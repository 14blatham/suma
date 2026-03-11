import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useDataContext } from '../../context/DataContext';
import { MOCK_TREND } from '../../services/api';

function SectionLabel({ children }: { children: string }) {
  return <p className="text-xs font-semibold text-[#7A6B5D] tracking-wide uppercase mb-3">{children}</p>;
}

const CATEGORY_COLORS: Record<string, string> = {
  Mindfulness:   '#8B7355',
  'Peer Support': '#C4956A',
  Social:        '#D6CCB8',
};

export function InsightsView() {
  const { filtered, isLoading } = useDataContext();

  // Aggregate sessions by category
  const byCategory = filtered.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + row.sessions;
    return acc;
  }, {});
  const categoryData = Object.entries(byCategory).map(([name, sessions]) => ({ name, sessions }));

  // Aggregate wellbeing by region
  const regionMap = filtered.reduce<Record<string, { sum: number; count: number }>>((acc, row) => {
    if (!acc[row.region]) acc[row.region] = { sum: 0, count: 0 };
    acc[row.region].sum += row.wellbeingScore;
    acc[row.region].count += 1;
    return acc;
  }, {});
  const regionData = Object.entries(regionMap).map(([name, { sum, count }]) => ({
    name: name.split(' ')[0], // shorten label
    wellbeing: parseFloat((sum / count).toFixed(2)),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#F5F0E8]">
        <p className="text-sm text-[#7A6B5D]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F5F0E8] h-full overflow-y-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#2C2420] mb-1">Insights</h2>
        <p className="text-xs text-[#7A6B5D]">Based on current filter selection</p>
      </div>

      {/* Sessions over time */}
      <section>
        <SectionLabel>Sessions over time</SectionLabel>
        <div className="bg-[#EDE6D6] border border-[#D6CCB8] rounded-xl p-4">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={MOCK_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="#D6CCB8" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7A6B5D' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#7A6B5D' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#EDE6D6', border: '1px solid #D6CCB8', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#2C2420', fontWeight: 600 }}
              />
              <Line
                type="monotone" dataKey="sessions" stroke="#8B7355"
                strokeWidth={2} dot={{ r: 3, fill: '#8B7355' }} activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Sessions by category */}
      <section>
        <SectionLabel>Sessions by category</SectionLabel>
        <div className="bg-[#EDE6D6] border border-[#D6CCB8] rounded-xl p-4">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={categoryData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="#D6CCB8" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#7A6B5D' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#7A6B5D' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#EDE6D6', border: '1px solid #D6CCB8', borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="sessions" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry) => (
                  <rect key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#8B7355'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Wellbeing by region */}
      <section>
        <SectionLabel>Avg wellbeing by region</SectionLabel>
        <div className="space-y-2">
          {regionData.sort((a, b) => b.wellbeing - a.wellbeing).map(({ name, wellbeing }) => (
            <div key={name} className="bg-[#EDE6D6] border border-[#D6CCB8] rounded-xl p-3">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-[#2C2420]">{name}</span>
                <span className="text-sm font-bold text-[#8B7355]">{wellbeing}</span>
              </div>
              <div className="h-1.5 bg-[#D6CCB8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B7355] rounded-full transition-all"
                  style={{ width: `${((wellbeing - 7) / 3) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {regionData.length === 0 && (
            <p className="text-sm text-[#7A6B5D] text-center py-6">No data for current filters.</p>
          )}
        </div>
      </section>

      {/* Wellbeing trend */}
      <section>
        <SectionLabel>Wellbeing trend</SectionLabel>
        <div className="bg-[#EDE6D6] border border-[#D6CCB8] rounded-xl p-4">
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={MOCK_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="#D6CCB8" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7A6B5D' }} axisLine={false} tickLine={false} />
              <YAxis domain={[7, 9]} tick={{ fontSize: 10, fill: '#7A6B5D' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#EDE6D6', border: '1px solid #D6CCB8', borderRadius: 8, fontSize: 12 }}
              />
              <Line
                type="monotone" dataKey="wellbeing" stroke="#C4956A"
                strokeWidth={2} dot={{ r: 3, fill: '#C4956A' }} activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
