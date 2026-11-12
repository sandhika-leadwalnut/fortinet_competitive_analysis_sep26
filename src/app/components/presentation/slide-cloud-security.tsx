import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Shield, TrendingUp, TrendingDown, Zap, Sparkles, Trophy, Target } from 'lucide-react';
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
  { id: 'ibm',          name: 'IBM',           color: '#0EA5E9' },
  { id: 'orca',         name: 'Orca Security', color: '#F97316' },
];

// Data: Aug 2025 to Oct 2026 (15 months)
const TOTAL_KEYWORDS_DATA_INITIAL = {
  fortinet:    [538, 259, 231, 259, 299, 305, 305, 283, 246, 234, 247, 247, 238, 228, 202],
  cisco:       [471, 177, 127, 137, 165, 165, 167, 163, 82, 76, 65, 59, 62, 67, 53],
  hpe:         [64, 22, 19, 20, 19, 20, 26, 25, 19, 26, 22, 21, 26, 24, 24],
  paloalto:    [502, 265, 203, 219, 254, 275, 277, 263, 195, 188, 205, 182, 185, 162, 149],
  checkpoint:  [552, 293, 237, 223, 215, 221, 221, 201, 140, 130, 138, 129, 125, 115, 111],
  crowdstrike: [null, null, null, 303, 323, 323, 317, 307, 243, 218, 251, 223, 192, 150, 128],
  catonetworks:[null, null, null, null, 41, 41, 49, 44, 18, 14, 21, 16, 17, 10, 7],
  sentinelone: [null, null, null, null, 376, 376, 370, 392, 387, 373, 403, 398, 376, 319, 298],
  wiz:         [null, null, null, null, null, null, null, 334, 256, 241, 242, 223, 219, 198, 178],
  ibm:         [null, null, null, null, null, null, null, null, null, null, null, 142, 149, 124, 128], // Data starts Jul 2026
  orca:        [null, null, null, null, null, null, null, null, null, null, null, 297, 311, 254, 217], // Data starts Jul 2026
};

const CUMULATIVE_TRAFFIC_DATA_INITIAL = {
  fortinet:    [13433, 25775, 13737, 144268, 48266, 48183, 138334, 58925, 111518, 6991, 7202, 4532, 3608, 3137, 2750],
  cisco:       [633, 450, 1008, 633, 734, 847, 1550, 24224, 1421, 908, 1573, 1565, 2272, 831, 761],
  hpe:         [267, 279, 380, 458, 840, 407, 947, 1102, 1267, 1234, 1401, 1521, 988, 308, 491],
  paloalto:    [118654, 90426, 29305, 178295, 171256, 213474, 71718, 4870, 5008, 138059, 136921, 3627, 2933, 2793, 2331],
  checkpoint:  [367241, 224793, 74645, 5634, 5246, 3458, 24300, 2231, 1877, 37673, 36170, 1358, 1070, 1764, 2295],
  crowdstrike: [null, null, null, 62044, 114510, 176384, 19111, 10645, 8890, 8200, 5834, 4496, 3135, 2684, 2600],
  catonetworks:[null, null, null, null, 34, 33, 59, 103, 100, 103, 178, 117, 128, 164, 50],
  sentinelone: [null, null, null, null, 25634, 15386, 226115, 17605, 18824, 71662, 71161, 15101, 9839, 7809, 8744],
  wiz:         [null, null, null, null, null, null, null, 16086, 13163, 8524, 8436, 5769, 4473, 4115, 3727],
  ibm:         [null, null, null, null, null, null, null, null, null, null, null, 2286, 3366, 3558, 5011], // Data starts Jul 2026
  orca:        [null, null, null, null, null, null, null, null, null, null, null, 8933, 5253, 5180, 4408], // Data starts Jul 2026
};

const PAGE_ONE_KEYWORDS_DATA_INITIAL = {
  fortinet:    [109, 142, 163, 179, 199, 201, 206, 211, 202, 196, 220, 232, 210, 207, 199],
  cisco:       [58, 47, 57, 48, 49, 43, 47, 64, 46, 46, 36, 43, 53, 56, 52],
  hpe:         [11, 11, 11, 14, 9, 9, 10, 14, 14, 18, 18, 21, 20, 22, 23],
  paloalto:    [143, 150, 149, 149, 164, 171, 174, 185, 168, 167, 185, 165, 161, 143, 145],
  checkpoint:  [179, 177, 175, 142, 91, 98, 87, 87, 86, 90, 90, 98, 99, 101, 107],
  crowdstrike: [null, null, null, 249, 234, 230, 223, 210, 198, 177, 220, 194, 163, 120, 125],
  catonetworks:[null, null, null, null, 7, 7, 10, 10, 11, 10, 15, 14, 15, 10, 7],
  sentinelone: [null, null, null, null, 320, 317, 318, 350, 364, 354, 385, 379, 357, 301, 289],
  wiz:         [null, null, null, null, null, null, null, 272, 220, 205, 227, 215, 204, 184, 171],
  ibm:         [null, null, null, null, null, null, null, null, null, null, null, 122, 125, 114, 128], // Data starts Jul 2026
  orca:        [null, null, null, null, null, null, null, null, null, null, null, 286, 297, 241, 214], // Data starts Jul 2026
};

const AIO_DATA_INITIAL = {
  fortinet:    [181, 91, 104, 143, 187, 187, 190, 192, 138, 154, 153, 149, 134, 111, 102],
  cisco:       [142, 51, 48, 95, 123, 121, 122, 127, 49, 52, 47, 42, 34, 34, 30],
  hpe:         [14, 10, 7, 15, 17, 18, 23, 20, 10, 21, 15, 14, 16, 10, 11],
  paloalto:    [164, 89, 77, 115, 145, 159, 165, 173, 97, 107, 110, 94, 98, 71, 74],
  checkpoint:  [181, 116, 118, 138, 155, 155, 156, 152, 93, 91, 101, 91, 77, 64, 73],
  crowdstrike: [null, null, null, 149, 189, 191, 191, 200, 129, 149, 158, 130, 109, 76, 65],
  catonetworks:[null, null, null, null, 38, 38, 42, 36, 13, 14, 19, 12, 10, 5, 5],
  sentinelone: [null, null, null, null, 210, 207, 203, 236, 202, 235, 240, 233, 203, 154, 170],
  wiz:         [null, null, null, null, null, null, null, 203, 139, 149, 151, 130, 118, 104, 102],
  ibm:         [null, null, null, null, null, null, null, null, null, null, null, 100, 103, 76, 85], // Data starts Jul 2026
  orca:        [null, null, null, null, null, null, null, null, null, null, null, 175, 179, 150, 154], // Data starts Jul 2026
};

const MONTHS = ['2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];

// Format function for month display
const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]}-${year.slice(2)}`;
};

type TabType = 'keywords' | 'page-one' | 'traffic' | 'aio' | 'keyword-gap';

const KEYWORD_GAP_DATA = {
  tofu: [
    { keyword: "cloud security", sv: 23000, kd: 52, fortinet: null, cisco: null, paloalto: null, checkpoint: 1, crowdstrike: null },
    { keyword: "what is cloud security", sv: 2400, kd: 39, fortinet: null, cisco: null, paloalto: 1, checkpoint: 1, crowdstrike: null },
    { keyword: "cloud security posture management", sv: 4100, kd: 26, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "cloud security architecture", sv: 1700, kd: 3, fortinet: 9, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "cloud security challenges", sv: 700, kd: 22, fortinet: null, cisco: null, paloalto: 1, checkpoint: 10, crowdstrike: 2 },
    { keyword: "cloud security best practices", sv: 3700, kd: 22, fortinet: null, cisco: null, paloalto: 6, checkpoint: null, crowdstrike: null },
  ],
  mofu: [
    { keyword: "cloud security software", sv: 1000, kd: 12, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "cloud security comparison", sv: null, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "enterprise cloud security", sv: 1800, kd: 9, fortinet: 1, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "cloud security for small business", sv: 200, kd: 0, fortinet: 1, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
  ],
  bofu: [
    { keyword: "cloud security solutions", sv: 6100, kd: 34, fortinet: 1, cisco: 1, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "cloud security services", sv: 8800, kd: 38, fortinet: null, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "cloud security company", sv: 700, kd: 45, fortinet: 1, cisco: null, paloalto: null, checkpoint: null, crowdstrike: 1 },
    { keyword: "cloud security providers", sv: 800, kd: 10, fortinet: 10, cisco: null, paloalto: null, checkpoint: 5, crowdstrike: 11 },
    { keyword: "cloud security vendors", sv: 500, kd: 22, fortinet: 1, cisco: null, paloalto: null, checkpoint: null, crowdstrike: 1 },
    { keyword: "cnapp solutions", sv: 300, kd: 11, fortinet: null, cisco: null, paloalto: 8, checkpoint: null, crowdstrike: null },
    { keyword: "cnapp provider", sv: null, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
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

export function SlideCloudSecurity({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(['fortinet', 'cisco', 'checkpoint', 'ibm', 'orca'])
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
              icon={TrendingDown}
              type="error"
              title="Fortinet"
              content="From Aug 2025 to Oct 2026, keywords declined 538 → 202 (−62.5%), trailing SentinelOne 298 and Orca 217; Oct MoM −11.4% (228 → 202)."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Aug 2025 to Oct 2026, Check Point declined 552 → 111 (−79.9%), Cisco declined 471 → 53 (−88.7%), IBM declined 142 → 128 (−9.9%) since Jul 2026, Orca declined 297 → 217 (−26.9%) since Jul 2026; Oct MoM: Check Point −3.5%, Cisco −20.9%, IBM +3.2%, Orca −14.6%."
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
              content="From Aug 2025 to Oct 2026, page-1 keywords grew 109 → 199 (+82.6%), trailing SentinelOne 289 and Orca 214; Oct MoM −3.9% (207 → 199)."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Aug 2025 to Oct 2026, Check Point declined 179 → 107 (−40.2%), Cisco declined 58 → 52 (−10.3%), IBM grew 122 → 128 (+4.9%) since Jul 2026, Orca declined 286 → 214 (−25.2%) since Jul 2026; Oct MoM: Check Point +5.9%, Cisco −7.1%, IBM +12.3%, Orca −11.2%."
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
              content="From Aug 2025 to Oct 2026, traffic declined 13,433 → 2,750 (−79.5%), trailing SentinelOne 8,744 and IBM 5,011; Oct MoM −12.3% (3,137 → 2,750)."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Aug 2025 to Oct 2026, Check Point declined 367,241 → 2,295 (−99.4%), Cisco grew 633 → 761 (+20.2%), IBM grew 2,286 → 5,011 (+119.2%) since Jul 2026, Orca declined 8,933 → 4,408 (−50.7%) since Jul 2026; Oct MoM: Check Point +30.1%, Cisco −8.4%, IBM +40.8%, Orca −14.9%."
            />
          </InsightsSection>
        );
      case 'aio':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Fortinet"
              content="From Aug 2025 to Oct 2026, AIO keywords declined 181 → 102 (−43.6%), trailing SentinelOne 170 and Orca 154; Oct MoM −8.1% (111 → 102)."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Aug 2025 to Oct 2026, Check Point declined 181 → 73 (−59.7%), Cisco declined 142 → 30 (−78.9%), IBM declined 100 → 85 (−15.0%) since Jul 2026, Orca declined 175 → 154 (−12.0%) since Jul 2026; Oct MoM: Check Point +14.1%, Cisco −11.8%, IBM +11.8%, Orca +2.7%."
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
              content="Fortinet ranks #1 for 'enterprise cloud security', the small-business term, 'cloud security solutions', 'cloud security company' and 'cloud security vendors'."
            />
            <InsightCard
              icon={Target}
              type="warning"
              title="Competitions"
              content="Fortinet is absent for the 23K head term, 'cloud security services' (SV 8.8K), CSPM (4.1K), best practices (3.7K) and software (1K). The #10 providers ranking is the clearest BOFU quick win."
            />
          </InsightsSection>
        );
      default:
        return null;
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 14; // Oct 2026
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
        <LineChart id={`cloud-line-${activeTab}`} data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid id={`cloud-grid-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
          <XAxis id={`cloud-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis id={`cloud-yaxis-${activeTab}`} {...(activeTab === 'traffic' ? { domain: [0, trafficYMax], tickFormatter: formatChartAxisNumber } : {})} {...CHART_CONFIG.yAxis} />
          <Tooltip id={`cloud-tooltip-${activeTab}`} content={<CustomTooltip />} />
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
    <SlideContainer slideNumber={24} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader 
        title="Cloud Security" 
        subtitle="(Aug 2025 – Oct 2026)"
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
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit Cloud Security Metrics Data (Jul 2025 - Oct 2026)</h3>
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
