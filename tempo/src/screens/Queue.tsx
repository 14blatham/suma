import { useEffect, useState } from 'react';
import { Shell } from './Welcome';

/*
 * QUEUE_WAITING
 *
 * Psychology: waiting must feel intentional, not empty.
 *
 * The pulsing rings communicate that something is actively happening —
 * that the system is working on the user's behalf.
 * Three rings: the innermost is solid, the outer two fade progressively.
 * Opacity-only animation: respects prefers-reduced-motion.
 *
 * No skeleton loaders. No spinner. The rings are the wait.
 *
 * After 60s with no match: inline no-users state.
 * In the demo: match fires after 4s so the user can see the full flow.
 */

interface Props {
  onMatched: () => void;
  onLeave: () => void;
  onEdit: () => void;
}

const COUNTS = [34, 41, 37, 29, 45, 38, 32, 44];

export function Queue({ onMatched, onLeave, onEdit }: Props) {
  const [seconds, setSeconds]     = useState(0);
  const [count, setCount]         = useState(COUNTS[0]);
  const [noUsers, setNoUsers]     = useState(false);

  // Simulate live user count cycling
  useEffect(() => {
    const id = setInterval(() => {
      setCount(COUNTS[Math.floor(Math.random() * COUNTS.length)]);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Elapsed seconds
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Demo: match after 4s
  useEffect(() => {
    const id = setTimeout(onMatched, 4000);
    return () => clearTimeout(id);
  }, [onMatched]);

  // No-users fallback after 60s
  useEffect(() => {
    if (seconds >= 60) setNoUsers(true);
  }, [seconds]);

  const waitLabel = seconds < 10
    ? 'just started…'
    : seconds < 30
    ? `${seconds}s`
    : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

  return (
    <Shell>
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.08; }
          50%       { opacity: 0.22; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ring { animation: none !important; }
        }
      `}</style>

      <div className="flex flex-col h-full min-h-dvh">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-sm font-semibold" style={{ fontFamily: 'Georgia, serif', color: 'var(--text)' }}>Tempo</span>
          <span className="text-xs" style={{ color: 'var(--text-2)' }}>
            <span style={{ color: 'var(--ink)' }}>{count}</span> online now
          </span>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">

          {noUsers ? (
            <NoUsers onLeave={onLeave} />
          ) : (
            <>
              {/* Pulsing rings */}
              <div className="relative flex items-center justify-center mb-10" style={{ width: 160, height: 160 }}>
                {/* Ring 3 — outermost */}
                <div className="ring absolute" style={{
                  width: 160, height: 160, borderRadius: '50%',
                  border: '1px solid var(--ink)',
                  animation: 'pulse-ring 2.4s ease-in-out infinite',
                  animationDelay: '0.8s',
                }} />
                {/* Ring 2 */}
                <div className="ring absolute" style={{
                  width: 120, height: 120, borderRadius: '50%',
                  border: '1px solid var(--ink)',
                  animation: 'pulse-ring 2.4s ease-in-out infinite',
                  animationDelay: '0.4s',
                }} />
                {/* Ring 1 — innermost, solid */}
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ink)' }} />
                </div>
              </div>

              <h2 className="text-2xl mb-2 text-center" style={{ fontFamily: 'Georgia, serif' }}>
                Looking for someone…
              </h2>
              <p className="text-sm mb-1 text-center" style={{ color: 'var(--text-2)' }}>
                Usually less than 2 minutes
              </p>
              <p className="text-xs mb-10 text-center tabular-nums" style={{ color: 'var(--text-2)' }}>
                Waiting {waitLabel}
              </p>

              {/* Ghost actions */}
              <div className="flex gap-6">
                <GhostAction onClick={onLeave}>Leave queue</GhostAction>
                <GhostAction onClick={onEdit}>Edit profile</GhostAction>
              </div>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}

function GhostAction({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent', border: 'none',
        color: 'var(--text-2)', fontSize: '0.87rem', cursor: 'pointer',
        fontFamily: 'inherit', padding: '4px 0',
        borderBottom: '1px solid var(--border)',
        transition: 'color 0.1s, border-color 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--text)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {children}
    </button>
  );
}

function NoUsers({ onLeave }: { onLeave: () => void }) {
  return (
    <div className="text-center" style={{ maxWidth: 280 }}>
      <h2 className="text-xl mb-3" style={{ fontFamily: 'Georgia, serif' }}>Nobody here right now</h2>
      <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-2)' }}>
        The queue is quiet. Try again during peak hours when more people are online.
      </p>

      <div className="text-left mb-8 p-4 rounded" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-2)', letterSpacing: '0.06em' }}>
          Match hours
        </p>
        {['7:00 – 9:00 am', '12:00 – 2:00 pm', '6:00 – 10:00 pm'].map(t => (
          <div key={t} className="text-sm py-1" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
            {t}
          </div>
        ))}
        <p className="text-xs mt-2" style={{ color: 'var(--text-2)' }}>All times local</p>
      </div>

      <button
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--ink)', fontSize: '0.87rem', fontFamily: 'inherit',
          marginBottom: '1rem',
        }}
      >
        Invite a friend →
      </button>

      <div>
        <button
          onClick={onLeave}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-2)', fontSize: '0.87rem', fontFamily: 'inherit',
          }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
