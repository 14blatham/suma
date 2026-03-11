import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';
import { MOCK_KPIS, MOCK_TREND } from '../../services/api';
import { Routes } from '../../router/routes';

/*
 * The dashboard is an instrument panel, not a poster.
 *
 * Hierarchy:
 *   1. The four numbers — at a glance, the state of things
 *   2. The 7-day trend — direction over time
 *   3. The most recent entries — ground-level detail
 *
 * No decorative elements. No illustrations. No cards competing for attention.
 * White space does the grouping.
 */

function Stat({ label, value, delta, positive }: {
  label: string; value: string; delta: string; positive: boolean;
}) {
  return (
    <div>
      <div className="text-xl font-semibold tabular-nums mb-0.5" style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div className="text-xs mb-1" style={{ color: 'var(--text-2)' }}>{label}</div>
      {delta !== '—' && (
        <div className="text-xs" style={{ color: positive ? 'var(--ink)' : 'var(--error)' }}>
          {positive ? '+' : ''}{delta}
        </div>
      )}
    </div>
  );
}

export function DashboardView() {
  const { filtered, isLoading, error, refresh } = useDataContext();
  const navigate = useNavigate();

  // Spark: normalise to 0–36px
  const max = Math.max(...MOCK_TREND.map(p => p.sessions));

  return (
    <div className="p-6" style={{ color: 'var(--text)' }}>

      {/* Header */}
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h2 className="text-lg" style={{ fontFamily: 'Georgia, serif' }}>Overview</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>Mar 1 – Mar 8, 2026</p>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="text-xs px-3 py-1.5 rounded border transition-colors duration-100"
          style={{
            color: 'var(--text-2)',
            borderColor: 'var(--border)',
            background: 'transparent',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          {isLoading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <p className="text-sm mb-6" style={{ color: 'var(--error)' }}>{error}</p>
      )}

      {/* Stat grid — four numbers, equal weight */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-10">
        {MOCK_KPIS.map(kpi => (
          <Stat key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Separator */}
      <div className="mb-6" style={{ height: '1px', background: 'var(--border)' }} />

      {/* 7-day trend — a sparkline, not a feature */}
      <div className="mb-8">
        <p className="text-xs mb-3" style={{ color: 'var(--text-2)' }}>Sessions · 8 days</p>
        <div className="flex items-end gap-px" style={{ height: 36 }}>
          {MOCK_TREND.map((p, i) => (
            <div
              key={i}
              className="flex-1 transition-none"
              title={`${p.date}: ${p.sessions}`}
              style={{
                height: `${Math.max((p.sessions / max) * 36, 2)}px`,
                background: 'var(--ink)',
                opacity: 0.55 + (i / MOCK_TREND.length) * 0.45,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: 'var(--text-2)' }}>Mar 1</span>
          <span className="text-xs" style={{ color: 'var(--text-2)' }}>Mar 8</span>
        </div>
      </div>

      {/* Separator */}
      <div className="mb-5" style={{ height: '1px', background: 'var(--border)' }} />

      {/* Recent data — a compact table, not cards */}
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
          Recent entries
        </p>
        <button
          onClick={() => navigate(Routes.EXPLORER)}
          className="text-xs transition-colors duration-100"
          style={{ color: 'var(--ink)', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          All data →
        </button>
      </div>

      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', paddingBottom: '0.4rem', paddingLeft: 0 }}>Region</th>
            <th style={{ textAlign: 'left', paddingBottom: '0.4rem' }}>Category</th>
            <th style={{ textAlign: 'right', paddingBottom: '0.4rem', paddingRight: 0 }}>Sessions</th>
          </tr>
        </thead>
        <tbody>
          {(filtered.length > 0 ? filtered : []).slice(0, 6).map(row => (
            <tr
              key={row.id}
              onClick={() => navigate(Routes.EXPLORER)}
              style={{ cursor: 'pointer' }}
              className="hover:opacity-70 transition-opacity duration-75"
            >
              <td style={{ paddingLeft: 0, color: 'var(--text)' }}>{row.region}</td>
              <td style={{ color: 'var(--text-2)', fontSize: '0.8rem' }}>{row.category}</td>
              <td style={{ textAlign: 'right', paddingRight: 0, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                {row.sessions}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && !isLoading && (
            <tr>
              <td colSpan={3} style={{ color: 'var(--text-2)', paddingLeft: 0 }}>No data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
