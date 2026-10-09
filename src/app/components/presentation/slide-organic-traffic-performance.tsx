import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Trophy } from 'lucide-react';
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
  fortinet:    [2900000,3000000,3100000,3500000,3600000,3700000,3500000,3400000,3000000,3000000],
  cisco:       [2100000,4000000,3100000,3400000,3000000,2300000,2800000,1900000,1500000,1600000],
  hpe:         [ 592000, 865000, 830000, 857000, 819000, 572000, 825000, 577000, 470000, 498000],
  paloalto:    [ 443000, 800000, 850000, 794000, 886000, 881000,1071000, 692000, 646000, 640000],
  checkpoint:  [ 545000, 543000, 549000, 618000, 625000, 558000, 681000, 528000, 425000, 407000],
  crowdstrike: [ 688000, 727000, 698000, 697000, 667000, 645000, 606000, 520000, 433000, 382000],
  cato:        [  44000,  46000,  52000,  70000,  78000,  68000,  67000,  71000,  63000,  66000],
  sentinelone: [ 331000, 336000, 384000, 365000, 383000, 421000, 461000, 370000, 352000, 309000],
  wiz:         [ 177000, 142000, 141000, 132000, 129000, 104000, 118000, 109000, 101000,  94000],
};

const formatAxis = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K`;
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

export function SlideOrganicTrafficPerformance({ onNavigateHome }: { onNavigateHome?: () => void }) {
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

  const ftLatest  = DATA.fortinet[9];  const ftFirst  = DATA.fortinet[0];
  const ciscoLatest = DATA.cisco[9];   const ciscoPeak = Math.max(...DATA.cisco);
  const s1First   = DATA.sentinelone[0]; const s1Latest = DATA.sentinelone[9];
  const paFirst   = DATA.paloalto[0]; const paLatest  = DATA.paloalto[9];  const paPeak   = Math.max(...DATA.paloalto);
  const ftPeak    = Math.max(...DATA.fortinet); const ftPeakMonth = formatMonth(MONTHS[DATA.fortinet.indexOf(ftPeak)]);
  const runnerUpLatest = Math.max(...VENDORS.filter(v => v.id !== 'fortinet').map(v => DATA[v.id][9]));
  const wizFirst  = DATA.wiz[0];       const wizLatest = DATA.wiz[9];


  return (
    <SlideContainer slideNumber={16} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader
        title="Organic Traffic Performance"
        subtitle="Organic Traffic · Dec 2025 – Sep 2026"
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
              icon={Trophy}
              type="success"
              title="Fortinet Leads WW"
              content={`Fortinet leads WW organic traffic at ${formatAxis(ftLatest)} in Sep 2026, up ${(((ftLatest - ftFirst) / ftFirst) * 100).toFixed(0)}% from ${formatAxis(ftFirst)} in Dec 2025. Down from a ${formatAxis(ftPeak)} peak in ${ftPeakMonth}, but still ~${(ftLatest / runnerUpLatest).toFixed(1)}× the next-best vendor (${formatAxis(runnerUpLatest)}).`}
            />
            <InsightCard
              icon={TrendingDown}
              type="warning"
              title="Cisco Highly Volatile"
              content={`Cisco spiked to ${formatAxis(ciscoPeak)} in Jan 2026 then collapsed to ${formatAxis(ciscoLatest)} in Sep 2026 (−${(((ciscoPeak - ciscoLatest) / ciscoPeak) * 100).toFixed(0)}%). Extreme month-to-month swings suggest unstable crawl/indexing patterns.`}
            />
            <InsightCard
              icon={TrendingUp}
              type="info"
              title="Palo Alto Growing"
              content={`Palo Alto grew ${(((paLatest - paFirst) / paFirst) * 100).toFixed(0)}% Dec→Sep (${formatAxis(paFirst)} → ${formatAxis(paLatest)}), though below its Jun peak of ${formatAxis(paPeak)}. SentinelOne slipped ${Math.abs(((s1Latest - s1First) / s1First) * 100).toFixed(0)}% (${formatAxis(s1First)} → ${formatAxis(s1Latest)}) over the same period.`}
            />
          </InsightsSection>

        </div>
      </div>

      <SlideFooter source="Source: Ahrefs · Organic Traffic · Dec 2025 – Sep 2026" />
    </SlideContainer>
  );
}
