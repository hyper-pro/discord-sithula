import React from 'react';
import { Server } from '../types';

interface ServerListProps {
  servers: Server[];
  activeServerId: string;
  onSelectServer: (id: string) => void;
}

const ServerList: React.FC<ServerListProps> = ({ servers, activeServerId, onSelectServer }) => {
  return (
    <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 space-y-2 overflow-y-auto hide-scrollbar z-20">
      {/* Home / DM Icon Placeholder */}
      <div 
        className="group relative flex items-center justify-center w-[48px] h-[48px] rounded-[24px] hover:rounded-[16px] transition-all duration-200 bg-[#313338] hover:bg-[#5865F2] cursor-pointer mb-2"
        onClick={() => onSelectServer('home')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-100">
             <path d="M18 7c0-5-10-5-10 0" /><path d="M6 7v9a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7" /><path d="M6 10h12" />
        </svg>
        {activeServerId === 'home' && (
          <div className="absolute left-[-16px] w-[8px] h-[40px] rounded-r-lg bg-white" />
        )}
      </div>

      <div className="w-8 h-[2px] bg-[#35363C] rounded-lg mx-auto mb-2" />

      {servers.map((server) => (
        <div 
          key={server.id} 
          className="relative flex items-center justify-center w-full group cursor-pointer"
          onClick={() => onSelectServer(server.id)}
        >
           {/* Active Indicator */}
          <div 
            className={`absolute left-0 w-[4px] bg-white rounded-r-lg transition-all duration-200
              ${activeServerId === server.id ? 'h-[40px]' : 'h-[8px] scale-0 group-hover:scale-100 group-hover:h-[20px]'}
            `}
          />

          {/* Server Icon */}
          <div className={`
            w-[48px] h-[48px] overflow-hidden transition-all duration-200
            ${activeServerId === server.id ? 'rounded-[16px]' : 'rounded-[24px] group-hover:rounded-[16px]'}
          `}>
            <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
          </div>
          
          {/* Tooltip (Simple) */}
          <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-xs font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
            {server.name}
            {/* Tiny Triangle */}
            <div className="absolute top-1/2 left-[-4px] -mt-1 border-4 border-transparent border-r-black"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServerList;
