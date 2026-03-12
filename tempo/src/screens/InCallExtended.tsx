import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Flag, PhoneOff } from 'lucide-react';
import { type Partner } from '../App';

/*
 * IN_CALL_EXTENDED
 *
 * Both users chose to extend. The minimum is met.
 * Now the call belongs to them — no pressure, no countdown.
 *
 * Changes from IN_CALL_MIN_TIMER:
 *   - Timer counts UP (elapsed time, not remaining)
 *   - Label: "Extra time" above the timer
 *   - Leave button is now "End call" — no confirm required
 *     (the minimum was already honoured)
 *   - No "Keep talking?" banner
 *
 * Everything else is identical — same controls, same layout,
 * same dark environment.
 */

interface Props {
  partner: Partner;
  onEnd: (duration: number) => void;
  onReport: () => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function InCallExtended({ partner, onEnd, onReport }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted]     = useState(false);
  const [camOff, setCamOff]   = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      .then(s => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => {});
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative flex items-center justify-center min-h-dvh max-w-sm mx-auto overflow-hidden"
      style={{ background: 'var(--call-bg)' }}
    >
      {/* Remote video placeholder */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, hsl(${partner.hue},20%,14%) 0%, hsl(${partner.hue},15%,8%) 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontSize: 80, fontFamily: 'Georgia, serif',
          color: `hsla(${partner.hue},30%,70%,0.25)`,
          userSelect: 'none',
        }}>
          {partner.name[0]}
        </span>
      </div>

      {/* Timer — top center, counts up */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 9, color: 'rgba(247,244,239,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
          Extra time
        </p>
        <span style={{
          fontSize: '0.87rem', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em',
          color: 'var(--call-text)', fontWeight: 600,
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}>
          {fmt(elapsed)}
        </span>
      </div>

      {/* Self-preview */}
      <div style={{
        position: 'absolute', bottom: 128, right: 16,
        width: 72, height: 96, borderRadius: 8,
        border: '1px solid rgba(247,244,239,0.2)',
        background: `hsl(${partner.hue + 180},15%,18%)`,
        overflow: 'hidden',
      }}>
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

      {/* Controls */}
      <div style={{
        position: 'absolute', bottom: 48,
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, alignItems: 'center',
        background: 'var(--call-ctrl)',
        borderRadius: 40, padding: '10px 16px',
        backdropFilter: 'blur(4px)',
      }}>
        <CtrlBtn icon={muted   ? MicOff   : Mic}   label={muted  ? 'Unmute' : 'Mute'}  onClick={() => setMuted(m => !m)}   active={muted}   />
        <CtrlBtn icon={camOff  ? VideoOff : Video}  label={camOff ? 'Cam on' : 'Cam'}   onClick={() => setCamOff(c => !c)}  active={camOff}  />
        <CtrlBtn icon={Flag}                         label="Report"                       onClick={onReport}                  danger            />
        <CtrlBtn icon={PhoneOff}                     label="End call"                     onClick={() => onEnd(300 + elapsed)} danger            />
      </div>
    </div>
  );
}

function CtrlBtn({ icon: Icon, label, onClick, active, danger }: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button onClick={onClick} title={label} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      background: active ? 'rgba(247,244,239,0.22)' : 'transparent',
      border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 12,
      minWidth: 48, transition: 'background 0.1s',
    }}>
      <Icon className="w-5 h-5"
        style={{ color: danger ? 'var(--error)' : active ? 'var(--call-text)' : 'rgba(247,244,239,0.7)' }}
      />
      <span style={{ fontSize: 9, color: danger ? 'var(--error)' : 'rgba(247,244,239,0.5)', letterSpacing: '0.02em' }}>
        {label}
      </span>
    </button>
  );
}
