import { useState } from 'react';
import { Video, Mic, Bell } from 'lucide-react';
import { Shell, PrimaryBtn } from './Welcome';

/*
 * Permission gates must be transparent, not persuasive.
 * The user needs to know exactly why each permission is needed.
 * No dark patterns. No "Allow to continue" coercion.
 *
 * The explanation is the product description: face-to-face for 5 minutes.
 * That's the whole thing. Saying it clearly builds trust.
 */

interface Props {
  onGranted: () => void;
}

const PERMS = [
  {
    icon: Video,
    label: 'Camera',
    reason: 'So the other person can see you. Required for video calls.',
    key: 'camera' as const,
  },
  {
    icon: Mic,
    label: 'Microphone',
    reason: 'So you can speak and be heard. Required for video calls.',
    key: 'mic' as const,
  },
  {
    icon: Bell,
    label: 'Notifications',
    reason: 'So we can tell you when someone is ready to talk.',
    key: 'notifications' as const,
    optional: true,
  },
];

export function Permissions({ onGranted }: Props) {
  const [granting, setGranting] = useState(false);

  const handleGrant = async () => {
    setGranting(true);
    try {
      // Request the real permissions where available
      await navigator.mediaDevices?.getUserMedia({ video: true, audio: true });
    } catch {
      // Permission denied or unavailable — proceed anyway (demo context)
    }
    setGranting(false);
    onGranted();
  };

  return (
    <Shell>
      <div className="flex flex-col h-full min-h-dvh p-6">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Before your first call
          </h2>
          <p className="text-sm mb-10 leading-relaxed" style={{ color: 'var(--text-2)' }}>
            You'll talk face-to-face for 5 minutes.
            Tempo needs a few permissions to make that work.
          </p>

          <div className="space-y-5">
            {PERMS.map(({ icon: Icon, label, reason, optional }) => (
              <div key={label} className="flex gap-4">
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 8,
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'var(--ink)' }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {label}
                    {optional && (
                      <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-2)' }}>optional</span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>{reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <PrimaryBtn onClick={handleGrant} disabled={granting}>
            {granting ? 'Requesting…' : 'Allow and continue'}
          </PrimaryBtn>
          <p className="text-xs text-center" style={{ color: 'var(--text-2)' }}>
            Camera and microphone are only active during calls.
          </p>
        </div>
      </div>
    </Shell>
  );
}
