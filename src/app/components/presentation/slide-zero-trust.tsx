import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Shield, TrendingUp, TrendingDown, AlertTriangle, Sparkles, Zap, Trophy, Target } from 'lucide-react';
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
  { id: 'akamai',       name: 'Akamai',        color: '#F97316' },
];

// Full data - Jul 2025 to Sep 2026 (14 months)
const TOTAL_KEYWORDS_DATA_INITIAL = {
  fortinet:    [301, 307, 218, 179, 210, 218, 226, 222, 227, 207, 220, 208, 258, 248, 237],
  cisco:       [310, 312, 163, 104, 126, 141, 135, 139, 138, 104, 102, 91, 77, 77, 77],
  hpe:         [ 71,  80,  20,  12,  22,  23,  22,  30,  23,  17,   8, 11,  7,  8, 10],
  paloalto:    [325, 348, 246, 225, 224, 232, 228, 237, 236, 215, 234, 261, 319, 300, 260],
  checkpoint:  [242, 250,  99,  46,  96, 115, 104, 105,  87,  58,  52, 59, 53, 59, 42],
  crowdstrike: [0, 0, 0, 0, 204, 217, 215, 220, 208, 160, 152, 174, 168, 167, 156],
  catonetworks:[0, 0, 0, 0, 0, 71, 72, 73, 49, 17, 20, 20, 17, 17, 14],
  sentinelone: [0, 0, 0, 0, 0, 101, 106, 93, 90, 62, 55, 58, 52, 44, 39],
  wiz:         [null, null, null, null, null, null, null, null, 16, 6, 4, 3, 2, 2, 3],
  akamai:      [null, null, null, null, null, null, null, null, null, null, null, null, 88, 92, 74], // Data starts Jul 2026
};

const CUMULATIVE_TRAFFIC_DATA_INITIAL = {
  fortinet:    [4565, 7238, 5353, 5994, 5370, 5926, 6208, 5688, 7125, 6489, 6366, 7621, 6379, 6378, 5231],
  cisco:       [1983, 2275, 1776, 1854, 1442, 1352, 1462, 1955, 1667, 1906, 2086, 1335, 1264, 1072, 1267],
  hpe:         [  49,   84,   39,   19,   75,   81,   55,   53,   67,  110,   62, 22, 15, 65, 636],
  paloalto:    [7219, 6300, 6434, 6942, 6334, 7388, 7193, 9993, 9513, 9469, 14406, 12393, 8601, 7629, 8140],
  checkpoint:  [ 215,  287,  176,  357,  408,  558,  352, 1096,  687,  859,   531, 846, 593, 533, 310],
  crowdstrike: [0, 0, 0, 0, 8230, 10344, 11093, 9760, 8538, 5952, 4841, 7082, 7699, 4015, 2917],
  catonetworks:[0, 0, 0, 0, 0, 200, 241, 234, 248, 87, 184, 126, 545, 256, 114],
  sentinelone: [0, 0, 0, 0, 0, 1774, 1841, 1851, 2162, 2145, 1961, 2120, 1754, 1157, 929],
  wiz:         [null, null, null, null, null, null, null, null, 66, 9, 14, 8, 0, 18, 10],
  akamai:      [null, null, null, null, null, null, null, null, null, null, null, null, 1093, 626, 753], // Data starts Jul 2026
};

const PAGE_ONE_KEYWORDS_DATA_INITIAL = {
  fortinet:    [113, 120, 134, 143, 174, 180, 192, 182, 199, 185, 200, 196, 248, 236, 225],
  cisco:       [ 73,  89,  70,  64,  69,  53,  58,  60,  73,  73,  77, 76, 68, 68, 74],
  hpe:         [  3,   6,   5,   3,   7,   8,   5,   9,   6,   8,   3, 6,  6,  5,  9],
  paloalto:    [146, 187, 177, 194, 193, 179, 172, 179, 195, 189, 204, 244, 303, 280, 243],
  checkpoint:  [ 15,  21,  21,  16,  29,  29,  20,  20,  22,  26,  21, 30, 33, 35, 30],
  crowdstrike: [0, 0, 0, 0, 176, 170, 170, 170, 167, 144, 125, 164, 152, 150, 142],
  catonetworks:[0, 0, 0, 0, 0, 17, 19, 19, 20, 9, 11, 16, 14, 14, 12],
  sentinelone: [0, 0, 0, 0, 0, 57, 54, 47, 61, 52, 44, 50, 47, 43, 33],
  wiz:         [null, null, null, null, null, null, null, null, 8, 4, 3, 2, 1, 2, 2],
  akamai:      [null, null, null, null, null, null, null, null, null, null, null, null, 67, 67, 57], // Data starts Jul 2026
};

const AIO_DATA_INITIAL = {
  fortinet:    [165, 176, 120, 120, 151, 163, 175, 174, 181, 161, 181, 174, 202, 179, 176],
  cisco:       [152, 175,  89,  58,  91, 102, 102,  97,  99,  75,  82, 65, 52, 55, 55],
  hpe:         [ 42,  52,   6,  10,  22,  22,  20,  28,  20,  16,   6, 11,  7,  8, 10],
  paloalto:    [160, 190, 136, 140, 157, 157, 165, 163, 174, 158, 179, 194, 216, 183, 159],
  checkpoint:  [139, 163,  48,  30,  82,  98,  92,  90,  71,  46,  41, 47, 45, 44, 32],
  crowdstrike: [0, 0, 0, 0, 158, 163, 164, 160, 156, 130, 131, 154, 143, 133, 121],
  catonetworks:[0, 0, 0, 0, 0, 62, 62, 62, 42, 14, 17, 14, 12, 14, 13],
  sentinelone: [0, 0, 0, 0, 0, 77, 81, 71, 66, 45, 43, 46, 40, 31, 23],
  wiz:         [null, null, null, null, null, null, null, null, 13, 4, 2, 2, 2, 2, 2],
  akamai:      [null, null, null, null, null, null, null, null, null, null, null, null, 54, 55, 43], // Data starts Jul 2026
};

const MONTHS = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];

// Format function for month display
const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]}-${year.slice(2)}`;
};

type TabType = 'keywords' | 'page-one' | 'traffic' | 'aio' | 'keyword-gap';

const KEYWORD_GAP_DATA = {
  tofu: [
    { keyword: "zero trust", sv: 9600, kd: 83, fortinet: 7, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "what is zero trust", sv: 2400, kd: 78, fortinet: 11, cisco: 29, paloalto: 19, checkpoint: 15, crowdstrike: 7 },
    { keyword: "zero trust definition", sv: 500, kd: 74, fortinet: 1, cisco: null, paloalto: null, checkpoint: null, crowdstrike: 1 },
    { keyword: "zero trust network", sv: 1900, kd: 78, fortinet: 6, cisco: 1, paloalto: 9, checkpoint: 20, crowdstrike: 15 },
    { keyword: "zero trust network security", sv: 500, kd: 65, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "zero trust principles", sv: 900, kd: 82, fortinet: null, cisco: null, paloalto: 17, checkpoint: 18, crowdstrike: 1 },
    { keyword: "zero trust architecture", sv: 6500, kd: 57, fortinet: null, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: 8 },
    { keyword: "zero trust network access", sv: 3200, kd: 59, fortinet: 1, cisco: 1, paloalto: null, checkpoint: null, crowdstrike: null },
  ],
  mofu: [
    { keyword: "zero trust software", sv: 400, kd: 33, fortinet: 1, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: 6 },
    { keyword: "zero trust system", sv: 50, kd: 77, fortinet: 8, cisco: null, paloalto: null, checkpoint: null, crowdstrike: 1 },
    { keyword: "zero trust access software", sv: 40, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "zero trust network access software", sv: 40, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
  ],
  bofu: [
    { keyword: "zero trust solutions", sv: 800, kd: 52, fortinet: 31, cisco: 8, paloalto: 14, checkpoint: null, crowdstrike: null },
    { keyword: "ztna solutions", sv: 900, kd: 47, fortinet: 11, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: 1 },
    { keyword: "zero trust network access solutions", sv: 100, kd: 31, fortinet: 1, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: 6 },
    { keyword: "zero trust security platform", sv: 400, kd: 51, fortinet: 6, cisco: null, paloalto: 4, checkpoint: 9, crowdstrike: 12 },
    { keyword: "zero trust network access platform", sv: null, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "zero trust vendor", sv: 200, kd: 6, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: 10 },
    { keyword: "zero trust security solutions", sv: 700, kd: 58, fortinet: 21, cisco: null, paloalto: 12, checkpoint: null, crowdstrike: 15 },
    { keyword: "ztna vendor", sv: 30, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "zero trust platform", sv: 500, kd: 54, fortinet: 1, cisco: null, paloalto: 1, checkpoint: 17, crowdstrike: 1 },
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

export function SlideZeroTrust({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(['fortinet', 'paloalto', 'akamai'])
  );
  
  // State for editable data
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
        dataPoint[vendor.id] = editableData.aio[vendor.id][i + tro] ?? 0;
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
              icon={TrendingDown}
              type="error"
              title="Fortinet"
              content="From Jul 2025 to Sep 2026, keywords declined 301 → 237 (−21.3%), trailing Palo Alto 260."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Palo Alto declined 325 → 260 (−20.0%), Cisco declined 310 → 77 (−75.2%)."
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
              content="From Jul 2025 to Sep 2026, rankings grew 113 → 225 (+99.1%), trailing Palo Alto 243."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Palo Alto grew 146 → 243 (+66.4%), Crowdstrike grew 0 → 142."
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
              content="From Jul 2025 to Sep 2026, traffic grew 4,565 → 5,231 (+14.6%), trailing Palo Alto 8,140."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Palo Alto grew 7,219 → 8,140 (+12.8%), leading all competitors."
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
              content="From Jul 2025 to Sep 2026, AIO grew 165 → 176 (+6.7%), leading Palo Alto 159."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Palo Alto was flat 160 → 159 (−0.6%), Crowdstrike grew 0 → 121."
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
              content="Ranks #1 for 'zero trust definition', 'zero trust network security', 'zero trust network access' (SV 3.2K), 'zero trust software' and 'zero trust platform' — strong ZTNA and platform terms."
            />
            <InsightCard
              icon={Target}
              type="warning"
              title="Competitions"
              content="Head terms lag: 'zero trust' (SV 9.6K) #7, 'what is zero trust' #11, 'zero trust solutions' #31 (Cisco #8, Palo Alto #14), and no ranking for 'zero trust architecture' (SV 6.5K; Palo Alto #1) or 'zero trust principles' — key gaps to address."
            />
          </InsightsSection>
        );
      default:
        return null;
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 14; // Sep 2026
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
        formatValue = (val) => `${(val / 1000).toFixed(1)}K`;
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
        <LineChart id={`ztna-line-${activeTab}`} data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid id={`ztna-grid-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
          <XAxis id={`ztna-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis id={`ztna-yaxis-${activeTab}`} {...(activeTab === 'traffic' ? { domain: [0, trafficYMax], tickFormatter: formatChartAxisNumber } : {})} {...CHART_CONFIG.yAxis} />
          <Tooltip id={`ztna-tooltip-${activeTab}`} content={<CustomTooltip />} />
          {visibleVendorsList.map((vendor) => (
            <Line
              key={vendor.id}
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
    <SlideContainer slideNumber={23} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader 
        title="Zero Trust Security" 
        subtitle="(Jul 2025 – Sep 2026)"
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
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit Zero Trust Metrics Data (Jul 2025 - Sep 2026)</h3>
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
                      {['Oct', 'Nov', 'Dec', 'Jan'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.keywords[vendor.id][idx]}
                            onChange={(e) => handleValueChange('keywords', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Traffic:</div>
                      {['Oct', 'Nov', 'Dec', 'Jan'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.traffic[vendor.id][idx]}
                            onChange={(e) => handleValueChange('traffic', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Page 1 KWs:</div>
                      {['Oct', 'Nov', 'Dec', 'Jan'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.pageOne[vendor.id][idx]}
                            onChange={(e) => handleValueChange('pageOne', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">AIO:</div>
                      {['Nov', 'Dec', 'Jan'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.aio[vendor.id][idx + 1]}
                            onChange={(e) => handleValueChange('aio', vendor.id, idx + 1, e.target.value)}
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