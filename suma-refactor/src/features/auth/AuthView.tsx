import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Routes } from '../../router/routes';

/*
 * The sign-in screen is not a branding exercise.
 * It is a door. It should open quickly and without ceremony.
 *
 * What it communicates:
 *   - What the product is (name + one sentence)
 *   - What the user needs to do (one action)
 *   - That their data is respected (one honest note)
 *
 * Nothing else.
 */

export function AuthView() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ id: '1', name: 'Alex' });
    navigate(Routes.DASHBOARD);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-xs">
        {/* Product identity — no logo, the name is the identity */}
        <div className="mb-10">
          <h1 className="text-2xl mb-2" style={{ fontFamily: 'Georgia, serif', color: 'var(--text)' }}>
            Suma Insights
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
            Wellbeing analytics for people who care about getting it right.
          </p>
        </div>

        {/* Access — one step */}
        <button
          onClick={handleLogin}
          className="w-full py-2.5 text-sm font-medium rounded transition-colors duration-100 mb-6"
          style={{
            background: 'var(--ink)',
            color: 'var(--bg)',
            border: '1px solid var(--ink)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--ink-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
        >
          Sign in
        </button>

        {/* Honest note — no shield icon needed, words are clearer */}
        <p className="text-xs text-center" style={{ color: 'var(--text-2)' }}>
          All data is anonymised and aggregated. Nothing is shared.
        </p>
      </div>
    </div>
  );
}
