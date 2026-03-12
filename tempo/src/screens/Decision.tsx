import { useState } from 'react';
import { type Partner } from '../App';
import { Shell } from './Welcome';

/*
 * POST_CALL_DECISION
 *
 * Critical psychology: the decision must feel private and pressure-free.
 *
 * Rules:
 *   1. Neither button is visually "better" than the other.
 *      Equal visual weight — border only, no fill on either.
 *      The product doesn't nudge. It lets the user decide honestly.
 *
 *   2. After the user taps, a loading state shows:
 *      "Waiting for their answer…"
 *      This delays the reveal and simulates the other person deciding.
 *      Duration: 2 seconds (feel of real mutual process).
 *
 *   3. The outcome is revealed simply:
 *      Mutual keep → warm, quiet. No confetti. "You're both keeping in touch."
 *      Pass → equally calm. No negative language. Just "no match this time."
 *
 * "Report" is available — small, bottom, not prominent.
 * Safety without pressure.
 */

type State = 'deciding' | 'waiting' | 'result-matched' | 'result-passed';

interface Props {
  partner: Partner;
  duration: number;
  onMatched: () => void;
  onPassed: () => void;
  onReport: () => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

export function Decision({ partner, duration, onMatched, onPassed, onReport }: Props) {
  const [state, setState] = useState<State>('deciding');

  const choose = (keep: boolean) => {
    setState('waiting');
    // Simulate the other person's decision after 2s
    // 50% chance of mutual match in demo
    setTimeout(() => {
      setState(keep && Math.random() > 0.4 ? 'result-matched' : 'result-passed');
    }, 2000);
  };

  return (
    <Shell>
      <div className="flex flex-col h-full min-h-dvh p-6">
        <div className="flex-1 flex flex-col justify-center">

          {/* Partner avatar */}
          <div
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: `hsl(${partner.hue},30%,72%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontFamily: 'Georgia, serif',
              color: `hsl(${partner.hue},25%,30%)`,
              border: '1px solid var(--border)',
              marginBottom: '1.25rem',
            }}
          >
            {partner.name[0]}
          </div>

          <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {partner.name}
          </h2>
          <p className="text-xs mb-8" style={{ color: 'var(--text-2)' }}>
            {fmt(duration)} · {partner.intent}
          </p>

          {/* Decision state */}
          {state === 'deciding' && (
            <>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: 260 }}>
                Your choice stays private until you've both answered.
              </p>
              <div className="flex gap-3">
                <DecisionBtn onClick={() => choose(true)}>
                  <span style={{ fontSize: '1.3rem' }}>👍</span>
                  <span>Keep in touch</span>
                </DecisionBtn>
                <DecisionBtn onClick={() => choose(false)}>
                  <span style={{ fontSize: '1.3rem' }}>👎</span>
                  <span>Pass</span>
                </DecisionBtn>
              </div>
            </>
          )}

          {state === 'waiting' && (
            <div>
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                Waiting for their answer…
              </p>
              {/* Minimal dots */}
              <div className="flex gap-1.5 mt-3">
                {[0, 1, 2].map(i => (
                  <WaitDot key={i} delay={i * 0.3} />
                ))}
              </div>
            </div>
          )}

          {state === 'result-matched' && (
            <div>
              <p className="text-sm mb-2" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                You're both keeping in touch.
              </p>
              <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
                Chat is now unlocked.
              </p>
              <button
                onClick={onMatched}
                style={{
                  width: '100%', maxWidth: 280,
                  padding: '0.75rem',
                  background: 'var(--ink)', color: 'var(--bg)',
                  border: '1px solid var(--ink)', borderRadius: 6,
                  fontSize: '0.93rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Open chat →
              </button>
            </div>
          )}

          {state === 'result-passed' && (
            <div>
              <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
                Not a match this time. That's okay.
              </p>
              <button
                onClick={onPassed}
                style={{
                  width: '100%', maxWidth: 280,
                  padding: '0.75rem',
                  background: 'var(--ink)', color: 'var(--bg)',
                  border: '1px solid var(--ink)', borderRadius: 6,
                  fontSize: '0.93rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Meet someone new
              </button>
            </div>
          )}
        </div>

        {/* Report — available but not prominent */}
        {(state === 'deciding' || state === 'result-passed') && (
          <button
            onClick={onReport}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--text-2)', fontSize: '0.8rem', fontFamily: 'inherit',
              padding: '8px 0', textAlign: 'center',
            }}
          >
            Report {partner.name}
          </button>
        )}
      </div>
    </Shell>
  );
}

function DecisionBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '1.25rem 0.5rem',
        border: '1px solid var(--border)', borderRadius: 8,
        background: 'transparent',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.87rem',
        color: 'var(--text)', transition: 'border-color 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {children}
    </button>
  );
}

function WaitDot({ delay }: { delay: number }) {
  return (
    <div style={{
      width: 6, height: 6, borderRadius: '50%',
      background: 'var(--text-2)',
      animation: `bounce 1s ease-in-out ${delay}s infinite`,
    }}>
      <style>{`
        @keyframes bounce {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
