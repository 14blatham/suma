import { BrowserRouter, Route, Routes as RouterRoutes, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart2, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AuthView } from '../features/auth/AuthView';
import { DashboardView } from '../features/dashboard/DashboardView';
import { ExplorerView } from '../features/explorer/ExplorerView';
import { InsightsView } from '../features/insights/InsightsView';
import { ProfileView } from '../features/profile/ProfileView';
import { Routes } from './routes';

const NAV_ITEMS = [
  { route: Routes.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { route: Routes.INSIGHTS,  icon: BarChart2,       label: 'Insights'  },
  { route: Routes.PROFILE,   icon: User,            label: 'Profile'   },
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
    <div className="min-h-screen bg-[#F5F0E8] text-[#2C2420] font-sans flex flex-col max-w-md mx-auto border-x border-[#D6CCB8]">
      <main className="flex-1 overflow-hidden relative">{children}</main>
      <nav className="bg-[#EDE6D6] border-t border-[#D6CCB8] px-8 py-4 flex justify-between items-center">
        {NAV_ITEMS.map(({ route, icon: Icon, label }) => {
          const active = pathname === route;
          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#2C2420]' : 'text-[#7A6B5D]'}`}
            >
              <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-[#D6CCB8]' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium tracking-wide">{label}</span>
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
          <Route path={Routes.DASHBOARD} element={<AppShell><DashboardView /></AppShell>} />
          <Route path={Routes.INSIGHTS}  element={<AppShell><InsightsView /></AppShell>} />
          <Route path={Routes.PROFILE}   element={<AppShell><ProfileView /></AppShell>} />
          <Route path={Routes.EXPLORER}  element={<ExplorerView />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}
