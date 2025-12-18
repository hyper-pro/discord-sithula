import React from 'react';
import { Server, Channel, User } from '../types';

interface ChannelListProps {
  server: Server;
  activeChannelId: string;
  currentUser: User;
  onSelectChannel: (id: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({ server, activeChannelId, currentUser, onSelectChannel }) => {
  return (
    <div className="w-60 bg-[#2b2d31] flex flex-col h-full shrink-0">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center shadow-sm hover:bg-[#35373c] cursor-pointer transition-colors border-b border-[#1f2023]">
        <h1 className="font-bold text-gray-100 truncate">{server.name}</h1>
        <svg className="ml-auto w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-[2px]">
        <div className="px-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wide hover:text-gray-300 cursor-pointer">
          Text Channels
        </div>
        {server.channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            className={`
              group px-2 py-1.5 rounded flex items-center cursor-pointer transition-colors
              ${activeChannelId === channel.id ? 'bg-[#404249] text-white' : 'text-gray-400 hover:bg-[#35373c] hover:text-gray-200'}
            `}
          >
            <span className="text-xl mr-1.5 text-gray-500">#</span>
            <span className={`truncate font-medium ${activeChannelId === channel.id ? 'text-white' : ''}`}>
              {channel.name}
            </span>
          </div>
        ))}
      </div>

      {/* User Area */}
      <div className="h-[52px] bg-[#232428] flex items-center px-2 py-1.5 gap-2">
        <div className="relative group cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-500">
            <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#232428] rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">{currentUser.username}</div>
          <div className="text-xs text-gray-400 truncate">#{currentUser.id.split('-')[1]}</div>
        </div>
        <div className="flex items-center">
            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 11a7 7 0 0 1-7 7m0 0a7 7 0 0 1-7-7m7 7v4m0 0H8m4 0h4"/></svg>
            </button>
            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelList;
