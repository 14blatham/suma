import { type Profile } from '../App';
import { Shell, PrimaryBtn } from './Welcome';

/*
 * The home screen has one job: be the emotional commitment moment.
 *
 * "Join queue" is not a feature. It is a decision.
 * The UI must honour that weight without creating anxiety.
 *
 * Single dominant action. Everything else recedes.
 * The profile summary is visible so the user knows what they're presenting.
 */

interface Props {
  profile: Profile | null;
  onJoin: () => void;
  onEditProfile: () => void;
}

export function Home({ profile, onJoin, onEditProfile }: Props) {
  const initials = profile?.name
    ? profile.name.slice(0, 2).toUpperCase()
    : '?';

  return (
    <Shell>
      <div className="flex flex-col h-full min-h-dvh">

        {/* Profile strip — compact, not the focus */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid var(--border)',
              background: profile?.photo ? 'transparent' : 'var(--surface)',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)',
              flexShrink: 0,
            }}
          >
            {profile?.photo
              ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
              {profile?.name || 'You'}
              {profile?.age && <span className="ml-1.5 font-normal" style={{ color: 'var(--text-2)' }}>{profile.age}</span>}
            </div>
            {profile?.intent && (
              <div className="text-xs" style={{ color: 'var(--text-2)' }}>{profile.intent}</div>
            )}
          </div>
          <button
            onClick={onEditProfile}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', color: 'var(--text-2)', fontFamily: 'inherit',
              padding: '4px 0',
            }}
          >
            Edit
          </button>
        </div>

        {/* Main — the commitment moment */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-3xl mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Ready to meet someone?
          </h2>
          <p className="text-sm mb-12 leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: 240 }}>
            You'll be matched with someone real.
            5 minutes. Face to face. Then you decide.
          </p>
          <div style={{ width: '100%', maxWidth: 280 }}>
            <PrimaryBtn onClick={onJoin}>Join queue</PrimaryBtn>
          </div>
        </div>

        {/* Footer — context, not pressure */}
        <div className="px-6 pb-8">
          <div
            className="text-xs text-center leading-relaxed"
            style={{ color: 'var(--text-2)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}
          >
            Match hours: 7–9am · 12–2pm · 6–10pm
            <br />
            <span style={{ color: 'var(--ink)' }}>47 people online now</span>
          </div>
        </div>

      </div>
    </Shell>
  );
}
