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

type MetricKey = 'keywords' | 'traffic' | 'value' | 'pages';

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

const formatAxis = (v: number, isValue = false, short = false) => {
  const prefix = isValue ? '$' : '';
  if (short) {
    if (v >= 1_000_000) return `${prefix}${(v/1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `${prefix}${(v/1_000).toFixed(0)}K`;
    return `${prefix}${v}`;
  }
  return `${prefix}${v.toLocaleString()}`;
};

type VendorMetrics = { keywords: number[]; traffic: number[]; value: number[]; pages: number[] };

const DATA: Record<string, VendorMetrics> = {
  fortinet:   { keywords: [60,60,56,60,54,56,42,40,36,41],       traffic: [1400,1300,1600,1800,1800,1700,693,632,583,1000],  value: [1500,1500,1800,1700,1700,1700,1200,1200,1200,1100], pages: [8922,9100,9180,10126,9887,9144,9000,8720,8529,9361] },
  cisco:      { keywords: [3,3,3,3,2,2,2,1,1,1],                traffic: [38,48,47,56,48,43,38,31,27,25],                 value: [95,119,127,142,122,118,112,98,97,72],             pages: [38360,37019,36865,44902,41599,35379,33974,30427,28244,34289] },
  hpe:        { keywords: [8,8,8,8,6,7,7,6,6,6],                traffic: [69,68,70,68,69,71,64,62,56,68],                 value: [142,138,137,144,136,139,138,138,123,107],          pages: [19385,18935,18919,22696,21019,18483,17509,15614,13507,17537] },
  paloalto:   { keywords: [20,21,20,23,20,22,20,19,17,18],        traffic: [361,603,526,614,738,801,380,315,301,454],        value: [1000,1500,1300,1400,1500,1600,1400,1300,1500,1100], pages: [2361,2369,2494,2857,2846,2590,2514,2339,2217,2583] },
  checkpoint: { keywords: [17,17,15,15,12,12,9,7,6,9],           traffic: [210,209,166,290,264,363,240,69,59,185],          value: [234,307,191,357,312,362,280,209,147,200],          pages: [6893,6850,6950,7856,7807,7273,6956,6577,6003,6549] },
  crowdstrike:{ keywords: [0,0,0,0,0,0,0,0,0,0],                 traffic: [0,0,0,0,0,0,0,0,0,0],                           value: [0,0,0,0,0,0,0,0,1,1],                             pages: [3897,3866,4010,4630,4711,4395,4458,4288,4279,4687] },
};

const METRIC_OPTS: { id: MetricKey; label: string }[] = [
  { id: 'keywords', label: 'Organic Keywords' },
  { id: 'traffic',  label: 'Organic Traffic'  },
  { id: 'value',    label: 'Traffic Value'     },
  { id: 'pages',    label: '# of Pages'       },
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

const CustomTooltip = ({ active, payload, label, isValue, isPages }: any) => {
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
          <span className="font-bold text-gray-900">{formatAxis(entry.value, isValue, isPages)}</span>
        </div>
      ))}
    </div>
  );
};

export function SlideCyberglossaryKeywords({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [metric,    setMetric]    = useState<MetricKey>('keywords');
  const [visible,   setVisible]   = useState<Set<string>>(new Set(VENDORS.map(v => v.id)));
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const toggle = (id: string) => {
    setVisible(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const isValue = metric === 'value';
  const isPages = metric === 'pages';

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const chartData = MONTHS.slice(tro).map((month, i) => {
    const dp: any = { month };
    VENDORS.forEach(v => { if (visible.has(v.id)) dp[v.id] = DATA[v.id][metric][i + tro]; });
    return dp;
  });

  const ftLatest = DATA.fortinet[metric][9]; const ftFirst = DATA.fortinet[metric][0];
  const ftPeak   = Math.max(...DATA.fortinet[metric]);
  const ftPeakIdx = DATA.fortinet[metric].indexOf(ftPeak);
  const paLatest = DATA.paloalto[metric][9]; const paFirst = DATA.paloalto[metric][0];
  const paPeak   = Math.max(...DATA.paloalto[metric]);
  const cpLatest = DATA.checkpoint[metric][9]; const cpFirst = DATA.checkpoint[metric][0];

  const renderInsights = () => {
    if (metric === 'keywords') return (
      <InsightsSection>
        <InsightCard icon={TrendingDown} type="warning" title="Fortinet KW Decline"
          content={`Fortinet cyberglossary keywords dropped from 60 (Dec–Jan) to 41 in Sep 2026 (−32%). This significant reduction may reflect keyword de-duplication or ranking losses.`} />
        <InsightCard icon={TrendingDown} type="error" title="Check Point Collapsing"
          content={`Check Point keywords fell from 17 to 9 (−47% Dec→Sep) — the steepest decline of any vendor with 10+ keywords (rebounding slightly from 6 in Aug). Cisco also shrinking: 3 → 1. Both lost cyberglossary search visibility.`} />
        <InsightCard icon={TrendingUp} type="info" title="Fortinet Still Leads"
          content={`Despite declining, Fortinet at ${formatAxis(ftLatest)} keywords leads Palo Alto (#2 at ${formatAxis(DATA.paloalto.keywords[9])}) by ${(ftLatest/DATA.paloalto.keywords[9]).toFixed(1)}×. Palo Alto keywords remain relatively stable in the 17–23 range.`} />
      </InsightsSection>
    );
    if (metric === 'traffic') return (
      <InsightsSection>
        <InsightCard icon={TrendingDown} type="error" title="Fortinet Traffic Crash, Sep Rebound"
          content={`Fortinet cyberglossary traffic collapsed from ${formatAxis(ftPeak)} (${formatMonth(MONTHS[ftPeakIdx])}) to a low of ${formatAxis(DATA.fortinet.traffic[8])} in Aug, rebounding to ${formatAxis(ftLatest)} in Sep 2026 — still −${(((ftPeak-ftLatest)/ftPeak)*100).toFixed(0)}% vs peak. Needs diagnosis.`} />
        <InsightCard icon={TrendingUp} type="success" title="Palo Alto Peak"
          content={`Palo Alto reached ${formatAxis(paPeak)} organic traffic in May 2026 — at ${formatAxis(paLatest)} in Sep 2026 (−${(((paPeak-paLatest)/paPeak)*100).toFixed(0)}% from peak). Gap with Fortinet narrowed since Dec (26% → 45% of Fortinet's traffic) despite a much lower keyword count.`} />
        <InsightCard icon={TrendingDown} type="warning" title="Check Point Aug Low"
          content={`Check Point traffic fell from ${formatAxis(DATA.checkpoint.traffic[5])} (May peak) a low of ${formatAxis(DATA.checkpoint.traffic[8])} in Aug, then ${formatAxis(cpLatest)} in Sep 2026 — still a ${(((DATA.checkpoint.traffic[5]-cpLatest)/DATA.checkpoint.traffic[5])*100).toFixed(0)}% drop vs May. Likely an algorithm impact.`} />
      </InsightsSection>
    );
    if (metric === 'value') return (
      <InsightsSection>
        <InsightCard icon={TrendingDown} type="error" title="Fortinet Value Drop"
          content={`Fortinet traffic value dropped from ${formatAxis(ftPeak, true)} peak to ${formatAxis(ftLatest, true)} in Sep 2026 (−${(((ftPeak-ftLatest)/ftPeak)*100).toFixed(0)}%). The $1.1K value now only ties Palo Alto for the lead and the decline signals lost high-value keyword rankings.`} />
        <InsightCard icon={TrendingUp} type="success" title="Palo Alto Value Strong"
          content={`Palo Alto achieved ${formatAxis(paPeak, true)} peak traffic value in May 2026, at ${formatAxis(paLatest, true)} in Sep 2026. Level with Fortinet in absolute value (both $1,100) despite far fewer pages.`} />
        <InsightCard icon={TrendingUp} type="info" title="HPE Most Stable"
          content={`HPE traffic value ranges ${formatAxis(Math.min(...DATA.hpe.value), true)}–${formatAxis(Math.max(...DATA.hpe.value), true)} — the narrowest relative swing of any vendor, though it eased to ${formatAxis(DATA.hpe.value[9], true)} in Sep.`} />
      </InsightsSection>
    );
    // pages
    const ciscoPagesLatest = DATA.cisco.pages[9]; const ciscoPagesFirst = DATA.cisco.pages[0];
    const ciscoPeak = Math.max(...DATA.cisco.pages); const ciscoPeakMo = MONTHS[DATA.cisco.pages.indexOf(ciscoPeak)];
    const ftPagesLatest = DATA.fortinet.pages[9]; const ftPagesFirst = DATA.fortinet.pages[0];
    const hpePagesLatest = DATA.hpe.pages[9]; const hpePeakPages = Math.max(...DATA.hpe.pages);
    return (
      <InsightsSection>
        <InsightCard icon={TrendingDown} type="warning" title="Industry-Wide Page Drop"
          content={`All vendors peaked in Mar–Apr 2026, declined into Jul–Aug, then partly rebounded in Sep. Cisco peaked at ${formatAxis(ciscoPeak)} pages (${formatMonth(ciscoPeakMo)}) and sits at ${formatAxis(ciscoPagesLatest)} in Sep 2026 — a ${(((ciscoPeak-ciscoPagesLatest)/ciscoPeak)*100).toFixed(0)}% drop.`} />
        <InsightCard icon={TrendingDown} type="error" title="Fortinet Pages Declining"
          content={`Fortinet cyberglossary pages dropped from ${formatAxis(Math.max(...DATA.fortinet.pages))} (Mar peak) to ${formatAxis(DATA.fortinet.pages[8])} in Aug, then ${formatAxis(ftPagesLatest)} in Sep 2026 (−${(((Math.max(...DATA.fortinet.pages)-ftPagesLatest)/Math.max(...DATA.fortinet.pages))*100).toFixed(0)}%). Monitor for index coverage issues.`} />
        <InsightCard icon={TrendingDown} type="info" title="HPE Page Decline"
          content={`HPE pages fell from ${formatAxis(hpePeakPages)} (Mar peak) to ${formatAxis(hpePagesLatest)} by Sep 2026 (−${(((hpePeakPages-hpePagesLatest)/hpePeakPages)*100).toFixed(0)}%), up from ${formatAxis(DATA.hpe.pages[8])} in Aug. Cisco had the largest absolute drop; Palo Alto remains lowest across all months at 2.2K–2.9K pages.`} />
      </InsightsSection>
    );
  };


  return (
    <SlideContainer slideNumber={29} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader
        title="Cyberglossary Organic Keyword & Traffic"
        subtitle="Organic Keywords, Traffic, Traffic Value & Indexed Pages · Dec 2025 – Sep 2026"
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
                      <YAxis {...CHART_CONFIG.yAxis} tickFormatter={(v) => formatAxis(v, isValue, isPages)} />
                      <Tooltip content={(props) => <CustomTooltip {...props} isValue={isValue} isPages={isPages} />} />
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

      <SlideFooter source="Source: Ahrefs · Cyberglossary Organic Data · Dec 2025 – Sep 2026" />
    </SlideContainer>
  );
}
