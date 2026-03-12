import { type Partner } from '../App';
import { Shell, PrimaryBtn } from './Welcome';

/*
 * MATCH_FOUND
 *
 * This screen bridges the anonymous wait and the real person.
 * The user sees who they're about to talk to before committing.
 *
 * Design principle: reduce shock, build anticipation.
 * The partner's avatar is their identity before the call starts.
 *
 * "Skip" is available but secondary — visually quiet.
 * The primary action is forward: start talking.
 *
 * No animation on the card reveal — the information itself
 * is the event. Let the user read it without distraction.
 */

interface Props {
  partner: Partner;
  onAccept: () => void;
  onSkip: () => void;
}

export function MatchFound({ partner, onAccept, onSkip }: Props) {
  return (
    <Shell>
      <div className="flex flex-col h-full min-h-dvh p-6">

        {/* Eyebrow */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-wider mb-8" style={{ color: 'var(--text-2)', letterSpacing: '0.07em' }}>
            Match found
          </p>

          {/* Partner avatar — colour-seeded from their hue */}
          <div
            style={{
              width: 96, height: 96, borderRadius: '50%',
              background: `hsl(${partner.hue}, 30%, 72%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 600, color: `hsl(${partner.hue}, 25%, 30%)`,
              fontFamily: 'Georgia, serif',
              marginBottom: '1.5rem',
              border: '1px solid var(--border)',
            }}
          >
            {partner.name[0]}
          </div>

          {/* Name + age */}
          <h2 className="text-3xl mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {partner.name}
            <span className="text-xl ml-2" style={{ color: 'var(--text-2)', fontFamily: 'inherit' }}>
              {partner.age}
            </span>
          </h2>

          {/* Intent badge */}
          <div className="mb-4">
            <span
              style={{
                display: 'inline-block',
                padding: '2px 10px',
                border: '1px solid var(--border)',
                borderRadius: 20,
                fontSize: '0.78rem',
                color: 'var(--text-2)',
              }}
            >
              {partner.intent}
            </span>
          </div>

          {/* Bio */}
          {partner.bio && (
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text)', maxWidth: 260 }}>
              {partner.bio}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {partner.tags.map(tag => (
              <span
                key={tag}
                style={{
                  padding: '3px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  color: 'var(--text-2)',
                  background: 'var(--surface)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6">
          <PrimaryBtn onClick={onAccept}>Start talking →</PrimaryBtn>
          <div className="text-center">
            <button
              onClick={onSkip}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--text-2)', fontSize: '0.87rem', fontFamily: 'inherit',
                padding: '4px 0',
              }}
            >
              Skip — meet someone else
            </button>
          </div>
        </div>

      </div>
    </Shell>
  );
}
