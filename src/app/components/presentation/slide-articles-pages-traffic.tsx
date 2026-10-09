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
  '2025-12', '2026-01', '2026-02', '2026-03',
  '2026-04', '2026-05', '2026-06', '2026-07', '2026-08',
  '2026-09',
];

const formatMonth = (key: string) => {
  const map: Record<string, string> = {
    '2025-12': 'Dec-25', '2026-01': 'Jan-26', '2026-02': 'Feb-26',
    '2026-03': 'Mar-26', '2026-04': 'Apr-26', '2026-05': 'May-26',
    '2026-06': 'Jun-26', '2026-07': 'Jul-26', '2026-08': 'Aug-26',
    '2026-09': 'Sep-26',
  };
  return map[key] ?? key;
};

const GA_DATA = {
  total:      [1035, 1199, 1355, 1321, 1211, 1047, 1049, 779, 735, 710],
  branded:    [  16,    6,   21,   17,   29,   17,   69,  18,  25,  24],
  nonBranded: [1019, 1193, 1334, 1304, 1182, 1030,  980, 761, 710, 686],
};

const GSC_DATA = {
  total:      [315, 370, 446, 463, 457, 809, 488, 443, 417, 417],
  branded:    [  5,   2,   7,   6,  11,  13,  32,  10,  14,  14],
  nonBranded: [310, 368, 439, 457, 446, 796, 456, 433, 403, 403],
};

type TabType = 'ga' | 'gsc';

const LINES = [
  { key: 'total',      name: 'Total Traffic',       color: '#EF4444', width: 2.5 },
  { key: 'nonBranded', name: 'Non-Branded Traffic',  color: '#3B82F6', width: 2 },
  { key: 'branded',    name: 'Branded Traffic',       color: '#10B981', width: 2 },
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

export function SlideArticlesPagesTraffic({ onNavigateHome }: { onNavigateHome?: () => void }) {
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

  const totalLatest    = source.total[source.total.length - 1];
  const totalPeak      = Math.max(...source.total);
  const totalPeakIdx   = source.total.indexOf(totalPeak);
  const totalFirst     = source.total[0];
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
            content={`Total GA articles traffic peaked at ${formatNumber(totalPeak)} in ${formatMonth(MONTHS[totalPeakIdx])}. Non-branded drove 98.5% of peak traffic — articles are almost purely organic-discovery pages.`}
          />
          <InsightCard
            icon={TrendingDown}
            type="warning"
            title="Significant Decline"
            content={`Total traffic fell ${Math.abs(Number(peakDropPct))}% from peak to ${formatNumber(totalLatest)} in Sep 2026. Non-branded dropped from 1,334 → ${formatNumber(nbLatest)} — continued decline worth monitoring.`}
          />
          <InsightCard
            icon={AlertTriangle}
            type="error"
            title="Low Absolute Volume"
            content={`Articles pages generate only ${formatNumber(totalLatest)} GA sessions in Sep 2026 — very low volume compared to product and cyberglossary pages, suggesting limited content depth.`}
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
          content={`Total GSC clicks peaked at ${formatNumber(totalPeak)} in ${formatMonth(MONTHS[totalPeakIdx])}. The May 2026 spike (809) suggests a short-term keyword surge or content publish event.`}
        />
        <InsightCard
          icon={TrendingDown}
          type="warning"
          title="Post-Spike Drop"
          content={`After the May peak of 809 clicks, traffic dropped to ${formatNumber(totalLatest)} in Sep 2026 (${peakDropPct}%), indicating the May spike was not sustained by permanent ranking gains.`}
        />
        <InsightCard
          icon={AlertTriangle}
          type="error"
          title="Minimal Branded Presence"
          content={`Branded GSC clicks are near-zero (${formatNumber(brandedLatest)} in Sep 2026), confirming articles pages are not driving any brand-search traffic — purely informational/SEO reach.`}
        />
      </InsightsSection>
    );
  };

  return (
    <SlideContainer slideNumber={7} onNavigateHome={onNavigateHome} source="GA & GSC">
      <SlideHeader
        title="Articles Pages"
        subtitle="Fortinet Articles Pages · Branded, Non-Branded & Total · Dec 2025 – Sep 2026"
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

      <SlideFooter source={`Source: ${activeTab === 'ga' ? 'GA' : 'GSC'} · Articles Pages · Dec 2025 – Sep 2026`} />
    </SlideContainer>
  );
}
