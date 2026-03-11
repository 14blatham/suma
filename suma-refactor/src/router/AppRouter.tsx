import { BrowserRouter, Route, Routes as RouterRoutes, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Video, MessageSquare, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AuthView } from '../features/auth/AuthView';
import { QueueView } from '../features/queue/QueueView';
import { CallView } from '../features/call/CallView';
import { ChatView } from '../features/chat/ChatView';
import { ProfileView } from '../features/profile/ProfileView';
import { Routes } from './routes';

const NAV_ITEMS = [
  { route: Routes.LOBBY, icon: Video, label: 'Discover' },
  { route: Routes.CHAT, icon: MessageSquare, label: 'Chat' },
  { route: Routes.PROFILE, icon: User, label: 'Profile' },
] as const;

function ProtectedRoute() {
  const { user } = useAppContext();
  if (!user) return <Navigate to={Routes.AUTH} replace />;
  return <Outlet />;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3A4145] font-sans flex flex-col max-w-md mx-auto border-x border-[#EFEAE4] shadow-2xl">
      <main className="flex-1 overflow-hidden relative">{children}</main>
      <nav className="bg-white/80 backdrop-blur-xl border-t border-[#EFEAE4] px-10 py-5 flex justify-between items-center rounded-t-[2.5rem]">
        {NAV_ITEMS.map(({ route, icon: Icon, label }) => {
          const active = pathname === route;
          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-[#7FB3D5]' : 'text-[#A8BA9A]'}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-[#7FB3D5]/10' : ''}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path={Routes.AUTH} element={<AuthView />} />
        <Route element={<ProtectedRoute />}>
          <Route path={Routes.LOBBY} element={<AppShell><QueueView /></AppShell>} />
          <Route path={Routes.CHAT} element={<AppShell><ChatView /></AppShell>} />
          <Route path={Routes.PROFILE} element={<AppShell><ProfileView /></AppShell>} />
          <Route path={Routes.CALLING} element={<CallView />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}
