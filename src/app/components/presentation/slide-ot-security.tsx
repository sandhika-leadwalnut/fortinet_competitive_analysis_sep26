import { TrendingUp, TrendingDown, Shield, Zap, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// OT Security Vendors with design system colors
const OT_VENDORS = [
  { id: 'fortinet',     name: 'Fortinet',      color: '#EF4444' },
  { id: 'cisco',        name: 'Cisco',         color: '#FF7AB6' },
  { id: 'hpe',          name: 'HPE',           color: '#7ED957' },
  { id: 'paloalto',     name: 'Palo Alto',     color: '#FFB14A' },
  { id: 'checkpoint',   name: 'Check Point',   color: '#6C9AFF' },
  { id: 'crowdstrike',  name: 'CrowdStrike',   color: '#1F2937' },
  { id: 'catonetworks', name: 'Cato Networks', color: '#A78BFA' },
  { id: 'sentinelone',  name: 'SentinelOne',   color: '#34D399' },
  { id: 'wiz',          name: 'Wiz',           color: '#06B6D4' },
  { id: 'dragos',       name: 'Dragos',        color: '#F97316' },
  { id: 'ibm',          name: 'IBM',           color: '#0EA5E9' },
];

// OT Security full data - Jul 2025 to Sep 2026 (15 months)
const TOTAL_KEYWORDS_DATA_INITIAL = {
  fortinet:    [40, 46, 34, 30, 24, 29, 29, 28, 32, 27, 26, 26, 218, 211, 254],
  cisco:       [40, 44, 24, 21, 18, 17, 18, 20, 24, 18, 14, 15, 13, 11, 15],
  hpe:         [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  paloalto:    [34, 43, 24, 19, 14, 20, 20, 20, 22, 18, 18, 17, 16, 17, 18],
  checkpoint:  [25, 25, 8, 2, 6, 7, 9, 8, 8, 2, 1, 1, 1, 0, 1],
  crowdstrike: [null, null, null, null, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  catonetworks:[null, null, null, null, null, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0],
  sentinelone: [null, null, null, null, null, 9, 10, 9, 7, 4, 5, 3, 2, 5, 4],
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 1, 1],
  dragos:      [null, null, null, null, null, null, null, null, null, null, null, null, 100, 101, 101], // Data starts Jul 2026
  ibm:         [null, null, null, null, null, null, null, null, null, null, null, null, 256, 252, 133], // Data starts Jul 2026
};


const CUMULATIVE_TRAFFIC_DATA_INITIAL = {
  fortinet:    [566, 872, 939, 1073, 1043, 1043, 1018, 1258, 1066, 925, 877, 839, 2913, 2944, 4935],
  cisco:       [295, 330, 343, 392, 349, 480, 497, 438, 421, 394, 352, 340, 348, 243, 277],
  hpe:         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  paloalto:    [302, 232, 270, 244, 267, 674, 642, 703, 763, 503, 424, 482, 454, 358, 368],
  checkpoint:  [10, 4, 0, 0, 2, 0, 1, 1, 2, 0, 0, 3, 0, 0, 0],
  crowdstrike: [null, null, null, null, 15, 16, 16, 14, 14, 14, 43, 43, 43, 23, 24],
  catonetworks:[null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  sentinelone: [null, null, null, null, null, 6, 9, 12, 12, 18, 23, 18, 3, 18, 19],
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 8, 8],
  dragos:      [null, null, null, null, null, null, null, null, null, null, null, null, 1218, 1417, 1152], // Data starts Jul 2026
  ibm:         [null, null, null, null, null, null, null, null, null, null, null, null, 2103, 1838, 1637], // Data starts Jul 2026
};

const PAGE_ONE_KEYWORDS_DATA_INITIAL = {
  fortinet:    [25, 27, 29, 28, 24, 28, 28, 28, 30, 27, 25, 25, 215, 207, 247],
  cisco:       [14, 17, 20, 16, 17, 13, 14, 16, 20, 18, 12, 15, 12, 10, 14],
  hpe:         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  paloalto:    [10, 18, 15, 15, 13, 18, 18, 19, 21, 18, 18, 17, 16, 17, 17],
  checkpoint:  [1, 0, 0, 0, 0, 0, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  crowdstrike: [null, null, null, null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  catonetworks:[null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  sentinelone: [null, null, null, null, null, 1, 3, 3, 2, 1, 3, 1, 0, 2, 2],
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 1, 1],
  dragos:      [null, null, null, null, null, null, null, null, null, null, null, null,  97,  99,  97], // Data starts Jul 2026
  ibm:         [null, null, null, null, null, null, null, null, null, null, null, null, 239, 234, 128], // Data starts Jul 2026
};

const AIO_DATA_INITIAL = {
  fortinet:    [19, 22, 17, 18, 13, 15, 16, 14, 20, 18, 18, 15, 175, 169, 192],
  cisco:       [20, 21, 16, 14, 11, 12, 15, 14, 17, 15, 11, 10, 8, 7, 10],
  hpe:         [null, null, null, null, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  paloalto:    [18, 22, 15, 13, 9, 13, 16, 14, 16, 14, 13, 11, 9, 10, 12],
  checkpoint:  [15, 15, 6, 2, 6, 7, 9, 6, 6, 2, 1, 1, 1, 0, 1],
  crowdstrike: [null, null, null, null, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  catonetworks:[null, null, null, null, null, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  sentinelone: [null, null, null, null, null, 7, 8, 6, 4, 3, 4, 3, 2, 3, 1],
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 1, 1],
  dragos:      [null, null, null, null, null, null, null, null, null, null, null, null, 65, 72, 79], // Data starts Jul 2026
  ibm:         [null, null, null, null, null, null, null, null, null, null, null, null, 195, 190, 105], // Data starts Jul 2026
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
    { keyword: "OT security", sv: 2400, kd: 24, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "operational technology", sv: 1800, kd: 24, fortinet: 1, cisco: 1, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "ot technology", sv: 400, kd: 13, fortinet: 1, cisco: 1, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "what is ot security", sv: 600, kd: 11, fortinet: 2, cisco: 1, paloalto: 8, checkpoint: 31, crowdstrike: null },
    { keyword: "ot components", sv: 10, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "ot best practices", sv: null, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "ot challenges", sv: null, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "ot vs it", sv: 1100, kd: 6, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
  ],
  mofu: [
    { keyword: "ot devices", sv: 300, kd: 9, fortinet: null, cisco: null, paloalto: 2, checkpoint: null, crowdstrike: null },
    { keyword: "ot systems", sv: 500, kd: 28, fortinet: 1, cisco: 1, paloalto: 7, checkpoint: null, crowdstrike: null },
    { keyword: "ot platform", sv: 90, kd: 44, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
  ],
  bofu: [
    { keyword: "ot security solutions", sv: 250, kd: 9, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "operational technology solutions", sv: 80, kd: 31, fortinet: null, cisco: 11, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "ot security companies", sv: 80, kd: 31, fortinet: 1, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "ot security vendors", sv: 150, kd: 5, fortinet: 1, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "industrial cybersecurity", sv: 1700, kd: 34, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
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

export function SlideOTSecurity({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(['fortinet', 'cisco', 'checkpoint', 'dragos', 'ibm'])
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
    OT_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.keywords[vendor.id]) {
        dataPoint[vendor.id] = editableData.keywords[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const cumulativeTrafficChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    OT_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.traffic[vendor.id]) {
        dataPoint[vendor.id] = editableData.traffic[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const getTrafficYMax = () => {
    let max = 0;
    cumulativeTrafficChartData.forEach((point) => {
      OT_VENDORS.forEach((vendor) => {
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
    OT_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.pageOne[vendor.id]) {
        dataPoint[vendor.id] = editableData.pageOne[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const aioChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    OT_VENDORS.forEach((vendor) => {
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
              content="Keywords fell 40 → 26 (−35.0%) from Jul 2025 to Jun 2026, then the Jul 2026 data refresh lifted the count to 218; Sep 2026 is 254, leading IBM 133 and Dragos 101."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco declined 40 → 15 (−62.5%) and Check Point 25 → 1 (−96.0%); IBM declined 256 → 133 (−48.0%) since Jul 2026."
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
              content="Page 1 keywords were 25 in Jul 2025 and again in Jun 2026, then jumped after the Jul 2026 data refresh; Sep 2026 is 247, leading IBM 128, Dragos 97 and Cisco 14."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco held steady 14 → 14 (0.0%); since Jul 2026 IBM declined 239 → 128 (−46.4%) and Dragos held 97 → 97."
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
              content="Traffic grew 566 → 839 (+48.2%) from Jul 2025 to Jun 2026, then rose to 2,913 in Jul 2026 and 4,935 in Sep 2026, leading IBM 1,637 and Dragos 1,152."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco declined 295 → 277 (−6.1%); since Jul 2026 IBM declined 2,103 → 1,637 (−22.2%) and Dragos 1,218 → 1,152 (−5.4%)."
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
              content="AIO fell 19 → 15 (−21.1%) from Jul 2025 to Jun 2026, then the Jul 2026 data refresh lifted it to 175; Sep 2026 is 192, leading IBM 105, Dragos 79 and Cisco 10."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco declined 20 → 10 (−50.0%) and Check Point 15 → 1 (−93.3%); since Jul 2026 IBM declined 195 → 105 (−46.2%) while Dragos grew 65 → 79 (+21.5%)."
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
              content="Ranks #1 for 'OT security' (SV 2.4K), 'operational technology', 'ot technology', 'ot vs it' (SV 1.1K), 'ot systems' and all three tracked BOFU vendor terms (solutions, companies, vendors) — dominant OT coverage."
            />
            <InsightCard
              icon={Target}
              type="warning"
              title="Competitions"
              content="'industrial cybersecurity' (SV 1.7K) has no ranking vendor — an open opportunity; Cisco leads 'what is ot security' (Fortinet #2) and holds #11 for 'operational technology solutions' where Fortinet is unranked."
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
    const rankings = OT_VENDORS.map(vendor => ({
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
    const visibleVendorsList = OT_VENDORS.filter(v => visibleVendors.has(v.id));

    return (
      <ResponsiveContainer key={`${activeTab}-${Array.from(visibleVendors).sort().join('-')}`} width="100%" height="100%">
        <LineChart data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
          <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis {...(activeTab === 'traffic' ? { domain: [0, trafficYMax] } : {})} {...CHART_CONFIG.yAxis} />
          <Tooltip content={<CustomTooltip />} />
          {visibleVendorsList.map((vendor) => (
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
    <SlideContainer slideNumber={21} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader
        title="OT Security"
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
                      competitors={OT_VENDORS}
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
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit OT Security Metrics Data (Jul 2025 – Sep 2026)</h3>
            <div className="space-y-6">
              {OT_VENDORS.map((vendor) => (
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