export const Routes = {
  AUTH:      '/',
  DASHBOARD: '/dashboard',
  EXPLORER:  '/explorer',
  INSIGHTS:  '/insights',
  PROFILE:   '/profile',
} as const;

export type Route = (typeof Routes)[keyof typeof Routes];
