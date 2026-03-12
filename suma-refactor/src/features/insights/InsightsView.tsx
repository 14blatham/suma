import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Cell,
} from 'recharts';
import { useDataContext } from '../../context/DataContext';
import { MOCK_TREND } from '../../services/api';

/*
 * Charts are not decoration. They reveal structure in data that
 * numbers alone cannot easily communicate.
 *
 * Principles applied here:
 *   - Maximum data-ink ratio (Tufte): every pixel earns its place
 *   - No legend if the chart title says what the line is
 *   - Gridlines horizontal only — vertical add noise, not information
 *   - No axis borders (the tick values are sufficient)
 *   - Tooltip only — no dot markers cluttering the line
 *   - Colour: one ink colour. The second chart uses a lighter value of the same.
 *
 * A chart that needs a legend is a chart with too many series.
 */

function SectionTitle({ children }: { children: string }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-wider mb-3"
      style={{ color: 'var(--text-2)', letterSpacing: '0.07em' }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return <div className="my-6" style={{ height: 1, background: 'var(--border)' }} />;
}

const TOOLTIP_STYLE = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 3,
  fontSize: 12,
  color: 'var(--text)',
  boxShadow: 'none',
};

export function InsightsView() {
  const { filtered, isLoading } = useDataContext();

  // Sessions by category
  const byCat = filtered.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + r.sessions;
    return acc;
  }, {});
  const catData = Object.entries(byCat)
    .map(([name, sessions]) => ({ name, sessions }))
    .sort((a, b) => b.sessions - a.sessions);

  // Wellbeing by region (averaged)
  const byRegion = filtered.reduce<Record<string, { sum: number; n: number }>>((acc, r) => {
    if (!acc[r.region]) acc[r.region] = { sum: 0, n: 0 };
    acc[r.region].sum += r.wellbeingScore;
    acc[r.region].n += 1;
    return acc;
  }, {});
  const regionData = Object.entries(byRegion)
    .map(([name, { sum, n }]) => ({ name: name.replace(' America', '').replace(' Pacific', ''), wellbeing: sum / n }))
    .sort((a, b) => b.wellbeing - a.wellbeing);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6" style={{ color: 'var(--text-2)' }}>
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-4" style={{ color: 'var(--text)' }}>
      <h2 className="text-lg mb-1" style={{ fontFamily: 'Georgia, serif' }}>Insights</h2>
      <p className="text-xs mb-8" style={{ color: 'var(--text-2)' }}>Reflects current filter selection</p>

      {/* Sessions over time */}
      <section>
        <SectionTitle>Sessions · 8 days</SectionTitle>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={MOCK_TREND} margin={{ top: 2, right: 4, bottom: 0, left: -28 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="none" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--text-2)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--text-2)' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ fontWeight: 600, marginBottom: 2 }} />
            <Line
              type="monotone" dataKey="sessions"
              stroke="var(--ink)" strokeWidth={1.5}
              dot={false} activeDot={{ r: 3, fill: 'var(--ink)', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <Divider />

      {/* Wellbeing trend */}
      <section>
        <SectionTitle>Avg wellbeing score · 8 days</SectionTitle>
        <ResponsiveContainer width="100%" height={110}>
          <LineChart data={MOCK_TREND} margin={{ top: 2, right: 4, bottom: 0, left: -28 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="none" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--text-2)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[7.5, 9]}
              tick={{ fontSize: 10, fill: 'var(--text-2)' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ fontWeight: 600, marginBottom: 2 }} />
            <Line
              type="monotone" dataKey="wellbeing"
              stroke="var(--ink)" strokeWidth={1.5} strokeOpacity={0.5}
              dot={false} activeDot={{ r: 3, fill: 'var(--ink)', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <Divider />

      {/* Sessions by category — a bar chart is honest here */}
      {catData.length > 0 && (
        <section>
          <SectionTitle>Sessions by category</SectionTitle>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={catData} margin={{ top: 2, right: 4, bottom: 0, left: -28 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="none" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'var(--text-2)' }}
                axisLine={false} tickLine={false}
              />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="sessions" radius={[2, 2, 0, 0]}>
                {catData.map((_, i) => (
                  <Cell key={i} fill="var(--ink)" opacity={1 - i * 0.2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      <Divider />

      {/* Wellbeing by region — a ranked list is more readable than another chart */}
      {regionData.length > 0 && (
        <section>
          <SectionTitle>Avg wellbeing by region</SectionTitle>
          <div className="space-y-3">
            {regionData.map(({ name, wellbeing }) => {
              // Scale within [7–9] range
              const pct = Math.max(0, Math.min(100, ((wellbeing - 7) / 2) * 100));
              return (
                <div key={name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{name}</span>
                    <span className="text-sm tabular-nums font-semibold" style={{ color: 'var(--ink)' }}>
                      {wellbeing.toFixed(1)}
                    </span>
                  </div>
                  {/* Progress bar: single colour, no border radius theatre */}
                  <div style={{ height: 2, background: 'var(--border)', borderRadius: 1 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--ink)',
                        borderRadius: 1,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <p className="text-sm mt-4" style={{ color: 'var(--text-2)' }}>
          No data matches the current filters.
        </p>
      )}
    </div>
  );
}
