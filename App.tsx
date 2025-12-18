import React, { useState } from 'react';
import ServerList from './components/ServerList';
import ChannelList from './components/ChannelList';
import ChatArea from './components/ChatArea';
import { MOCK_SERVERS, CURRENT_USER } from './constants';
import { MessageMap } from './types';

const App: React.FC = () => {
  const [activeServerId, setActiveServerId] = useState<string>(MOCK_SERVERS[0].id);
  const [activeChannelId, setActiveChannelId] = useState<string>(MOCK_SERVERS[0].channels[0].id);
  // Store messages in a map keyed by channel ID to preserve history when switching
  const [messages, setMessages] = useState<MessageMap>({});

  const activeServer = MOCK_SERVERS.find(s => s.id === activeServerId) || MOCK_SERVERS[0];
  
  // Logic to get the correct channel object, defaulting to first if mismatch
  let activeChannel = activeServer.channels.find(c => c.id === activeChannelId);
  if (!activeChannel) {
      activeChannel = activeServer.channels[0];
      // Note: We don't automatically set state here to avoid render loops, just display correct data
  }

  const handleServerSelect = (id: string) => {
    setActiveServerId(id);
    const server = MOCK_SERVERS.find(s => s.id === id);
    if (server && server.channels.length > 0) {
      setActiveChannelId(server.channels[0].id);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#313338] font-sans">
      {/* 1. Server List (Leftmost) */}
      <ServerList 
        servers={MOCK_SERVERS} 
        activeServerId={activeServerId} 
        onSelectServer={handleServerSelect} 
      />

      {/* 2. Channel List (Middle Sidebar) - Hidden on super small screens potentially, but strictly flex here */}
      <div className="hidden md:flex flex-col rounded-tl-[8px] bg-[#2b2d31] overflow-hidden">
        <ChannelList 
            server={activeServer}
            activeChannelId={activeChannelId}
            currentUser={CURRENT_USER}
            onSelectChannel={setActiveChannelId}
        />
      </div>

      {/* 3. Main Chat Area */}
      <ChatArea 
        channel={activeChannel} 
        messages={messages}
        setMessages={setMessages}
      />
      
      {/* 4. Optional Member List (Rightmost) - Hidden on smaller screens */}
      <div className="hidden lg:flex w-60 bg-[#2b2d31] flex-col p-4 shrink-0 overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-400 uppercase mb-4">Online — 2</h2>
        
        {/* Current User */}
        <div className="flex items-center mb-4 opacity-50 hover:opacity-100 cursor-pointer">
           <div className="relative">
             <img src={CURRENT_USER.avatar} className="w-8 h-8 rounded-full" alt="me" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#2b2d31] rounded-full"></div>
           </div>
           <div className="ml-3">
             <div className="text-white font-medium text-sm">{CURRENT_USER.username}</div>
             <div className="text-gray-400 text-xs">Playing VS Code</div>
           </div>
        </div>

        {/* Gemini Bot */}
         <div className="flex items-center mb-4 hover:bg-[#35373c] p-1 rounded -ml-1 cursor-pointer">
           <div className="relative">
             <img src="https://picsum.photos/id/1/200/200" className="w-8 h-8 rounded-full" alt="Gemini" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#2b2d31] rounded-full"></div>
           </div>
           <div className="ml-3">
             <div className="text-white font-medium text-sm flex items-center">
                 Gemini AI
                 <span className="bg-[#5865F2] text-[10px] text-white px-1 ml-2 rounded-[3px] py-[1px]">BOT</span>
            </div>
             <div className="text-gray-400 text-xs">Answering questions</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
