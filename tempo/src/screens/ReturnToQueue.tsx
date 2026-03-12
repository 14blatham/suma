import { Shell, PrimaryBtn, SecondaryBtn } from './Welcome';

/*
 * RETURN_TO_QUEUE
 *
 * This screen handles two cases:
 *   1. Regular pass (either one-sided or mutual)
 *   2. Early leave
 *
 * In both cases: no negative framing.
 * "Not every conversation becomes a match." is true, and enough.
 *
 * For early leave, a brief acknowledgment — not a penalty notice.
 * The system notes it internally; the user doesn't need to be lectured.
 *
 * Two paths forward:
 *   - Meet someone new (primary — keeps the user in the product)
 *   - Go home (secondary — always available, never hidden)
 */

interface Props {
  earlyLeave?: boolean;
  onQueue: () => void;
  onHome: () => void;
}

export function ReturnToQueue({ earlyLeave, onQueue, onHome }: Props) {
  return (
    <Shell>
      <div className="flex flex-col h-full min-h-dvh p-6 justify-center">

        <div className="mb-10">
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: 260 }}>
            {earlyLeave
              ? 'You left the conversation early. That\'s okay — it\'s not always the right fit.'
              : 'Not every conversation becomes a match.'
            }
          </p>
          {earlyLeave && (
            <p className="text-xs mt-3" style={{ color: 'var(--text-2)', opacity: 0.7 }}>
              For fairness, repeated early leaves may affect your position in the queue.
            </p>
          )}
        </div>

        <div className="space-y-3" style={{ maxWidth: 320 }}>
          <PrimaryBtn onClick={onQueue}>Meet someone new</PrimaryBtn>
          <SecondaryBtn onClick={onHome}>Go home</SecondaryBtn>
        </div>

      </div>
    </Shell>
  );
}
