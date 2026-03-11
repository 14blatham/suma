import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Minus, RefreshCw, MoveRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useDataContext } from '../../context/DataContext';
import { MOCK_KPIS, MOCK_TREND, MOCK_ROWS } from '../../services/api';
import { Routes } from '../../router/routes';

function DeltaIcon({ positive, neutral }: { positive: boolean; neutral: boolean }) {
  if (neutral) return <Minus className="w-3 h-3 text-[#7A6B5D]" />;
  return positive
    ? <ArrowUpRight className="w-3 h-3 text-[#8B7355]" />
    : <ArrowDownRight className="w-3 h-3 text-[#C97B7B]" />;
}

export function DashboardView() {
  const { isLoading, error, refresh, filtered } = useDataContext();
  const navigate = useNavigate();

  // Sparkline: normalise sessions to 0–32px height
  const max = Math.max(...MOCK_TREND.map(p => p.sessions));
  const spark = MOCK_TREND.map(p => Math.round((p.sessions / max) * 32));

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#F5F0E8]">
        <p className="text-[#C97B7B] text-sm">{error}</p>
        <Button variant="outline" onClick={refresh}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F5F0E8] h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-[#2C2420]">Dashboard</h2>
          <p className="text-xs text-[#7A6B5D]">Mar 1 – Mar 8, 2026</p>
        </div>
        <button
          onClick={refresh}
          aria-label="Refresh data"
          className={`p-2 rounded-lg text-[#7A6B5D] hover:bg-[#EDE6D6] transition-colors ${isLoading ? 'animate-spin' : ''}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {MOCK_KPIS.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <p className="text-xs text-[#7A6B5D] mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-[#2C2420] mb-1">{kpi.value}</p>
            <div className="flex items-center gap-1">
              <DeltaIcon positive={kpi.positive} neutral={kpi.delta === '—'} />
              <span className={`text-xs font-medium ${kpi.delta === '—' ? 'text-[#7A6B5D]' : kpi.positive ? 'text-[#8B7355]' : 'text-[#C97B7B]'}`}>
                {kpi.delta}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Sparkline trend */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-[#7A6B5D] tracking-wide uppercase">Sessions trend</p>
          <p className="text-xs text-[#7A6B5D]">8 days</p>
        </div>
        <div className="flex items-end gap-1 h-10">
          {spark.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-[#8B7355]/60 rounded-sm transition-all"
              style={{ height: `${Math.max(h, 4)}px` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-[#7A6B5D]">Mar 1</span>
          <span className="text-[10px] text-[#7A6B5D]">Mar 8</span>
        </div>
      </Card>

      {/* Recent rows */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[#7A6B5D] tracking-wide uppercase">Recent entries</p>
        <button
          onClick={() => navigate(Routes.EXPLORER)}
          className="flex items-center gap-1 text-xs text-[#8B7355] hover:underline"
        >
          View all <MoveRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-2">
        {(filtered.length > 0 ? filtered : MOCK_ROWS).slice(0, 5).map((row) => (
          <Card
            key={row.id}
            className="p-3 flex items-center justify-between cursor-pointer hover:bg-[#D6CCB8]/50 transition-colors"
            onClick={() => navigate(Routes.EXPLORER)}
          >
            <div>
              <p className="text-sm font-medium text-[#2C2420]">{row.region}</p>
              <p className="text-xs text-[#7A6B5D]">{row.category} · {row.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#8B7355]">{row.sessions}</p>
              <p className="text-xs text-[#7A6B5D]">sessions</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
