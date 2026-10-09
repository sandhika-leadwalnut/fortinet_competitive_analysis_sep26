import { TrendingUp, TrendingDown, BarChart3, Zap, Sparkles, Target } from 'lucide-react';
import { formatChartAxisNumber } from '@/app/utils/format';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

// Full data - Jul 2025 to Sep 2026 (14 months)
const TOTAL_KEYWORDS_DATA_INITIAL = {
  fortinet:    [309, 362, 307, 288, 289, 295, 304, 293, 287, 273, 276, 266, 617, 591, 564],
  cisco:       [316, 354, 315, 297, 308, 306, 314, 329, 317, 316, 310, 313, 757, 749, 718],
  hpe:         [168, 185, 138, 127, 135, 128, 125, 124, 107,  75,  71,  87, 179, 187, 231],
  paloalto:    [309, 357, 314, 283, 291, 309, 312, 306, 297, 305, 303, 310, 698, 670, 633],
  checkpoint:  [222, 236,  91,  48,  65,  68,  79,  74,  71,  50,  48,  52,  46,  31,  29],
  crowdstrike: [null, null, null, null, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null, 185, 179, 132, 117, 82, 63, 55, 119, 121, 91], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0], // Data starts Dec 2025
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0], // Mar 2026 only
};

const CUMULATIVE_TRAFFIC_DATA_INITIAL = {
  fortinet:    [4029, 5416, 6311, 5961, 5984, 6055, 6196, 5974, 7113, 6425, 7282, 5618, 7963, 6714, 6284],
  cisco:       [8246, 10236, 10316, 9702, 9574, 8833, 8824, 11169, 8474, 9640, 8257, 6583, 9156, 7931, 7129],
  hpe:         [1674, 1545, 1737, 1584, 1554, 1538, 1138, 1061, 900, 790, 662, 644, 1284, 1285, 1329],
  paloalto:    [7517, 7150, 7080, 6979, 7379, 8021, 8281, 8073, 8398, 8621, 7196, 6847, 8525, 7806, 6413],
  checkpoint:  [ 217,  183,  163,   98,  262,  167,  215,  249, 209, 345, 273, 247, 249, 131, 176],
  crowdstrike: [null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null, 1118, 1074, 1108, 964, 563, 506, 440, 753, 968, 453], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Data starts Dec 2025
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0], // Mar 2026 only
};

const PAGE_ONE_KEYWORDS_DATA_INITIAL = {
  fortinet:    [205, 257, 271, 277, 282, 284, 292, 277, 276, 272, 270, 262, 611, 588, 562],
  cisco:       [249, 278, 292, 284, 296, 289, 291, 309, 295, 306, 297, 301, 751, 744, 714],
  hpe:         [ 89, 108, 110, 107, 124, 106, 105, 103,  88,  62,  61,  85, 177, 179, 223],
  paloalto:    [236, 270, 286, 274, 277, 296, 302, 293, 285, 302, 297, 303, 684, 665, 628],
  checkpoint:  [ 21,  16,  18,  16,  29,  22,  24,  24,  27,  34,  30,  36,  34,  22,  26],
  crowdstrike: [null, null, null, null, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null, 142, 135, 94, 88, 67, 47, 46, 115, 119, 88], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null, null, null, null, null, null, null, 0, 0, 0, 0], // No data in CSV
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0], // Mar 2026 only
};

const AIO_DATA_INITIAL = {
  fortinet:    [141, 198, 149, 142, 157, 160, 160, 155, 162, 161, 180, 176, 332, 292, 279],
  cisco:       [146, 201, 154, 160, 164, 160, 158, 164, 174, 180, 189, 194, 383, 346, 341],
  hpe:         [ 74, 112,  71,  62,  76,  81,  80,  76,  64,  38,  40,  56, 102, 100, 124],
  paloalto:    [145, 201, 149, 144, 152, 162, 160, 155, 170, 174, 188, 193, 375, 324, 304],
  checkpoint:  [113, 148,  44,  32,  54,  55,  62,  57,  55,  43,  41,  46,  39,  23,  17],
  crowdstrike: [null, null, null, null, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null, 107, 108, 89, 82, 57, 47, 41, 65, 71, 47], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0], // Data starts Dec 2025
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0], // Mar 2026 only
};

const MONTHS = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];

// Format function for month display
const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

type TabType = 'keywords' | 'page-one' | 'traffic' | 'aio' | 'keyword-gap';

const KEYWORD_GAP_DATA = {
  tofu: [
    { keyword: "sd-wan", sv: 6900, kd: 62, fortinet: 1, cisco: 1, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "what is sd-wan", sv: 1300, kd: 30, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: 1, crowdstrike: null },
    { keyword: "sd wan defined", sv: 100, kd: 35, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "sd wan meaning", sv: 1000, kd: 28, fortinet: 1, cisco: 1, paloalto: null, checkpoint: 1, crowdstrike: null },
    { keyword: "software defined wan", sv: 600, kd: 37, fortinet: 3, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
  ],
  mofu: [
    { keyword: "sd wan software", sv: 350, kd: 44, fortinet: null, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "sd wan device", sv: 200, kd: 40, fortinet: 1, cisco: 4, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "secure sd wan", sv: 250, kd: 10, fortinet: 1, cisco: 6, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "sd-wan software", sv: 150, kd: 45, fortinet: null, cisco: 2, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "sd wan security", sv: 700, kd: 2, fortinet: 5, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
  ],
  bofu: [
    { keyword: "sd-wan solutions", sv: 600, kd: 33, fortinet: 13, cisco: 6, paloalto: 7, checkpoint: 23, crowdstrike: null },
    { keyword: "sd wan service", sv: 350, kd: 1, fortinet: 1, cisco: 7, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "sd wan services", sv: 300, kd: 12, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "sd-wan platform", sv: 40, kd: 31, fortinet: 10, cisco: 3, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "sd-wan vendors", sv: 150, kd: 2, fortinet: null, cisco: 9, paloalto: null, checkpoint: 11, crowdstrike: null },
    { keyword: "sd-wan providers", sv: 200, kd: 2, fortinet: null, cisco: null, paloalto: null, checkpoint: 9, crowdstrike: null },
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

export function SlideSDWANMetrics({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(['fortinet', 'cisco', 'hpe', 'paloalto', 'catonetworks'])
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
      if (visibleVendors.has(vendor.id) && editableData.keywords[vendor.id]) {
        dataPoint[vendor.id] = editableData.keywords[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const cumulativeTrafficChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.traffic[vendor.id]) {
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
      if (visibleVendors.has(vendor.id) && editableData.pageOne[vendor.id]) {
        dataPoint[vendor.id] = editableData.pageOne[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const aioChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.aio[vendor.id]) {
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

  const getChartTitle = () => {
    switch (activeTab) {
      case 'keywords': return 'Total Keywords';
      case 'page-one': return 'No. of KWs Ranking on Page 1';
      case 'traffic': return 'Cumulative Traffic';
      case 'aio': return 'AIO (AI Overview)';
      default: return '';
    }
  };

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
              content="From Jul 2025 to Sep 2026, keywords grew 309 → 564 (+82.5%), all of it from the Jul 2026 step (266 → 617), easing to 564 since; still trails Cisco 718 and Palo Alto 633."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco grew 316 → 718 (+127.2%), Palo Alto grew 309 → 633 (+104.9%), both also lifted by the Jul 2026 refresh."
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
              content="From Jul 2025 to Sep 2026, rankings grew 205 → 562 (+174.1%), driven by the Jul-26 jump (262 → 611), trailing Cisco 714 and Palo Alto 628."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco grew 249 → 714 (+186.7%), Palo Alto grew 236 → 628 (+166.1%), both also stepping up in Jul-26."
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
              content="From Jul 2025 to Sep 2026, traffic grew 4,029 → 6,284 (+56.0%), peaking at 7,963 in Jul-26; trails Cisco 7,129 while Palo Alto 6,413 is close behind."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco declined 8,246 → 7,129 (−13.5%), Palo Alto declined 7,517 → 6,413 (−14.7%), despite Jul-26 bumps; Cisco has led Fortinet in traffic every month."
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
              content="From Jul 2025 to Sep 2026, AIO grew 141 → 279 (+97.9%), doubling at the Jul-26 step (176 → 332) and easing since, trailing Cisco 341 and Palo Alto 304."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco grew 146 → 341 (+133.6%), Palo Alto grew 145 → 304 (+109.7%), both lifted by the Jul-26 step."
            />
          </InsightsSection>
        );
      case 'keyword-gap':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Fortinet"
              content="Ranks #1 for 4 of 5 TOFU terms (sd-wan, what is sd-wan, defined, meaning) plus 'sd wan service', 'sd wan services', 'sd wan device' and 'secure sd wan' — strong core and service-intent coverage."
            />
            <InsightCard
              icon={Target}
              type="warning"
              title="Competitions"
              content="Fortinet is #13 for 'sd-wan solutions' (SV 600; Cisco #6, Palo Alto #7) and unranked for 'sd wan software', 'sd-wan software', 'sd-wan vendors' and 'sd-wan providers' — Cisco and Palo Alto hold the software terms; Cisco and Check Point hold vendors/providers."
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

    return (
      <ResponsiveContainer key={`${activeTab}-${Array.from(visibleVendors).sort().join('-')}`} width="100%" height="100%">
        <LineChart data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
          <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis {...(activeTab === 'traffic' ? { domain: [0, trafficYMax], tickFormatter: formatChartAxisNumber } : {})} {...CHART_CONFIG.yAxis} />
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
    );
  };

  return (
    <SlideContainer slideNumber={20} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader
        title="SD-WAN"
        subtitle="(Jul 2025 – Sep 2026)"
      />
      
      {!isEditing ? (
        <div className="flex-1 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex items-center justify-between">
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
          </div>

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
                                <span
                                  key={vendor}
                                  className={`text-[11px] font-semibold text-center tabular-nums rounded px-1 py-0.5 ${
                                    val == null ? 'text-gray-300' :
                                    isTop3 ? 'bg-green-100 text-green-700' :
                                    isTop10 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-50 text-red-600'
                                  }`}
                                >
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
              <div className="col-span-4 flex flex-col gap-4">
                {getInsights()}
              </div>
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
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit SD-WAN Metrics Data (Jul 2025 – Sep 2026)</h3>
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
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
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
                      <div className="text-xs font-semibold text-gray-700 mb-2">Page 1 KWs:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
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
                      <div className="text-xs font-semibold text-gray-700 mb-2">Traffic:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
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
                      <div className="text-xs font-semibold text-gray-700 mb-2">AIO:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.aio[vendor.id][idx]}
                            onChange={(e) => handleValueChange('aio', vendor.id, idx, e.target.value)}
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