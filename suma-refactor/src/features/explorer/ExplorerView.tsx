import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, X, ArrowLeft } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { type Row } from '../../services/api';
import { Routes } from '../../router/routes';

/*
 * The explorer is a pure data table.
 * Its entire purpose is to let the user read, sort, and filter rows.
 * The UI should be nearly invisible — only the data should be prominent.
 *
 * Full-screen: no nav bar. This is focus mode.
 * The only persistent UI is the toolbar (search + filters) and the back link.
 *
 * Sort direction is communicated by a small ↑ or ↓ next to the column header.
 * Nothing more is needed.
 */

type SortKey = keyof Row;
type SortDir = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: 'date',           label: 'Date'      },
  { key: 'region',         label: 'Region'    },
  { key: 'category',       label: 'Category'  },
  { key: 'sessions',       label: 'Sessions',  numeric: true },
  { key: 'avgDuration',    label: 'Min',       numeric: true },
  { key: 'wellbeingScore', label: 'Wellbeing', numeric: true },
];

export function ExplorerView() {
  const { filtered, filters, setFilter, clearFilters, isLoading } = useDataContext();
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'date', dir: 'desc' });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const toggleSort = (key: SortKey) =>
    setSort(prev => prev.key === key
      ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { key, dir: 'asc' }
    );

  const rows = [...filtered]
    .filter(row =>
      !search ||
      Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === 'asc' ? cmp : -cmp;
    });

  const hasFilters = Object.values(filters).some(Boolean) || search;

  return (
    <div
      className="flex flex-col min-h-screen max-w-md mx-auto"
      style={{ background: 'var(--bg)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
    >
      {/* Toolbar */}
      <div
        className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        {/* Back + title + count */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(Routes.DASHBOARD)}
            className="flex items-center gap-1 text-xs transition-colors duration-100"
            style={{ color: 'var(--text-2)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            <ArrowLeft className="w-3 h-3" />
            Overview
          </button>
          <span className="text-xs ml-auto" style={{ color: 'var(--text-2)' }}>
            {isLoading ? 'Loading…' : `${rows.length} row${rows.length !== 1 ? 's' : ''}`}
          </span>
          {hasFilters && (
            <button
              onClick={() => { clearFilters(); setSearch(''); }}
              className="text-xs transition-colors duration-100"
              style={{ color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-2" style={{ border: '1px solid var(--border)', borderRadius: 4, padding: '0.4rem 0.6rem' }}>
          <input
            className="flex-1 text-sm outline-none"
            style={{ background: 'transparent', color: 'var(--text)', border: 'none' }}
            placeholder="Search all columns…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex' }}>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['region', 'category'] as const).map(key => (
            <select
              key={key}
              value={filters[key] ?? ''}
              onChange={e => setFilter(key, e.target.value)}
              className="flex-1 text-xs px-2 py-1.5 rounded"
              style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
            >
              <option value="">{key === 'region' ? 'All regions' : 'All categories'}</option>
              {[...new Set(filtered.map(r => r[key]))].sort().map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Table — the entire product */}
      <div className="flex-1 overflow-x-auto">
        <table style={{ width: '100%', tableLayout: 'auto' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--bg)' }}>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    textAlign: col.numeric ? 'right' : 'left',
                    cursor: 'pointer',
                    paddingLeft: col.numeric ? 0 : '1rem',
                    paddingRight: col.numeric ? '1rem' : 0,
                    color: sort.key === col.key ? 'var(--text)' : 'var(--text-2)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span className="inline-flex items-center gap-0.5">
                    {col.label}
                    {sort.key === col.key
                      ? sort.dir === 'asc'
                        ? <ChevronUp className="w-3 h-3" />
                        : <ChevronDown className="w-3 h-3" />
                      : <ChevronDown className="w-3 h-3" style={{ opacity: 0.2 }} />
                    }
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="hover:opacity-60 transition-opacity duration-75">
                <td style={{ paddingLeft: '1rem', color: 'var(--text-2)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                  {row.date.slice(5)}
                </td>
                <td style={{ color: 'var(--text)', fontSize: '0.82rem' }}>{row.region.split(' ')[0]}</td>
                <td style={{ color: 'var(--text-2)', fontSize: '0.8rem' }}>{row.category}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontSize: '0.87rem' }}>
                  {row.sessions}
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-2)', fontSize: '0.82rem' }}>
                  {row.avgDuration}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    paddingRight: '1rem',
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 600,
                    fontSize: '0.87rem',
                    color: row.wellbeingScore >= 8.5 ? 'var(--ink)' : row.wellbeingScore < 7.5 ? 'var(--error)' : 'var(--text)',
                  }}
                >
                  {row.wellbeingScore.toFixed(1)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ paddingLeft: '1rem', color: 'var(--text-2)', paddingTop: '2rem', paddingBottom: '2rem' }}>
                  No rows match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
