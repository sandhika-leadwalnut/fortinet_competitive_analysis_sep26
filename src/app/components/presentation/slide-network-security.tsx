import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { TrendingDown, Trophy, Target, Shield, AlertTriangle } from 'lucide-react';
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
  { id: 'fortinet',    name: 'Fortinet',     color: '#EF4444' },
  { id: 'checkpoint',  name: 'Check Point',  color: '#6C9AFF' },
  { id: 'cisco',       name: 'Cisco',        color: '#FF7AB6' },
  { id: 'ibm',         name: 'IBM',          color: '#A78BFA' },
  { id: 'imperva',     name: 'Imperva',      color: '#34D399' },
];

// Jul 2026, Aug 2026, Sep 2026
const MONTHS = ['2026-07', '2026-08', '2026-09'];

const TOTAL_KEYWORDS_DATA = {
  fortinet:   [457, 452, 427],
  checkpoint: [221, 202, 193],
  cisco:      [380, 381, 357],
  ibm:        [203, 219, 216],
  imperva:    [67,  57,  38],
};

const TRAFFIC_DATA = {
  fortinet:   [7579, 7737, 6785],
  checkpoint: [2937, 3064, 2539],
  cisco:      [7314, 7009, 6717],
  ibm:        [3419, 2799, 2937],
  imperva:    [514,  482,  398],
};

const PAGE_ONE_DATA = {
  fortinet:   [444, 437, 411],
  checkpoint: [195, 181, 176],
  cisco:      [360, 367, 343],
  ibm:        [189, 210, 206],
  imperva:    [56,  45,  30],
};

const AIO_DATA = {
  fortinet:   [271, 260, 255],
  checkpoint: [131, 116, 119],
  cisco:      [219, 209, 201],
  ibm:        [137, 139, 131],
  imperva:    [40,  37,  22],
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

export function SlideNetworkSecurity({ onNavigateHome }: { onNavigateHome?: () => void }) {
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
            <InsightCard icon={Trophy} type="success" title="Fortinet Leads"
              content="Sep 2026: Fortinet ranks #1 with 427 keywords — 70 ahead of Cisco (357) and 234 ahead of Check Point (193). Only IBM grew Jul → Sep (203 → 216, +6%)." />
            <InsightCard icon={TrendingDown} type="error" title="Sector Contraction"
              content="Four of five vendors lost keyword coverage Jul → Sep: Fortinet −7%, Cisco −6%, Check Point −13%, Imperva −43%. Only IBM grew (+6%), intensifying competitive pressure." />
          </InsightsSection>
        );
      case 'traffic':
        return (
          <InsightsSection>
            <InsightCard icon={Trophy} type="success" title="Fortinet #1"
              content="Sep 2026: Fortinet leads with 6,785 cumulative traffic — only 68 ahead of Cisco (6,717). IBM third at 2,937. Cisco closing the gap fast." />
            <InsightCard icon={AlertTriangle} type="warning" title="Cisco Narrowing Gap"
              content="Jul 2026 gap was 265 visits (7,579 vs 7,314); by Sep it's just 68. Fortinet's traffic dropped −10.5% while Cisco fell only −8.2%." />
          </InsightsSection>
        );
      case 'page-one':
        return (
          <InsightsSection>
            <InsightCard icon={Trophy} type="success" title="Fortinet Leads"
              content="Sep 2026: Fortinet holds 411 page-1 rankings vs Cisco 343, IBM 206, Check Point 176, Imperva 30. A comfortable 68-keyword lead over Cisco." />
            <InsightCard icon={TrendingDown} type="error" title="Imperva Sharp Decline"
              content="Imperva lost nearly half its page-1 rankings (56 → 30, −46%) Jul → Sep 2026. Check Point also fell from 195 to 176 (−10%)." />
          </InsightsSection>
        );
      case 'aio':
        return (
          <InsightsSection>
            <InsightCard icon={Trophy} type="success" title="Fortinet #1 in AIO"
              content="Sep 2026: Fortinet appears in 255 AI Overviews — 54 more than Cisco (201) and 136 more than Check Point (119)." />
            <InsightCard icon={TrendingDown} type="error" title="Imperva Losing Ground"
              content="Imperva's AIO presence collapsed from 40 to 22 (−45%) Jul → Sep. Fortinet's AIO also declined (271 → 255, −6%) — monitoring warranted." />
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
    <SlideContainer slideNumber={28} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader title="Network Security" subtitle="(Jul 2026 – Sep 2026)" />

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
