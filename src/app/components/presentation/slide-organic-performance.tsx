import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '@/app/utils/format';
import {
  SlideContainer, SlideHeader, SlideFooter, ChartContainer,
  InsightCard, InsightsSection, CompetitorFilter, CHART_CONFIG,
  TimeRangeFilter, TimeRange, getTimeRangeOffset,
} from './design-system';

// ─── Types ─────────────────────────────────────────────────────────────────────

type MainTab = 'search-traffic' | 'search-metrics' | 'ai-traffic' | 'aio-metrics';
type TrafficMetric = 'sessions' | 'users';
type MetricsView = 'us-clicks' | 'us-impressions' | 'ww-clicks' | 'ww-impressions';
type AIOMetric = 'keywords' | 'traffic';

// ─── Month keys ────────────────────────────────────────────────────────────────

const MONTHS_8 = ['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09'];
const MONTHS_7 = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09'];

const formatMonth = (key: string) => {
  const map: Record<string,string> = {
    '2025-12':'Dec-25','2026-01':'Jan-26','2026-02':'Feb-26','2026-03':'Mar-26',
    '2026-04':'Apr-26','2026-05':'May-26','2026-06':'Jun-26','2026-07':'Jul-26','2026-08':'Aug-26','2026-09':'Sep-26',
  };
  return map[key] ?? key;
};

const formatAxis = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return `${v}`;
};

// ─── Tab 1: Search Traffic ─────────────────────────────────────────────────────

const SEARCH_DATA: Record<TrafficMetric, Record<string, number[]>> = {
  sessions: {
    google: [80922,94225,102040,104400,87360,72320,64923,54149,46202,47788],
    bing:   [14461,16839, 17572, 15407,13372,12435,12525, 9671, 8084, 7721],
    yahoo:  [  783,  924,  1006,   993,  710,  645,  462,  425,  280,  268],
  },
  users: {
    google: [59668,69109,73097,74778,64464,55524,50947,40395,32258,34851],
    bing:   [11132,12955,12825,11931, 9991, 9744,10107, 7782, 6372, 6193],
    yahoo:  [  668,  830,  854,  839,  612,  569,  415,  367,  244,  230],
  },
};

const SEARCH_LINES = [
  { id: 'google', name: 'Google', color: '#3B82F6', width: 2.5 },
  { id: 'bing',   name: 'Bing',   color: '#F97316', width: 2 },
  { id: 'yahoo',  name: 'Yahoo',  color: '#10B981', width: 2 },
];

// ─── Tab 2: Search Metrics ─────────────────────────────────────────────────────

const METRICS_DATA: Record<MetricsView, { gsc: number[]; bing: number[]; ratio: number[] }> = {
  'us-clicks': {
    gsc:   [130000,153000,162000,173000,160000,142000,127000,120000,118000,121000],
    bing:  [ 68000, 76000, 76000, 71000, 64000, 55000, 58000, 59000, 60000, 59000],
    ratio: [1.9,2.0,2.1,2.4,2.5,2.6,2.2,2.0,2.0,2.0],
  },
  'us-impressions': {
    gsc:   [47500000,51100000,68200000,69900000,62100000,64700000,55800000,38400000,32900000,40600000],
    bing:  [ 2300000, 2300000, 2300000, 2100000, 1800000, 1600000, 2600000, 1900000, 1863000, 1930000],
    ratio: [21.0,22.3,29.7,33.9,35.0,40.1,21.5,20.4,17.6,21.0],
  },
  'ww-clicks': {
    gsc:   [1300000,1500000,1500000,1600000,1500000,1400000,1400000,1300000,1100000,1200000],
    bing:  [ 408000, 449000, 452000, 448000, 403000, 365000, 400000, 396000, 374000, 404000],
    ratio: [3.2,3.2,3.2,3.6,3.7,3.8,3.5,3.3,3.0,2.9],
  },
  'ww-impressions': {
    gsc:   [136600000,157500000,292300000,232700000,204800000,182100000,168300000,156200000,141300000,145200000],
    bing:  [  8800000,  8700000,  8900000,  9000000,  8300000,  7200000,  7200000,  6400000,  8300000,  8600000],
    ratio: [15.6,18.1,32.9,25.8,24.7,25.3,23.4,24.6,17.0,16.8],
  },
};

// ─── Tab 3: AI Traffic ─────────────────────────────────────────────────────────

const AI_ENGINES = [
  { id: 'chatgpt',    name: 'ChatGPT',    color: '#10B981', data: [9000,8716,8878,8888,7777,12859,10948, 9978,10389,11056] },
  { id: 'gemini',     name: 'Gemini',     color: '#3B82F6', data: [1272,1684,1743,2062,2135, 1607, 1578, 1634, 1605, 1671] },
  { id: 'perplexity', name: 'Perplexity', color: '#F59E0B', data: [1115, 824, 753, 911, 994,  656,  464,  286,  149,  179] },
  { id: 'claude',     name: 'Claude',     color: '#8B5CF6', data: [ 179, 235, 260, 508, 414,  539,  409,  295,  224,  123] },
];

// ─── Tab 4: AIO Metrics ────────────────────────────────────────────────────────

const AIO_COUNTRIES = [
  { id: 'us', name: 'US',          color: '#EF4444',
    kw: [16395,16503,18900,24298,25738,22996,21257,19353,22240],
    traffic: [190645,207640,367278,352079,197296,153672,201628,182939,184345] },
  { id: 'uk', name: 'UK',          color: '#3B82F6',
    kw: [2654,2626,3067,4109,4086,3823,3406,2782,3148],
    traffic: [16907,21345,36596,41086,39845,26704,26283,31568,36672] },
  { id: 'es', name: 'Spain',       color: '#F59E0B',
    kw: [2122,2155,2131,2713,2759,2425,2596,2558,2711],
    traffic: [10175,10561,17516,15838,12794,9115,14254,16319,20706] },
  { id: 'de', name: 'Germany',     color: '#6B7280',
    kw: [1497,1304,1410,1920,1877,1820,1916,1807,1900],
    traffic: [10948,16488,18919,14837,13550,10195,12462,19441,21926] },
  { id: 'it', name: 'Italy',       color: '#F97316',
    kw: [1784,1596,1272,1599,1687,1644,1786,1739,1804],
    traffic: [13065,14030,12272,13186,11357,9476,12223,18816,14080] },
  { id: 'nl', name: 'Netherlands', color: '#06B6D4',
    kw: [810,634,822,1368,1467,1257,1274,1121,1194],
    traffic: [2643,2504,4392,6190,4349,3014,3493,5360,4966] },
  { id: 'ru', name: 'Russia',      color: '#8B5CF6',
    kw: [161,161,380,1189,1024,1167,805,867,1240],
    traffic: [1594,1594,2927,1745,1691,1791,2449,2425,2751] },
  { id: 'fr', name: 'France',      color: '#10B981',
    kw: [0,0,0,0,0,0,338,1671,3170],
    traffic: [0,0,0,0,0,0,9867,19705,29570] },
];

// ─── Tooltip ───────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].filter((e:any) => e.value != null).sort((a:any,b:any) => b.value - a.value);
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

// ─── SubFilter ─────────────────────────────────────────────────────────────────

function SubFilter<T extends string>({
  options, value, onChange,
}: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all border ${
            value === opt.id
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function SlideOrganicPerformance({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab,     setActiveTab]     = useState<MainTab>('search-traffic');
  const [trafficMetric, setTrafficMetric] = useState<TrafficMetric>('sessions');
  const [metricsView,   setMetricsView]   = useState<MetricsView>('us-clicks');
  const [aioMetric,     setAioMetric]     = useState<AIOMetric>('keywords');
  const [visibleSearch, setVisibleSearch] = useState<Set<string>>(new Set(SEARCH_LINES.map(l => l.id)));
  const [visibleMetrics,setVisibleMetrics]= useState<Set<string>>(new Set(['gsc','bing']));
  const [visibleAI,     setVisibleAI]     = useState<Set<string>>(new Set(AI_ENGINES.map(e => e.id)));
  const [visibleAIO,    setVisibleAIO]    = useState<Set<string>>(new Set(AIO_COUNTRIES.map(c => c.id)));
  const [timeRange,     setTimeRange]     = useState<TimeRange>('all');

  const isAIO  = activeTab === 'aio-metrics';
  const months = isAIO ? MONTHS_7 : MONTHS_8;
  const tro    = getTimeRangeOffset(timeRange, months.length);

  // ── Compute chart data + lines ──────────────────────────────────────────────

  let chartData: any[] = [];
  let chartLines: Array<{id:string; name:string; color:string; width:number; dash?:string; nulls?:boolean}> = [];

  if (activeTab === 'search-traffic') {
    const d = SEARCH_DATA[trafficMetric];
    chartData = months.slice(tro).map((m,i) => {
      const dp: any = { month: m };
      SEARCH_LINES.forEach(l => { if (visibleSearch.has(l.id)) dp[l.id] = d[l.id as keyof typeof d][i+tro]; });
      return dp;
    });
    chartLines = SEARCH_LINES.filter(l => visibleSearch.has(l.id)).map(l => ({ id:l.id, name:l.name, color:l.color, width:l.width }));

  } else if (activeTab === 'search-metrics') {
    const d = METRICS_DATA[metricsView];
    const metricsLines = [
      { id:'gsc',  name:'GSC',  color:'#3B82F6', width:2.5 },
      { id:'bing', name:'Bing', color:'#6B7280', width:2 },
    ];
    chartData = months.slice(tro).map((m,i) => {
      const dp: any = { month: m };
      if (visibleMetrics.has('gsc'))  dp.gsc  = d.gsc[i+tro];
      if (visibleMetrics.has('bing')) dp.bing = d.bing[i+tro];
      return dp;
    });
    chartLines = metricsLines.filter(l => visibleMetrics.has(l.id));

  } else if (activeTab === 'ai-traffic') {
    chartData = months.slice(tro).map((m,i) => {
      const dp: any = { month: m };
      AI_ENGINES.filter(e => visibleAI.has(e.id)).forEach(e => { dp[e.id] = e.data[i+tro]; });
      return dp;
    });
    chartLines = AI_ENGINES.filter(e => visibleAI.has(e.id)).map(e => ({ id:e.id, name:e.name, color:e.color, width:2 }));

  } else if (activeTab === 'aio-metrics') {
    chartData = MONTHS_7.map((m,i) => {
      const dp: any = { month: m };
      AIO_COUNTRIES.filter(c => visibleAIO.has(c.id)).forEach(c => {
        dp[c.id] = aioMetric === 'keywords' ? c.kw[i] : c.traffic[i];
      });
      return dp;
    });
    chartLines = AIO_COUNTRIES.filter(c => visibleAIO.has(c.id)).map(c => ({ id:c.id, name:c.name, color:c.color, width:2 }));

  }

  // ── Insights ────────────────────────────────────────────────────────────────

  const renderInsights = () => {
    if (activeTab === 'search-traffic') {
      const d = SEARCH_DATA[trafficMetric];
      const label = trafficMetric === 'sessions' ? 'sessions' : 'users';
      const gLatest = d.google[9]; const gPeak = Math.max(...d.google); const gPeakIdx = d.google.indexOf(gPeak);
      const bLatest = d.bing[9];   const bFirst = d.bing[0]; const yLatest = d.yahoo[9];
      const bPeakIdx = d.bing.indexOf(Math.max(...d.bing));
      const gShare = Math.round((gLatest / (gLatest + bLatest + yLatest)) * 100);
      return (
        <InsightsSection>
          <InsightCard icon={TrendingUp} type="success" title="Google Dominates"
            content={`Google generated ${formatNumber(gLatest)} ${label} in Sep 2026, accounting for ~${gShare}% of all organic ${label}. Peaked at ${formatNumber(gPeak)} in ${formatMonth(MONTHS_8[gPeakIdx])}.`} />
          <InsightCard icon={TrendingDown} type="warning" title="Bing Declining"
            content={`Bing dropped from ${formatNumber(bFirst)} in Dec 2025 to ${formatNumber(bLatest)} in Sep 2026 (${(((bLatest-bFirst)/bFirst)*100).toFixed(0)}%). Downward trend since the ${formatMonth(MONTHS_8[bPeakIdx])} peak.`} />
          <InsightCard icon={AlertTriangle} type="error" title="Yahoo Negligible"
            content={`Yahoo averages just ${formatNumber(Math.round(d.yahoo.reduce((a,b)=>a+b,0)/d.yahoo.length))} ${label}/month — less than 1% of organic ${label}. Not a meaningful traffic source.`} />
        </InsightsSection>
      );
    }

    if (activeTab === 'search-metrics') {
      const d = METRICS_DATA[metricsView];
      const gLatest = d.gsc[9]; const gFirst = d.gsc[0]; const gPeak = Math.max(...d.gsc);
      const ratioLatest = d.ratio[9]; const ratioPeak = Math.max(...d.ratio);
      const isImpression = metricsView.includes('impression');
      const scope = metricsView.startsWith('us') ? 'US' : 'WW';
      return (
        <InsightsSection>
          <InsightCard icon={TrendingDown} type="warning" title={`${scope} GSC ${isImpression ? 'Impressions' : 'Clicks'} Peak`}
            content={`GSC ${isImpression ? 'impressions' : 'clicks'} peaked at ${formatAxis(gPeak)} — currently at ${formatAxis(gLatest)} in Sep 2026 (${(((gLatest-gFirst)/gFirst)*100).toFixed(0)}% Dec→Sep change).`} />
          <InsightCard icon={Activity} type="info" title="GSC/Bing Ratio"
            content={`GSC is ${ratioLatest}× Bing in Sep 2026. Ratio peaked at ${ratioPeak}× — GSC ${isImpression ? 'impression' : 'click'} volume significantly outpaces Bing across all months.`} />
          <InsightCard icon={TrendingUp} type="success" title={isImpression ? 'Bing Impressions Stable' : 'Bing Trend'}
            content={`Bing ${isImpression ? 'impressions' : 'clicks'} ranged from ${formatAxis(Math.min(...d.bing))} to ${formatAxis(Math.max(...d.bing))} — relatively stable vs volatile GSC trends.`} />
        </InsightsSection>
      );
    }

    if (activeTab === 'ai-traffic') {
      const chatLatest = AI_ENGINES[0].data[9]; const chatPeak = Math.max(...AI_ENGINES[0].data);
      const gemFirst = AI_ENGINES[1].data[0]; const gemLatest = AI_ENGINES[1].data[9]; const gemPeak = Math.max(...AI_ENGINES[1].data);
      const claudeFirst = AI_ENGINES[3].data[0]; const claudeLatest = AI_ENGINES[3].data[9]; const claudePeak = Math.max(...AI_ENGINES[3].data); const claudePrev = AI_ENGINES[3].data[8];
      return (
        <InsightsSection>
          <InsightCard icon={TrendingUp} type="success" title="ChatGPT Dominates"
            content={`ChatGPT drives ~85% of all AI referral traffic. May 2026 spike to ${formatNumber(chatPeak)} sessions (+65% MoM) is the highest recorded month. Sep at ${formatNumber(chatLatest)}.`} />
          <InsightCard icon={TrendingUp} type="success" title="Gemini Growing"
            content={`Gemini sessions grew ${(((gemLatest-gemFirst)/gemFirst)*100).toFixed(0)}% Dec→Sep (${formatNumber(gemFirst)} → ${formatNumber(gemLatest)}), though still below the Apr peak of ${formatNumber(gemPeak)}. Remains the #2 AI source.`} />
          <InsightCard icon={TrendingDown} type="warning" title="Claude Declining"
            content={`Claude fell ${Math.abs(((claudeLatest-claudeFirst)/claudeFirst)*100).toFixed(0)}% Dec→Sep (${formatNumber(claudeFirst)} → ${formatNumber(claudeLatest)}), including a ${Math.abs(((claudeLatest-claudePrev)/claudePrev)*100).toFixed(0)}% MoM drop in Sep — well below the May peak of ${formatNumber(claudePeak)} and the weakest engine by volume.`} />
        </InsightsSection>
      );
    }

    if (activeTab === 'aio-metrics') {
      const us = AIO_COUNTRIES[0];
      const usLatest = aioMetric === 'keywords' ? us.kw[8] : us.traffic[8];
      const usPeak   = Math.max(...(aioMetric === 'keywords' ? us.kw : us.traffic));
      const usPrev   = aioMetric === 'keywords' ? us.kw[7] : us.traffic[7];
      const val = (c: typeof us, i: number) => aioMetric === 'keywords' ? c.kw[i] : c.traffic[i];
      const runnerUp = AIO_COUNTRIES.slice(1).reduce((a, b) => (val(b, 8) > val(a, 8) ? b : a));
      const ukLatest = val(runnerUp, 8);
      const usPeakMonth = aioMetric === 'keywords' ? 'May' : 'Mar';
      const frLatest = val(AIO_COUNTRIES[7], 8); const frPrev = val(AIO_COUNTRIES[7], 7);
      const label = aioMetric === 'keywords' ? 'KWs' : 'sessions';
      return (
        <InsightsSection>
          <InsightCard icon={TrendingUp} type="success" title="US Leads AIO"
            content={`US has ${formatNumber(usLatest)} AIO ${label} in Sep 2026 — far ahead of ${runnerUp.name} #2 at ${formatNumber(ukLatest)}. US peaked at ${formatNumber(usPeak)} in ${usPeakMonth} 2026.`} />
          <InsightCard icon={TrendingDown} type="warning" title="US Still Below Peak"
            content={`US AIO ${label} peaked in ${usPeakMonth} 2026 (${formatNumber(usPeak)}) and remain ${Math.abs(((usLatest-usPeak)/usPeak)*100).toFixed(0)}% below it in Sep, though up ${(((usLatest-usPrev)/usPrev)*100).toFixed(0)}% MoM from Aug.`} />
          <InsightCard icon={TrendingUp} type="info" title="France Emerging"
            content={`France AIO ${label} surged from 0 (Jun) to ${formatNumber(frLatest)} in Sep 2026 (+${(((frLatest-frPrev)/frPrev)*100).toFixed(0)}% MoM) — fastest-growing market. A new region to monitor closely.`} />
        </InsightsSection>
      );
    }

    return null;
  };

  // ── Tabs config ─────────────────────────────────────────────────────────────

  const TABS: { id: MainTab; label: string }[] = [
    { id: 'search-traffic', label: 'Search Engines - Organic Traffic'  },
    { id: 'search-metrics', label: 'Search Engines - Organic Metrics'  },
    { id: 'ai-traffic',     label: 'LLM - Organic Traffic'             },
    { id: 'aio-metrics',    label: 'AIO Metrics (KW & Traffic)'        },
  ];

  const footerSource =
    activeTab === 'search-traffic' ? 'Source: GA & Google Webmaster · US · Dec 2025 – Sep 2026' :
    activeTab === 'search-metrics' ? 'Source: GSC & Bing Webmaster · Dec 2025 – Sep 2026' :
    activeTab === 'ai-traffic'     ? 'Source: GA · AI Engine Referrals · Dec 2025 – Sep 2026' :
                                     'Source: SEMrush · AIO Metrics · Jan 2026 – Sep 2026';

  return (
    <SlideContainer
      slideNumber={8}
      onNavigateHome={onNavigateHome}
      source={
        activeTab === 'search-traffic' ? 'GA' :
        activeTab === 'search-metrics' ? 'GSC & Bing' :
        activeTab === 'ai-traffic'     ? 'GA' :
                                         'SEMrush'
      }
    >
      <SlideHeader
        title="Organic Performance Metrics"
        subtitle="Search Engine, LLM & AIO Performance · Dec 2025 – Sep 2026"
      />

      <div className="flex-1 flex flex-col gap-3">

        {/* ── Main Tabs ──────────────────────────────────────────────────── */}
        <div className="flex items-end gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-[11.5px] font-semibold transition-all duration-200 relative ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 z-10'
                  : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300'
              }`}
              style={{
                borderRadius: '12px 12px 0 0',
                marginBottom: '-2px',
                boxShadow: activeTab === tab.id
                  ? '0 -2px 8px rgba(0,0,0,0.08), 0 2px 0 0 white'
                  : '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Sub-filters ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === 'search-traffic' && (
              <SubFilter
                options={[{id:'sessions',label:'Sessions'},{id:'users',label:'Users'}] as {id:TrafficMetric;label:string}[]}
                value={trafficMetric} onChange={setTrafficMetric}
              />
            )}
            {activeTab === 'search-metrics' && (
              <SubFilter
                options={[
                  {id:'us-clicks',label:'US Clicks'},{id:'us-impressions',label:'US Impressions'},
                  {id:'ww-clicks',label:'WW Clicks'},{id:'ww-impressions',label:'WW Impressions'},
                ] as {id:MetricsView;label:string}[]}
                value={metricsView} onChange={setMetricsView}
              />
            )}
            {activeTab === 'aio-metrics' && (
              <SubFilter
                options={[{id:'keywords',label:'Total KWs'},{id:'traffic',label:'Traffic'}] as {id:AIOMetric;label:string}[]}
                value={aioMetric} onChange={setAioMetric}
              />
            )}
          </div>
          {!isAIO && <TimeRangeFilter value={timeRange} onChange={setTimeRange} />}
        </div>

        {/* ── Main Grid ──────────────────────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">

          {/* Chart — 8 cols */}
          <div className="col-span-8 flex flex-col">
            <ChartContainer title="" height={380}>
              <div className="h-full flex flex-col">

                {/* CompetitorFilter for all tabs */}
                {activeTab === 'search-traffic' && (
                  <div className="pb-3 border-b border-gray-200 mb-3">
                    <CompetitorFilter
                      competitors={SEARCH_LINES}
                      visibleCompetitors={visibleSearch}
                      onToggle={(id) => setVisibleSearch(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; })}
                    />
                  </div>
                )}
                {activeTab === 'search-metrics' && (
                  <div className="pb-3 border-b border-gray-200 mb-3">
                    <CompetitorFilter
                      competitors={[{ id:'gsc', name:'GSC', color:'#3B82F6' }, { id:'bing', name:'Bing', color:'#6B7280' }]}
                      visibleCompetitors={visibleMetrics}
                      onToggle={(id) => setVisibleMetrics(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; })}
                    />
                  </div>
                )}
                {activeTab === 'ai-traffic' && (
                  <div className="pb-3 border-b border-gray-200 mb-3">
                    <CompetitorFilter
                      competitors={AI_ENGINES}
                      visibleCompetitors={visibleAI}
                      onToggle={(id) => setVisibleAI(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; })}
                    />
                  </div>
                )}
                {activeTab === 'aio-metrics' && (
                  <div className="pb-3 border-b border-gray-200 mb-3">
                    <CompetitorFilter
                      competitors={AIO_COUNTRIES}
                      visibleCompetitors={visibleAIO}
                      onToggle={(id) => setVisibleAIO(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; })}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                      <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                      <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
                      <YAxis {...CHART_CONFIG.yAxis} tickFormatter={formatAxis} />
                      <Tooltip content={<CustomTooltip />} />
                      {chartLines.map((l) => (
                        <Line
                          key={l.id}
                          type="monotone"
                          dataKey={l.id}
                          name={l.name}
                          stroke={l.color}
                          strokeWidth={l.width}
                          strokeDasharray={l.dash}
                          dot={{ fill: l.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          connectNulls={!!l.nulls}
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
            {renderInsights()}
          </div>
        </div>
      </div>

      <SlideFooter source={footerSource} />
    </SlideContainer>
  );
}
