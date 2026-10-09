import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  CHART_CONFIG,
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';

const MONTHS = [
  '2025-07', '2025-08', '2025-09', '2025-10', '2025-11',
  '2025-12', '2026-01', '2026-02', '2026-03',
  '2026-04', '2026-05', '2026-06', '2026-07', '2026-08',
  '2026-09',
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

const GA_DATA = {
  total:      [408039, 342460, 410885, 408338, 349104, 246024, 256421, 257635, 270038, 247690, 236793, 251193, 247495, 228826, 225367],
  branded:    [379197, 316636, 383428, 382866, 328508, 231319, 240760, 240942, 252554, 230795, 221612, 236394, 233675, 217513, 213927],
  nonBranded: [ 28842,  25824,  27457,  25596,  20596,  14705,  15661,  16693,  17484,  16895,  15181,  14799,  13820,  11313,  11440],
};

const GSC_DATA = {
  total:      [62419, 55924, 61760, 59762, 56156, 42930, 46270, 46903, 49578, 44539, 41180, 40447, 36801, 45410, 40068],
  branded:    [58007, 51707, 57633, 56034, 52843, 40364, 43444, 43864, 46368, 41501, 38540, 38064, 34746, 43165, 38034],
  nonBranded: [ 4412,  4217,  4127,  3728,  3313,  2566,  2826,  3039,  3210,  3038,  2640,  2383,  2055,  2245,  2034],
};

type TabType = 'ga' | 'gsc';

const LINES = [
  { key: 'total',      name: 'Total Traffic',       color: '#EF4444', width: 2.5 },
  { key: 'branded',    name: 'Branded Traffic',      color: '#3B82F6', width: 2 },
  { key: 'nonBranded', name: 'Non-Branded Traffic',  color: '#10B981', width: 2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {payload.map((entry: any, i: number) => (
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

export function SlideProductPagesTraffic({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('ga');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);
  const source = activeTab === 'ga' ? GA_DATA : GSC_DATA;

  const chartData = MONTHS.slice(tro).map((month, i) => ({
    month,
    total:      source.total[i + tro],
    branded:    source.branded[i + tro],
    nonBranded: source.nonBranded[i + tro],
  }));

  const totalLatest   = source.total[source.total.length - 1];
  const totalPeak     = Math.max(...source.total);
  const totalPeakIdx  = source.total.indexOf(totalPeak);
  const totalFirst    = source.total[0];
  const totalChangePct = (((totalLatest - totalFirst) / totalFirst) * 100).toFixed(1);
  const peakDropPct    = (((totalLatest - totalPeak) / totalPeak) * 100).toFixed(1);
  const brandedLatest  = source.branded[source.branded.length - 1];
  const nbLatest       = source.nonBranded[source.nonBranded.length - 1];

  const tabs = [
    { id: 'ga'  as TabType, label: 'Traffic – GA'  },
    { id: 'gsc' as TabType, label: 'Click – GSC' },
  ];

  const getInsights = () => {
    if (activeTab === 'ga') {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Traffic Peak"
            content={`Total GA product traffic peaked at ${formatNumber(totalPeak)} in ${formatMonth(MONTHS[totalPeakIdx])}. Branded traffic dominates at ~${((source.branded[totalPeakIdx] / totalPeak) * 100).toFixed(0)}% of total product page visits at peak (~${((brandedLatest / totalLatest) * 100).toFixed(0)}% in Sep 2026).`}
          />
          <InsightCard
            icon={TrendingDown}
            type="warning"
            title="Post-Peak Decline"
            content={`Total traffic fell ${Math.abs(Number(peakDropPct))}% from the ${formatMonth(MONTHS[totalPeakIdx])} peak to ${formatNumber(totalLatest)} in Sep 2026. Branded dropped from ${formatNumber(source.branded[totalPeakIdx])} → ${formatNumber(brandedLatest)} (${(((brandedLatest - source.branded[totalPeakIdx]) / source.branded[totalPeakIdx]) * 100).toFixed(1)}%).`}
          />
          <InsightCard
            icon={AlertTriangle}
            type="error"
            title="Non-Branded Gap"
            content={`Non-branded product traffic at ${formatNumber(nbLatest)} in Sep 2026 represents only ~${((nbLatest / totalLatest) * 100).toFixed(1)}% of total — highlighting a significant gap in organic discovery for product pages.`}
          />
        </InsightsSection>
      );
    }
    return (
      <InsightsSection>
        <InsightCard
          icon={TrendingUp}
          type="success"
          title="GSC Peak"
          content={`Total GSC clicks peaked at ${formatNumber(totalPeak)} in ${formatMonth(MONTHS[totalPeakIdx])}. Branded clicks drove ~${((source.branded[totalPeakIdx]/totalPeak)*100).toFixed(0)}% of the peak, confirming strong brand-driven product page demand.`}
        />
        <InsightCard
          icon={TrendingDown}
          type="warning"
          title="Declining Trend"
          content={`Total GSC clicks eased to ${formatNumber(totalLatest)} in Sep 2026 after the Aug rebound to ${formatNumber(GSC_DATA.total[13])} (${(((totalLatest - GSC_DATA.total[13]) / GSC_DATA.total[13]) * 100).toFixed(1)}%). Branded clicks retreated from ${formatNumber(GSC_DATA.branded[13])} → ${formatNumber(brandedLatest)}.`}
        />
        <InsightCard
          icon={TrendingDown}
          type="error"
          title="Non-Branded Drop"
          content={`Non-branded GSC clicks at ${formatNumber(nbLatest)} in Sep 2026 — down ${Math.abs(((nbLatest - Math.max(...GSC_DATA.nonBranded)) / Math.max(...GSC_DATA.nonBranded)) * 100).toFixed(0)}% from the ${formatMonth(MONTHS[GSC_DATA.nonBranded.indexOf(Math.max(...GSC_DATA.nonBranded))])} peak of ${formatNumber(Math.max(...GSC_DATA.nonBranded))}.`}
        />
      </InsightsSection>
    );
  };

  return (
    <SlideContainer slideNumber={6} onNavigateHome={onNavigateHome} source="GA & GSC">
      <SlideHeader
        title="Product Pages"
        subtitle="Fortinet Product Pages · Branded, Non-Branded & Total · Jul 2025 – Sep 2026"
      />

      <div className="flex-1 flex flex-col gap-4">
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
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                      <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                      <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
                      <YAxis {...CHART_CONFIG.yAxis} tickFormatter={(v) => formatNumber(v)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      {LINES.map((l) => (
                        <Line
                          key={l.key}
                          type="monotone"
                          dataKey={l.key}
                          name={l.name}
                          stroke={l.color}
                          strokeWidth={l.width}
                          dot={{ fill: l.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
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

      <SlideFooter source={`Source: ${activeTab === 'ga' ? 'GA' : 'GSC'} · Product Pages · Jul 2025 – Sep 2026`} />
    </SlideContainer>
  );
}
