import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Shield, TrendingUp, TrendingDown, Zap, Sparkles, Bot, Trophy, Target } from 'lucide-react';
import { formatChartAxisNumber } from '@/app/utils/format';
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
  getTimeRangeOffset,
} from './design-system';

// Vendors with design system colors
const VENDORS = [
  { id: 'fortinet',     name: 'Fortinet',      color: '#EF4444' },
  { id: 'cisco',        name: 'Cisco',         color: '#FF7AB6' },
  { id: 'hpe',          name: 'HPE',           color: '#7ED957' },
  { id: 'paloalto',     name: 'Palo Alto',     color: '#FFB14A' },
  { id: 'checkpoint',   name: 'Check Point',   color: '#6C9AFF' },
  { id: 'crowdstrike',  name: 'CrowdStrike',   color: '#1F2937' },
  { id: 'catonetworks', name: 'Cato Networks', color: '#A78BFA' },
  { id: 'sentinelone',  name: 'SentinelOne',   color: '#34D399' },
  { id: 'wiz',          name: 'Wiz',           color: '#06B6D4' },
];

// Data: Dec 2025 to Sep 2026 (9 months)
const TOTAL_KEYWORDS_DATA_INITIAL = {
  fortinet:    [32, 31, 33, 29, 14, 15, 15, 76, 78, 79],
  cisco:       [29, 32, 32, 25,  4,  4,  3, 80, 91, 95],
  hpe:         [ 1,  6,  6,  5,  2,  1,  2, 82, 68, 52],
  paloalto:    [35, 41, 41, 31, 20, 21, 25, 89, 85, 66],
  checkpoint:  [28, 27, 27, 22, 15, 16, 16, 16, 15, 14],
  crowdstrike: [34, 31, 31, 25, 11, 15, 14, 14, 12,  9],
  catonetworks:[ 9, 15, 15,  7,  0,  2,  3,  2,  4,  1],
  sentinelone: [43, 45, 40, 36, 30, 29, 33, 34, 30, 23],
  wiz:         [null, null, null, 24, 17, 19, 21, 21, 22, 19],
};

const CUMULATIVE_TRAFFIC_DATA_INITIAL = {
  fortinet:    [ 959, 1661, 1435,  931, 1840, 1890, 1106, 5572, 4446, 2145],
  cisco:       [ 125,  149,  141,  150,   10,  145,   13, 1275, 1835, 1726],
  hpe:         [   0,   13,    0,    1,    0,    1,    8, 1121,  486,  402],
  paloalto:    [1252, 1430,  834, 1224, 1585, 1004, 1605, 3623, 2668, 1638],
  checkpoint:  [ 301,  294,  207,  216,  612,  508,  556,  316,  162,  451],
  crowdstrike: [ 154,  142,  144,  125,  154,  249,  175,  157,  137,  128],
  catonetworks:[   0,    0,    0,    0,    0,   23,    2,    0,   44,   18],
  sentinelone: [ 659,  624, 1064,  985, 1028,  834,  884,  674,  721,  460],
  wiz:         [null, null, null, 1405, 1398, 1638, 1431, 1116, 1184, 1490],
};

const PAGE_ONE_KEYWORDS_DATA_INITIAL = {
  fortinet:    [10,  7, 11,  9,  6,  9, 15, 71, 75, 72],
  cisco:       [ 1,  3,  4,  6,  1,  3,  3, 69, 76, 90],
  hpe:         [ 0,  0,  0,  1,  0,  0,  1, 61, 45, 42],
  paloalto:    [17, 18, 20, 20, 16, 13, 22, 81, 75, 60],
  checkpoint:  [ 2,  2,  8,  9,  9, 10, 11, 11,  8, 10],
  crowdstrike: [ 8,  7,  7,  7,  6,  8,  6,  8,  7,  6],
  catonetworks:[ 0,  0,  0,  0,  0,  0,  1,  2,  3,  1],
  sentinelone: [26, 24, 23, 24, 23, 22, 27, 25, 23, 20],
  wiz:         [null, null, null, 12, 12, 16, 18, 21, 20, 18],
};

const AIO_DATA_INITIAL = {
  fortinet:    [26, 24, 27, 26, 11, 14, 15, 66, 62, 69],
  cisco:       [23, 24, 27, 23,  4,  3,  3, 59, 73, 75],
  hpe:         [ 1,  5,  4,  5,  2,  1,  2, 67, 57, 45],
  paloalto:    [27, 28, 33, 28, 16, 17, 22, 77, 76, 60],
  checkpoint:  [25, 22, 24, 22, 13, 15, 16, 14, 13, 12],
  crowdstrike: [24, 22, 26, 23,  8, 14, 13, 13, 10,  8],
  catonetworks:[ 7, 13, 12,  5,  0,  2,  3,  2,  4,  1],
  sentinelone: [32, 33, 34, 31, 25, 26, 32, 32, 24, 21],
  wiz:         [null, null, null, 18, 13, 14, 19, 18, 19, 15],
};

const MONTHS = ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];

// Format function for month display
const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]}-${year.slice(2)}`;
};

type TabType = 'keywords' | 'page-one' | 'traffic' | 'aio' | 'keyword-gap';

const KEYWORD_GAP_DATA = {
  tofu: [
    { keyword: "ai in cybersecurity", sv: 11000, kd: 72, fortinet: 1, cisco: 1, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "artificial intelligence in cybersecurity", sv: 300, kd: 70, fortinet: 1, cisco: 7, paloalto: 9, checkpoint: null, crowdstrike: null },
    { keyword: "ai security", sv: 4600, kd: 45, fortinet: null, cisco: null, paloalto: null, checkpoint: 7, crowdstrike: null },
    { keyword: "ai for security", sv: 900, kd: 61, fortinet: null, cisco: 5, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "how generative ai in used in cybersecurity", sv: null, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "aiops", sv: 9000, kd: 48, fortinet: 1, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
  ],
  mofu: [
    { keyword: "ai security system", sv: 450, kd: 51, fortinet: 1, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "ai cybersecurity tools", sv: 500, kd: 61, fortinet: 5, cisco: null, paloalto: null, checkpoint: null, crowdstrike: 20 },
    { keyword: "ai cybersecurity platform", sv: 80, kd: 73, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "ai cybersecurity software", sv: 200, kd: 59, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "ai security software", sv: 500, kd: 56, fortinet: 1, cisco: null, paloalto: 1, checkpoint: 9, crowdstrike: null },
    { keyword: "ai security platform", sv: 500, kd: 79, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
  ],
  bofu: [
    { keyword: "ai security solutions", sv: 2200, kd: 55, fortinet: null, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "ai security services", sv: 200, kd: 33, fortinet: null, cisco: 5, paloalto: null, checkpoint: null, crowdstrike: 1 },
    { keyword: "ai cybersecurity solutions", sv: 1200, kd: 58, fortinet: 1, cisco: 1, paloalto: 12, checkpoint: null, crowdstrike: 25 },
    { keyword: "ai cybersecurity companies", sv: 600, kd: 5, fortinet: 29, cisco: null, paloalto: null, checkpoint: 7, crowdstrike: null },
    { keyword: "ai security companies", sv: 250, kd: 47, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
  ],
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const validPayload = payload.filter((entry: any) => entry.value !== null && entry.value !== undefined);
  if (!validPayload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {validPayload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs mb-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function SlideAICyberSecurity({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(VENDORS.filter((v) => !['checkpoint', 'crowdstrike', 'catonetworks'].includes(v.id)).map((v) => v.id))
  );
  
  const [editableData, setEditableData] = useState<{
    keywords: Record<string, number[]>;
    traffic: Record<string, number[]>;
    pageOne: Record<string, number[]>;
    aio: Record<string, number[]>;
  }>(() => ({
    keywords: JSON.parse(JSON.stringify(TOTAL_KEYWORDS_DATA_INITIAL)),
    traffic: JSON.parse(JSON.stringify(CUMULATIVE_TRAFFIC_DATA_INITIAL)),
    pageOne: JSON.parse(JSON.stringify(PAGE_ONE_KEYWORDS_DATA_INITIAL)),
    aio: JSON.parse(JSON.stringify(AIO_DATA_INITIAL)),
  }));

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableData({
      keywords: JSON.parse(JSON.stringify(TOTAL_KEYWORDS_DATA_INITIAL)),
      traffic: JSON.parse(JSON.stringify(CUMULATIVE_TRAFFIC_DATA_INITIAL)),
      pageOne: JSON.parse(JSON.stringify(PAGE_ONE_KEYWORDS_DATA_INITIAL)),
      aio: JSON.parse(JSON.stringify(AIO_DATA_INITIAL)),
    });
    setIsEditing(false);
  };

  const handleValueChange = (
    dataset: 'keywords' | 'traffic' | 'pageOne' | 'aio',
    vendorId: string,
    index: number,
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    setEditableData((prev) => ({
      ...prev,
      [dataset]: {
        ...prev[dataset],
        [vendorId]: prev[dataset][vendorId].map((v, i) => (i === index ? numValue : v)),
      },
    }));
  };

  const toggleVendor = (vendorId: string) => {
    setVisibleVendors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(vendorId)) {
        newSet.delete(vendorId);
      } else {
        newSet.add(vendorId);
      }
      return newSet;
    });
  };

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const totalKeywordsChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.keywords[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const cumulativeTrafficChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.traffic[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const getTrafficYMax = () => {
    let max = 0;
    cumulativeTrafficChartData.forEach((point) => {
      VENDORS.forEach((vendor) => {
        if (visibleVendors.has(vendor.id) && point[vendor.id] != null) {
          max = Math.max(max, point[vendor.id]);
        }
      });
    });
    return Math.ceil(max * 1.15);
  };

  const trafficYMax = getTrafficYMax();

  const pageOneKeywordsChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.pageOne[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const aioChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.aio[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const tabs = [
    { id: 'keywords' as TabType, label: 'Total Keywords' },
    { id: 'page-one' as TabType, label: 'Page 1 Keywords' },
    { id: 'traffic' as TabType, label: 'Cumulative Traffic' },
    { id: 'aio' as TabType, label: 'AIO (AI Overview)' },
    { id: 'keyword-gap' as TabType, label: 'Priority Keywords' },
  ];

  const getChartData = () => {
    switch (activeTab) {
      case 'keywords': return totalKeywordsChartData;
      case 'page-one': return pageOneKeywordsChartData;
      case 'traffic': return cumulativeTrafficChartData;
      case 'aio': return aioChartData;
      default: return [];
    }
  };

  const getInsights = () => {
    switch (activeTab) {
      case 'keywords':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Fortinet"
              content="From Dec 2025 to Sep 2026, keywords grew 32 → 79 (+146.9%), driven by a Jul-26 step-up, trailing only Cisco 95."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Dec 2025 to Sep 2026, Cisco grew 29 → 95 (+227.6%), Palo Alto grew 35 → 66 (+88.6%), SentinelOne declined 43 → 23 (−46.5%)."
            />
          </InsightsSection>
        );
      case 'page-one':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Fortinet"
              content="From Dec 2025 to Sep 2026, page-1 rankings grew 10 → 72 (+620.0%), trailing only Cisco 90, ahead of Palo Alto 60."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Dec 2025 to Sep 2026, Cisco grew 1 → 90, Palo Alto grew 17 → 60 (+252.9%), SentinelOne declined 26 → 20 (−23.1%)."
            />
          </InsightsSection>
        );
      case 'traffic':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Fortinet"
              content="From Dec 2025 to Sep 2026, traffic grew 959 → 2,145 (+123.7%), leading Cisco 1,726 and Palo Alto 1,638."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Dec 2025 to Sep 2026, Palo Alto grew 1,252 → 1,638 (+30.8%), SentinelOne declined 659 → 460 (−30.2%)."
            />
          </InsightsSection>
        );
      case 'aio':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Fortinet"
              content="From Dec 2025 to Sep 2026, AIO rankings grew 26 → 69 (+165.4%), trailing only Cisco 75, ahead of Palo Alto 60."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Dec 2025 to Sep 2026, Cisco grew 23 → 75 (+226.1%), Palo Alto grew 27 → 60 (+122.2%), SentinelOne declined 32 → 21 (−34.4%)."
            />
          </InsightsSection>
        );
      case 'keyword-gap':
        return (
          <InsightsSection>
            <InsightCard
              icon={Trophy}
              type="success"
              title="Fortinet"
              content="Ranks #1 for 'ai in cybersecurity' (SV 11K), 'artificial intelligence in cybersecurity', 'aiops' (SV 9K), 'ai security system', 'ai security software' and 'ai cybersecurity solutions' — strong AI TOFU and solution coverage."
            />
            <InsightCard
              icon={Target}
              type="warning"
              title="Competitions"
              content="Fortinet is unranked for 'ai security' (SV 4.6K; Check Point #7) and 'ai security solutions' (SV 2.2K; Palo Alto #1), and only #29 for 'ai cybersecurity companies' — Palo Alto and CrowdStrike are contesting BOFU AI terms."
            />
          </InsightsSection>
        );
      default:
        return null;
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 9; // Sep 2026
    let dataSource: Record<string, number[]>;
    let formatValue: (val: number) => string;

    switch (activeTab) {
      case 'keywords':
        dataSource = editableData.keywords;
        formatValue = (val) => val.toLocaleString();
        break;
      case 'page-one':
        dataSource = editableData.pageOne;
        formatValue = (val) => val.toLocaleString();
        break;
      case 'traffic':
        dataSource = editableData.traffic;
        formatValue = (val) => val.toLocaleString();
        break;
      case 'aio':
        dataSource = editableData.aio;
        formatValue = (val) => val.toLocaleString();
        break;
      default:
        return null;
    }

    // Get latest values for all vendors
    const rankings = VENDORS.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      value: dataSource[vendor.id]?.[latestIndex] ?? 0,
      color: vendor.color,
    })).sort((a, b) => b.value - a.value);

    const fortinetRanking = rankings.find(r => r.id === 'fortinet');
    if (!fortinetRanking) return null;

    const fortinetPosition = rankings.findIndex(r => r.id === 'fortinet') + 1;
    const isLeader = fortinetPosition === 1;
    const secondPlace = rankings[1];
    const firstPlace = rankings[0];

    if (isLeader) {
      // Fortinet is #1, show who's in second
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
      const ordinal = (n: number) => n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`;
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

  const renderChart = () => {
    const chartData = getChartData();
    const visibleVendorsList = VENDORS.filter(v => visibleVendors.has(v.id));

    return (
      <ResponsiveContainer key={`${activeTab}-${Array.from(visibleVendors).sort().join('-')}`} width="100%" height="100%">
        <LineChart data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
          <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis {...(activeTab === 'traffic' ? { domain: [0, trafficYMax], tickFormatter: formatChartAxisNumber } : {})} {...CHART_CONFIG.yAxis} />
          <Tooltip content={<CustomTooltip />} />
          {visibleVendorsList.map((vendor, idx) => (
            <Line
              key={`line-${vendor.id}-${idx}`}
              type="monotone"
              dataKey={vendor.id}
              name={vendor.name}
              stroke={vendor.color}
              {...CHART_CONFIG.line}
              dot={{ fill: vendor.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <SlideContainer slideNumber={26} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader 
        title="AI CyberSecurity" 
        subtitle="(Dec 2025 – Sep 2026)"
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
          {activeTab !== 'keyword-gap' && <TimeRangeFilter value={timeRange} onChange={setTimeRange} />}

          {/* Content Area */}
          {activeTab === 'keyword-gap' ? (
            <div className="flex-1 grid grid-cols-12 gap-6">
              <div className="col-span-8 flex flex-col gap-3 overflow-auto">
                <div className="flex items-center gap-4 text-[10px] text-gray-500 px-1">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 inline-block" /> #1–3</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-100 inline-block" /> #4–10</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-50 inline-block" /> #11+</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Not ranking</span>
                </div>
                {(['tofu', 'mofu', 'bofu'] as const).map((section) => {
                  const sectionLabel = section === 'tofu' ? 'TOFU' : section === 'mofu' ? 'MOFU' : 'BOFU';
                  const sectionColor = section === 'tofu' ? 'bg-blue-600' : section === 'mofu' ? 'bg-violet-600' : 'bg-orange-600';
                  const rowHover = section === 'tofu' ? 'hover:bg-blue-50' : section === 'mofu' ? 'hover:bg-violet-50' : 'hover:bg-orange-50';
                  const divider = section === 'tofu' ? 'divide-blue-50' : section === 'mofu' ? 'divide-violet-50' : 'divide-orange-50';
                  return (
                    <div key={section} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className={`grid grid-cols-[2fr_60px_40px_70px_70px_80px_70px_70px] gap-2 px-3 py-2 ${sectionColor} text-white`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{sectionLabel} Keywords</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center">SV</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center">KD</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center">Fortinet</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center">Cisco</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center">Palo Alto</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center">Checkpoint</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center">Crowdstrike</span>
                      </div>
                      <div className={`divide-y ${divider}`}>
                        {KEYWORD_GAP_DATA[section].map((row, idx) => (
                          <div key={idx} className={`grid grid-cols-[2fr_60px_40px_70px_70px_80px_70px_70px] gap-2 items-center px-3 py-2 ${rowHover} transition-colors`}>
                            <span className="text-[11px] font-medium text-gray-800">{row.keyword}</span>
                            <span className="text-[11px] text-gray-500 text-center tabular-nums">{row.sv != null ? row.sv.toLocaleString() : '—'}</span>
                            <span className="text-[11px] text-gray-500 text-center tabular-nums">{row.kd != null ? row.kd : '—'}</span>
                            {(['fortinet', 'cisco', 'paloalto', 'checkpoint', 'crowdstrike'] as const).map((vendor) => {
                              const val = row[vendor];
                              const isTop3 = val != null && val <= 3;
                              const isTop10 = val != null && val <= 10;
                              return (
                                <span key={vendor} className={`text-[11px] font-semibold text-center tabular-nums rounded px-1 py-0.5 ${val == null ? 'text-gray-300' : isTop3 ? 'bg-green-100 text-green-700' : isTop10 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-50 text-red-600'}`}>
                                  {val != null ? `#${val}` : '—'}
                                </span>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="col-span-4 flex flex-col gap-4">{getInsights()}</div>
            </div>
          ) : (
          <div className="flex-1 grid grid-cols-12 gap-6">
            {/* Chart Section - 8 columns */}
            <div className="col-span-8 flex flex-col gap-4">
              <ChartContainer
                title=""
                actions={<EditButton isEditing={isEditing} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} />}
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
                    {renderChart()}
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
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit AI CyberSecurity Metrics Data (Dec 2025 - Sep 2026)</h3>
            <div className="space-y-6">
              {VENDORS.map((vendor) => (
                <div key={vendor.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }} />
                    <h4 className="text-sm font-bold text-gray-900">{vendor.name}</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Total Keywords:</div>
                      {['Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.keywords[vendor.id][idx + 5]}
                            onChange={(e) => handleValueChange('keywords', vendor.id, idx + 5, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Traffic:</div>
                      {['Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.traffic[vendor.id][idx + 5]}
                            onChange={(e) => handleValueChange('traffic', vendor.id, idx + 5, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Page 1 KWs:</div>
                      {['Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.pageOne[vendor.id][idx + 5]}
                            onChange={(e) => handleValueChange('pageOne', vendor.id, idx + 5, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">AIO:</div>
                      {['Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.aio[vendor.id][idx + 5]}
                            onChange={(e) => handleValueChange('aio', vendor.id, idx + 5, e.target.value)}
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

      <SlideFooter source="Source: Ahrefs" />
    </SlideContainer>
  );
}