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

const MONTHS = ['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10'];

const formatMonth = (key: string) => {
  const map: Record<string,string> = {
    '2025-12':'Dec-25','2026-01':'Jan-26','2026-02':'Feb-26','2026-03':'Mar-26',
    '2026-04':'Apr-26','2026-05':'May-26','2026-06':'Jun-26','2026-07':'Jul-26','2026-08':'Aug-26','2026-09':'Sep-26','2026-10':'Oct-26',
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
  fortinet:   { keywords: [60,60,56,60,54,56,42,40,36,41,36],       traffic: [1400,1300,1600,1800,1800,1700,693,632,583,1000,540],  value: [1500,1500,1800,1700,1700,1700,1200,1200,1200,1100,1100], pages: [8922,9100,9180,10126,9887,9144,9000,8720,8529,9361,8933] },
  cisco:      { keywords: [3,3,3,3,2,2,2,1,1,1,2],                traffic: [38,48,47,56,48,43,38,31,27,25,22],                 value: [95,119,127,142,122,118,112,98,97,72,82],             pages: [38360,37019,36865,44902,41599,35379,33974,30427,28244,34289,19651] },
  hpe:        { keywords: [8,8,8,8,6,7,7,6,6,6,7],                traffic: [69,68,70,68,69,71,64,62,56,68,51],                 value: [142,138,137,144,136,139,138,138,123,107,130],          pages: [19385,18935,18919,22696,21019,18483,17509,15614,13507,17537,16885] },
  paloalto:   { keywords: [20,21,20,23,20,22,20,19,17,18,16],        traffic: [361,603,526,614,738,801,380,315,301,454,214],        value: [1000,1500,1300,1400,1500,1600,1400,1300,1500,1100,1200], pages: [2361,2369,2494,2857,2846,2590,2514,2339,2217,2583,2531] },
  checkpoint: { keywords: [17,17,15,15,12,12,9,7,6,9,6],           traffic: [210,209,166,290,264,363,240,69,59,185,65],          value: [234,307,191,357,312,362,280,209,147,200,169],          pages: [6893,6850,6950,7856,7807,7273,6956,6577,6003,6549,6262] },
  crowdstrike:{ keywords: [0,0,0,0,0,0,0,0,0,0,5],                 traffic: [0,0,0,0,0,0,0,0,0,0,18],                           value: [0,0,0,0,0,0,0,0,1,1,26],                             pages: [3897,3866,4010,4630,4711,4395,4458,4288,4279,4687,4089] },
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

  const L = MONTHS.length - 1;
  const ftLatest = DATA.fortinet[metric][L]; const ftFirst = DATA.fortinet[metric][0];
  const ftPeak   = Math.max(...DATA.fortinet[metric]);
  const ftPeakIdx = DATA.fortinet[metric].indexOf(ftPeak);
  const paLatest = DATA.paloalto[metric][L];
  const paPeak   = Math.max(...DATA.paloalto[metric]);
  const cpLatest = DATA.checkpoint[metric][L];

  const renderInsights = () => {
    if (metric === 'keywords') return (
      <InsightsSection>
        <InsightCard icon={TrendingDown} type="warning" title="Fortinet KW Decline"
          content={`Fortinet cyberglossary keywords fell to 36 in Oct 2026 (−12% MoM; −40% vs Dec). The footprint is back at the Jul–Aug low, indicating renewed ranking contraction.`} />
        <InsightCard icon={TrendingDown} type="error" title="Check Point Collapsing"
          content={`Check Point fell to 6 keywords (−33% MoM; −65% vs Dec). Palo Alto also declined to 16, while CrowdStrike entered the tracked set with 5 keywords and Cisco recovered from 1 to 2.`} />
        <InsightCard icon={TrendingUp} type="info" title="Fortinet Still Leads"
          content={`Fortinet still leads with ${formatAxis(ftLatest)} keywords, ${((ftLatest / DATA.paloalto.keywords[L] - 1) * 100).toFixed(0)}% ahead of Palo Alto at ${formatAxis(DATA.paloalto.keywords[L])}. Leadership remains meaningful, but both vendors lost coverage in October.`} />
      </InsightsSection>
    );
    if (metric === 'traffic') return (
      <InsightsSection>
        <InsightCard icon={TrendingDown} type="error" title="Fortinet Traffic Reverses"
          content={`Fortinet cyberglossary traffic fell from ${formatAxis(DATA.fortinet.traffic[L - 1])} in Sep to ${formatAxis(ftLatest)} in Oct (−${(((DATA.fortinet.traffic[L - 1] - ftLatest) / DATA.fortinet.traffic[L - 1]) * 100).toFixed(0)}% MoM), now −${(((ftPeak-ftLatest)/ftPeak)*100).toFixed(0)}% below the ${formatMonth(MONTHS[ftPeakIdx])} peak.`} />
        <InsightCard icon={TrendingUp} type="success" title="Palo Alto Peak"
          content={`Palo Alto dropped to ${formatAxis(paLatest)} in Oct (−${(((DATA.paloalto.traffic[L - 1] - paLatest) / DATA.paloalto.traffic[L - 1]) * 100).toFixed(0)}% MoM) and remains −${(((paPeak-paLatest)/paPeak)*100).toFixed(0)}% below its peak. Fortinet still leads traffic by ${(ftLatest / paLatest).toFixed(1)}×.`} />
        <InsightCard icon={AlertTriangle} type="warning" title="Broad October Contraction"
          content={`Check Point traffic fell to ${formatAxis(cpLatest)} (−${(((DATA.checkpoint.traffic[L - 1] - cpLatest) / DATA.checkpoint.traffic[L - 1]) * 100).toFixed(0)}% MoM), while HPE declined 25% and Cisco 12%. The cross-vendor drop warrants an Ahrefs methodology check alongside page-level ranking analysis.`} />
      </InsightsSection>
    );
    if (metric === 'value') return (
      <InsightsSection>
        <InsightCard icon={TrendingDown} type="error" title="Fortinet Value Drop"
          content={`Fortinet traffic value held at ${formatAxis(ftLatest, true)} in Oct, still −${(((ftPeak-ftLatest)/ftPeak)*100).toFixed(0)}% below peak. Stable value despite lower traffic suggests the remaining rankings skew toward higher-value queries.`} />
        <InsightCard icon={TrendingUp} type="success" title="Palo Alto Value Strong"
          content={`Palo Alto rose to ${formatAxis(paLatest, true)} in Oct (+9% MoM) and moved ahead of Fortinet by ${formatAxis(paLatest - ftLatest, true)} despite operating with far fewer indexed pages.`} />
        <InsightCard icon={TrendingUp} type="info" title="HPE Most Stable"
          content={`HPE recovered to ${formatAxis(DATA.hpe.value[L], true)} (+21% MoM), while Cisco improved to ${formatAxis(DATA.cisco.value[L], true)}. Check Point declined 16% to ${formatAxis(DATA.checkpoint.value[L], true)}.`} />
      </InsightsSection>
    );
    // pages
    const ciscoPagesLatest = DATA.cisco.pages[L];
    const ftPagesLatest = DATA.fortinet.pages[L];
    const hpePagesLatest = DATA.hpe.pages[L];
    return (
      <InsightsSection>
        <InsightCard icon={TrendingDown} type="warning" title="Industry-Wide Page Drop"
          content={`Indexed pages fell across all six vendors in Oct. Cisco recorded the largest decline, dropping from ${formatAxis(DATA.cisco.pages[L - 1])} to ${formatAxis(ciscoPagesLatest)} (−${(((DATA.cisco.pages[L - 1] - ciscoPagesLatest) / DATA.cisco.pages[L - 1]) * 100).toFixed(0)}% MoM).`} />
        <InsightCard icon={TrendingDown} type="error" title="Fortinet Pages Declining"
          content={`Fortinet pages eased to ${formatAxis(ftPagesLatest)} in Oct (−${(((DATA.fortinet.pages[L - 1] - ftPagesLatest) / DATA.fortinet.pages[L - 1]) * 100).toFixed(1)}% MoM; −${(((Math.max(...DATA.fortinet.pages)-ftPagesLatest)/Math.max(...DATA.fortinet.pages))*100).toFixed(0)}% vs peak). Check removals, canonicals and index coverage.`} />
        <InsightCard icon={TrendingDown} type="info" title="HPE Page Decline"
          content={`HPE declined to ${formatAxis(hpePagesLatest)} (−4% MoM), Check Point to ${formatAxis(DATA.checkpoint.pages[L])} (−4%), and CrowdStrike to ${formatAxis(DATA.crowdstrike.pages[L])} (−13%). The synchronized contraction may reflect Ahrefs recrawling as well as real index loss.`} />
      </InsightsSection>
    );
  };


  return (
    <SlideContainer slideNumber={29} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader
        title="Cyberglossary Organic Keyword & Traffic"
        subtitle="Organic Keywords, Traffic, Traffic Value & Indexed Pages · Dec 2025 – Oct 2026"
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

      <SlideFooter source="Source: Ahrefs · Cyberglossary Organic Data · Dec 2025 – Oct 2026" />
    </SlideContainer>
  );
}
