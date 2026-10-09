import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  SlideContainer, SlideHeader, SlideFooter, ChartContainer,
  InsightCard, InsightsSection, CompetitorFilter, CHART_CONFIG,
  TimeRange, getTimeRangeOffset, TimeRangeFilter,
} from './design-system';

const VENDORS = [
  { id: 'fortinet',    name: 'Fortinet',      color: '#EF4444' },
  { id: 'cisco',       name: 'Cisco',         color: '#FF7AB6' },
  { id: 'hpe',         name: 'HPE',           color: '#7ED957' },
  { id: 'paloalto',    name: 'Palo Alto',     color: '#FFB14A' },
  { id: 'checkpoint',  name: 'Check Point',   color: '#6C9AFF' },
  { id: 'crowdstrike', name: 'CrowdStrike',   color: '#1F2937' },
  { id: 'cato',        name: 'Cato Networks', color: '#A78BFA' },
  { id: 'sentinelone', name: 'SentinelOne',   color: '#F59E0B' },
  { id: 'wiz',         name: 'Wiz',           color: '#06B6D4' },
  { id: 'forcepoint',  name: 'Force Point',   color: '#EC4899' },
];

const MONTHS = ['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09'];

const formatMonth = (key: string) => {
  const map: Record<string,string> = {
    '2025-12':'Dec-25','2026-01':'Jan-26','2026-02':'Feb-26','2026-03':'Mar-26',
    '2026-04':'Apr-26','2026-05':'May-26','2026-06':'Jun-26','2026-07':'Jul-26','2026-08':'Aug-26','2026-09':'Sep-26',
  };
  return map[key] ?? key;
};

const DATA: Record<string, number[]> = {
  fortinet:    [36807, 36217, 36476, 38250, 38844, 39985, 37857, 30354, 31874, 34586],
  cisco:       [141751,134391,133696,146240,152101,147884,139722,116813,111636,125416],
  hpe:         [ 70164, 67403, 64944, 66992, 65079, 62480, 59152, 52283, 50693, 55400],
  paloalto:    [ 24117, 23816, 23736, 26097, 26727, 26065, 24682, 21525, 20502, 23487],
  checkpoint:  [ 14705, 14252, 14075, 15342, 15058, 14539, 14167, 13325, 12751, 14058],
  crowdstrike: [  5155,  4718,  4569,  5018,  5237,  5310,  5296,  5107,  5128,  5426],
  cato:        [  1622,  1678,  1741,  1908,  1948,  2020,  2077,  2110,  2255,  2348],
  sentinelone: [  4006,  4539,  5336,  7336,  9751, 10955, 10815,  9708,  8798, 10061],
  wiz:         [  5511,  5818,  5948,  5480,  4564,  3179,  2151,  2034,  2137,  2300],
  forcepoint:  [  3684,  3337,  3328,  3498,  3417,  3402,  3294,  3171,  3133,  3146],
};

const formatAxis = (v: number) => {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return `${v}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].filter((e:any) => e.value != null).sort((a:any,b:any) => b.value - a.value);
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]">
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

export function SlideOrganicPagesOverview({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [visible, setVisible] = useState<Set<string>>(new Set(VENDORS.map(v => v.id)));
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const toggle = (id: string) => {
    setVisible(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const chartData = MONTHS.slice(tro).map((month, i) => {
    const dp: any = { month };
    VENDORS.forEach(v => { if (visible.has(v.id)) dp[v.id] = DATA[v.id][i + tro]; });
    return dp;
  });

  const last = MONTHS.length - 1;
  const ftLatest  = DATA.fortinet[last];  const ftPeak  = Math.max(...DATA.fortinet);
  const s1Latest  = DATA.sentinelone[last]; const s1First = DATA.sentinelone[0];
  const wizLatest = DATA.wiz[last];       const wizPeak = Math.max(...DATA.wiz);
  const catoFirst = DATA.cato[0];         const catoLatest = DATA.cato[last];


  return (
    <SlideContainer slideNumber={17} onNavigateHome={onNavigateHome} source="SEMrush">
      <SlideHeader
        title="Organic Pages Performance Overview"
        subtitle="Indexed Organic Pages · Dec 2025 – Sep 2026"
      />

      <TimeRangeFilter value={timeRange} onChange={setTimeRange} />

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Chart — 8 cols */}
        <div className="col-span-8 flex flex-col">
          <ChartContainer title="" height={380}>
            <div className="h-full flex flex-col">
              <div className="pb-3 border-b border-gray-200 mb-3">
                <CompetitorFilter competitors={VENDORS} visibleCompetitors={visible} onToggle={toggle} />
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                    <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                    <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
                    <YAxis {...CHART_CONFIG.yAxis} tickFormatter={formatAxis} />
                    <Tooltip content={<CustomTooltip />} />
                    {VENDORS.filter(v => visible.has(v.id)).map(v => (
                      <Line
                        key={v.id}
                        type="monotone"
                        dataKey={v.id}
                        name={v.name}
                        stroke={v.color}
                        strokeWidth={v.id === 'fortinet' ? 2.5 : 2}
                        dot={{ fill: v.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
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
        <div className="col-span-4 flex flex-col gap-4">
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="SentinelOne Surging"
              content={`SentinelOne pages grew ${(((s1Latest - s1First) / s1First) * 100).toFixed(0)}% Dec→Sep (${s1First.toLocaleString()} → ${s1Latest.toLocaleString()}) — by far the fastest-growing vendor in indexed page count.`}
            />
            <InsightCard
              icon={TrendingDown}
              type="warning"
              title="Fortinet Below May Peak"
              content={`Fortinet peaked at ${ftPeak.toLocaleString()} pages in May 2026, fell to a Jul low of 30,354, and stood at ${ftLatest.toLocaleString()} in Sep (−${(((ftPeak - ftLatest) / ftPeak) * 100).toFixed(0)}% vs peak, +14% vs Jul). Monitor for re-indexing or content removal issues.`}
            />
            <InsightCard
              icon={AlertTriangle}
              type="error"
              title="Wiz Declining Fast"
              content={`Wiz pages fell from a Feb 2026 peak of ${wizPeak.toLocaleString()} to just ${wizLatest.toLocaleString()} in Sep 2026 (−${(((wizPeak - wizLatest) / wizPeak) * 100).toFixed(0)}%). Cato Networks moving the opposite direction: +${(((catoLatest - catoFirst) / catoFirst) * 100).toFixed(0)}% Dec→Sep.`}
            />
          </InsightsSection>

        </div>
      </div>

      <SlideFooter source="Source: SEMrush · Organic Pages · Dec 2025 – Sep 2026" />
    </SlideContainer>
  );
}
