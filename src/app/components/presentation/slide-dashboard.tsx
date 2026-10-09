import { TrendingUp, TrendingDown, BarChart3, Zap, Sparkles, Trophy, Target } from 'lucide-react';
import { useState } from 'react';
import { formatChartAxisNumber } from '@/app/utils/format';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  ChartContainer,
  InsightCard,
  InsightsSection,
  CompetitorFilter,
  EditButton,
  CHART_CONFIG,
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// SD-WAN Dashboard vendors with design system colors
const SDWAN_VENDORS = [
  { id: 'fortinet',     name: 'Fortinet',      color: '#EF4444' },
  { id: 'cisco',        name: 'Cisco',         color: '#FF7AB6' },
  { id: 'hpe',          name: 'HPE',           color: '#7ED957' },
  { id: 'paloalto',     name: 'Palo Alto',     color: '#FFB14A' },
  { id: 'checkpoint',   name: 'Check Point',   color: '#6C9AFF' },
  { id: 'crowdstrike',  name: 'CrowdStrike',   color: '#1F2937' },
  { id: 'catonetworks', name: 'Cato Networks', color: '#A78BFA' },
  { id: 'sentinelone',  name: 'SentinelOne',   color: '#34D399' },
  { id: 'wiz',          name: 'Wiz',           color: '#06B6D4' },
  { id: 'zscaler',      name: 'Zscaler',       color: '#A855F7' },
];

// SASE full data - Jul 2025 to Sep 2026 (15 months)
const TOTAL_KEYWORDS_DATA_INITIAL = {
  fortinet:    [184, 202, 186, 175, 181, 189, 196, 193, 193, 183, 188, 184, 229, 226, 232],
  cisco:       [180, 185, 154, 129, 144, 154, 160, 164, 166, 142, 128, 118, 112, 116, 104],
  hpe:         [ 98,  83,  37,  33,  45,  65,  70,  65,  52,  18,  23,  28,  24,  29,  25],
  paloalto:    [187, 202, 189, 179, 182, 195, 200, 200, 196, 198, 199, 201, 249, 245, 234],
  checkpoint:  [150, 170, 101,  65,  99, 114, 114, 105, 102,  61,  62,  64,  60,  63,  66],
  crowdstrike: [0, 0, 0, 0, 35, 44, 48, 40, 40,  27,  24,  32,  33,  15, 13],
  catonetworks:[0, 0, 0, 0, 0, 205, 207, 171, 136, 130, 126, 138, 162, 156, 144],
  sentinelone: [0, 0, 0, 0, 0, 51, 53, 49, 47,  20,  18,  21,  15,  13, 17],
  wiz:         [null, null, null, null, null, null, null, null, 9, 0, 0, 0, 0, 0, 0],
  zscaler:     [null, null, null, null, null, null, null, null, null, null, null, null, 154, 149, 153], // Data starts Jul 2026
};

const CUMULATIVE_TRAFFIC_DATA_INITIAL = {
  fortinet:    [13499, 15964, 9684, 11031, 8746, 10024, 10015, 10369, 6899, 8455, 12229, 11145, 8013, 8354, 6800],
  cisco:       [ 1713,  2353, 1932,  1921, 2090,  1976,  2109,  3539, 2249, 2212,  2084,  1379,  1387, 1004, 1134],
  hpe:         [  125,    80,  181,   227,  107,   137,   118,   189,  141,   88,    74,    62,   343,  137,  324],
  paloalto:    [ 7562,  8242, 8130,  8998, 9442, 10263, 10660, 10161, 10645, 8979,  7260,  7696,  6621, 6889, 5024],
  checkpoint:  [  671,   849,  780,   818, 1270,  1368,  1372,  1472, 1118, 1024,  1076,  1034,   857,  861, 1146],
  crowdstrike: [0, 0, 0, 0, 325, 423, 436, 472, 469, 487, 441, 420, 381, 275, 218],
  catonetworks:[0, 0, 0, 0, 0, 2456, 2410, 2352, 2056, 1803, 1822, 2486, 2057, 2531, 1702],
  sentinelone: [0, 0, 0, 0, 0, 43, 38, 53, 66,  68,  57,  44,  63,  64, 126],
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0],
  zscaler:     [null, null, null, null, null, null, null, null, null, null, null, null, 1521, 1699, 1449], // Data starts Jul 2026
};

const PAGE_ONE_KEYWORDS_DATA_INITIAL = {
  fortinet:    [148, 161, 169, 165, 167, 179, 188, 179, 184, 178, 183, 179, 226, 226, 230],
  cisco:       [102, 107, 120, 114, 128, 128, 131, 124, 136, 132, 112, 102, 106, 106, 95],
  hpe:         [  5,   9,   7,  14,  13,  16,  15,  12,   9,  11,  11,  16,  19,  21,  20],
  paloalto:    [157, 160, 173, 173, 174, 182, 188, 190, 188, 197, 194, 198, 248, 241, 231],
  checkpoint:  [ 13,  28,  32,  37,  54,  57,  52,  46,  47,  42,  42,  47,  48,  48,  49],
  crowdstrike: [0, 0, 0, 0, 17, 15, 13, 14, 19,  16,  19,  29,  31,  14, 11],
  catonetworks:[0, 0, 0, 0, 0, 186, 185, 147, 124, 117, 114, 133, 158, 150, 141],
  sentinelone: [0, 0, 0, 0, 0, 11, 11, 7, 10,   7,   2,   9,  10,   8, 11],
  wiz:         [null, null, null, null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0],
  zscaler:     [null, null, null, null, null, null, null, null, null, null, null, null, 146, 142, 148], // Data starts Jul 2026
};

const AIO_DATA_INITIAL = {
  fortinet:    [148, 161, 169, 165, 167, 179, 188, 179, 136, 133, 136, 129, 150, 142, 155],
  cisco:       [102, 107, 120, 114, 128, 128, 131, 124, 120, 100, 100,  87,  82,  81, 73],
  hpe:         [  5,   9,   7,  14,  13,  16,  15,  12,  43,  15,  20,  24,  20,  19,  18],
  paloalto:    [157, 160, 173, 173, 174, 182, 188, 190, 135, 137, 144, 132, 156, 153, 156],
  checkpoint:  [ 13,  28,  32,  37,  54,  57,  52,  46,  78,  48,  52,  51,  41,  48,  49],
  crowdstrike: [0, 0, 0, 0, 17, 15, 13, 14, 32,  24,  23,  30,  31,  15, 13],
  catonetworks:[0, 0, 0, 0, 0, 186, 185, 147, 95,  89,  96,  93,  98,  94,  95],
  sentinelone: [0, 0, 0, 0, 0, 11, 11, 7, 40,  18,  18,  20,  13,  11, 15],
  wiz:         [null, null, null, null, null, null, null, null, 5, 0, 0, 0, 0, 0, 0],
  zscaler:     [null, null, null, null, null, null, null, null, null, null, null, null, 115, 105, 109], // Data starts Jul 2026
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
    { keyword: "sase", sv: 19000, kd: 58, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: 1, crowdstrike: null },
    { keyword: "sase meaning", sv: 4900, kd: 51, fortinet: 2, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "what is sase", sv: 2600, kd: 54, fortinet: 1, cisco: null, paloalto: null, checkpoint: 20, crowdstrike: null },
    { keyword: "secure access service edge", sv: 2000, kd: 55, fortinet: 1, cisco: 8, paloalto: 1, checkpoint: 11, crowdstrike: 18 },
    { keyword: "sase definition", sv: 700, kd: 57, fortinet: 1, cisco: 7, paloalto: 2, checkpoint: 9, crowdstrike: null },
    { keyword: "sase benefits", sv: 600, kd: 2, fortinet: 1, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "sase architecture", sv: 800, kd: 48, fortinet: 1, cisco: null, paloalto: 1, checkpoint: 5, crowdstrike: null },
    { keyword: "sase technology", sv: 250, kd: 60, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
  ],
  mofu: [
    { keyword: "sase security", sv: 1600, kd: 42, fortinet: 1, cisco: 9, paloalto: 1, checkpoint: 16, crowdstrike: null },
    { keyword: "sase platform", sv: 600, kd: 54, fortinet: 1, cisco: 24, paloalto: 1, checkpoint: 16, crowdstrike: null },
    { keyword: "sase network", sv: 300, kd: 53, fortinet: 1, cisco: 10, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "sase products", sv: 200, kd: 37, fortinet: 1, cisco: 6, paloalto: 1, checkpoint: 4, crowdstrike: null },
    { keyword: "sase network security", sv: 150, kd: 57, fortinet: 1, cisco: 7, paloalto: 3, checkpoint: null, crowdstrike: null },
  ],
  bofu: [
    { keyword: "sase solutions", sv: 1600, kd: 55, fortinet: 1, cisco: 11, paloalto: 1, checkpoint: 13, crowdstrike: null },
    { keyword: "sase services", sv: 250, kd: 57, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "secure access service edge vendors", sv: 150, kd: 56, fortinet: 1, cisco: null, paloalto: 4, checkpoint: null, crowdstrike: null },
    { keyword: "sase vendor", sv: 200, kd: 0, fortinet: 8, cisco: null, paloalto: 6, checkpoint: 9, crowdstrike: null },
    { keyword: "sase providers", sv: 450, kd: 1, fortinet: 1, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
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

export function SlideDashboard({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(['fortinet', 'hpe', 'paloalto', 'checkpoint', 'catonetworks', 'zscaler'])
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
    SDWAN_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.keywords[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const cumulativeTrafficChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    SDWAN_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.traffic[vendor.id]) {
        dataPoint[vendor.id] = editableData.traffic[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const getTrafficYMax = () => {
    let max = 0;
    cumulativeTrafficChartData.forEach((point) => {
      SDWAN_VENDORS.forEach((vendor) => {
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
    SDWAN_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.pageOne[vendor.id]) {
        dataPoint[vendor.id] = editableData.pageOne[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const aioChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    SDWAN_VENDORS.forEach((vendor) => {
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
              content="From Jul 2025 to Sep 2026, keywords grew 184 → 232 (+26.1%), just behind Palo Alto 234."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco declined 180 → 104 (−42.2%), Palo Alto grew 187 → 234 (+25.1%)."
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
              content="From Jul 2025 to Sep 2026, page-1 keywords grew 148 → 230 (+55.4%), essentially level with Palo Alto 231."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Palo Alto grew 157 → 231 (+47.1%), edging Fortinet 230."
            />
          </InsightsSection>
        );
      case 'traffic':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Fortinet"
              content="From Jul 2025 to Sep 2026, traffic declined 13,499 → 6,800 (−49.6%), still leading Palo Alto 5,024."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Palo Alto declined 7,562 → 5,024 (−33.6%), Cisco declined 1,713 → 1,134 (−33.8%)."
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
              content="From Jul 2025 to Sep 2026, AIO grew 148 → 155 (+4.7%), just behind Palo Alto 156."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco declined 102 → 73 (−28.4%), Palo Alto declined 157 → 156 (−0.6%)."
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
              content="Ranks #1 for 7 of 8 TOFU terms, all 5 MOFU terms and 'sase solutions', 'sase services', 'secure access service edge vendors', 'sase providers' — dominant SASE funnel coverage."
            />
            <InsightCard
              icon={Target}
              type="warning"
              title="Competitions"
              content="Palo Alto matches Fortinet at #1 on 'sase', 'sase platform', 'sase solutions' and leads 'sase vendor' (#6 vs Fortinet #8, SV 200); Check Point is a growing challenger at #4–#5 for 'sase products' and 'sase architecture'."
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
    const rankings = SDWAN_VENDORS.map(vendor => ({
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
    const visibleVendorsList = SDWAN_VENDORS.filter(v => visibleVendors.has(v.id));

    return (
      <ResponsiveContainer key={`${activeTab}-${Array.from(visibleVendors).sort().join('-')}`} width="100%" height="100%">
        <LineChart id={`dashboard-line-${activeTab}`} data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid id={`dashboard-grid-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
          <XAxis id={`dashboard-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis id={`dashboard-yaxis-${activeTab}`} {...(activeTab === 'traffic' ? { domain: [0, trafficYMax], tickFormatter: formatChartAxisNumber } : {})} {...CHART_CONFIG.yAxis} />
          <Tooltip id={`dashboard-tooltip-${activeTab}`} content={<CustomTooltip />} />
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
    <SlideContainer slideNumber={22} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader
        title="SASE"
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
                      competitors={SDWAN_VENDORS}
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
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit SASE Metrics Data (Jul 2025 - May 2026)</h3>
            <div className="space-y-6">
              {SDWAN_VENDORS.map((vendor) => (
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