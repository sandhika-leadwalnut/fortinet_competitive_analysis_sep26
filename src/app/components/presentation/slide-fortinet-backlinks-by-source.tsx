import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  SlideContainer, SlideHeader, SlideFooter, ChartContainer,
  InsightCard, InsightsSection, CompetitorFilter, CHART_CONFIG,
  TimeRangeFilter, TimeRange, getTimeRangeOffset,
} from './design-system';

const MONTHS = [
  '2025-12', '2026-01', '2026-02', '2026-03',
  '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09',
];

const formatMonth = (key: string) => {
  const map: Record<string, string> = {
    '2025-12': 'Dec-25', '2026-01': 'Jan-26', '2026-02': 'Feb-26',
    '2026-03': 'Mar-26', '2026-04': 'Apr-26', '2026-05': 'May-26',
    '2026-06': 'Jun-26', '2026-07': 'Jul-26', '2026-08': 'Aug-26', '2026-09': 'Sep-26',
  };
  return map[key] ?? key;
};

const formatAxis = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return `${v}`;
};

const SOURCES = [
  {
    id: 'ahrefs',
    name: 'Ahrefs',
    color: '#F97316',
    data: [6200000, 7500000, 6800000, 7400000, 7800000, 8100000, 8100000, 10200000, 9800000, 6600000] as (number | null)[],
  },
  {
    id: 'gsc',
    name: 'GSC',
    color: '#3B82F6',
    data: [4100000, 3400000, 3300000, 3100000, 2700000, 2500000, 2300000, 1800000, 2500000, 2700000] as (number | null)[],
  },
  {
    id: 'semrush',
    name: 'SEMRush',
    color: '#EF4444',
    data: [2800000, 2800000, 2800000, 3100000, 3100000, 3110000, 3180000, 3280000, 3680000, 3870000] as (number | null)[],
  },
  {
    id: 'majestic',
    name: 'Majestic',
    color: '#8B5CF6',
    data: [null, null, null, null, 7500000, 7100000, 6200000, 3100000, 2600000, 2100000] as (number | null)[],
  },
  {
    id: 'bing',
    name: 'Bing',
    color: '#6B7280',
    data: [900000, 900000, 800000, 800000, 900000, 900000, 1000000, 1000000, 1000000, 980000] as (number | null)[],
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const sorted = [...payload]
    .filter((e: any) => e.value != null)
    .sort((a: any, b: any) => b.value - a.value);
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[190px]">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {sorted.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}</span>
          </div>
          <span className="font-bold text-gray-900">{formatAxis(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function SlideFortinetBacklinksBySource({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [visible, setVisible] = useState<Set<string>>(new Set(SOURCES.map((s) => s.id)));
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const toggle = (id: string) => {
    setVisible((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const chartData = MONTHS.slice(tro).map((month, i) => {
    const dp: any = { month };
    SOURCES.filter((s) => visible.has(s.id)).forEach((s) => {
      dp[s.id] = s.data[i + tro] ?? null;
    });
    return dp;
  });

  const ahData    = SOURCES[0].data as number[];
  const gscData   = SOURCES[1].data as number[];
  const semData   = SOURCES[2].data as number[];
  const ahLatest  = ahData[9];
  const ahFirst   = ahData[0];
  const gscFirst  = gscData[0];
  const gscLatest = gscData[9];
  const semFirst  = semData[0];
  const semLatest = semData[9];

  return (
    <SlideContainer slideNumber={39} onNavigateHome={onNavigateHome} source="GSC · SEMRush · Ahrefs · Bing · Majestic">
      <SlideHeader
        title="Fortinet Backlinks by Source"
        subtitle="No. of Backlinks · Location: US · Dec 2025 – Sep 2026"
      />

      <div className="flex-1 flex flex-col gap-4">
        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Chart — 8 cols */}
          <div className="col-span-8 flex flex-col">
            <ChartContainer title="" height={380}>
              <div className="h-full flex flex-col">
                <div className="pb-3 border-b border-gray-200 mb-3">
                  <CompetitorFilter
                    competitors={SOURCES}
                    visibleCompetitors={visible}
                    onToggle={toggle}
                  />
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                      <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                      <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
                      <YAxis {...CHART_CONFIG.yAxis} tickFormatter={formatAxis} />
                      <Tooltip content={<CustomTooltip />} />
                      {SOURCES.filter((s) => visible.has(s.id)).map((s) => (
                        <Line
                          key={s.id}
                          type="monotone"
                          dataKey={s.id}
                          name={s.name}
                          stroke={s.color}
                          strokeWidth={2}
                          dot={{ fill: s.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartContainer>
          </div>

          {/* Insights — 4 cols */}
          <div className="col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
            <InsightsSection>
              <InsightCard
                icon={TrendingUp}
                type="warning"
                title="Ahrefs Largest, Off Peak"
                content={`Ahrefs backlinks grew ${(((ahLatest - ahFirst) / ahFirst) * 100).toFixed(0)}% Dec→Sep (${formatAxis(ahFirst)} → ${formatAxis(ahLatest)}) — the largest source overall, but down 35% from the 10.2M peak in Jul 2026 (9.8M in Aug, 6.6M in Sep).`}
              />
              <InsightCard
                icon={TrendingDown}
                type="error"
                title="GSC Backlinks Declining"
                content={`GSC backlinks dropped ${Math.abs((((gscLatest - gscFirst) / gscFirst) * 100)).toFixed(0)}% Dec→Sep (${formatAxis(gscFirst)} → ${formatAxis(gscLatest)}) — steady decline to 1.8M in Jul 2026, then a partial rebound to 2.7M by Sep; possibly reflecting link cleanup or algorithm changes.`}
              />
              <InsightCard
                icon={Activity}
                type="info"
                title="SEMRush Stable Growth"
                content={`SEMRush grew consistently ${(((semLatest - semFirst) / semFirst) * 100).toFixed(0)}% Dec→Sep (${formatAxis(semFirst)} → ${formatAxis(semLatest)}) — the most stable upward trend of any source across the full period.`}
              />
              <InsightCard
                icon={AlertTriangle}
                type="warning"
                title="Majestic Apr–Sep Trend"
                content={`Majestic data starts Apr 2026 at 7.5M and declined to 2.1M in Sep 2026 — a 72% drop in 5 months. Not tracked before Apr 2026.`}
              />
            </InsightsSection>
          </div>
        </div>
      </div>

      <SlideFooter source="Source: GSC · SEMRush · Ahrefs · Bing · Majestic · Dec 2025 – Sep 2026" />
    </SlideContainer>
  );
}
