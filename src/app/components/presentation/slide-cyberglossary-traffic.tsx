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

// ─── Month keys ───────────────────────────────────────────────────────────────

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const GA_DATA = {
  total:      [164526, 172102, 195488, 185335, 156307, 110689, 117434, 128151, 130379, 120458, 104128,  99306, 91685, 86677, 87115],
  nonBranded: [159186, 167633, 190543, 180544, 152265, 107828, 114206, 125025, 127342, 117512, 101688,  96487, 89964, 85262, 85726],
  branded:    [  5340,   4469,   4945,   4791,   4042,   2861,   3228,   3126,   3037,   2946,   2440,   2819,  1721,  1415,  1389],
};

const GSC_DATA = {
  total:      [143557, 164300, 188054, 182500, 159468, 132551, 146481, 152111, 165841, 150038, 142898, 139119, 138854, 142151, 135173],
  nonBranded: [138898, 160034, 183297, 177782, 155344, 129125, 142455, 148400, 161978, 146369, 139549, 135170, 136247, 139831, 133018],
  branded:    [  4659,   4266,   4757,   4718,   4124,   3426,   4026,   3711,   3863,   3669,   3349,   3949,   2607,   2320,   2155],
};

const DIRECT_DATA: { total: number[]; nonBranded: (number | null)[]; branded: (number | null)[] } = {
  //                  Jul-25  Aug-25  Sep-25  Oct-25  Nov-25  Dec-25  Jan-26  Feb-26  Mar-26  Apr-26  May-26  Jun-26  Jul-26  Aug-26  Sep-26
  // Sep-26: CSV provides total direct only (no branded / non-branded split) -> null
  total:      [24127, 22001, 24162, 24068, 30296, 25549, 23200, 23628, 29736, 30175, 32203, 32371, 19900, 17260, 18470],
  nonBranded: [23500, 21429, 23534, 23442, 29508, 24428, 22562, 23052, 29043, 29437, 31448, 31452, 19526, 16935,  null],
  branded:    [  627,   572,   628,   626,   788,   652,   638,   576,   693,   738,   755,   919,   374,   325,  null],
};

const BING_DATA = {
  //                  Jul-25  Aug-25  Sep-25  Oct-25  Nov-25  Dec-25  Jan-26  Feb-26  Mar-26  Apr-26  May-26  Jun-26  Jul-26  Aug-26  Sep-26
  total:      [10372, 10805,  8102,  8791,  7318,  5128,  5545,  5303,  5764,  5894,  5302,  3441,  2529,  3095,  4772],
  branded:    [ 8565,  8792,  6649,  7157,  6024,  4332,  4526,  4495,  4658,  4713,  4157,  2506,  1909,  2477,  3722],
  nonBranded: [ 1807,  2013,  1453,  1634,  1294,   796,  1019,   808,  1106,  1181,  1145,   935,   620,   618,  1050],
};

const DIRECT_GL_DATA = [
  { url: 'https://www.fortinet.com/resources/cyberglossary/proxy-server', keyword: 'What is Proxy Server', jun: 1044, jul: 1320, change: 276, pct: 26.44 },
  { url: 'https://www.fortinet.com/resources/cyberglossary/cloud-security-tools', keyword: 'cloud security tools', jun: 4, jul: 101, change: 97, pct: 2425.00 },
  { url: 'https://www.fortinet.com/resources/cyberglossary/firewall', keyword: 'firewall', jun: 229, jul: 301, change: 72, pct: 31.44 },
  { url: 'https://www.fortinet.com/resources/cyberglossary/computer-virus', keyword: 'computer viruses', jun: 105, jul: 173, change: 68, pct: 64.76 },
  { url: 'https://www.fortinet.com/resources/cyberglossary', keyword: 'Cyber Glossary', jun: 370, jul: 434, change: 64, pct: 17.30 },
  { url: 'https://www.fortinet.com/resources/cyberglossary/cyber-safety', keyword: 'cyber safety', jun: 55, jul: 111, change: 56, pct: 101.82 },
  { url: 'https://www.fortinet.com/resources/cyberglossary/what-is-dmz', keyword: 'DMZ', jun: 59, jul: 111, change: 52, pct: 88.14 },
  { url: 'https://www.fortinet.com/resources/cyberglossary/data-breach', keyword: 'What is a data breach', jun: 72, jul: 110, change: 38, pct: 52.78 },
  { url: 'https://www.fortinet.com/resources/cyberglossary/what-is-cryptography', keyword: 'cryptography', jun: 47, jul: 83, change: 36, pct: 76.60 },
  { url: 'https://www.fortinet.com/resources/cyberglossary/what-is-arp', keyword: 'arp', jun: 63, jul: 99, change: 36, pct: 57.14 },
];

type TabType = 'ga' | 'gsc' | 'bing' | 'direct' | 'direct-gl';

const LINES = [
  { key: 'total',      name: 'Total Traffic',        color: '#EF4444', width: 2.5 },
  { key: 'nonBranded', name: 'Non-Branded Traffic',  color: '#3B82F6', width: 2 },
  { key: 'branded',    name: 'Branded Traffic',       color: '#10B981', width: 2 },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export function SlideCyberglossaryTraffic({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('ga');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);
  const source = activeTab === 'ga' ? GA_DATA : activeTab === 'gsc' ? GSC_DATA : activeTab === 'bing' ? BING_DATA : DIRECT_DATA;

  const chartData = MONTHS.slice(tro).map((month, i) => ({
    month,
    total:      source.total[i + tro],
    nonBranded: source.nonBranded[i + tro],
    branded:    source.branded[i + tro],
  }));

  // Key numbers for insights
  const totalLatest  = source.total[source.total.length - 1];
  const totalPeak    = Math.max(...source.total);
  const totalPeakIdx = source.total.indexOf(totalPeak);
  const totalFirst   = source.total[0];
  const totalChangePct = (((totalLatest - totalFirst) / totalFirst) * 100).toFixed(1);
  const peakDropPct    = (((totalLatest - totalPeak) / totalPeak) * 100).toFixed(1);

  const brandedLatest = source.branded[source.branded.length - 1] as number;
  const nbLatest      = source.nonBranded[source.nonBranded.length - 1] as number;

  const tabs = [
    { id: 'ga'        as TabType, label: 'Organic traffic'              },
    { id: 'direct'    as TabType, label: 'Direct traffic'               },
    { id: 'direct-gl' as TabType, label: 'Direct traffic – Gain & Loss' },
    { id: 'gsc'       as TabType, label: 'Click – GSC'                  },
    { id: 'bing'      as TabType, label: 'Click – Bing'                 },
  ];

  const getInsights = () => {
    if (activeTab === 'ga') {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Traffic Peak"
            content={`Total GA traffic peaked at ${formatNumber(totalPeak)} in ${formatMonth(MONTHS[totalPeakIdx])}. Non-branded drove ${((GA_DATA.nonBranded[totalPeakIdx]/totalPeak)*100).toFixed(1)}% of peak traffic (${formatNumber(GA_DATA.nonBranded[totalPeakIdx])}).`}
          />
          <InsightCard
            icon={TrendingDown}
            type="warning"
            title="Post-Peak Decline"
            content={`Total traffic dropped ${Math.abs(Number(peakDropPct))}% from the ${formatMonth(MONTHS[totalPeakIdx])} peak to ${formatNumber(totalLatest)} in Sep 2026. Non-branded fell from ${formatNumber(GA_DATA.nonBranded[totalPeakIdx])} → ${formatNumber(nbLatest)} (${(((nbLatest - GA_DATA.nonBranded[totalPeakIdx]) / GA_DATA.nonBranded[totalPeakIdx]) * 100).toFixed(1)}%).`}
          />
          <InsightCard
            icon={AlertTriangle}
            type="error"
            title="Branded Drop"
            content={`Branded GA traffic hit a low of ${formatNumber(brandedLatest)} in Sep 2026 — down ${Math.abs(((brandedLatest - Math.max(...GA_DATA.branded)) / Math.max(...GA_DATA.branded)) * 100).toFixed(0)}% from the Jul 2025 peak of ${formatNumber(Math.max(...GA_DATA.branded))}.`}
          />
        </InsightsSection>
      );
    }
    if (activeTab === 'gsc') {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="GSC Peak"
            content={`Total GSC clicks peaked at ${formatNumber(totalPeak)} in ${formatMonth(MONTHS[totalPeakIdx])}. GSC has reported more traffic than GA every month since Nov 2025 (counting-method differences).`}
          />
          <InsightCard
            icon={TrendingDown}
            type="warning"
            title="Post-Peak Decline"
            content={`Total GSC clicks fell ${Math.abs(Number(peakDropPct))}% from the ${formatMonth(MONTHS[totalPeakIdx])} peak (${formatNumber(totalPeak)}) to Sep 2026 (${formatNumber(totalLatest)}). Non-branded slipped to ${formatNumber(nbLatest)} in Sep from ${formatNumber(GSC_DATA.nonBranded[GSC_DATA.nonBranded.length - 2])} in Aug.`}
          />
          <InsightCard
            icon={TrendingDown}
            type="info"
            title="Sep Pullback Signal"
            content={`Total GSC clicks eased to ${formatNumber(totalLatest)} in Sep 2026, down from ${formatNumber(GSC_DATA.total[GSC_DATA.total.length - 2])} in Aug (${(((totalLatest - GSC_DATA.total[GSC_DATA.total.length - 2]) / GSC_DATA.total[GSC_DATA.total.length - 2]) * 100).toFixed(1)}%). Non-branded drove the pullback at ${formatNumber(nbLatest)}.`}
          />
        </InsightsSection>
      );
    }
    if (activeTab === 'bing') {
      const bingPeakBranded    = Math.max(...BING_DATA.branded);
      const bingPeakBrandedIdx = BING_DATA.branded.indexOf(bingPeakBranded);
      const bingBrandedLatest  = BING_DATA.branded[BING_DATA.branded.length - 1];
      const bingNbLatest       = BING_DATA.nonBranded[BING_DATA.nonBranded.length - 1];
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Bing Clicks Below Peak"
            content={`Total Bing CG clicks fell from ${formatNumber(totalPeak)} (${formatMonth(MONTHS[totalPeakIdx])}) to a low of ${formatNumber(Math.min(...BING_DATA.total))} in Jul 2026, then ${formatNumber(totalLatest)} in Sep 2026 — still ${Math.abs(Number(peakDropPct))}% below peak, despite a Sep rebound.`}
          />
          <InsightCard
            icon={TrendingDown}
            type="warning"
            title="Branded Dominates but Shrinking"
            content={`Branded clicks peaked at ${formatNumber(bingPeakBranded)} in ${formatMonth(MONTHS[bingPeakBrandedIdx])} and fell to ${formatNumber(bingBrandedLatest)} by Sep 2026 (−${(((bingPeakBranded - bingBrandedLatest) / bingPeakBranded) * 100).toFixed(0)}%). Branded traffic makes up ~${((bingBrandedLatest / totalLatest) * 100).toFixed(0)}% of Bing clicks.`}
          />
          <InsightCard
            icon={AlertTriangle}
            type="info"
            title="Non-Branded Small Share"
            content={`Non-branded Bing clicks at ${formatNumber(bingNbLatest)} in Sep 2026 — only ~${((bingNbLatest / totalLatest) * 100).toFixed(0)}% of total Bing traffic. Fortinet has limited Bing organic discovery presence.`}
          />
        </InsightsSection>
      );
    }
    return (
      <InsightsSection>
        <InsightCard
          icon={TrendingUp}
          type="success"
          title="Direct Traffic Peak"
          content={`Total direct traffic peaked at ${formatNumber(32371)} in Jun 2026. Non-branded direct sessions drove the bulk of visits at ${formatNumber(31452)} in Jun — indicating strong brand recall without search intent.`}
        />
        <InsightCard
          icon={TrendingUp}
          type="info"
          title="Partial Rebound"
          content={`Direct traffic ticked up to ${formatNumber(18470)} in Sep 2026, from ${formatNumber(17260)} in Aug (+${(((18470 - 17260) / 17260) * 100).toFixed(1)}%) — still ${Math.abs(((18470 - 32371) / 32371) * 100).toFixed(0)}% below the Jun peak of ${formatNumber(32371)}.`}
        />
        <InsightCard
          icon={TrendingDown}
          type="warning"
          title="Branded Share Slipping"
          content={`Branded direct traffic averaged ~2.5% of total direct visits (Jan–Jun 2026), peaking at ${formatNumber(919)} in Jun, then fell to ${formatNumber(374)} in Jul and ${formatNumber(325)} in Aug (~1.9%). Sep split not available.`}
        />
      </InsightsSection>
    );
  };

  return (
    <SlideContainer slideNumber={4} onNavigateHome={onNavigateHome} source="GA & GSC">
      <SlideHeader
        title="Cyberglossary Pages"
        subtitle="Fortinet Cyberglossary · Branded, Non-Branded & Total · Jul 2025 – Sep 2026"
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

        {/* Time Range Filter — hidden on gain/loss tab */}
        {activeTab !== 'direct-gl' && (
          <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
        )}

        {/* Main content */}
        {activeTab === 'direct-gl' ? (
          /* ── Gain & Loss Table ── */
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-gray-900">Performance Tracker · Direct Traffic</span>
                  <span className="ml-3 text-xs text-gray-500">Aug 2026 → Sep 2026</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  Top 10 Gains
                </span>
              </div>
              {/* Table */}
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600 w-[36%]">URL</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600 w-[24%]">Target Keyword</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Aug 2026</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Sep 2026</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Change</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600 pr-5">Change %</th>
                  </tr>
                </thead>
                <tbody>
                  {DIRECT_GL_DATA.map((row, i) => {
                    const slug = row.url.split('/cyberglossary/')[1] ?? '';
                    const isLoss = row.change < 0;
                    return (
                      <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-emerald-50/30 transition-colors`}>
                        <td className="px-4 py-2.5">
                          <a href={row.url} target="_blank" rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-mono text-[11px]">
                            /cyberglossary{slug ? `/${slug}` : ''}
                          </a>
                        </td>
                        <td className="px-4 py-2.5 text-gray-700 font-medium">{row.keyword}</td>
                        <td className="px-4 py-2.5 text-right text-gray-800 font-semibold">{row.jun.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right text-gray-800 font-semibold">{row.jul.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`font-bold ${isLoss ? 'text-red-600' : 'text-emerald-600'}`}>
                            {isLoss ? '' : '+'}{row.change.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right pr-5">
                          <span className={`inline-flex items-center justify-end gap-1 font-bold ${isLoss ? 'text-red-600' : 'text-emerald-600'}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isLoss ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            {isLoss ? '' : '+'}{row.pct.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 border-t-2 border-gray-300">
                    <td colSpan={2} className="px-4 py-2.5 font-bold text-gray-800 text-xs">Total (Top 10)</td>
                    <td className="px-4 py-2.5 text-right font-bold text-gray-800">
                      {DIRECT_GL_DATA.reduce((s, r) => s + r.jun, 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-gray-800">
                      {DIRECT_GL_DATA.reduce((s, r) => s + r.jul, 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-emerald-600">
                      +{DIRECT_GL_DATA.reduce((s, r) => s + r.change, 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right pr-5 font-bold text-emerald-600">
                      +{((DIRECT_GL_DATA.reduce((s,r)=>s+r.jul,0) - DIRECT_GL_DATA.reduce((s,r)=>s+r.jun,0)) / DIRECT_GL_DATA.reduce((s,r)=>s+r.jun,0) * 100).toFixed(2)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          /* ── Chart + Insights grid ── */
          <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            {/* Chart — 8 cols */}
            <div className="col-span-8 flex flex-col">
              <ChartContainer title="" height={380}>
                <div className="h-full flex flex-col">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                        <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                        <XAxis
                          dataKey="month"
                          {...CHART_CONFIG.xAxis}
                          tickFormatter={formatMonth}
                        />
                        <YAxis
                          {...CHART_CONFIG.yAxis}
                          tickFormatter={(v) => formatNumber(v)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        />
                        {LINES.filter((l) => (activeTab !== 'direct') || l.key === 'total').map((l) => (
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
            {/* Insights — 4 cols */}
            <div className="col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
              {getInsights()}
            </div>
          </div>
        )}
      </div>

      <SlideFooter source={`Source: ${activeTab === 'gsc' ? 'GSC' : activeTab === 'bing' ? 'Bing Webmaster Tools' : 'GA'} · Cyberglossary · ${activeTab === 'direct-gl' ? 'Aug–Sep 2026' : 'Jul 2025 – Sep 2026'}`} />
    </SlideContainer>
  );
}
