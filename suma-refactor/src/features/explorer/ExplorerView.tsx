import { useState } from 'react';
import { ChevronUp, ChevronDown, X, Search } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { type Row } from '../../services/api';
import { Button } from '../../components/ui/Button';

type SortKey = keyof Row;
type SortDir = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'date',           label: 'Date'       },
  { key: 'region',         label: 'Region'     },
  { key: 'category',       label: 'Category'   },
  { key: 'sessions',       label: 'Sessions'   },
  { key: 'avgDuration',    label: 'Avg min'    },
  { key: 'wellbeingScore', label: 'Wellbeing'  },
  { key: 'connections',    label: 'Connected'  },
];

export function ExplorerView() {
  const { filtered, filters, setFilter, clearFilters, isLoading } = useDataContext();
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'date', dir: 'desc' });
  const [search, setSearch] = useState('');

  const toggleSort = (key: SortKey) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  const displayed = [...filtered]
    .filter(row =>
      !search ||
      Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === 'asc' ? cmp : -cmp;
    });

  const activeFilters = Object.entries(filters).filter(([, v]) => v);

  return (
    <div className="flex flex-col h-full bg-[#F5F0E8]">
      {/* Toolbar */}
      <div className="p-4 border-b border-[#D6CCB8] bg-[#EDE6D6]">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-[#F5F0E8] border border-[#D6CCB8] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#7A6B5D] shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm text-[#2C2420] placeholder-[#7A6B5D] outline-none"
              placeholder="Search all columns…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#7A6B5D]">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          {activeFilters.length > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="text-xs py-2 px-3">
              Clear filters
            </Button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['region', 'category'] as const).map(key => (
            <select
              key={key}
              value={filters[key] ?? ''}
              onChange={e => setFilter(key, e.target.value)}
              className="text-xs bg-[#F5F0E8] border border-[#D6CCB8] rounded-lg px-2 py-1.5 text-[#2C2420] outline-none capitalize"
            >
              <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}: all</option>
              {[...new Set(displayed.map(r => r[key]))].sort().map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          ))}
          <span className="text-xs text-[#7A6B5D] self-center ml-auto shrink-0">
            {isLoading ? 'Loading…' : `${displayed.length} rows`}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-[#EDE6D6] border-b border-[#D6CCB8]">
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="text-left px-3 py-3 text-xs font-semibold text-[#7A6B5D] uppercase tracking-wide cursor-pointer select-none hover:text-[#2C2420] whitespace-nowrap"
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sort.key === col.key
                      ? sort.dir === 'asc'
                        ? <ChevronUp className="w-3 h-3" />
                        : <ChevronDown className="w-3 h-3" />
                      : <ChevronDown className="w-3 h-3 opacity-20" />
                    }
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-[#D6CCB8]/50 hover:bg-[#EDE6D6]/60 transition-colors ${i % 2 === 0 ? 'bg-[#F5F0E8]' : 'bg-[#EDE6D6]/30'}`}
              >
                <td className="px-3 py-2.5 text-[#7A6B5D] tabular-nums">{row.date}</td>
                <td className="px-3 py-2.5 text-[#2C2420]">{row.region}</td>
                <td className="px-3 py-2.5 text-[#2C2420]">
                  <span className="bg-[#D6CCB8] text-[#2C2420] text-[11px] px-2 py-0.5 rounded-md">{row.category}</span>
                </td>
                <td className="px-3 py-2.5 font-semibold text-[#2C2420] tabular-nums">{row.sessions}</td>
                <td className="px-3 py-2.5 text-[#2C2420] tabular-nums">{row.avgDuration}</td>
                <td className="px-3 py-2.5 tabular-nums">
                  <span className={`font-semibold ${row.wellbeingScore >= 8.5 ? 'text-[#8B7355]' : row.wellbeingScore >= 7.5 ? 'text-[#2C2420]' : 'text-[#C97B7B]'}`}>
                    {row.wellbeingScore.toFixed(1)}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[#2C2420] tabular-nums">{row.connections}</td>
              </tr>
            ))}
            {displayed.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-[#7A6B5D]">
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
