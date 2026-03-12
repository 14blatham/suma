import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Flag, LogOut } from 'lucide-react';
import { type Partner } from '../App';

/*
 * IN_CALL_MIN_TIMER
 *
 * Design principle: calm, minimal, non-gamified.
 * The other person is the product. The UI should disappear.
 *
 * Layout:
 *   - Remote video fills the entire screen (gradient placeholder, partner's initial)
 *   - Self-preview: small, bottom-right, unobtrusive
 *   - Timer: top-center, white, small — visible but not demanding
 *   - Controls: bottom-center, translucent pill
 *
 * At 0:00: a bottom sheet slides into view.
 * "Keep talking?" — Extend | End & decide
 *
 * Early leave before 5 min: a confirm sheet (not a dialog).
 * The language is honest: leaving early affects the other person.
 *
 * Timer turns amber at 1:00 remaining — a gentle heads-up,
 * not an alarm. The user notices without being startled.
 */

const CALL_DURATION = 5 * 60; // 5 minutes in seconds

interface Props {
  partner: Partner;
  onExtend: () => void;
  onEnd: (duration: number) => void;
  onEarlyLeave: () => void;
  onReport: () => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function InCall({ partner, onExtend, onEnd, onEarlyLeave, onReport }: Props) {
  const [remaining, setRemaining] = useState(CALL_DURATION);
  const [muted, setMuted]         = useState(false);
  const [camOff, setCamOff]       = useState(false);
  const [showMinEnd, setShowMinEnd]   = useState(false);   // "Keep talking?" panel
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const elapsedRef = useRef(0);
  const videoRef   = useRef<HTMLVideoElement>(null);

  // Real camera for self-preview
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      .then(s => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => {});
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  // Countdown timer
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(r => {
        const next = r - 1;
        elapsedRef.current += 1;
        if (next <= 0) {
          clearInterval(id);
          setShowMinEnd(true);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLeave = () => {
    if (remaining > 0) {
      setShowLeaveConfirm(true);
    } else {
      onEnd(elapsedRef.current);
    }
  };

  const timerColor = remaining <= 60 ? '#D97B3A' : 'var(--call-text)';

  return (
    <div className="relative flex items-center justify-center min-h-dvh max-w-sm mx-auto overflow-hidden"
      style={{ background: 'var(--call-bg)' }}
    >

      {/* Remote "video" — gradient with partner's initial */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, hsl(${partner.hue},20%,14%) 0%, hsl(${partner.hue},15%,8%) 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span style={{
          fontSize: 80, fontFamily: 'Georgia, serif',
          color: `hsla(${partner.hue},30%,70%,0.25)`,
          userSelect: 'none',
        }}>
          {partner.name[0]}
        </span>
      </div>

      {/* Timer — top center */}
      <div
        style={{
          position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
          fontSize: '0.87rem', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em',
          color: timerColor, fontWeight: 600,
          transition: 'color 0.5s',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      >
        {fmt(remaining)}
      </div>

      {/* Self-preview — bottom right */}
      <div
        style={{
          position: 'absolute', bottom: 128, right: 16,
          width: 72, height: 96, borderRadius: 8,
          border: '1px solid rgba(247,244,239,0.2)',
          background: `hsl(${partner.hue + 180},15%,18%)`,
          overflow: 'hidden',
        }}
      >
        <video ref={videoRef} autoPlay muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
        />
        {camOff && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `hsl(${partner.hue + 180},15%,18%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <VideoOff className="w-5 h-5" style={{ color: 'rgba(247,244,239,0.3)' }} />
          </div>
        )}
      </div>

      {/* Controls — bottom center, translucent pill */}
      <div
        style={{
          position: 'absolute', bottom: 48,
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8, alignItems: 'center',
          background: 'var(--call-ctrl)',
          borderRadius: 40, padding: '10px 16px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <CtrlBtn icon={muted    ? MicOff   : Mic}   label={muted   ? 'Unmute' : 'Mute'}   onClick={() => setMuted(m => !m)}     active={muted}    />
        <CtrlBtn icon={camOff  ? VideoOff : Video}  label={camOff  ? 'Cam on' : 'Cam'}    onClick={() => setCamOff(c => !c)}    active={camOff}   />
        <CtrlBtn icon={Flag}                         label="Report"                          onClick={onReport}                    danger             />
        <CtrlBtn icon={LogOut}                       label="Leave"                           onClick={handleLeave}                  danger             />
      </div>

      {/* At 5:00: "Keep talking?" panel */}
      {showMinEnd && !showLeaveConfirm && (
        <BottomSheet>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>Want to keep talking?</p>
          <p className="text-xs mb-5" style={{ color: 'var(--text-2)' }}>
            Both of you need to choose Extend to continue.
          </p>
          <div className="flex gap-3">
            <ActionBtn onClick={onExtend} primary>Extend call</ActionBtn>
            <ActionBtn onClick={() => onEnd(CALL_DURATION)}>End &amp; decide</ActionBtn>
          </div>
        </BottomSheet>
      )}

      {/* Early leave confirm */}
      {showLeaveConfirm && (
        <BottomSheet>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>Leave early?</p>
          <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--text-2)' }}>
            The 5-minute minimum exists to give real conversations a chance.
            Leaving early affects {partner.name} too.
          </p>
          <div className="flex gap-3">
            <ActionBtn onClick={onEarlyLeave} danger>Leave anyway</ActionBtn>
            <ActionBtn onClick={() => setShowLeaveConfirm(false)} primary>Stay</ActionBtn>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────────── */

function CtrlBtn({ icon: Icon, label, onClick, active, danger }: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        background: active ? 'rgba(247,244,239,0.22)' : 'transparent',
        border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 12,
        transition: 'background 0.1s',
        minWidth: 48,
      }}
      title={label}
    >
      <Icon className="w-5 h-5"
        style={{ color: danger ? 'var(--error)' : active ? 'var(--call-text)' : 'rgba(247,244,239,0.7)' }}
      />
      <span style={{ fontSize: 9, color: danger ? 'var(--error)' : 'rgba(247,244,239,0.5)', letterSpacing: '0.02em' }}>
        {label}
      </span>
    </button>
  );
}

function BottomSheet({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderRadius: '16px 16px 0 0',
        padding: '1.5rem',
      }}
    >
      {children}
    </div>
  );
}

function ActionBtn({ children, onClick, primary, danger }: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
}) {
  const bg = danger ? 'var(--error)' : primary ? 'var(--ink)' : 'transparent';
  const color = (danger || primary) ? 'var(--bg)' : 'var(--text)';
  const border = (danger || primary) ? 'transparent' : 'var(--border)';
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '0.65rem', borderRadius: 6,
        background: bg, color, border: `1px solid ${border}`,
        fontSize: '0.87rem', fontWeight: 500, cursor: 'pointer',
        fontFamily: 'inherit', transition: 'opacity 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </button>
  );
}
