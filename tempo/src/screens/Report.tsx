import { useState } from 'react';
import { type Partner } from '../App';
import { Shell, PrimaryBtn, SecondaryBtn } from './Welcome';

/*
 * REPORT
 *
 * Safety is non-negotiable for a live video product.
 *
 * The report flow must be:
 *   1. Fast — one tap to reach it, two to submit
 *   2. Clear — plain-language reason options, no codes
 *   3. Honest — tells the user exactly what will happen
 *   4. Final — block is immediate; no undo prompt
 *
 * On submit: the user sees a brief confirmation then moves on.
 * We don't show them moderation queue details or timelines —
 * that creates anxiety. Just: "Reported. They've been blocked."
 *
 * Cancel returns to where the user came from (call or decision screen).
 */

const REASONS = [
  'Inappropriate behaviour',
  'Harassment or threats',
  'Fake profile',
  'Appears underage',
  'Other',
] as const;

interface Props {
  partner: Partner;
  fromCall: boolean;
  onDone: () => void;
  onCancel: () => void;
}

type State = 'form' | 'submitted';

export function Report({ partner, fromCall: _fromCall, onDone, onCancel }: Props) {
  const [reason, setReason] = useState<string>('');
  const [state, setState]   = useState<State>('form');

  const handleSubmit = () => {
    if (!reason) return;
    setState('submitted');
    setTimeout(onDone, 2000);
  };

  return (
    <Shell>
      <div className="flex flex-col h-full min-h-dvh p-6">
        <div className="flex-1">

          {state === 'form' ? (
            <>
              <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                Report {partner.name}
              </h2>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {partner.name} will be immediately blocked.
                Your report goes to our moderation team.
              </p>

              {/* Reason list */}
              <div className="space-y-2 mb-8">
                {REASONS.map(r => (
                  <label
                    key={r}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '0.75rem',
                      border: `1px solid ${reason === r ? 'var(--ink)' : 'var(--border)'}`,
                      borderRadius: 6, cursor: 'pointer',
                      background: reason === r ? 'var(--surface)' : 'transparent',
                      transition: 'all 0.1s',
                    }}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      style={{ accentColor: 'var(--ink)', width: 16, height: 16, flexShrink: 0 }}
                    />
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{r}</span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center h-full">
              <p className="text-base mb-2" style={{ color: 'var(--text)' }}>
                Reported. {partner.name} has been blocked.
              </p>
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                Thank you for keeping Tempo safe.
              </p>
            </div>
          )}

        </div>

        {state === 'form' && (
          <div className="space-y-3">
            <PrimaryBtn onClick={handleSubmit} disabled={!reason}>
              Block and report
            </PrimaryBtn>
            <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
          </div>
        )}
      </div>
    </Shell>
  );
}
