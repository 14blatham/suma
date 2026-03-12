import { useEffect, useState } from 'react';
import { type Partner } from '../App';

/*
 * CONNECTING
 *
 * The 3-2-1 countdown is not decoration.
 * Its purpose:
 *   1. Reduce shock — the user knows exactly when the call starts
 *   2. Build anticipation — measured time before the real moment
 *   3. Prevent instant skipping — there's a beat before the face appears
 *
 * Full dark screen: signals the transition from the light app
 * to the video call environment. The user's eye adjusts.
 *
 * The number is the design. Georgia serif, large.
 * No background circle, no animation on the number itself —
 * just the number changing. That's enough.
 */

interface Props {
  partner: Partner;
  onReady: () => void;
}

export function Connecting({ partner, onReady }: Props) {
  const [count, setCount] = useState<3 | 2 | 1 | 0>(3);

  useEffect(() => {
    const ticks = [
      setTimeout(() => setCount(2),    1000),
      setTimeout(() => setCount(1),    2000),
      setTimeout(() => setCount(0),    3000),
      setTimeout(() => onReady(),      3200),
    ];
    return () => ticks.forEach(clearTimeout);
  }, [onReady]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh max-w-sm mx-auto"
      style={{ background: 'var(--call-bg)', color: 'var(--call-text)' }}
    >
      {/* Partner name above */}
      <p className="text-sm mb-8 opacity-60" style={{ letterSpacing: '0.05em' }}>
        {partner.name}, {partner.age}
      </p>

      {/* The number */}
      <div
        style={{
          fontSize: 96,
          fontFamily: 'Georgia, serif',
          lineHeight: 1,
          color: 'var(--call-text)',
          minWidth: 80,
          textAlign: 'center',
          opacity: count === 0 ? 0 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {count > 0 ? count : ''}
      </div>

      {/* Label below */}
      <p className="text-sm mt-8 opacity-50">
        Starting your 5-minute conversation
      </p>
    </div>
  );
}
