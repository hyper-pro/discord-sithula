export interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  isBot?: boolean;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: User;
  channelId: string;
  isStreaming?: boolean; // For AI streaming effect
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  description?: string;
  serverId: string;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
}

export interface MessageMap {
  [channelId: string]: Message[];
}
