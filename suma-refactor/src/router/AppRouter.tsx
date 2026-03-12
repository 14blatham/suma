import {
  BrowserRouter, Route, Routes as RouterRoutes,
  Navigate, Outlet, useLocation, useNavigate,
} from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AuthView }      from '../features/auth/AuthView';
import { DashboardView } from '../features/dashboard/DashboardView';
import { ExplorerView }  from '../features/explorer/ExplorerView';
import { InsightsView }  from '../features/insights/InsightsView';
import { ProfileView }   from '../features/profile/ProfileView';
import { Routes }        from './routes';

/*
 * Navigation principle: text labels only.
 * Icons are abstractions — they make the user interpret.
 * Words are direct — they tell.
 *
 * Active state: a top border tab, not a highlight. 
 * This is the oldest navigation convention: the physical folder tab.
 * The user understands it without learning it.
 */
const NAV_ITEMS = [
  { route: Routes.DASHBOARD, label: 'Overview'  },
  { route: Routes.INSIGHTS,  label: 'Insights'  },
  { route: Routes.PROFILE,   label: 'Profile'   },
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
    <div
      className="min-h-screen flex flex-col max-w-md mx-auto"
      style={{ background: 'var(--bg)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
    >
      <main className="flex-1 overflow-y-auto">{children}</main>

      <nav
        className="flex border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ route, label }) => {
          const active = pathname === route;
          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              aria-current={active ? 'page' : undefined}
              className="flex-1 py-3.5 text-sm transition-colors duration-100"
              style={{
                color: active ? 'var(--text)' : 'var(--text-2)',
                fontWeight: active ? 600 : 400,
                marginTop: '-1px',
                background: 'transparent',
                borderTop: active ? '2px solid var(--ink)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {label}
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
          <Route path={Routes.INSIGHTS}  element={<AppShell><InsightsView /></AppShell>}  />
          <Route path={Routes.PROFILE}   element={<AppShell><ProfileView /></AppShell>}   />
          {/* Explorer is full-screen — no nav chrome, pure focus on data */}
          <Route path={Routes.EXPLORER}  element={<ExplorerView />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}
