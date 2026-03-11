export const Routes = {
  AUTH: '/',
  LOBBY: '/discover',
  CALLING: '/call',
  CHAT: '/chat',
  PROFILE: '/profile',
} as const;

export type Route = (typeof Routes)[keyof typeof Routes];
