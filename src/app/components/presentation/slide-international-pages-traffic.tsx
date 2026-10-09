import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '@/app/utils/format';
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

const MONTHS = [
  '2025-07', '2025-08', '2025-09', '2025-10', '2025-11',
  '2025-12', '2026-01', '2026-02', '2026-03',
  '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09',
];

const formatMonth = (key: string) => {
  const map: Record<string, string> = {
    '2025-07': 'Jul-25', '2025-08': 'Aug-25', '2025-09': 'Sep-25',
    '2025-10': 'Oct-25', '2025-11': 'Nov-25',
    '2025-12': 'Dec-25', '2026-01': 'Jan-26', '2026-02': 'Feb-26',
    '2026-03': 'Mar-26', '2026-04': 'Apr-26', '2026-05': 'May-26',
    '2026-06': 'Jun-26', '2026-07': 'Jul-26', '2026-08': 'Aug-26', '2026-09': 'Sep-26',
  };
  return map[key] ?? key;
};

type TabType = 'organic' | 'direct';

const ORGANIC_COUNTRIES = [
  { id: 'total', name: 'Total', color: '#1F2937', data: [76822, 82472, 103188, 105475, 88130, 55826, 61027, 70768, 82453, 79456, 73087, 60701, 45458, 45900, 56224 ] },
  { id: 'lat',   name: 'LAT',  color: '#F59E0B', data: [28418, 35565,  49992,  50541, 40241, 19198, 23392, 34608, 37527, 36645, 35072, 27359, 21650, 24921, 34657 ] },
  { id: 'tw',    name: 'TW',   color: '#06B6D4', data: [11619, 11179,  11159,  10515, 10631,  9354,  8550,  6290,  9790,  9056,  8568,  7426,  7294,  6673,  6312 ] },
  { id: 'jp',    name: 'JP',   color: '#F97316', data: [ 8892,  7734,   8630,  10656,  8866,  7459,  7683,  7020,  6792,  7107,  6412,  6967,  6351,  5375,  5121 ] },
  { id: 'br',    name: 'BR',   color: '#22C55E', data: [10412, 12455,  13769,  13536, 10869,  7486,  8354,  9791, 13121, 11599, 11298,  8077,  1224,  1416,  1359 ] },
  { id: 'fr',    name: 'FR',   color: '#3B82F6', data: [ 7545,  6898,   9398,  10961,  9305,  6431,  6986,  7581,  7791,  8464,  6535,  5951,  4562,  3733,  4721 ] },
  { id: 'kr',    name: 'KR',   color: '#8B5CF6', data: [ 8055,  6927,   7942,   6931,  6777,  4865,  4731,  4168,  5912,  5445,  4242,  3944,  3519,  2988,  3044 ] },
  { id: 'de',    name: 'DE',   color: '#6B7280', data: [ 1013,  1101,   1356,   1372,  1088,   751,  1019,  1011,  1134,   849,   693,   699,   613,   630,   721 ] },
  { id: 'it',    name: 'IT',   color: '#EF4444', data: [  868,   613,    942,    963,   353,   282,   312,   299,   386,   291,   267,   278,   245,   164,   289 ] },
  { id: 'cn',    name: 'CN',   color: '#D1D5DB', data: [    0,     0,      0,      0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0 ] },
];

const DIRECT_COUNTRIES = [
  //                          Jul-25  Aug-25  Sep-25  Oct-25  Nov-25  Dec-25  Jan-26  Feb-26  Mar-26  Apr-26  May-26  Jun-26  Jul-26  Aug-26  Sep-26
  { id: 'total', name: 'Total', color: '#1F2937', data: [11374, 11823,  8903, 11363, 28802, 24239, 19990, 17382, 21240, 20699, 26068, 29445,  9444,  8209,  9356 ] },
  { id: 'fr',    name: 'FR',   color: '#3B82F6', data: [ 1644,  1686,  1295,  2348,  6533,  6810,  6078,  5303,  5694,  5664,  5721,  6585,  1815,  1024,  1060 ] },
  { id: 'lat',   name: 'LAT',  color: '#F59E0B', data: [ 3005,  3420,  4404,  4764,  6428,  4303,  4315,  4945,  6456,  6721,  7075,  6666,  3383,  3398,  4459 ] },
  { id: 'it',    name: 'IT',   color: '#EF4444', data: [ 1204,   986,   384,   924,  3783,  3275,  2379,  2047,  2219,  2057,  2564,  2674,   598,   383,   459 ] },
  { id: 'de',    name: 'DE',   color: '#6B7280', data: [  896,  1082,   317,   675,  3361,  2675,  1994,  1707,  2161,  1643,  2186,  2498,   592,   507,   525 ] },
  { id: 'tw',    name: 'TW',   color: '#06B6D4', data: [ 1329,  1443,   715,   647,  2081,  2517,  2557,  1302,  1577,  1414,  3191,  4076,   730,   989,   996 ] },
  { id: 'br',    name: 'BR',   color: '#22C55E', data: [ 1577,  1702,  1002,  1152,  3003,  2236,  1501,  1328,  2118,  2182,  3133,  3936,  1429,  1091,  1104 ] },
  { id: 'jp',    name: 'JP',   color: '#F97316', data: [  798,   539,   450,   617,  1980,  1317,   556,   403,   487,   487,   859,  1330,   511,   473,   428 ] },
  { id: 'kr',    name: 'KR',   color: '#8B5CF6', data: [  921,   965,   336,   236,  1633,  1106,   610,   347,   528,   531,  1339,  1680,   386,   344,   325 ] },
  { id: 'cn',    name: 'CN',   color: '#D1D5DB', data: [    0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0 ] },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const sorted = [...payload]
    .filter((e: any) => e.value != null && e.value > 0)
    .sort((a: any, b: any) => b.value - a.value);
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {sorted.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}</span>
          </div>
          <span className="font-bold text-gray-900">{formatNumber(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function SlideInternationalPagesTraffic({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('organic');
  const [visibleOrganic, setVisibleOrganic] = useState<Set<string>>(
    new Set(ORGANIC_COUNTRIES.map((c) => c.id))
  );
  const [visibleDirect, setVisibleDirect] = useState<Set<string>>(
    new Set(DIRECT_COUNTRIES.map((c) => c.id))
  );
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const countries   = activeTab === 'organic' ? ORGANIC_COUNTRIES : DIRECT_COUNTRIES;
  const visible     = activeTab === 'organic' ? visibleOrganic : visibleDirect;
  const setVisible  = activeTab === 'organic' ? setVisibleOrganic : setVisibleDirect;

  const toggle = (id: string) => {
    setVisible((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const chartData = MONTHS.slice(tro).map((month, i) => {
    const dp: any = { month };
    countries.forEach((c) => {
      if (visible.has(c.id)) dp[c.id] = c.data[i + tro];
    });
    return dp;
  });

  const totalData    = countries[0].data;
  const totalLatest  = totalData[totalData.length - 1];
  const totalPeak    = Math.max(...totalData);
  const totalPeakIdx = totalData.indexOf(totalPeak);
  const peakDropPct  = (((totalLatest - totalPeak) / totalPeak) * 100).toFixed(1);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'organic',      label: 'Organic traffic'                },
    { id: 'direct',       label: 'Direct traffic'                 },
  ];

  const getInsights = () => {
    if (activeTab === 'organic') {
      const latData  = ORGANIC_COUNTRIES[1].data;
      const latPeak  = Math.max(...latData);
      const latPeakIdx = latData.indexOf(latPeak);
      const latPeakPct = ((latPeak / ORGANIC_COUNTRIES[0].data[latPeakIdx]) * 100).toFixed(0);
      const brData   = ORGANIC_COUNTRIES[4].data;
      const brLatest = brData[brData.length - 1];
      const brPrev   = brData[11]; // Jun 2026 is index 11 in the 15-month array
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="LAT Dominates"
            content={`Latin America is the largest organic market, peaking at ${formatNumber(latPeak)} in ${formatMonth(MONTHS[latPeakIdx])} — ~${latPeakPct}% of all international organic traffic at peak.`}
          />
          <InsightCard
            icon={TrendingDown}
            type="warning"
            title="Total Traffic Decline"
            content={`Organic traffic peaked at ${formatNumber(totalPeak)} in ${formatMonth(MONTHS[totalPeakIdx])}, then fell ${Math.abs(Number(peakDropPct))}% to ${formatNumber(totalLatest)} in Sep 2026. LAT and BR are the primary drivers.`}
          />
          <InsightCard
            icon={AlertTriangle}
            type="error"
            title="BR Low Traffic"
            content={`Brazil organic traffic collapsed from ${formatNumber(brPrev)} in Jun 2026 to ${formatNumber(brData[12])} in Jul 2026, then ${formatNumber(brData[13])} in Aug and ${formatNumber(brLatest)} in Sep (${(((brLatest - brData[13]) / brData[13]) * 100).toFixed(1)}% MoM) — still well below prior highs.`}
          />
        </InsightsSection>
      );
    }
    const frData   = DIRECT_COUNTRIES[1].data;
    const frPeak   = Math.max(...frData);
    const twData   = DIRECT_COUNTRIES[5].data;
    const twJun    = twData[11]; // Jun 2026 = index 11 in 15-month array
    return (
      <InsightsSection>
        <InsightCard
          icon={TrendingUp}
          type="success"
          title="Jun 2026 Peak"
          content={`Direct traffic peaked at ${formatNumber(totalPeak)} in Jun 2026. TW surged to ${formatNumber(twJun)} and LAT reached ${formatNumber(DIRECT_COUNTRIES[2].data[11])} — both contributing to the Jun high.`}
        />
        <InsightCard
          icon={TrendingDown}
          type="warning"
          title="Post-Jun Decline"
          content={`Total direct traffic fell sharply from ${formatNumber(totalPeak)} in Jun to ${formatNumber(DIRECT_COUNTRIES[0].data[12])} in Jul, dipping to ${formatNumber(DIRECT_COUNTRIES[0].data[13])} in Aug before rebounding to ${formatNumber(totalLatest)} in Sep 2026 (+${(((totalLatest - DIRECT_COUNTRIES[0].data[13]) / DIRECT_COUNTRIES[0].data[13]) * 100).toFixed(1)}% MoM). TW held at ${formatNumber(DIRECT_COUNTRIES[5].data[14])} in Sep.`}
        />
        <InsightCard
          icon={TrendingUp}
          type="info"
          title="LAT Leads Direct Traffic"
          content={`Latin America is the top direct market, at ${formatNumber(DIRECT_COUNTRIES[2].data[14])} in Sep 2026 (~${((DIRECT_COUNTRIES[2].data[14] / totalLatest) * 100).toFixed(0)}% of direct traffic), followed by BR and FR (peak FR: ${formatNumber(frPeak)}) — indicating strong brand recall and direct navigation.`}
        />
      </InsightsSection>
    );
  };

  return (
    <SlideContainer slideNumber={5} onNavigateHome={onNavigateHome} source="GA">
      <SlideHeader
        title="International Cyberglossary Pages"
        subtitle="Fortinet International Cyberglossary Pages · By Country/Region · Jul 2025 – Sep 2026"
      />

      <div className="flex-1 flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex items-start gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 text-sm font-semibold transition-all duration-200 relative ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 z-10'
                  : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
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

        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          <div className="col-span-8 flex flex-col">
            <ChartContainer title="" height={380}>
              <div className="h-full flex flex-col">
                <div className="pb-3 border-b border-gray-200 mb-3">
                  <CompetitorFilter
                    competitors={countries}
                    visibleCompetitors={visible}
                    onToggle={toggle}
                  />
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                      <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                      <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
                      <YAxis {...CHART_CONFIG.yAxis} tickFormatter={(v) => formatNumber(v)} />
                      <Tooltip content={<CustomTooltip />} />
                      {countries.filter((c) => visible.has(c.id)).map((c) => (
                        <Line
                          key={`${activeTab}-${c.id}`}
                          type="monotone"
                          dataKey={c.id}
                          name={c.name}
                          stroke={c.color}
                          strokeWidth={c.id === 'total' ? 2.5 : 2}
                          strokeDasharray={c.id === 'total' ? '6 3' : undefined}
                          dot={{ fill: c.color, r: c.id === 'total' ? 4 : 3.5, strokeWidth: 2, stroke: '#fff' }}
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
          <div className="col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
            {getInsights()}
          </div>
        </div>
      </div>

      <SlideFooter source={`Source: GA · International Cyberglossary Pages · Jul 2025 – Sep 2026`} />
    </SlideContainer>
  );
}
