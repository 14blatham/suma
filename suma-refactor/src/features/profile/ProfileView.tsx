import { useAppContext } from '../../context/AppContext';
import { useDataContext } from '../../context/DataContext';

/*
 * Profile communicates what the user needs to know about their account
 * and their relationship to the data.
 *
 * Structure replaces decoration:
 *   - Section labels identify groups of information
 *   - Values sit to the right of their labels (the eye reads left, finds right)
 *   - A separator line is sufficient to divide sections
 *
 * No avatar. No badge. No card container.
 * The information itself is the profile.
 */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className="text-sm" style={{ color: 'var(--text-2)' }}>{label}</span>
      <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider mt-8 mb-3" style={{ color: 'var(--text-2)', letterSpacing: '0.07em' }}>
      {children}
    </p>
  );
}

export function ProfileView() {
  const { user, logout } = useAppContext();
  const { dataset } = useDataContext();

  const totalSessions = dataset?.reduce((s, r) => s + r.sessions, 0) ?? 0;
  const avgWellbeing = dataset && dataset.length > 0
    ? (dataset.reduce((s, r) => s + r.wellbeingScore, 0) / dataset.length).toFixed(2)
    : '—';
  const regions = dataset ? [...new Set(dataset.map(r => r.region))].length : 0;

  return (
    <div className="p-6 pb-10" style={{ color: 'var(--text)' }}>
      <h2 className="text-lg mb-1" style={{ fontFamily: 'Georgia, serif' }}>{user?.name}</h2>
      <p className="text-xs mb-6" style={{ color: 'var(--text-2)' }}>Analyst · Suma Insights</p>

      <SectionLabel>Dataset summary</SectionLabel>
      <Row label="Total sessions"   value={totalSessions.toLocaleString()} />
      <Row label="Avg wellbeing"    value={avgWellbeing} />
      <Row label="Regions covered"  value={String(regions)} />
      <Row label="Date range"       value="Mar 1 – Mar 8, 2026" />

      <SectionLabel>Preferences</SectionLabel>
      <Row label="Saved filters"  value="3" />
      <Row label="Export history" value="12 exports" />
      <Row label="Display"        value="Compact" />

      <SectionLabel>Access</SectionLabel>
      <Row label="Role"        value="Read only" />
      <Row label="Data access" value="Anonymised aggregates" />
      <Row label="Encryption"  value="TLS 1.3 in transit" />

      <div className="mt-10">
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
          All data displayed here is anonymised and aggregated at source.
          No individual-level records are accessible through this interface.
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={logout}
          className="text-sm transition-colors duration-100"
          style={{ color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
