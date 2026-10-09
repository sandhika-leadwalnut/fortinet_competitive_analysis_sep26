import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Sparkles, TrendingUp, Award, Zap, Target, TrendingDown, Trophy } from 'lucide-react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  ChartContainer,
  InsightCard,
  InsightsSection,
  EditButton,
  CompetitorFilter,
  CHART_CONFIG,
  TimeRangeFilter,
  TimeRange,
} from './design-system';

// ─── Single source of truth for vendor order, names & colours ────────────────
// Ordered by Feb 2026 visibility rank (highest → lowest) so every legend,
// filter pill and tooltip entry appears in the same sequence across all tabs.
const VENDORS = [
  { id: 'fortinet',     name: 'Fortinet',      color: '#EF4444' }, // 1 – red       (brand)
  { id: 'paloalto',    name: 'Palo Alto',     color: '#F59E0B' }, // 2 – amber
  { id: 'cisco',       name: 'Cisco',         color: '#3B82F6' }, // 3 – blue
  { id: 'crowdstrike', name: 'CrowdStrike',   color: '#F97316' }, // 4 – orange
  { id: 'checkpoint',  name: 'Check Point',   color: '#8B5CF6' }, // 5 – violet
  { id: 'sentinelone', name: 'SentinelOne',   color: '#06B6D4' }, // 6 – cyan
  { id: 'catonetworks',name: 'Cato Networks', color: '#EC4899' }, // 7 – pink
  { id: 'hpe',         name: 'HPE',           color: '#10B981' }, // 8 – emerald
];

const VISIBILITY_DATA_INITIAL = {
  fortinet:    [57.3, 57.8, 57.7, 63.7, 66.2, 64.7, 48.7, 46.3, 46.5, 44.9, 44.3],
  paloalto:    [40.9, 43.5, 43.5, 42.4, 42.2, 46.7, 34.5, 34.6, 43.9, 42.5, 41.0],
  checkpoint:  [14.9, 15.8, 15.9, 14.3, 14.3, 16.4, 12.4, 10.3, 11.2, 10.5, 10.7],
  hpe:         [ 1.6,  1.8,  2.1,  2.2,  1.8,  1.7,  1.8,  1.3,  1.4,  1.7,  1.4],
  cisco:       [31.3, 34.6, 33.9, 32.5, 32.2, 34.8, 30.8, 28.7, 31.6, 30.0, 29.7],
  crowdstrike: [14.5, 16.3, 16.0, 15.4, 15.2, 17.2, 13.5, 14.5, 16.0, 14.9, 15.0],
  catonetworks:[ 6.3,  6.5,  6.9,  7.0,  6.2,  6.6,  8.1,  7.5,  8.9,  8.1,  7.7],
  sentinelone: [10.3, 10.6, 11.3, 11.6, 10.5, 11.5,  6.8,  6.7,  7.3,  7.3,  8.0],
};

const SHARE_OF_VOICE_DATA_INITIAL = {
  fortinet:    [10.8, 10.1, 10.0, 11.2, 14.0, 10.6,  8.8,  9.1,  8.4,  8.6,  8.3],
  paloalto:    [ 7.7,  7.5,  7.5,  7.4,  7.5,  7.6,  6.3,  6.9,  7.9,  8.1,  7.6],
  checkpoint:  [ 2.8,  2.8,  2.8,  2.5,  2.5,  2.6,  2.1,  2.0,  2.0,  2.0,  2.0],
  hpe:         [ 0.3,  0.3,  0.3,  0.4,  0.3,  0.3,  0.3,  0.3,  0.3,  0.3,  0.3],
  cisco:       [ 5.8,  6.0,  5.9,  5.7,  5.7,  5.6,  5.5,  5.6,  5.6,  5.6,  5.4],
  crowdstrike: [ 2.7,  2.8,  2.8,  2.7,  2.7,  2.8,  2.4,  2.8,  2.8,  2.8,  2.7],
  catonetworks:[ 1.2,  1.1,  1.2,  1.2,  1.0,  1.0,  1.4,  1.4,  1.6,  1.5,  1.4],
  sentinelone: [ 1.9,  1.9,  1.9,  2.0,  1.8,  1.8,  1.2,  1.3,  1.3,  1.4,  1.5],
};

const CITATION_DATA_INITIAL = {
  fortinet:    [ 9.2, 12.2, 12.4, 11.4, 11.7, 12.0,  8.2,  8.5,  9.0,  9.1,  8.8],
  paloalto:    [ 2.0,  1.8,  1.8,  1.7,  1.8,  1.9,  3.9,  3.4,  3.5,  3.9,  3.6],
  checkpoint:  [ 1.4,  0.9,  0.9,  0.9,  0.9,  1.0,  1.3,  1.0,  1.2,  1.0,  0.9],
  hpe:         [ 1.1,  0.1,  0.1,  0.2,  0.2,  0.2,  0.1,  0.2,  0.2,  0.2,  0.2],
  cisco:       [ 1.4,  1.1,  1.1,  1.0,  0.9,  1.0,  1.8,  1.6,  2.1,  2.0,  1.9],
  crowdstrike: [ 1.0,  0.4,  0.4,  0.4,  0.4,  0.4,  0.5,  0.4,  0.5,  0.4,  0.4],
  catonetworks:[ 0.2,  0.1,  0.2,  0.2,  0.2,  0.2,  0.5,  0.5,  0.3,  0.4,  0.4],
  sentinelone: [ 2.0,  1.6,  1.5,  1.7,  1.6,  1.5,  1.2,  1.1,  0.9,  0.8,  1.0],
};

const MONTHS = ['Nov-25', 'Dec-25', 'Jan-26', 'Feb-26', 'Mar-26', 'Apr-26', 'May-26', 'Jun-26', 'Jul-26', 'Aug-26', 'Sep-26'];

// Helper function to format month keys for display
const formatMonth = (monthKey: string) => {
  const monthMap: { [key: string]: string } = {
    '2025-11': 'Nov-25',
    '2025-12': 'Dec-25',
    '2026-01': 'Jan-26',
    '2026-02': 'Feb-26',
    '2026-03': 'Mar-26',
    '2026-04': 'Apr-26',
    '2026-05': 'May-26',
    '2026-06': 'Jun-26',
    '2026-07': 'Jul-26',
    '2026-08': 'Aug-26',
    '2026-09': 'Sep-26',
  };
  return monthMap[monthKey] || monthKey;
};

const MONTH_LABELS_LONG = ['Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];

const MONTH_KEYS = ['2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];

type TabType = 'visibility' | 'shareOfVoice' | 'citation';

// Slide 34 has 11 months (Nov 2025 – Sep 2026):
// All → offset 0  (Nov 2025 – Sep 2026)
// 6M  → offset 5  (Apr 2026 – Sep 2026, last 6 months)
// 3M  → offset 8  (Jul 2026 – Sep 2026)
function getProfundOffset(range: TimeRange): number {
  if (range === '3m') return 8;
  if (range === '6m') return 5;
  return 0; // 'all' shows all 11 months
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const validPayload = payload.filter((entry: any) => entry.value !== null && entry.value !== undefined);
  if (!validPayload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {validPayload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs mb-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-700">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

export function SlideProfundMetrics({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('visibility');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(VENDORS.map((v) => v.id))
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    visibility: { ...VISIBILITY_DATA_INITIAL },
    shareOfVoice: { ...SHARE_OF_VOICE_DATA_INITIAL },
    citation: { ...CITATION_DATA_INITIAL },
  });

  const toggleVendor = (id: string) => {
    setVisibleVendors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleValueChange = (metric: string, vendorId: string, monthIdx: number, value: string) => {
    setEditableData((prev) => ({
      ...prev,
      [metric]: {
        ...prev[metric as keyof typeof prev],
        [vendorId]: [
          ...prev[metric as keyof typeof prev][vendorId].slice(0, monthIdx),
          parseFloat(value) || 0,
          ...prev[metric as keyof typeof prev][vendorId].slice(monthIdx + 1),
        ],
      },
    }));
  };

  const tro = getProfundOffset(timeRange);

  const visibilityChartData = MONTH_KEYS.slice(tro).map((monthKey, idx) => {
    const dataPoint: any = { month: monthKey };
    VENDORS.forEach((vendor) => {
      dataPoint[vendor.id] = editableData.visibility[vendor.id][idx + tro];
    });
    return dataPoint;
  });

  const shareOfVoiceChartData = MONTH_KEYS.slice(tro).map((monthKey, idx) => {
    const dataPoint: any = { month: monthKey };
    VENDORS.forEach((vendor) => {
      dataPoint[vendor.id] = editableData.shareOfVoice[vendor.id][idx + tro];
    });
    return dataPoint;
  });

  const citationChartData = MONTH_KEYS.slice(tro).map((monthKey, idx) => {
    const dataPoint: any = { month: monthKey };
    VENDORS.forEach((vendor) => {
      dataPoint[vendor.id] = editableData.citation[vendor.id][idx + tro];
    });
    return dataPoint;
  });

  const tabs = [
    { id: 'visibility' as TabType, label: 'AI Visibility %' },
    { id: 'shareOfVoice' as TabType, label: 'Share of Voice %' },
    { id: 'citation' as TabType, label: 'Citation Rate %' },
  ];

  const getChartData = () => {
    switch (activeTab) {
      case 'visibility': return visibilityChartData;
      case 'shareOfVoice': return shareOfVoiceChartData;
      case 'citation': return citationChartData;
      default: return [];
    }
  };

  const getInsights = () => {
    const last = MONTHS.length - 1;
    const range = `From ${MONTH_LABELS_LONG[tro]} to ${MONTH_LABELS_LONG[last]}`;
    const src: Record<string, Record<string, number[]>> = {
      visibility: editableData.visibility,
      shareOfVoice: editableData.shareOfVoice,
      citation: editableData.citation,
    };
    const data = src[activeTab];
    if (!data) return null;
    const delta = (id: string) => {
      const from = data[id][tro];
      const to = data[id][last];
      return { from, to, d: to - from };
    };
    const pp = (d: number) => `${d >= 0 ? '+' : '−'}${Math.abs(d).toFixed(1)}pp`;
    const pair = (id: string) => {
      const c = delta(id);
      return `${c.from.toFixed(1)}% → ${c.to.toFixed(1)}% (${pp(c.d)})`;
    };
    const mv = (d: number, up: string, down: string, flat = 'held') =>
      Math.abs(d) < 0.05 ? flat : d > 0 ? up : down;
    const ft = delta('fortinet');
    const pa = delta('paloalto');
    const ci = delta('cisco');
    const cs = delta('crowdstrike');
    const ftIcon = ft.d >= 0 ? TrendingUp : TrendingDown;
    const ftType = ft.d >= 0 ? 'success' : 'error';
    const rankings = VENDORS.map((v) => ({ id: v.id, value: data[v.id][last] })).sort((x, y) => y.value - x.value);
    const ftLeads = rankings[0].id === 'fortinet';
    const gapPa = data.fortinet[last] - data.paloalto[last];

    switch (activeTab) {
      case 'visibility':
        return (
          <InsightsSection>
            <InsightCard
              icon={ftIcon}
              type={ftType}
              title="Fortinet"
              content={`${range}, visibility ${mv(ft.d, 'rose', 'fell')} ${pair('fortinet')}, Palo Alto ${mv(pa.d, 'rose', 'dipped', 'held steady')} ${pair('paloalto')}.`}
            />
            <InsightCard
              icon={ci.d >= 0 && cs.d >= 0 ? TrendingUp : TrendingDown}
              type={ci.d >= 0 && cs.d >= 0 ? 'success' : 'error'}
              title="Competitions"
              content={`${range}, Cisco ${mv(ci.d, 'rose', 'fell')} ${pair('cisco')}, CrowdStrike ${mv(cs.d, 'rose', 'fell')} ${pair('crowdstrike')}.`}
            />
          </InsightsSection>
        );
      case 'shareOfVoice':
        return (
          <InsightsSection>
            <InsightCard
              icon={ftIcon}
              type={ftType}
              title="Fortinet"
              content={`${range}, share of voice ${mv(ft.d, 'rose', 'fell')} ${pair('fortinet')}, ${ftLeads ? `Palo Alto ${gapPa.toFixed(1)}pp behind` : 'Palo Alto now ahead'}.`}
            />
            <InsightCard
              icon={pa.d >= 0 && ci.d >= 0 ? TrendingUp : TrendingDown}
              type={pa.d >= 0 && ci.d >= 0 ? 'success' : 'error'}
              title="Competitions"
              content={`${range}, Palo Alto ${mv(pa.d, 'rose', 'fell')} ${pair('paloalto')}, Cisco ${mv(ci.d, 'rose', 'fell')} ${pair('cisco')}.`}
            />
          </InsightsSection>
        );
      case 'citation':
        return (
          <InsightsSection>
            <InsightCard
              icon={ftIcon}
              type={ftType}
              title="Fortinet"
              content={`${range}, citations ${mv(ft.d, 'rose', 'fell')} ${pair('fortinet')}${ftLeads ? ', still leads all competitors' : ''}.`}
            />
            <InsightCard
              icon={pa.d >= 0 && ci.d >= 0 ? TrendingUp : TrendingDown}
              type={pa.d >= 0 && ci.d >= 0 ? 'success' : 'error'}
              title="Competitions"
              content={`${range}, Palo Alto ${mv(pa.d, 'rose', 'fell')} ${pair('paloalto')}, Cisco ${mv(ci.d, 'rose', 'fell')} ${pair('cisco')}.`}
            />
          </InsightsSection>
        );
      default:
        return null;
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 10; // Sep 2026
    let dataSource: Record<string, number[]>;
    let formatValue: (val: number) => string;

    switch (activeTab) {
      case 'visibility':
        dataSource = editableData.visibility;
        formatValue = (val) => `${val.toFixed(1)}%`;
        break;
      case 'shareOfVoice':
        dataSource = editableData.shareOfVoice;
        formatValue = (val) => `${val.toFixed(1)}%`;
        break;
      case 'citation':
        dataSource = editableData.citation;
        formatValue = (val) => `${val.toFixed(1)}%`;
        break;
      default:
        return null;
    }

    const rankings = VENDORS.map((v) => ({
      id: v.id,
      name: v.name,
      value: dataSource[v.id]?.[latestIndex] ?? 0,
    })).sort((a, b) => b.value - a.value);

    const fortinetRanking = rankings.find((r) => r.id === 'fortinet');
    if (!fortinetRanking) return null;

    const fortinetPosition = rankings.findIndex((r) => r.id === 'fortinet') + 1;
    const isLeader = fortinetPosition === 1;
    const secondPlace = rankings[1];
    const firstPlace = rankings[0];
    const ordinal = (n: number) => n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`;

    if (isLeader) {
      const gap = fortinetRanking.value - secondPlace.value;
      const gapPercent = ((gap / fortinetRanking.value) * 100).toFixed(1);
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-green-900">Top Performer - <span className="font-bold">Fortinet</span></span>
              <span className="text-sm text-green-900 font-semibold">{formatValue(fortinetRanking.value)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-800">2nd position - {secondPlace.name}</span>
              <span className="text-sm text-green-800 font-semibold">{formatValue(secondPlace.value)}</span>
            </div>
            <div>
              <span className="text-sm text-green-900"><span className="font-semibold">Lead:</span> +{formatValue(gap)} ({gapPercent}% ahead)</span>
            </div>
          </div>
        </div>
      );
    } else {
      const gap = firstPlace.value - fortinetRanking.value;
      const gapPercent = ((gap / firstPlace.value) * 100).toFixed(1);
      return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-300 rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-orange-900">Top Performer - <span className="font-bold">{firstPlace.name}</span></span>
              <span className="text-sm text-orange-900 font-semibold">{formatValue(firstPlace.value)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-orange-800">{ordinal(fortinetPosition)} position - Fortinet</span>
              <span className="text-sm text-orange-800 font-semibold">{formatValue(fortinetRanking.value)}</span>
            </div>
            <div>
              <span className="text-sm text-orange-900"><span className="font-semibold">Gap to #1:</span> {formatValue(gap)} ({gapPercent}% behind)</span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <SlideContainer slideNumber={15} onNavigateHome={onNavigateHome} source="Profound">
      <SlideHeader
        title="LLM Metrics"
        subtitle="(Nov 2025 – Sep 2026)"
      />

      {!isEditing ? (
        <div className="flex-1 flex flex-col gap-6">
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
                    ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Time Range Filter */}
          <TimeRangeFilter value={timeRange} onChange={setTimeRange} />

          {/* Content Area */}
          <div className="flex-1 grid grid-cols-12 gap-6">
            {/* Chart Section - 8 columns */}
            <div className="col-span-8 flex flex-col gap-4">
              <ChartContainer
                title=""
                height={420}
              >
                <div className="h-full flex flex-col">
                  <div className="pb-4 border-b border-gray-200 mb-4">
                    <CompetitorFilter
                      competitors={VENDORS}
                      visibleCompetitors={visibleVendors}
                      onToggle={toggleVendor}
                    />
                  </div>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        id={`profund-linechart-${activeTab}-${timeRange}`}
                        data={getChartData()} 
                        margin={CHART_CONFIG.margin}
                      >
                        <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                        <XAxis 
                          id={`profund-xaxis-${activeTab}`}
                          dataKey="month" 
                          {...CHART_CONFIG.xAxis} 
                          tickFormatter={formatMonth} 
                        />
                        <YAxis 
                          id={`profund-yaxis-${activeTab}`}
                          {...CHART_CONFIG.yAxis} 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {VENDORS.filter(v => visibleVendors.has(v.id)).map((vendor) => (
                          <Line
                            key={vendor.id}
                            name={vendor.name}
                            type="monotone"
                            dataKey={vendor.id}
                            stroke={vendor.color}
                            {...CHART_CONFIG.line}
                            dot={{ fill: vendor.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 2 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </ChartContainer>
            </div>

            {/* Insights Section - 4 columns */}
            <div className="col-span-4 flex flex-col gap-4">
              {getInsights()}
              {getPerformanceSummary()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit AI Overview Metrics Data</h3>
            <div className="space-y-6">
              {VENDORS.map((vendor) => (
                <div key={vendor.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }} />
                    <h4 className="text-sm font-bold text-gray-900">{vendor.name}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Visibility %:</div>
                      {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editableData.visibility[vendor.id][idx]}
                            onChange={(e) => handleValueChange('visibility', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Share of Voice %:</div>
                      {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editableData.shareOfVoice[vendor.id][idx]}
                            onChange={(e) => handleValueChange('shareOfVoice', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Citation %:</div>
                      {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editableData.citation[vendor.id][idx]}
                            onChange={(e) => handleValueChange('citation', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SlideFooter source="Source: Profound" />
    </SlideContainer>
  );
}