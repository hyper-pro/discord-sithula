import { Server, User } from './types';

export const CURRENT_USER: User = {
  id: 'user-1',
  username: 'DevUser',
  avatar: 'https://picsum.photos/200/200',
  status: 'online',
};

export const GEMINI_BOT: User = {
  id: 'bot-gemini',
  username: 'Gemini AI',
  avatar: 'https://picsum.photos/id/1/200/200',
  status: 'online',
  isBot: true,
};

export const MOCK_SERVERS: Server[] = [
  {
    id: 'server-1',
    name: 'Gemini Developers',
    icon: 'https://picsum.photos/id/20/100/100',
    channels: [
      { id: 'ch-welcome', name: 'welcome', type: 'text', serverId: 'server-1', description: 'Welcome to the server!' },
      { id: 'ch-general', name: 'general', type: 'text', serverId: 'server-1', description: 'General discussion' },
      { id: 'ch-ai-help', name: 'ask-gemini', type: 'text', serverId: 'server-1', description: 'Talk to Gemini AI' },
      { id: 'ch-code', name: 'coding', type: 'text', serverId: 'server-1', description: 'Code snippets and help' },
    ],
  },
  {
    id: 'server-2',
    name: 'React Enthusiasts',
    icon: 'https://picsum.photos/id/30/100/100',
    channels: [
      { id: 'ch-react-gen', name: 'general', type: 'text', serverId: 'server-2' },
      { id: 'ch-components', name: 'components', type: 'text', serverId: 'server-2' },
    ],
  },
  {
    id: 'server-3',
    name: 'Gaming Lounge',
    icon: 'https://picsum.photos/id/40/100/100',
    channels: [
      { id: 'ch-lfg', name: 'lfg', type: 'text', serverId: 'server-3' },
      { id: 'ch-memes', name: 'memes', type: 'text', serverId: 'server-3' },
    ],
  },
];
