import { useState } from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Target, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  ChartContainer,
  CHART_CONFIG,
  COLORS,
  TEXT_STYLES,
  InsightCard,
  InsightsSection,
} from './design-system';

type CategoryType = 'sase' | 'otSecurity' | 'ztna' | 'cloudSecurity' | 'secOps' | 'firewall' | 'quantumSecurity' | 'aiCybersecurity';

// Helper function to format month for display
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

// Category performance data with insights — Nov 2025 → Sep 2026 (Source: Profound)
const categories = [
  {
    id: 'sase' as CategoryType,
    name: 'Secure Access Service Edge (SASE)',
    topPerformer: 'Palo Alto',        // chart renderer uses this to pick non-FT bar
    topPerformerColor: '#FFB14A',
    data: [
      { period: '2025-11', fortinet: 86.3, top: 92.6, paloAlto: 92.6 },
      { period: '2025-12', fortinet: 89.6, top: 94.7, paloAlto: 94.7 },
      { period: '2026-01', fortinet: 90.9, top: 95.3, paloAlto: 95.3 },
      { period: '2026-02', fortinet: 94.1, top: 94.1, paloAlto: 93.7 }, // FT overtakes PA
      { period: '2026-03', fortinet: 96.7, top: 96.7, paloAlto: 85.5 }, // FT extends lead
      { period: '2026-04', fortinet: 96.3, top: 96.9, paloAlto: 96.9 }, // PA reclaims top by 0.6pp
      { period: '2026-05', fortinet: 73.2, top: 73.2, paloAlto: 45.6 }, // FT reclaims top, both drop sharply
      { period: '2026-06', fortinet: 73.4, top: 73.4, paloAlto: 46.2 }, // FT leads, slight recovery
      { period: '2026-07', fortinet: 72.7, top: 72.7, paloAlto: 62.4 }, // FT holds, PA surges +16.2pp
      { period: '2026-08', fortinet: 71.9, top: 71.9, paloAlto: 65.4 }, // FT dips slightly, PA continues closing gap
      { period: '2026-09', fortinet: 71.1, top: 71.1, paloAlto: 63.2 }, // FT holds lead, PA dips slightly
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'Led SASE in Sep 2026 at 71.1% (−0.8pp); Palo Alto dipped to 63.2% (−2.2pp), gap widens slightly to 7.9pp.' },
    competitionInsight: { icon: TrendingDown, type: 'warning' as const, content: 'Palo Alto dipped from 65.4% (Aug) to 63.2% (Sep); Fortinet SASE lead widens to 7.9pp.' },
  },
  {
    id: 'otSecurity' as CategoryType,
    name: 'OT Security',
    topPerformer: 'Fortinet',
    topPerformerColor: '#EF4444',
    data: [
      { period: '2025-11', fortinet: 86.8, top: 86.8 },
      { period: '2025-12', fortinet: 90.3, top: 90.3 },
      { period: '2026-01', fortinet: 91.4, top: 91.4 },
      { period: '2026-02', fortinet: 92.4, top: 92.4 },
      { period: '2026-03', fortinet: 89.0, top: 89.0 },
      { period: '2026-04', fortinet: 92.1, top: 92.1 }, // rebounds close to Feb peak
      { period: '2026-05', fortinet: 45.5, top: 45.5, paloAlto: 25.4 }, // sharp drop, PA visible
      { period: '2026-06', fortinet: 41.8, top: 41.8, paloAlto: 26.5 }, // further decline, PA inches up
      { period: '2026-07', fortinet: 46.3, top: 46.3, paloAlto: 34.6 }, // FT recovers, PA surges
      { period: '2026-08', fortinet: 40.6, top: 40.6, paloAlto: 31.6 }, // FT dips, PA also dips
      { period: '2026-09', fortinet: 42.2, top: 42.2, paloAlto: 34.1 }, // both recover slightly
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'OT Security recovered to 42.2% in Sep 2026 (+1.6pp); Fortinet leads PA (34.1%) by 8.1pp.' },
    competitionInsight: { icon: TrendingUp, type: 'warning' as const, content: 'Palo Alto recovered from 31.6% (Aug) to 34.1% (Sep); both vendors rebounded — Fortinet lead narrows from 9.0pp to 8.1pp.' },
  },
  {
    id: 'ztna' as CategoryType,
    name: 'ZTNA',
    topPerformer: 'Palo Alto',
    topPerformerColor: '#FFB14A',
    data: [
      { period: '2025-11', fortinet: 67.4, top: 88.4 },
      { period: '2025-12', fortinet: 75.4, top: 93.9 },
      { period: '2026-01', fortinet: 74.1, top: 90.3 },
      { period: '2026-02', fortinet: 78.5, top: 91.3 },
      { period: '2026-03', fortinet: 87.9, top: 95.3 },
      { period: '2026-04', fortinet: 87.3, top: 92.6 }, // gap narrowed to 5.3pp
      { period: '2026-05', fortinet: 44.8, top: 44.8, paloAlto: 36.8 }, // FT overtakes, both drop
      { period: '2026-06', fortinet: 39.0, top: 40.5, paloAlto: 40.5 }, // PA reclaims top by 1.5pp
      { period: '2026-07', fortinet: 39.0, top: 50.3, paloAlto: 50.3 }, // PA surges, FT flat
      { period: '2026-08', fortinet: 33.5, top: 41.8, paloAlto: 41.8 }, // both decline, PA still leads
      { period: '2026-09', fortinet: 33.1, top: 44.1, paloAlto: 44.1 }, // FT flat, PA recovers
    ],
    fortinetInsight: { icon: AlertTriangle, type: 'error' as const, content: 'ZTNA held at 33.1% in Sep 2026 (−0.4pp); Palo Alto recovered to 44.1% (+2.3pp), gap widens to −11.0pp.' },
    competitionInsight: { icon: TrendingUp, type: 'warning' as const, content: 'Palo Alto recovered from 41.8% (Aug) to 44.1% (Sep); Fortinet flat at 33.1% — PA extends ZTNA lead to 11.0pp.' },
  },
  {
    id: 'cloudSecurity' as CategoryType,
    name: 'Cloud Security',
    topPerformer: 'Palo Alto',
    topPerformerColor: '#FFB14A',
    data: [
      { period: '2025-11', fortinet: 52.0, top: 96.3 },
      { period: '2025-12', fortinet: 60.9, top: 92.9 },
      { period: '2026-01', fortinet: 64.4, top: 90.6 },
      { period: '2026-02', fortinet: 73.0, top: 92.3 },
      { period: '2026-03', fortinet: 73.7, top: 92.3 },
      { period: '2026-04', fortinet: 76.9, top: 92.8 }, // continues gaining, gap 15.9pp
      { period: '2026-05', fortinet: 24.6, top: 36.7 }, // both collapse, PA still leads
      { period: '2026-06', fortinet: 25.7, top: 37.6 }, // slight recovery for both, PA still leads
      { period: '2026-07', fortinet: 24.0, top: 43.7 }, // FT dips, PA surges to 43.7%
      { period: '2026-08', fortinet: 25.0, top: 44.8 }, // FT slight recovery, PA continues climbing
      { period: '2026-09', fortinet: 25.7, top: 44.8 }, // FT ticks up, PA holds
    ],
    fortinetInsight: { icon: AlertTriangle, type: 'error' as const, content: 'Cloud Security edged to 25.7% in Sep 2026 (+0.7pp); Palo Alto held at 44.8%, gap narrows slightly to −19.1pp.' },
    competitionInsight: { icon: TrendingDown, type: 'error' as const, content: 'Palo Alto held at 44.8% in Sep; Fortinet ticked up to 25.7% — Cloud Security deficit persists at −19.1pp.' },
  },
  {
    id: 'secOps' as CategoryType,
    name: 'SecOps',
    topPerformer: 'CrowdStrike',
    topPerformerColor: '#1F2937',
    data: [
      { period: '2025-11', fortinet: 23.8, top: 58.5 },
      { period: '2025-12', fortinet: 16.4, top: 63.2 },
      { period: '2026-01', fortinet: 18.7, top: 58.6 },
      { period: '2026-02', fortinet: 22.0, top: 63.6 },
      { period: '2026-03', fortinet: 18.0, top: 74.7 },
      { period: '2026-04', fortinet: 20.5, top: 80.2 }, // CS surges to 80.2%, gap 59.7pp
      { period: '2026-05', fortinet: 12.2, top: 45.7 }, // both drop, gap narrows but still 33.5pp
      { period: '2026-06', fortinet: 12.4, top: 45.4 }, // marginal recovery, gap holds at 33.0pp
      { period: '2026-07', fortinet: 12.8, top: 49.0 }, // FT slight uptick, CS surges to 49.0%
      { period: '2026-08', fortinet: 11.5, top: 46.3 }, // FT dips, CS also declines
      { period: '2026-09', fortinet: 12.6, top: 43.4 }, // FT recovers slightly, CS dips
    ],
    fortinetInsight: { icon: TrendingUp, type: 'error' as const, content: 'SecOps recovered to 12.6% in Sep 2026 (+1.1pp); CrowdStrike dipped to 43.4% (−2.9pp), gap narrows to 30.8pp.' },
    competitionInsight: { icon: TrendingDown, type: 'warning' as const, content: 'CrowdStrike declined from 46.3% (Aug) to 43.4% (Sep); Fortinet ticked up to 12.6% — gap narrows to 30.8pp.' },
  },
  {
    id: 'firewall' as CategoryType,
    name: 'Firewall',
    topPerformer: 'Fortinet',
    topPerformerColor: '#EF4444',
    // Data available only from Feb 2026 onwards
    data: [
      { period: '2026-02', fortinet: 100.0, top: 100.0, cisco: 38.0, paloalto: undefined },
      { period: '2026-03', fortinet: 99.6,  top: 99.6,  cisco: undefined, paloalto: 37.8 },
      { period: '2026-04', fortinet: 100.0, top: 100.0, cisco: undefined, paloalto: 36.0 }, // perfect score reclaimed
      { period: '2026-05', fortinet: 69.9,  top: 69.9,  cisco: 44.7, paloalto: undefined }, // drop, Cisco runner-up
      { period: '2026-06', fortinet: 72.0,  top: 72.0,  cisco: undefined, paloalto: 45.7 }, // FT recovers, PA runner-up
      { period: '2026-07', fortinet: 69.8,  top: 69.8,  cisco: undefined, paloalto: 58.8 }, // FT dips, PA runner-up surges
      { period: '2026-08', fortinet: 68.7,  top: 68.7,  cisco: undefined, paloalto: 57.1 }, // both dip slightly
      { period: '2026-09', fortinet: 71.7,  top: 71.7,  cisco: undefined, paloalto: 56.4 }, // FT recovers, PA dips
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'Firewall recovered to 71.7% in Sep 2026 (+3.0pp); Fortinet leads Palo Alto (56.4%) by 15.3pp — gap widens.' },
    competitionInsight: { icon: TrendingDown, type: 'warning' as const, content: 'Palo Alto dipped to 56.4% in Sep (from 57.1%); Fortinet Firewall lead extends to 15.3pp.' },
  },
  {
    id: 'quantumSecurity' as CategoryType,
    name: 'Quantum Security',
    topPerformer: 'Fortinet',
    topPerformerColor: '#EF4444',
    // Data available only from Feb 2026 onwards
    data: [
      { period: '2026-02', fortinet: 96.9, top: 96.9, paloAlto: 14.7 },
      { period: '2026-03', fortinet: 88.0, top: 88.0, paloAlto: 10.7 },
      { period: '2026-04', fortinet: 39.7, top: 39.7, paloAlto: 16.7 }, // CRITICAL: severe drop
      { period: '2026-05', fortinet: 32.9, top: 32.9, paloAlto: 19.0 }, // continues sliding, PA closes gap
      { period: '2026-06', fortinet: 32.4, top: 32.4, paloAlto: 17.9 }, // FT holds, PA dips slightly
      { period: '2026-07', fortinet: 33.2, top: 33.2, paloAlto: 22.0 }, // FT ticks up, PA recovers
      { period: '2026-08', fortinet: 35.8, top: 35.8, paloAlto: 28.0 }, // both climb, FT extends lead
      { period: '2026-09', fortinet: 38.5, top: 38.5, paloAlto: 25.3 }, // FT extends, PA dips
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'Quantum Security climbed to 38.5% in Sep 2026 (+2.7pp); Fortinet extends lead over PA (25.3%) to 13.2pp.' },
    competitionInsight: { icon: TrendingDown, type: 'warning' as const, content: 'Palo Alto dipped to 25.3% in Sep (from 28.0%); Fortinet Quantum lead extends to 13.2pp.' },
  },
  {
    id: 'aiCybersecurity' as CategoryType,
    name: 'AI Cybersecurity',
    topPerformer: 'Fortinet',
    topPerformerColor: '#EF4444',
    // Data available only from Feb 2026 onwards
    data: [
      { period: '2026-02', fortinet: 75.4, top: 75.4, crowdstrike: 20.5 },
      { period: '2026-03', fortinet: 88.9, top: 88.9, crowdstrike: 26.0 },
      { period: '2026-04', fortinet: 89.6, top: 89.6, crowdstrike: 30.1 }, // continues growth
      { period: '2026-05', fortinet: 49.3, top: 49.3, crowdstrike: 23.7 }, // sharp drop, still leads
      { period: '2026-06', fortinet: 50.1, top: 50.1, crowdstrike: 25.3 }, // slight recovery, FT extends lead
      { period: '2026-07', fortinet: 51.5, top: 51.5, crowdstrike: 27.6 }, // FT extends, CS rises
      { period: '2026-08', fortinet: 50.0, top: 50.0, crowdstrike: 25.4 }, // both dip slightly, FT maintains lead
      { period: '2026-09', fortinet: 39.6, top: 39.6, crowdstrike: 28.1 }, // both drop sharply, CS closes gap
    ],
    fortinetInsight: { icon: AlertTriangle, type: 'warning' as const, content: 'AI Cybersecurity fell to 39.6% in Sep 2026 (−10.4pp); leads CrowdStrike (28.1%) by 11.5pp — gap narrows sharply.' },
    competitionInsight: { icon: TrendingUp, type: 'warning' as const, content: 'CrowdStrike recovered to 28.1% in Sep (from 25.4%); Fortinet AI Cybersecurity lead narrows to 11.5pp — monitor closely.' },
  },
];

// Label above bar — used for Fortinet (first bar)
const renderLabelAbove = (props: any) => {
  const { x, y, width, value } = props;
  if (value === undefined || value === null) return null;
  return (
    <text x={x + width / 2} y={y - 5} fill="#374151" textAnchor="middle" fontSize="10" fontWeight="600">
      {value.toFixed(1)}%
    </text>
  );
};

// Label inside bar near top — used for competitor bars to avoid overlap
const renderLabelInside = (props: any) => {
  const { x, y, width, height, value } = props;
  if (value === undefined || value === null) return null;
  if (height < 22) {
    // Bar too short for inside label; shift above instead
    return (
      <text x={x + width / 2} y={y - 5} fill="#374151" textAnchor="middle" fontSize="10" fontWeight="600">
        {value.toFixed(1)}%
      </text>
    );
  }
  return (
    <text x={x + width / 2} y={y + 15} fill="white" textAnchor="middle" fontSize="10" fontWeight="700">
      {value.toFixed(1)}%
    </text>
  );
};

export function SlideCategoryPerformance({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<CategoryType>('sase');

  const tabs = categories.map(cat => ({
    id: cat.id,
    label: cat.name,
  }));

  const activeCategory = categories.find(cat => cat.id === activeTab)!;
  const isFortinetTopPerformer = activeCategory.topPerformer === 'Fortinet';

  // No longer filter to a single month — show all available data for each category
  const chartData = activeCategory.data.map((item: any) => {
      const dataPoint: any = {
        period: item.period,
        fortinet: item.fortinet,
      };

      if (activeTab === 'sase') {
        // paloAlto field used for all months
        if (item.paloAlto !== undefined) dataPoint['paloalto'] = item.paloAlto;
      }
      else if (activeTab === 'ztna') {
        // Nov–Apr: PA value stored in item.top; May: stored in item.paloAlto
        const paVal = item.paloAlto !== undefined ? item.paloAlto : item.top;
        if (paVal !== undefined) dataPoint['paloalto'] = paVal;
      }
      else if (activeTab === 'otSecurity') {
        // PA only appears in May 2026
        if (item.paloAlto !== undefined) dataPoint['paloalto'] = item.paloAlto;
      }
      else if (activeTab === 'firewall') {
        if (item.cisco !== undefined) dataPoint['cisco'] = item.cisco;
        if (item.paloalto !== undefined) dataPoint['paloalto'] = item.paloalto;
      }
      else if (activeTab === 'quantumSecurity' && item.paloAlto !== undefined) {
        dataPoint['paloalto'] = item.paloAlto;
      }
      else if (activeTab === 'aiCybersecurity' && item.crowdstrike !== undefined) {
        dataPoint['crowdstrike'] = item.crowdstrike;
      }
      else if (activeTab !== 'otSecurity') {
        dataPoint[activeCategory.topPerformer.toLowerCase().replace(/\s+/g, '')] = item.top;
      }

      return dataPoint;
    });

  const getPerformanceSummary = () => {
    const latestData = activeCategory.data[activeCategory.data.length - 1]; // Latest available month (May 2026)
    const fortinetValue = latestData.fortinet;

    // Determine competitor based on tab
    let competitorName = '';
    let competitorValue = 0;

    if (activeTab === 'sase' || activeTab === 'quantumSecurity' || activeTab === 'otSecurity' || activeTab === 'ztna') {
      competitorName = 'Palo Alto';
      competitorValue = (latestData as any).paloAlto || 0;
    } else if (activeTab === 'firewall') {
      // May 2026 runner-up is Cisco
      const d = latestData as any;
      if (d.paloalto !== undefined) {
        competitorName = 'Palo Alto';
        competitorValue = d.paloalto;
      } else {
        competitorName = 'Cisco';
        competitorValue = d.cisco || 0;
      }
    } else if (activeTab === 'aiCybersecurity') {
      competitorName = 'CrowdStrike';
      competitorValue = (latestData as any).crowdstrike || 0;
    } else {
      competitorName = activeCategory.topPerformer;
      competitorValue = latestData.top || 0;
    }

    const isLeader = fortinetValue >= competitorValue;

    const formatValue = (val: number) => `${val.toFixed(1)}%`;

    if (isLeader) {
      // Fortinet is #1, show who's in second
      const gap = fortinetValue - competitorValue;
      const gapPercent = ((gap / fortinetValue) * 100).toFixed(1);

      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-green-900">Top Performer - <span className="font-bold">Fortinet</span></span>
              <span className="text-sm text-green-900 font-semibold">{formatValue(fortinetValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-800">2nd position - {competitorName}</span>
              <span className="text-sm text-green-800 font-semibold">{formatValue(competitorValue)}</span>
            </div>
            <div>
              <span className="text-sm text-green-900"><span className="font-semibold">Lead:</span> +{formatValue(gap)} ({gapPercent}% ahead)</span>
            </div>
          </div>
        </div>
      );
    } else {
      const gap = competitorValue - fortinetValue;
      const gapPercent = ((gap / competitorValue) * 100).toFixed(1);
      return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-300 rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-orange-900">Top Performer - <span className="font-bold">{competitorName}</span></span>
              <span className="text-sm text-orange-900 font-semibold">{formatValue(competitorValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-orange-800">2nd position - Fortinet</span>
              <span className="text-sm text-orange-800 font-semibold">{formatValue(fortinetValue)}</span>
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
    <SlideContainer slideNumber={16} onNavigateHome={onNavigateHome} source="Profound">
      <SlideHeader
        title="Focused Category"
        subtitle="(Nov 2025 – Sep 2026)"
      />

      <div className="flex-1 flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex items-start gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-xs font-semibold leading-tight transition-all duration-200 relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 z-10'
                  : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
              }`}
              style={{
                borderRadius: '12px 12px 0 0',
                marginBottom: '-2px',
                fontSize: '11px',
                fontWeight: 600,
                lineHeight: '1.3',
                letterSpacing: '0.01em',
                boxShadow: activeTab === tab.id
                  ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                  : '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 grid grid-cols-12 gap-6">
          {/* Chart Section - 8 columns */}
          <div className="col-span-8 flex flex-col gap-4">
            <ChartContainer title="" height={420}>
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      id={`category-chart-${activeTab}`}
                      key={`chart-${activeTab}`}
                      data={chartData}
                      margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                      barGap={0}
                      barCategoryGap="25%"
                    >
                      <CartesianGrid
                        id={`cartesian-${activeTab}`}
                        {...CHART_CONFIG.cartesianGrid}
                      />
                      <XAxis
                        dataKey="period"
                        {...CHART_CONFIG.xAxis}
                        tick={{ fontSize: 11 }}
                        tickFormatter={formatMonth}
                        interval={0}
                        id={`xaxis-${activeTab}`}
                      />
                      <YAxis
                        {...CHART_CONFIG.yAxis}
                        tick={{ fontSize: 11 }}
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        id={`yaxis-${activeTab}`}
                      />
                      <Tooltip
                        id={`tooltip-${activeTab}`}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value: any) => `${value.toFixed(1)}%`}
                        labelFormatter={(label) => formatMonth(label)}
                      />
                      {isFortinetTopPerformer ? (
                        <>
                          <Bar
                            key="bar-fortinet"
                            dataKey="fortinet"
                            name="Fortinet"
                            fill="#EF4444"
                            radius={[4, 4, 0, 0]}
                            label={renderLabelAbove}
                            maxBarSize={90}
                          />
                          {activeTab === 'otSecurity' && (
                            <Bar
                              key="bar-paloalto-ot"
                              dataKey="paloalto"
                              name="Palo Alto"
                              fill="#FFB14A"
                              radius={[4, 4, 0, 0]}
                              label={renderLabelInside}
                              maxBarSize={90}
                            />
                          )}
                          {activeTab === 'firewall' && (
                            <>
                              <Bar
                                key="bar-cisco-firewall"
                                dataKey="cisco"
                                name="Cisco"
                                fill="#1EAEDB"
                                radius={[4, 4, 0, 0]}
                                label={renderLabelInside}
                                maxBarSize={90}
                              />
                              <Bar
                                key="bar-paloalto-firewall"
                                dataKey="paloalto"
                                name="Palo Alto"
                                fill="#FFB14A"
                                radius={[4, 4, 0, 0]}
                                label={renderLabelInside}
                                maxBarSize={90}
                              />
                            </>
                          )}
                          {activeTab === 'quantumSecurity' && (
                            <Bar
                              key="bar-paloalto-quantum"
                              dataKey="paloalto"
                              name="Palo Alto"
                              fill="#F59E0B"
                              radius={[4, 4, 0, 0]}
                              label={renderLabelInside}
                              maxBarSize={90}
                            />
                          )}
                          {activeTab === 'aiCybersecurity' && (
                            <Bar
                              key="bar-crowdstrike-ai"
                              dataKey="crowdstrike"
                              name="CrowdStrike"
                              fill="#1F2937"
                              radius={[4, 4, 0, 0]}
                              label={renderLabelInside}
                              maxBarSize={90}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <Bar
                            key="bar-fortinet"
                            dataKey="fortinet"
                            name="Fortinet"
                            fill="#EF4444"
                            radius={[4, 4, 0, 0]}
                            label={renderLabelAbove}
                            maxBarSize={90}
                          />
                          {activeTab === 'sase' ? (
                            <Bar
                              key="bar-paloalto-sase"
                              dataKey="paloalto"
                              name="Palo Alto"
                              fill="#F59E0B"
                              radius={[4, 4, 0, 0]}
                              label={renderLabelInside}
                              maxBarSize={90}
                            />
                          ) : (
                            <Bar
                              key={`bar-${activeCategory.topPerformer.toLowerCase().replace(/\s+/g, '-')}`}
                              dataKey={activeCategory.topPerformer.toLowerCase().replace(/\s+/g, '')}
                              name={activeCategory.topPerformer}
                              fill={activeCategory.topPerformerColor}
                              radius={[4, 4, 0, 0]}
                              label={renderLabelInside}
                              maxBarSize={90}
                            />
                          )}
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartContainer>
          </div>

          {/* Insights Section - 4 columns */}
          <div className="col-span-4 flex flex-col gap-4">
            <InsightsSection>
              <InsightCard
                icon={activeCategory.fortinetInsight.icon}
                type={activeCategory.fortinetInsight.type}
                title="Fortinet"
                content={activeCategory.fortinetInsight.content}
              />
              <InsightCard
                icon={activeCategory.competitionInsight.icon}
                type={activeCategory.competitionInsight.type}
                title="Competitions"
                content={activeCategory.competitionInsight.content}
              />
            </InsightsSection>
            {getPerformanceSummary()}
          </div>
        </div>

        {/* Competitor Legend at bottom */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className={`${TEXT_STYLES.sectionLabel} mb-3`}>Top Performers by Category · Sep 2026 Snapshot</h4>
          <div className="flex gap-6 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: '#EF4444' }}
              />
              <span className="font-semibold text-gray-900">Fortinet</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-600">SASE, OT Security, Firewall, Quantum Security, AI Cybersecurity (Sep 2026)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: '#FFB14A' }}
              />
              <span className="font-semibold text-gray-900">Palo Alto</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-600">Cloud Security, ZTNA (Sep 2026) · SASE/ZTNA leader Nov 2025–Apr 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: '#1F2937' }}
              />
              <span className="font-semibold text-gray-900">CrowdStrike</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-600">SecOps leader all periods (43.4% Sep 2026)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: '#1EAEDB' }}
              />
              <span className="font-semibold text-gray-900">Cisco</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-600">Runner-up in Firewall (Feb–Apr 2026); Palo Alto runner-up Jun–Sep 2026</span>
            </div>
          </div>
        </div>
      </div>

      <SlideFooter source="Source: Profound" />
    </SlideContainer>
  );
}
