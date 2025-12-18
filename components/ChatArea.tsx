import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Channel, Message, User, MessageMap } from '../types';
import { CURRENT_USER, GEMINI_BOT } from '../constants';
import { streamGeminiResponse } from '../services/geminiService';

interface ChatAreaProps {
  channel: Channel;
  messages: MessageMap;
  setMessages: React.Dispatch<React.SetStateAction<MessageMap>>;
}

// Simple Markdown Formatter Component
const MarkdownText: React.FC<{ content: string }> = ({ content }) => {
  // Very basic parser: Bold (**), Code Blocks (```), Inline Code (`), Newlines
  // For production, use 'react-markdown' or similar.
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*|\n)/g);

  return (
    <span className="whitespace-pre-wrap break-words leading-relaxed text-gray-100">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3);
          return (
            <div key={i} className="bg-[#2b2d31] p-2 rounded-md my-1 font-mono text-sm border border-gray-700 overflow-x-auto text-gray-200">
              {code}
            </div>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="bg-[#2b2d31] px-1 rounded text-sm font-mono text-red-400">{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        if (part === '\n') {
            return <br key={i} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const ChatArea: React.FC<ChatAreaProps> = ({ channel, messages, setMessages }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelMessages = messages[channel.id] || [];

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages.length, channel.id]);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      content: inputText,
      timestamp: new Date(),
      sender: CURRENT_USER,
      channelId: channel.id,
    };

    // Update UI with user message immediately
    setMessages((prev) => ({
      ...prev,
      [channel.id]: [...(prev[channel.id] || []), newUserMsg],
    }));

    setInputText('');

    // GEMINI INTEGRATION
    // If the channel is 'ask-gemini' or specific channels, trigger AI
    if (channel.name === 'ask-gemini' || channel.name === 'coding') {
      setIsTyping(true);
      const aiMsgId = (Date.now() + 1).toString();
      
      // Initialize AI message placeholder
      const initialAiMsg: Message = {
        id: aiMsgId,
        content: '',
        timestamp: new Date(),
        sender: GEMINI_BOT,
        channelId: channel.id,
        isStreaming: true,
      };

      setMessages((prev) => ({
        ...prev,
        [channel.id]: [...(prev[channel.id] || []), initialAiMsg],
      }));

      // Stream content
      await streamGeminiResponse(inputText, (currentText) => {
        setMessages((prev) => {
          const currentList = prev[channel.id] || [];
          const updatedList = currentList.map((m) =>
            m.id === aiMsgId ? { ...m, content: currentText } : m
          );
          return { ...prev, [channel.id]: updatedList };
        });
      });
      
      setIsTyping(false);
    }
  }, [inputText, channel, setMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] min-w-0">
      {/* Chat Header */}
      <div className="h-12 px-4 flex items-center shadow-sm border-b border-[#26272d] shrink-0">
        <div className="text-gray-400 text-2xl mr-2">#</div>
        <h3 className="font-bold text-gray-100">{channel.name}</h3>
        {channel.description && (
          <>
            <div className="mx-4 w-[1px] h-6 bg-gray-600 hidden md:block"></div>
            <span className="text-gray-400 text-sm truncate hidden md:block">{channel.description}</span>
          </>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 custom-scrollbar flex flex-col space-y-4">
        {/* Welcome Message */}
        <div className="mt-4 mb-8">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-white">#</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to #{channel.name}!</h1>
            <p className="text-gray-400">This is the start of the #{channel.name} channel.</p>
        </div>

        {channelMessages.map((msg, index) => {
          const isSequential = index > 0 && channelMessages[index - 1].sender.id === msg.sender.id && (msg.timestamp.getTime() - channelMessages[index - 1].timestamp.getTime() < 60000);
          
          return (
            <div key={msg.id} className={`group flex pr-4 ${isSequential ? 'mt-[2px]' : 'mt-[17px]'} hover:bg-[#2e3035] -mx-4 px-4 py-0.5`}>
              {!isSequential ? (
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4 mt-0.5 shrink-0 bg-gray-700 cursor-pointer hover:opacity-80 active:translate-y-[1px]">
                  <img src={msg.sender.avatar} alt={msg.sender.username} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 mr-4 shrink-0 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 text-right select-none pt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

              <div className="flex-1 min-w-0">
                {!isSequential && (
                  <div className="flex items-center">
                    <span className="font-medium text-white hover:underline cursor-pointer mr-2">
                        {msg.sender.username}
                    </span>
                    {msg.sender.isBot && (
                        <span className="bg-[#5865F2] text-[10px] text-white px-1.5 rounded-[3px] py-[1px] font-medium leading-3 h-4 flex items-center mr-2">
                            APP
                        </span>
                    )}
                    <span className="text-xs text-gray-400 ml-0">
                      {msg.timestamp.toLocaleDateString()} {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                <div className={`text-gray-300 font-normal leading-[1.375rem] ${isSequential ? '' : ''}`}>
                    <MarkdownText content={msg.content} />
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
             <div className="flex items-center mt-2 animate-pulse">
                 <span className="text-xs font-bold text-gray-400">Gemini is thinking...</span>
             </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="px-4 pb-6 shrink-0 bg-[#313338]">
        <div className="bg-[#383a40] rounded-lg px-4 py-2.5 flex items-center">
          <button className="text-gray-400 hover:text-gray-200 mr-4 p-1">
             <div className="bg-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-[#383a40] font-bold text-xs">+</div>
          </button>
          <input
            type="text"
            className="bg-transparent flex-1 text-gray-200 outline-none placeholder-gray-500 font-light"
            placeholder={`Message #${channel.name}`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center space-x-3 text-gray-400">
             <svg className="w-6 h-6 hover:text-gray-200 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
