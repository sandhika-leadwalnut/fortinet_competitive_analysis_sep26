import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { TrendingDown, Target, Shield, AlertTriangle, Zap } from 'lucide-react';
import { formatChartAxisNumber } from '@/app/utils/format';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  ChartContainer,
  InsightCard,
  InsightsSection,
  CompetitorFilter,
  CHART_CONFIG,
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';

const VENDORS = [
  { id: 'fortinet',      name: 'Fortinet',       color: '#EF4444' },
  { id: 'crowdstrike',   name: 'CrowdStrike',    color: '#FF8E5A' },
  { id: 'paloalto',      name: 'Palo Alto',      color: '#FFB14A' },
  { id: 'redcanary',     name: 'Red Canary',     color: '#6C9AFF' },
  { id: 'secopsolution', name: 'Secopsolution',  color: '#A78BFA' },
  { id: 'splunk',        name: 'Splunk',         color: '#34D399' },
];

// Jul 2026, Aug 2026, Sep 2026
const MONTHS = ['2026-07', '2026-08', '2026-09'];

const TOTAL_KEYWORDS_DATA = {
  fortinet:      [317, 295, 255],
  crowdstrike:   [241, 222, 220],
  paloalto:      [674, 671, 634],
  redcanary:     [87,  78,  75],
  secopsolution: [3,   2,   4],
  splunk:        [494, 493, 442],
};

const TRAFFIC_DATA = {
  fortinet:      [3095, 2913, 2971],
  crowdstrike:   [3342, 2465, 7101],
  paloalto:      [10947, 9137, 8632],
  redcanary:     [992,  593,  536],
  secopsolution: [10,   1,    61],
  splunk:        [5626, 7288, 4069],
};

const PAGE_ONE_DATA = {
  fortinet:      [289, 267, 236],
  crowdstrike:   [226, 205, 205],
  paloalto:      [650, 645, 602],
  redcanary:     [73,  67,  68],
  secopsolution: [3,   2,   4],
  splunk:        [474, 478, 426],
};

const AIO_DATA = {
  fortinet:      [211, 185, 156],
  crowdstrike:   [189, 153, 156],
  paloalto:      [470, 442, 435],
  redcanary:     [73,  64,  55],
  secopsolution: [3,   2,   3],
  splunk:        [326, 320, 293],
};

const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${monthNames[parseInt(month) - 1]}-${year.slice(2)}`;
};

type TabType = 'keywords' | 'traffic' | 'page-one' | 'aio';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const valid = payload.filter((e: any) => e.value !== null && e.value !== undefined);
  if (!valid.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {valid.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs mb-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-700">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function SlideSecOps({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(new Set(VENDORS.map(v => v.id)));

  const toggleVendor = (id: string) => {
    setVisibleVendors(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const buildChartData = (dataset: Record<string, number[]>) =>
    MONTHS.slice(tro).map((month, i) => {
      const pt: any = { month };
      VENDORS.forEach(v => { if (visibleVendors.has(v.id)) pt[v.id] = dataset[v.id][i + tro] ?? null; });
      return pt;
    });

  const getChartData = () => {
    switch (activeTab) {
      case 'keywords':  return buildChartData(TOTAL_KEYWORDS_DATA);
      case 'traffic':   return buildChartData(TRAFFIC_DATA);
      case 'page-one':  return buildChartData(PAGE_ONE_DATA);
      case 'aio':       return buildChartData(AIO_DATA);
      default:          return [];
    }
  };

  const tabs = [
    { id: 'keywords' as TabType,  label: 'Total Keywords' },
    { id: 'traffic'  as TabType,  label: 'Cumulative Traffic' },
    { id: 'page-one' as TabType,  label: 'Page 1 Keywords' },
    { id: 'aio'      as TabType,  label: 'AIO (AI Overview)' },
  ];

  const getInsights = () => {
    switch (activeTab) {
      case 'keywords':
        return (
          <InsightsSection>
            <InsightCard icon={Target} type="error" title="Palo Alto Dominates"
              content="Sep 2026: Palo Alto leads with 634 keywords — 1.4× Splunk (442) and 2.5× Fortinet (255). Every vendor except Secopsolution lost keywords Jul → Sep." />
            <InsightCard icon={TrendingDown} type="error" title="Fortinet Declining"
              content="Fortinet lost 62 keywords Jul → Sep (317 → 255, −20%), the steepest drop among the major vendors (Red Canary −14%, Splunk −10%). Action needed." />
          </InsightsSection>
        );
      case 'traffic':
        return (
          <InsightsSection>
            <InsightCard icon={Zap} type="warning" title="CrowdStrike Sep Spike"
              content="CrowdStrike's traffic surged from 2,465 (Aug) to 7,101 (Sep 2026) — a 188% single-month jump. Likely a viral campaign or news cycle boost." />
            <InsightCard icon={Target} type="error" title="Fortinet Trails"
              content="Sep 2026: Fortinet ranks 4th in traffic (2,971) behind Palo Alto (8,632), CrowdStrike (7,101), and Splunk (4,069). Significant gap to close." />
          </InsightsSection>
        );
      case 'page-one':
        return (
          <InsightsSection>
            <InsightCard icon={Target} type="error" title="Palo Alto Leads"
              content="Sep 2026: Palo Alto holds 602 page-1 rankings — 1.4× Splunk (426) and 2.5× Fortinet (236). A large structural advantage to overcome." />
            <InsightCard icon={TrendingDown} type="error" title="Fortinet Gap Widening"
              content="Fortinet's page-1 KWs dropped from 289 (Jul) to 236 (Sep), −18%. The gap vs Splunk widened (185 → 190 keywords behind)." />
          </InsightsSection>
        );
      case 'aio':
        return (
          <InsightsSection>
            <InsightCard icon={Target} type="error" title="Palo Alto AIO Leader"
              content="Sep 2026: Palo Alto appears in 435 AI Overviews — 1.5× Splunk (293) and 2.8× Fortinet (156). AIO capture gap is wide." />
            <InsightCard icon={TrendingDown} type="error" title="Fortinet AIO Declining"
              content="Fortinet's AIO presence fell sharply Jul → Sep (211 → 156, −26%), the steepest decline across all vendors. CrowdStrike also fell −17%." />
          </InsightsSection>
        );
      default: return null;
    }
  };

  const getPerformanceSummary = () => {
    const dataset = activeTab === 'keywords' ? TOTAL_KEYWORDS_DATA
      : activeTab === 'traffic' ? TRAFFIC_DATA
      : activeTab === 'page-one' ? PAGE_ONE_DATA : AIO_DATA;
    const latestIdx = 2; // Sep 2026
    const rankings = VENDORS
      .map(v => ({ id: v.id, name: v.name, value: dataset[v.id][latestIdx] ?? 0, color: v.color }))
      .sort((a, b) => b.value - a.value);
    const fortinet = rankings.find(r => r.id === 'fortinet')!;
    const pos = rankings.findIndex(r => r.id === 'fortinet') + 1;
    const leader = rankings[0];
    const second = rankings[1];
    const fmt = (n: number) => n.toLocaleString();
    const ordinal = (n: number) => n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`;

    if (pos === 1) {
      const gap = fortinet.value - second.value;
      const pct = ((gap / fortinet.value) * 100).toFixed(1);
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex justify-between"><span className="text-sm text-green-900">Top Performer — <b>Fortinet</b></span><span className="text-sm font-semibold text-green-900">{fmt(fortinet.value)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-green-800">2nd — {second.name}</span><span className="text-sm font-semibold text-green-800">{fmt(second.value)}</span></div>
            <span className="text-sm text-green-900"><b>Lead:</b> +{fmt(gap)} ({pct}% ahead)</span>
          </div>
        </div>
      );
    }
    const gap = leader.value - fortinet.value;
    const pct = ((gap / leader.value) * 100).toFixed(1);
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-300 rounded-xl p-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex justify-between"><span className="text-sm text-orange-900">Top Performer — <b>{leader.name}</b></span><span className="text-sm font-semibold text-orange-900">{fmt(leader.value)}</span></div>
          <div className="flex justify-between"><span className="text-sm text-orange-800">{ordinal(pos)} — Fortinet</span><span className="text-sm font-semibold text-orange-800">{fmt(fortinet.value)}</span></div>
          <span className="text-sm text-orange-900"><b>Gap to #1:</b> {fmt(gap)} ({pct}% behind)</span>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    const data = getChartData();
    const visible = VENDORS.filter(v => visibleVendors.has(v.id));
    return (
      <ResponsiveContainer key={`${activeTab}-${Array.from(visibleVendors).sort().join('-')}`} width="100%" height="100%">
        <LineChart data={data} margin={CHART_CONFIG.margin}>
          <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
          <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis {...CHART_CONFIG.yAxis} tickFormatter={formatChartAxisNumber} />
          <Tooltip content={<CustomTooltip />} />
          {visible.map((v, idx) => (
            <Line key={`${v.id}-${idx}`} type="monotone" dataKey={v.id} name={v.name}
              stroke={v.color} {...CHART_CONFIG.line}
              dot={{ fill: v.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 2 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <SlideContainer slideNumber={29} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader title="SecOps" subtitle="(Jul 2026 – Sep 2026)" />

      <div className="flex-1 flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex items-start gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 text-sm font-semibold transition-all duration-200 relative ${activeTab === tab.id ? 'bg-white text-red-600 z-10' : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'}`}
              style={{ borderRadius: '12px 12px 0 0', marginBottom: '-2px', boxShadow: activeTab === tab.id ? '0 -2px 8px rgba(0,0,0,0.08), 0 2px 0 0 white' : '0 1px 3px rgba(0,0,0,0.1)' }}>
              {tab.label}
            </button>
          ))}
        </div>

        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />

        <div className="flex-1 grid grid-cols-12 gap-6">
          <div className="col-span-8 flex flex-col gap-4">
            <ChartContainer title="" height={420}>
              <div className="h-full flex flex-col">
                <div className="pb-4 border-b border-gray-200 mb-4">
                  <CompetitorFilter competitors={VENDORS} visibleCompetitors={visibleVendors} onToggle={toggleVendor} />
                </div>
                <div className="flex-1">{renderChart()}</div>
              </div>
            </ChartContainer>
          </div>
          <div className="col-span-4 flex flex-col gap-4">
            {getInsights()}
            {getPerformanceSummary()}
          </div>
        </div>
      </div>

      <SlideFooter source="Source: Ahrefs" />
    </SlideContainer>
  );
}
