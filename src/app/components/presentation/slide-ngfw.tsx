import { useState } from 'react';
import { TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  ChartContainer,
  InsightCard,
  InsightsSection,
  EditButton,
  CompetitorFilter,
  CustomChartTooltip,
  CHART_CONFIG,
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NGFW_COMPETITORS = [
  { id: 'fortinet',     name: 'Fortinet',      color: '#EF4444' },
  { id: 'cisco',        name: 'Cisco',         color: '#FF7AB6' },
  { id: 'hpe',          name: 'HPE',           color: '#7ED957' },
  { id: 'paloalto',     name: 'Palo Alto',     color: '#FFB14A' },
  { id: 'checkpoint',   name: 'Check Point',   color: '#6C9AFF' },
  { id: 'crowdstrike',  name: 'CrowdStrike',   color: '#1F2937' },
  { id: 'catonetworks', name: 'Cato Networks', color: '#8B5CF6' },
  { id: 'sentinelone',  name: 'SentinelOne',   color: '#10B981' },
  { id: 'wiz',          name: 'Wiz',           color: '#06B6D4' },
  { id: 'forcepoint',   name: 'Forcepoint',    color: '#F97316' },
  { id: 'zscaler',      name: 'Zscaler',       color: '#A855F7' },
];

const MONTHS = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];

// Format month for display
const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(monthNum) - 1]}-${year.slice(2)}`;
};

const TOTAL_KEYWORDS_ABS = {
  fortinet:    [1240, 1421, 995, 896, 944, 981, 998, 999,  908, 903, 896, 900, 1522, 1458, 1369],
  cisco:       [1132, 1177, 756, 665, 700, 742, 755, 825,  689, 654, 659, 660, 1145, 1151, 1128],
  hpe:         [ 170,  174,  87,  85, 103, 102, 109, 109,  111,  72,  82,  80,   72,   68,   52],
  paloalto:    [1129, 1224, 848, 727, 756, 860, 909, 917,  868, 809, 854, 812, 1406, 1331, 1239],
  checkpoint:  [1115, 1198, 708, 564, 560, 562, 562, 567,  553, 516, 537, 530,  816,  767,  767],
  crowdstrike: [null, null, null, null,  63,  74,  80,  89,   76,  61,  50,  53,   44,   44,   39], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null,  89,  99,  86,   77,  38,  37,  36,   28,   23,   22], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null,  25,  32,  34,   31,  17,  10,  20,   22,   17,   11], // Data starts Dec 2025
  wiz:         [null, null, null, null, null, null, null, null, 14,   0,   0,   0,    1,    0,    0], // Data starts Mar 2026
  forcepoint:  [null, null, null, null, null, null, null, null, null, null, null, null,   37,   45,   39], // Data starts Jul 2026
  zscaler:     [null, null, null, null, null, null, null, null, null, null, null, null,  104,   89,   90], // Data starts Jul 2026
};

const PAGE_ONE_KW_ABS = {
  fortinet:    [653, 762, 791, 788, 849, 862, 879, 859, 820, 864, 847, 871, 1494, 1429, 1336],
  cisco:       [494, 510, 535, 556, 584, 601, 604, 661, 562, 606, 615, 621, 1101, 1116, 1096],
  hpe:         [ 41,  41,  45,  51,  64,  55,  66,  63,  69,  53,  65,  68,   60,   56,   43],
  paloalto:    [517, 557, 611, 608, 634, 719, 760, 758, 761, 746, 791, 770, 1359, 1279, 1207],
  checkpoint:  [425, 430, 445, 413, 400, 371, 381, 361, 378, 439, 458, 470,  768,  712,  715],
  crowdstrike: [null, null, null, null,  38,  39,  36,  40,  35,  54,  45,  48,   41,   39,   35], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null,  22,  29,  21,  27,  22,  25,  28,   21,   17,   18], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null,   6,   7,   6,  12,  12,   8,  13,   15,    9,    8], // Data starts Dec 2025
  wiz:         [null, null, null, null, null, null, null, null, 0,   0,   0,   0,    1,    0,    0], // Data starts Mar 2026
  forcepoint:  [null, null, null, null, null, null, null, null, null, null, null, null,   29,   37,   37], // Data starts Jul 2026
  zscaler:     [null, null, null, null, null, null, null, null, null, null, null, null,   95,   79,   80], // Data starts Jul 2026
};

const CUMULATIVE_TRAFFIC_ABS = {
  fortinet:    [18947, 23092, 25392, 23104, 24692, 27746, 30861, 30105, 35029, 37349, 36987, 38088, 23118, 22921, 18403],
  cisco:       [16293, 15420, 16155, 15861, 15826, 24132, 29153, 30462, 36553, 42295, 42594, 39293, 17960, 18614, 15532],
  hpe:         [  256,   413,   384,   782,   836,   626,   687,   702,   645,   518,   709,   754,   542,   580,   512],
  paloalto:    [10265, 11043, 11770, 11946, 12637, 21611, 23649, 23938, 23938, 27038, 27275, 23299, 17443, 15363, 13224],
  checkpoint:  [ 5250,  6262,  5016,  4294,  5126,  4772,  4814,  5881,  4753,  8828,  5543,  7395,  4612,  4742,  4964],
  crowdstrike: [null, null, null, null,  407,  338,  317,  451,  296,   629,   507,   399,   412,   278,   323], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null,  270,  306,  351,  283,   214,   215,   214,   187,   158,   129], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null,   62,   60,   62,   64,    92,    47,    72,    60,    46,    36], // Data starts Dec 2025
  wiz:         [null, null, null, null, null, null, null, null,    0,     0,     0,     0,     5,     0,     0], // Data starts Mar 2026
  forcepoint:  [null, null, null, null, null, null, null, null, null,  null,  null,  null,   119,   171,   381], // Data starts Jul 2026
  zscaler:     [null, null, null, null, null, null, null, null, null,  null,  null,  null,   834,   985,   997], // Data starts Jul 2026
};

const AIO_DATA_ABS = {
  fortinet:    [538, 611, 474, 498, 588, 615, 637, 652, 660, 678, 692, 699, 1051, 957, 925],
  cisco:       [484, 530, 374, 389, 462, 490, 498, 534, 517, 498, 504, 524,  812, 776, 764],
  hpe:         [ 82,  98,  61,  55,  77,  77,  79,  87,  90,  56,  60,  63,   55,  51,  43],
  paloalto:    [497, 550, 420, 413, 496, 558, 587, 613, 629, 602, 643, 620,  940, 853, 814],
  checkpoint:  [500, 542, 359, 353, 389, 396, 384, 406, 430, 405, 431, 441,  606, 542, 555],
  crowdstrike: [null, null, null, null,  47,  47,  53,  61,  58,  45,  45,  48,   39,  35,  30], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null,  68,  74,  73,  65,  32,  34,  35,   25,  17,  17], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null,  18,  22,  27,  27,  13,   8,  18,   19,  14,   9], // Data starts Dec 2025
  wiz:         [null, null, null, null, null, null, null, null, 13,   0,   0,   0,    1,   0,   0], // Data starts Mar 2026
  forcepoint:  [null, null, null, null, null, null, null, null, null, null, null, null,   25,  26,  23], // Data starts Jul 2026
  zscaler:     [null, null, null, null, null, null, null, null, null, null, null, null,   69,  56,  58], // Data starts Jul 2026
};

type TabType = 'keywords' | 'page-one' | 'traffic' | 'aio' | 'keyword-gap';

const KEYWORD_GAP_DATA = {
  tofu: [
    { keyword: "firewall", sv: 33000, kd: 69, fortinet: 1, cisco: 1, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "what is firewall", sv: 2200, kd: 65, fortinet: 1, cisco: 1, paloalto: null, checkpoint: 12, crowdstrike: null },
    { keyword: "firewall definition", sv: 2900, kd: 51, fortinet: 1, cisco: 1, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "network firewall", sv: 8200, kd: 50, fortinet: null, cisco: 4, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "how does a firewall work", sv: 700, kd: 52, fortinet: 1, cisco: 9, paloalto: 1, checkpoint: 12, crowdstrike: null },
    { keyword: "types of firewall", sv: 400, kd: 29, fortinet: 2, cisco: 10, paloalto: 1, checkpoint: 1, crowdstrike: null },
    { keyword: "firewall benefits", sv: 40, kd: 2, fortinet: 1, cisco: 7, paloalto: 4, checkpoint: null, crowdstrike: null },
  ],
  mofu: [
    { keyword: "software firewalls", sv: 600, kd: 46, fortinet: 1, cisco: null, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "firewall comparison", sv: 70, kd: 14, fortinet: 9, cisco: null, paloalto: 2, checkpoint: null, crowdstrike: null },
    { keyword: "enterprise firewall", sv: 500, kd: 12, fortinet: 15, cisco: 22, paloalto: null, checkpoint: 11, crowdstrike: null },
    { keyword: "firewall devices", sv: 150, kd: 8, fortinet: 1, cisco: 7, paloalto: 1, checkpoint: null, crowdstrike: null },
    { keyword: "network firewall device", sv: 150, kd: 0, fortinet: 6, cisco: 11, paloalto: 10, checkpoint: null, crowdstrike: null },
  ],
  bofu: [
    { keyword: "firewall solutions", sv: 450, kd: 46, fortinet: 4, cisco: 3, paloalto: 10, checkpoint: null, crowdstrike: null },
    { keyword: "enterprise firewall solutions", sv: 200, kd: 42, fortinet: 6, cisco: null, paloalto: 1, checkpoint: 11, crowdstrike: null },
    { keyword: "best firewall solution", sv: null, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "leading firewall services", sv: null, kd: null, fortinet: null, cisco: null, paloalto: null, checkpoint: null, crowdstrike: null },
    { keyword: "firewall solutions for small business", sv: 100, kd: 1, fortinet: 3, cisco: 2, paloalto: null, checkpoint: null, crowdstrike: null },
  ],
};

interface SlideNGFWProps {
  onNavigateHome?: () => void;
}

export function SlideNGFW({ onNavigateHome }: SlideNGFWProps) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleCompetitors, setVisibleCompetitors] = useState<Set<string>>(
    new Set(['fortinet', 'cisco', 'paloalto', 'checkpoint', 'forcepoint', 'zscaler'])
  );

  const [editableData, setEditableData] = useState<{
    keywords: Record<string, number[]>;
    pageOne: Record<string, number[]>;
    traffic: Record<string, number[]>;
    aio: Record<string, number[]>;
  }>(() => ({
    keywords: JSON.parse(JSON.stringify(TOTAL_KEYWORDS_ABS)),
    pageOne: JSON.parse(JSON.stringify(PAGE_ONE_KW_ABS)),
    traffic: JSON.parse(JSON.stringify(CUMULATIVE_TRAFFIC_ABS)),
    aio: JSON.parse(JSON.stringify(AIO_DATA_ABS)),
  }));

  const [isEditing, setIsEditing] = useState(false);

  const toggleCompetitor = (competitorId: string) => {
    setVisibleCompetitors((prev) => {
      const newSet = new Set(prev);
      newSet.has(competitorId) ? newSet.delete(competitorId) : newSet.add(competitorId);
      return newSet;
    });
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);

  const handleCancel = () => {
    setEditableData({
      keywords: JSON.parse(JSON.stringify(TOTAL_KEYWORDS_ABS)),
      pageOne: JSON.parse(JSON.stringify(PAGE_ONE_KW_ABS)),
      traffic: JSON.parse(JSON.stringify(CUMULATIVE_TRAFFIC_ABS)),
      aio: JSON.parse(JSON.stringify(AIO_DATA_ABS)),
    });
    setIsEditing(false);
  };

  const handleValueChange = (
    dataset: 'keywords' | 'pageOne' | 'traffic' | 'aio',
    competitorId: string,
    index: number,
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setEditableData((prev) => ({
      ...prev,
      [dataset]: {
        ...prev[dataset],
        [competitorId]: prev[dataset][competitorId].map((v, i) => (i === index ? numValue : v)),
      },
    }));
  };

  // Prepare chart data
  const tro = getTimeRangeOffset(timeRange, MONTHS.length);
  const keywordsChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id) && editableData.keywords[comp.id]) {
        dataPoint[comp.id] = editableData.keywords[comp.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const trafficChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id) && editableData.traffic[comp.id]) {
        dataPoint[comp.id] = editableData.traffic[comp.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const pageOneChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id) && editableData.pageOne[comp.id]) {
        dataPoint[comp.id] = editableData.pageOne[comp.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const aioChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id) && editableData.aio[comp.id]) {
        dataPoint[comp.id] = editableData.aio[comp.id][i + tro] ?? null;
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
      case 'keywords': return keywordsChartData;
      case 'page-one': return pageOneChartData;
      case 'traffic': return trafficChartData;
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
              content="From Jul 2025 to Sep 2026, keywords grew 1,240 → 1,369 (+10.4%), leading Palo Alto 1,239 and Cisco 1,128; Jul-26 data refresh lifted the base."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco held flat 1,132 → 1,128 (−0.4%), Palo Alto grew 1,129 → 1,239 (+9.7%); both gains rest on the Jul-26 jump (Cisco 660 → 1,145, Palo Alto 812 → 1,406)."
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
              content="From Jul 2025 to Sep 2026, page-1 keywords grew 653 → 1,336 (+104.6%), leading Palo Alto 1,207 and Cisco 1,096; most of the gain came in the Jul-26 step (871 → 1,494), easing since."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco grew 494 → 1,096 (+121.9%), Palo Alto grew 517 → 1,207 (+133.5%), both stepping up in Jul-26 and easing since."
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
              content="From Jul 2025 to Sep 2026, traffic declined 18,947 → 18,403 (−2.9%), after falling from 38,088 in Jun-26 to 23,118 in Jul-26; leads Cisco 15,532 and Palo Alto 13,224 since Jul-26."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco declined 16,293 → 15,532 (−4.7%); it led Fortinet Feb–Jun 2026, Zscaler tracked at 997 since Jul."
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
              content="From Jul 2025 to Sep 2026, AIO keywords grew 538 → 925 (+71.9%), maintaining category lead over Palo Alto 814; Jul-26 step (699 → 1,051) has eased to 925."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Sep 2026, Cisco grew 484 → 764 (+57.9%), Palo Alto grew 497 → 814 (+63.8%)."
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
              content="Ranks #1 for 5 of 7 TOFU firewall keywords (firewall, what is firewall, definition, how it works, benefits) and #1 for 'software firewalls' and 'firewall devices' — strong foundational coverage."
            />
            <InsightCard
              icon={Target}
              type="warning"
              title="Competitions"
              content="Fortinet does not rank for 'network firewall' (SV 8.2K; Cisco #4) and sits at #15 for 'enterprise firewall'; Palo Alto leads BOFU with #1 for 'enterprise firewall solutions' (Fortinet #6) — biggest volume gaps to close."
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
    let metricName: string;
    let formatValue: (val: number) => string;

    switch (activeTab) {
      case 'keywords':
        dataSource = editableData.keywords;
        metricName = 'Keywords';
        formatValue = (val) => val.toLocaleString();
        break;
      case 'page-one':
        dataSource = editableData.pageOne;
        metricName = 'Page 1 Rankings';
        formatValue = (val) => val.toLocaleString();
        break;
      case 'traffic':
        dataSource = editableData.traffic;
        metricName = 'Traffic';
        formatValue = (val) => `${(val / 1000).toFixed(1)}K`;
        break;
      case 'aio':
        dataSource = editableData.aio;
        metricName = 'AIO Rankings';
        formatValue = (val) => val.toLocaleString();
        break;
      default:
        return null;
    }

    // Get latest values for all competitors
    const rankings = NGFW_COMPETITORS.map(comp => ({
      id: comp.id,
      name: comp.name,
      value: dataSource[comp.id]?.[latestIndex] ?? 0,
      color: comp.color,
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
    const visibleCompetitorsList = NGFW_COMPETITORS.filter(comp => visibleCompetitors.has(comp.id));

    return (
      <ResponsiveContainer key={`${activeTab}-${Array.from(visibleCompetitors).sort().join('-')}`} width="100%" height="100%">
        <LineChart data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid id={`ngfw-cartesian-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
          <XAxis id={`ngfw-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis id={`ngfw-yaxis-${activeTab}`} {...CHART_CONFIG.yAxis} />
          <Tooltip id={`ngfw-tooltip-${activeTab}`} content={(props) => <CustomChartTooltip {...props} />} />
          {visibleCompetitorsList.map((comp) => (
            <Line
              key={comp.id}
              id={`ngfw-line-${activeTab}-${comp.id}`}
              name={comp.name}
              type="monotone"
              dataKey={comp.id}
              stroke={comp.color}
              {...CHART_CONFIG.line}
              dot={{ fill: comp.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <SlideContainer slideNumber={19} onNavigateHome={onNavigateHome} source="Ahrefs">
      <SlideHeader
        title="NGFW / Firewall"
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
              {/* Keyword Gap Table - full width minus insight panel */}
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
              {/* Insights Section */}
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
                      competitors={NGFW_COMPETITORS}
                      visibleCompetitors={visibleCompetitors}
                      onToggle={toggleCompetitor}
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
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit NGFW Metrics Data</h3>
            <div className="space-y-6">
              {NGFW_COMPETITORS.map((comp) => (
                <div key={comp.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />
                    <h4 className="text-sm font-bold text-gray-900">{comp.name}</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Total Keywords:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.keywords[comp.id][idx]}
                            onChange={(e) => handleValueChange('keywords', comp.id, idx, e.target.value)}
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
                            value={editableData.pageOne[comp.id][idx]}
                            onChange={(e) => handleValueChange('pageOne', comp.id, idx, e.target.value)}
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
                            value={editableData.traffic[comp.id][idx]}
                            onChange={(e) => handleValueChange('traffic', comp.id, idx, e.target.value)}
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
                            value={editableData.aio[comp.id][idx]}
                            onChange={(e) => handleValueChange('aio', comp.id, idx, e.target.value)}
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