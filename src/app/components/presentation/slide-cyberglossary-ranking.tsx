import { useState } from 'react';
import { TrendingUp, TrendingDown, Trophy, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  SlideContainer, SlideHeader, SlideFooter, ChartContainer,
  InsightCard, InsightsSection, CompetitorFilter, CHART_CONFIG,
  TimeRange, getTimeRangeOffset, TimeRangeFilter,
} from './design-system';

const VENDORS = [
  { id: 'fortinet',    name: 'Fortinet',     color: '#EF4444' },
  { id: 'cisco',       name: 'Cisco',        color: '#FF7AB6' },
  { id: 'hpe',         name: 'HPE',          color: '#7ED957' },
  { id: 'paloalto',    name: 'Palo Alto',    color: '#FFB14A' },
  { id: 'checkpoint',  name: 'Check Point',  color: '#6C9AFF' },
  { id: 'crowdstrike', name: 'CrowdStrike',  color: '#1F2937' },
];

const MONTHS = ['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10'];

const formatMonth = (key: string) => {
  const map: Record<string,string> = {
    '2025-12':'Dec-25','2026-01':'Jan-26','2026-02':'Feb-26','2026-03':'Mar-26',
    '2026-04':'Apr-26','2026-05':'May-26','2026-06':'Jun-26','2026-07':'Jul-26','2026-08':'Aug-26','2026-09':'Sep-26','2026-10':'Oct-26',
  };
  return map[key] ?? key;
};

const RANK_DATA: Record<string, number[]> = {
  fortinet:    [2210,2221,2201,2150,2131,2129,2132,2120,2136,2162,2125],
  cisco:       [ 556, 550, 557, 558, 558, 560, 561, 567, 571, 560, 566],
  hpe:         [2124,2137,2188,2152,2142,2133,2122,2108,2171,2188,2203],
  paloalto:    [3182,3070,2989,2969,2918,2866,2806,2717,2558,2455,2249],
  checkpoint:  [2105,2038,2024,2052,2006,1973,1934,1870,1885,1746,1715],
  crowdstrike: [4101,4047,3953,3829,3702,3703,3608,3586,3532,3376,3162],
};

const DA: Record<string, number> = {
  fortinet: 89, cisco: 92, hpe: 89, paloalto: 89, checkpoint: 90, crowdstrike: 87,
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].filter((e:any) => e.value != null).sort((a:any,b:any) => a.value - b.value);
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]">
      <p className="text-xs font-semibold text-gray-900 mb-1">{formatMonth(label)}</p>
      <p className="text-[10px] text-gray-400 mb-2 italic">Lower rank = better position</p>
      {sorted.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}</span>
          </div>
          <span className="font-bold text-gray-900">#{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function SlideCyberglossaryRanking({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [visible, setVisible] = useState<Set<string>>(new Set(VENDORS.map(v => v.id)));
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const toggle = (id: string) => {
    setVisible(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const chartData = MONTHS.slice(tro).map((month, i) => {
    const dp: any = { month };
    VENDORS.forEach(v => { if (visible.has(v.id)) dp[v.id] = RANK_DATA[v.id][i + tro]; });
    return dp;
  });

  const L = MONTHS.length - 1;
  const ftLatest  = RANK_DATA.fortinet[L];
  const csLatest  = RANK_DATA.crowdstrike[L];
  const cpLatest  = RANK_DATA.checkpoint[L]; const cpFirst  = RANK_DATA.checkpoint[0];
  const paLatest  = RANK_DATA.paloalto[L];
  const cisLatest = RANK_DATA.cisco[L];

  // DA sorted
  const daSorted = VENDORS.map(v => ({ ...v, da: DA[v.id] })).sort((a,b) => b.da - a.da);

  return (
    <SlideContainer slideNumber={30} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader
        title="Cyberglossary Ranking Performance"
        subtitle="Dec 2025 – Oct 2026"
      />

      <TimeRangeFilter value={timeRange} onChange={setTimeRange} />

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Chart — 8 cols */}
        <div className="col-span-8 flex flex-col">
          <ChartContainer title="" height={380}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                <CompetitorFilter competitors={VENDORS} visibleCompetitors={visible} onToggle={toggle} />
                <span className="text-[10px] text-gray-400 italic whitespace-nowrap">↑ lower rank = better</span>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                    <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                    <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
                    <YAxis
                      {...CHART_CONFIG.yAxis}
                      reversed
                      tickFormatter={(v) => `#${(v/1000).toFixed(1)}K`}
                    />
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
        <div className="col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
          <InsightsSection>
            <InsightCard
              icon={Trophy}
              type="success"
              title="Cisco #1 Ranked"
              content={`Cisco holds the best global rank at #${cisLatest.toLocaleString()} in Oct 2026, despite a slight MoM softening from #${RANK_DATA.cisco[L - 1].toLocaleString()}. Its consistent #550–#571 range remains the category benchmark.`}
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Check Point Improving"
              content={`Check Point improved to #${cpLatest.toLocaleString()} in Oct (from #${RANK_DATA.checkpoint[L - 1].toLocaleString()} in Sep; ${(((cpFirst - cpLatest) / cpFirst) * 100).toFixed(0)}% better than Dec). Palo Alto made the largest MoM gain, reaching #${paLatest.toLocaleString()} from #${RANK_DATA.paloalto[L - 1].toLocaleString()}.`}
            />
            <InsightCard
              icon={AlertTriangle}
              type="warning"
              title="CrowdStrike Lags"
              content={`CrowdStrike remains lowest at #${csLatest.toLocaleString()}, although it improved 6% MoM. Fortinet improved to #${ftLatest.toLocaleString()} from #${RANK_DATA.fortinet[L - 1].toLocaleString()}, but still trails Check Point and remains far behind Cisco.`}
            />
          </InsightsSection>

          {/* Domain Authority Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm flex-shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-3">Domain Authority</p>
            <div className="space-y-2">
              {daSorted.map(v => (
                <div key={v.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: v.color }} />
                  <span className={`text-xs font-medium w-24 flex-shrink-0 ${v.id === 'fortinet' ? 'text-red-700 font-bold' : 'text-gray-700'}`}>
                    {v.name}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${v.da}%`, backgroundColor: v.color, opacity: 0.8 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-800 tabular-nums w-6 text-right">{v.da}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 mt-2 italic">All vendors score 86–91 DA — highly competitive authority range</p>
          </div>
        </div>
      </div>

      <SlideFooter source="Source: Ahrefs · Global Rank & Domain Authority · Dec 2025 – Oct 2026" />
    </SlideContainer>
  );
}
