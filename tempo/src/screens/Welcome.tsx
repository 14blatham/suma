/*
 * The door.
 *
 * It should open in under 10 seconds.
 * The product earns trust through clarity, not polish.
 * No hero image. No tagline committee. One serif name. One honest line.
 */

interface Props {
  onSignUp: () => void;
  onLogin: () => void;
}

export function Welcome({ onSignUp, onLogin }: Props) {
  return (
    <Shell>
      <div className="flex flex-col justify-between h-full p-8">

        {/* Identity */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl mb-3" style={{ fontFamily: 'Georgia, serif', color: 'var(--text)' }}>
            Tempo
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: 260 }}>
            Five minutes. Face to face.
            Real conversation before anything else.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <PrimaryBtn onClick={onSignUp}>Create profile</PrimaryBtn>
          <SecondaryBtn onClick={onLogin}>Sign in</SecondaryBtn>

          <p className="text-xs text-center mt-4" style={{ color: 'var(--text-2)' }}>
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>

      </div>
    </Shell>
  );
}

/* ─── shared primitives (Welcome-file-local for now) ─────────────── */

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh flex flex-col max-w-sm mx-auto relative"
      style={{ background: 'var(--bg)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
    >
      {children}
    </div>
  );
}

export function PrimaryBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '0.75rem',
        background: disabled ? 'var(--border)' : 'var(--ink)',
        color: disabled ? 'var(--text-2)' : 'var(--bg)',
        border: `1px solid ${disabled ? 'var(--border)' : 'var(--ink)'}`,
        borderRadius: 6,
        fontSize: '0.93rem',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.1s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.background = 'var(--ink-hover)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.background = 'var(--ink)')}
    >
      {children}
    </button>
  );
}

export function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '0.75rem',
        background: 'transparent',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        fontSize: '0.93rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'border-color 0.1s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {children}
    </button>
  );
}
