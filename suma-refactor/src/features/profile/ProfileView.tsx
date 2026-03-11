import { User, Settings, Download, BookMarked } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAppContext } from '../../context/AppContext';
import { useDataContext } from '../../context/DataContext';

export function ProfileView() {
  const { user } = useAppContext();
  const { dataset } = useDataContext();

  const totalSessions = dataset?.reduce((sum, r) => sum + r.sessions, 0) ?? 0;
  const avgWellbeing = dataset
    ? (dataset.reduce((sum, r) => sum + r.wellbeingScore, 0) / dataset.length).toFixed(1)
    : '—';

  return (
    <div className="p-8 bg-[#F5F0E8] h-full overflow-y-auto">
      <header className="mb-10">
        <div className="w-14 h-14 bg-[#EDE6D6] border border-[#D6CCB8] rounded-xl flex items-center justify-center mb-5">
          <User className="w-7 h-7 text-[#8B7355]" />
        </div>
        <h2 className="text-2xl font-bold text-[#2C2420]">{user?.name}</h2>
        <p className="text-sm text-[#7A6B5D]">Analyst · Suma Insights</p>
      </header>

      <section className="space-y-3 mb-8">
        <p className="text-xs font-semibold text-[#7A6B5D] tracking-wide uppercase mb-2">Your session stats</p>
        <Card className="p-4 flex items-center justify-between">
          <span className="text-sm text-[#2C2420]">Sessions in dataset</span>
          <span className="font-bold text-[#8B7355]">{totalSessions.toLocaleString()}</span>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <span className="text-sm text-[#2C2420]">Avg wellbeing score</span>
          <span className="font-bold text-[#8B7355]">{avgWellbeing}</span>
        </Card>
      </section>

      <section className="space-y-3 mb-8">
        <p className="text-xs font-semibold text-[#7A6B5D] tracking-wide uppercase mb-2">Preferences</p>
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookMarked className="w-4 h-4 text-[#8B7355]" />
            <span className="text-sm text-[#2C2420]">Saved filters</span>
          </div>
          <span className="text-sm text-[#7A6B5D]">3 saved</span>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-[#8B7355]" />
            <span className="text-sm text-[#2C2420]">Export history</span>
          </div>
          <span className="text-sm text-[#7A6B5D]">12 exports</span>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-[#8B7355]" />
            <span className="text-sm text-[#2C2420]">Account settings</span>
          </div>
        </Card>
      </section>

      <div className="p-5 bg-[#EDE6D6] rounded-xl border border-[#D6CCB8]">
        <p className="text-xs text-[#7A6B5D] tracking-wide mb-2">Data access</p>
        <p className="text-sm text-[#2C2420] leading-relaxed">
          You have read access to the wellbeing dataset. All data is anonymised and aggregated before display.
        </p>
      </div>
    </div>
  );
}
