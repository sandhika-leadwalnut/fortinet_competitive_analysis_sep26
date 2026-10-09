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

type MetricKey = 'backlinks' | 'domains';

const VENDORS = [
  { id: 'fortinet',    name: 'Fortinet',     color: '#EF4444' },
  { id: 'cisco',       name: 'Cisco',        color: '#FF7AB6' },
  { id: 'hpe',         name: 'HPE',          color: '#7ED957' },
  { id: 'paloalto',    name: 'Palo Alto',    color: '#FFB14A' },
  { id: 'checkpoint',  name: 'Check Point',  color: '#6C9AFF' },
  { id: 'crowdstrike', name: 'CrowdStrike',  color: '#1F2937' },
];

const MONTHS = ['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09'];

const formatMonth = (key: string) => {
  const map: Record<string,string> = {
    '2025-12':'Dec-25','2026-01':'Jan-26','2026-02':'Feb-26','2026-03':'Mar-26',
    '2026-04':'Apr-26','2026-05':'May-26','2026-06':'Jun-26','2026-07':'Jul-26','2026-08':'Aug-26','2026-09':'Sep-26',
  };
  return map[key] ?? key;
};

const formatAxis = (v: number) => {
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v/1_000).toFixed(0)}K`;
  return `${v}`;
};

const formatExact = (v: number) => v.toLocaleString();

type VendorMetrics = { backlinks: number[]; domains: number[] };

const DATA: Record<string, VendorMetrics> = {
  fortinet:    { backlinks: [81,93,99,104,116,134,143,159,156,142], domains: [14903,15518,15826,16197,15916,16490,16854,16233,16122,16752] },
  cisco:       { backlinks: [94,96,88,97,220,189,168,140,124,126], domains: [7796,8588,8751,9345,10265,10805,11336,10976,11155,12988] },
  hpe:         { backlinks: [257,268,267,275,248,268,264,263,284,1549], domains: [1752,2319,2412,2766,3292,3498,4012,3863,4004,4228] },
  paloalto:    { backlinks: [52,56,58,57,60,66,68,72,76,85], domains: [6388,7155,7352,7519,8278,8687,8987,8607,8811,9598] },
  checkpoint:  { backlinks: [28,27,26,28,30,34,36,39,41,43], domains: [6724,7022,6926,7377,7191,7406,7655,7352,7384,7594] },
  crowdstrike: { backlinks: [25,26,25,21,22,23,23,23,23,24], domains: [2005,2024,1998,1994,1999,2071,2248,2170,2224,2598] },
};

const METRIC_OPTS: { id: MetricKey; label: string }[] = [
  { id: 'backlinks', label: 'Backlinks'         },
  { id: 'domains',   label: 'Referring Domains' },
];

function SubFilter<T extends string>({ options, value, onChange }: { options:{id:T;label:string}[]; value:T; onChange:(v:T)=>void }) {
  return (
    <div className="flex items-center gap-1.5">
      {options.map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)}
          className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all border ${value === opt.id ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

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
          <span className="font-bold text-gray-900">{formatExact(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function SlideCyberglossaryBacklinks({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [metric,    setMetric]    = useState<MetricKey>('backlinks');
  const [visible,   setVisible]   = useState<Set<string>>(new Set(VENDORS.map(v => v.id)));
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const toggle = (id: string) => {
    setVisible(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const chartData = MONTHS.slice(tro).map((month, i) => {
    const dp: any = { month };
    VENDORS.forEach(v => { if (visible.has(v.id)) dp[v.id] = DATA[v.id][metric][i + tro]; });
    return dp;
  });

  const ftLatest = DATA.fortinet[metric][9]; const ftFirst = DATA.fortinet[metric][0];
  const ciscoLatest = DATA.cisco[metric][9];
  const hpeLatest = DATA.hpe[metric][9];   const hpeFirst = DATA.hpe[metric][0];
  const paLatest  = DATA.paloalto[metric][9]; const paFirst = DATA.paloalto[metric][0];

  const renderInsights = () => {
    if (metric === 'backlinks') return (
      <InsightsSection>
        <InsightCard icon={TrendingUp} type="success" title="Fortinet Growing Fast"
          content={`Fortinet backlinks grew ${(((ftLatest-ftFirst)/ftFirst)*100).toFixed(0)}% Dec→Sep (${formatAxis(ftFirst)} → ${formatAxis(ftLatest)}) — strongest growth rate excluding HPE's acquisition-driven spike. Gains held through Jul (159), then eased to 142 by Sep.`} />
        <InsightCard icon={AlertTriangle} type="warning" title="Cisco Apr Spike"
          content={`Cisco backlinks spiked to 220 in Apr 2026 (vs 94 in Dec) before declining to ${ciscoLatest} — a likely mass-link campaign or directory burst. Needs investigation.`} />
        <InsightCard icon={TrendingUp} type="warning" title="HPE Volume Inflated"
          content={`HPE's Sep 2026 backlink count surged to 1,549 (from 284 in Aug) — driven by the Juniper Networks acquisition. When Juniper.net pages were redirected post-acquisition, those URLs were counted as new backlinks, inflating HPE's total rather than reflecting organic growth.`} />
      </InsightsSection>
    );
    if (metric === 'domains') return (
      <InsightsSection>
        <InsightCard icon={TrendingUp} type="success" title="Fortinet Leads Domains"
          content={`Fortinet has the most referring domains: ${formatAxis(ftLatest)} in Sep 2026. Grew ${(((ftLatest-ftFirst)/ftFirst)*100).toFixed(0)}% Dec→Sep — the broadest and most diverse backlink profile.`} />
        <InsightCard icon={TrendingUp} type="success" title="HPE Domain Growth"
          content={`HPE referring domains grew ${(((hpeLatest-hpeFirst)/hpeFirst)*100).toFixed(0)}% (${formatAxis(hpeFirst)} → ${formatAxis(hpeLatest)}) — fastest growth rate. Palo Alto also strong: +${(((paLatest-paFirst)/paFirst)*100).toFixed(0)}% (${formatAxis(paFirst)} → ${formatAxis(paLatest)}).`} />
        <InsightCard icon={TrendingDown} type="warning" title="CrowdStrike Gap"
          content={`CrowdStrike referring domains at just ${formatAxis(DATA.crowdstrike.domains[9])} — lowest of all vendors. Cisco is closing in on Fortinet's lead (7.8K → 13.0K vs 14.9K → 16.8K).`} />
      </InsightsSection>
    );
  };


  return (
    <SlideContainer slideNumber={31} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader
        title="Cyberglossary Backlink Performance"
        subtitle="Backlinks, Referring Domains & Indexed Pages · Dec 2025 – Sep 2026"
      />

      <div className="flex-1 flex flex-col gap-3">
        <SubFilter options={METRIC_OPTS} value={metric} onChange={setMetric} />

        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
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
                        <Line key={v.id} type="monotone" dataKey={v.id} name={v.name} stroke={v.color}
                          strokeWidth={v.id === 'fortinet' ? 2.5 : 2}
                          dot={{ fill: v.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }} connectNulls />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartContainer>
          </div>

          <div className="col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
            {renderInsights()}
          </div>
        </div>
      </div>

      <SlideFooter source="Source: Ahrefs · Cyberglossary Backlinks & Referring Domains · Dec 2025 – Sep 2026" />
    </SlideContainer>
  );
}
