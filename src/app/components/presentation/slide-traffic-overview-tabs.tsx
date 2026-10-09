import { TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COMPETITORS, ORGANIC_TRAFFIC, BRANDED_TRAFFIC, NON_BRANDED_TRAFFIC, TRAFFIC_MONTHS as MONTHS } from '@/app/data/seo-data';
import { useState } from 'react';
import { formatNumber } from '@/app/utils/format';
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
  TEXT_STYLES,
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';

type TabType = 'overall' | 'branded' | 'non-branded';

// Format month for display
const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(monthNum) - 1]}-${year.slice(2)}`;
};

interface EditableData {
  branded: (number | null)[];
  nonBranded: (number | null)[];
}

interface SlideTrafficOverviewTabsProps {
  onNavigateHome?: () => void;
}

export function SlideTrafficOverviewTabs({ onNavigateHome }: SlideTrafficOverviewTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overall');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleCompetitors, setVisibleCompetitors] = useState<Set<string>>(
    new Set(COMPETITORS.map((c) => c.id))
  );

  const [editableTraffic, setEditableTraffic] = useState<Record<string, (number | null)[]>>(() => {
    const initial: Record<string, (number | null)[]> = {};
    COMPETITORS.forEach((comp) => {
      initial[comp.id] = [...ORGANIC_TRAFFIC[comp.id as keyof typeof ORGANIC_TRAFFIC]];
    });
    return initial;
  });

  const [editableBrandedData, setEditableBrandedData] = useState<Record<string, EditableData>>(() => {
    const initial: Record<string, EditableData> = {};
    COMPETITORS.forEach((comp) => {
      initial[comp.id] = {
        branded: [...BRANDED_TRAFFIC[comp.id as keyof typeof BRANDED_TRAFFIC]],
        nonBranded: [...NON_BRANDED_TRAFFIC[comp.id as keyof typeof NON_BRANDED_TRAFFIC]],
      };
    });
    return initial;
  });

  const [isEditing, setIsEditing] = useState(false);

  const toggleCompetitor = (competitorId: string) => {
    setVisibleCompetitors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(competitorId)) {
        newSet.delete(competitorId);
      } else {
        newSet.add(competitorId);
      }
      return newSet;
    });
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);

  const handleCancel = () => {
    const reset: Record<string, (number | null)[]> = {};
    COMPETITORS.forEach((comp) => {
      reset[comp.id] = [...ORGANIC_TRAFFIC[comp.id as keyof typeof ORGANIC_TRAFFIC]];
    });
    setEditableTraffic(reset);
    
    const resetBranded: Record<string, EditableData> = {};
    COMPETITORS.forEach((comp) => {
      resetBranded[comp.id] = {
        branded: [...BRANDED_TRAFFIC[comp.id as keyof typeof BRANDED_TRAFFIC]],
        nonBranded: [...NON_BRANDED_TRAFFIC[comp.id as keyof typeof NON_BRANDED_TRAFFIC]],
      };
    });
    setEditableBrandedData(resetBranded);
    setIsEditing(false);
  };

  const handleValueChange = (competitorId: string, index: number, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setEditableTraffic((prev) => ({
      ...prev,
      [competitorId]: prev[competitorId].map((v, i) => (i === index ? numValue : v)),
    }));
  };

  const handleBrandedValueChange = (competitorId: string, type: 'branded' | 'nonBranded', index: number, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setEditableBrandedData((prev) => ({
      ...prev,
      [competitorId]: {
        ...prev[competitorId],
        [type]: prev[competitorId][type].map((v, i) => (i === index ? numValue : v)),
      },
    }));
  };

  // Prepare chart data for overall traffic
  const tro = getTimeRangeOffset(timeRange, MONTHS.length);
  const overallChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: label };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        dataPoint[competitor.id] = editableTraffic[competitor.id][i + tro];
      }
    });
    return dataPoint;
  });

  // Prepare chart data for branded/non-branded
  const brandedChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: label };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        const value = editableBrandedData[competitor.id].branded[i + tro];
        dataPoint[competitor.id] = value;
      }
    });
    return dataPoint;
  });

  const nonBrandedChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: label };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        const value = editableBrandedData[competitor.id].nonBranded[i + tro];
        dataPoint[competitor.id] = value;
      }
    });
    return dataPoint;
  });

  // Calculate dynamic Y-axis domain
  const getYAxisDomain = (type: TabType) => {
    let maxValue = 0;
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        let trafficData: (number | null)[] = [];
        
        if (type === 'overall') {
          trafficData = editableTraffic[competitor.id];
        } else if (type === 'branded') {
          trafficData = editableBrandedData[competitor.id].branded;
        } else {
          trafficData = editableBrandedData[competitor.id].nonBranded;
        }
        
        trafficData.forEach((value) => {
          if (value !== null && value > maxValue) {
            maxValue = value;
          }
        });
      }
    });
    return [0, maxValue > 0 ? Math.ceil(maxValue * 1.1) : 100];
  };

  const tabs = [
    { id: 'overall' as TabType, label: 'Overall Traffic' },
    { id: 'branded' as TabType, label: 'Branded' },
    { id: 'non-branded' as TabType, label: 'Non-Branded' },
  ];

  const getChartData = () => {
    if (activeTab === 'overall') return overallChartData;
    if (activeTab === 'branded') return brandedChartData;
    return nonBrandedChartData;
  };

  const getInsights = () => {
    if (activeTab === 'overall') {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Fortinet"
            content="From Jul 2025 to Sep 2026, traffic grew 890K → 1.20M (+34.3%), Palo Alto surged 296K → 718K (+142.8%)."
          />
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Competitions"
            content="From Jul 2025 to Sep 2026, Cisco leads at 1.96M (+5.8%), Crowdstrike fell 352K → 277K (−21.2%)."
          />
        </InsightsSection>
      );
    } else if (activeTab === 'branded') {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Fortinet"
            content="From Jul 2025 to Sep 2026, branded traffic fell 158K → 109K (−31.3%), Wiz fell 91K → 21K (−76.8%)."
          />
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Competitions"
            content="From Jul 2025 to Sep 2026, Cisco fell 974K → 390K (−60.0%), Crowdstrike 181K → 73K (−59.4%)."
          />
        </InsightsSection>
      );
    } else {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Fortinet"
            content="From Jul 2025 to Sep 2026, non-branded grew 732K → 1.09M (+48.5%), Palo Alto 225K → 588K (+161.3%)."
          />
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Competitions"
            content="From Jul 2025 to Sep 2026, Cisco grew 877K → 1.57M (+78.7%), SentinelOne 87K → 196K (+126.5%)."
          />
        </InsightsSection>
      );
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 14; // Sep 2026
    let dataSource: Record<string, number[]>;
    let label: string;

    if (activeTab === 'overall') {
      dataSource = {};
      COMPETITORS.forEach((c) => { dataSource[c.id] = editableTraffic[c.id] as number[]; });
      label = 'Overall Traffic';
    } else if (activeTab === 'branded') {
      dataSource = {};
      COMPETITORS.forEach((c) => { dataSource[c.id] = editableBrandedData[c.id].branded as number[]; });
      label = 'Branded Traffic';
    } else {
      dataSource = {};
      COMPETITORS.forEach((c) => { dataSource[c.id] = editableBrandedData[c.id].nonBranded as number[]; });
      label = 'Non-Branded Traffic';
    }

    const rankings = COMPETITORS.map((c) => ({
      id: c.id,
      name: c.name,
      value: dataSource[c.id]?.[latestIndex] ?? 0,
    })).sort((a, b) => b.value - a.value);

    const fortinetRanking = rankings.find((r) => r.id === 'fortinet');
    if (!fortinetRanking) return null;

    const fortinetPosition = rankings.findIndex((r) => r.id === 'fortinet') + 1;
    const isLeader = fortinetPosition === 1;
    const secondPlace = rankings[1];
    const firstPlace = rankings[0];
    const formatValue = (val: number) => formatNumber(val);

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
            <div className="flex justify-between">
              <span className="text-sm text-green-900"><span className="font-semibold">Lead:</span></span>
              <span className="text-sm text-green-900 font-semibold">+{formatValue(gap)} ({gapPercent}% ahead)</span>
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

  // Filter visible competitors for rendering
  const visibleCompetitorsList = COMPETITORS.filter(c => visibleCompetitors.has(c.id));

  return (
    <SlideContainer slideNumber={13} onNavigateHome={onNavigateHome}>
      <SlideHeader
        title="Organic Traffic Performance Overview"
        subtitle="(Jul 2025 - Sep 2026)"
      />

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-10 py-3.5 text-sm font-semibold transition-all duration-200 relative ${
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
        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6">
        {/* Chart Section - 8 columns */}
        <div className="col-span-8 flex flex-col gap-4">
          <ChartContainer
            title=""
            actions={
              <EditButton
                isEditing={isEditing}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            }
            height={400}
          >
            {!isEditing ? (
              <div className="h-full flex flex-col">
                <div className="pb-4 border-b border-gray-200 mb-4">
                  <CompetitorFilter
                    competitors={COMPETITORS}
                    visibleCompetitors={visibleCompetitors}
                    onToggle={toggleCompetitor}
                  />
                </div>
                <div className="flex-1">
                  <ResponsiveContainer 
                    width="100%" 
                    height="100%" 
                    key={`${activeTab}-${Array.from(visibleCompetitors).sort().join('-')}-${Date.now()}`}
                  >
                    <LineChart id={`traffic-tabs-linechart-${activeTab}`} data={getChartData()} margin={CHART_CONFIG.margin}>
                      <CartesianGrid id={`traffic-tabs-cartesian-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
                      <XAxis id={`traffic-tabs-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
                      <YAxis
                        id={`traffic-tabs-yaxis-${activeTab}`}
                        {...CHART_CONFIG.yAxis}
                        tickFormatter={(value) => formatNumber(value)}
                        domain={getYAxisDomain(activeTab)}
                      />
                      <Tooltip
                        id={`traffic-tabs-tooltip-${activeTab}`}
                        content={(props) => (
                          <CustomChartTooltip {...props} formatter={formatNumber} monthFormatter={formatMonth} />
                        )}
                      />
                      {visibleCompetitorsList.map((competitor) => (
                        <Line
                          key={`${competitor.id}-${activeTab}`}
                          id={`traffic-tabs-line-${activeTab}-${competitor.id}`}
                          name={competitor.name}
                          type="monotone"
                          dataKey={competitor.id}
                          stroke={competitor.color}
                          {...CHART_CONFIG.line}
                          dot={{ fill: competitor.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 7, strokeWidth: 2 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <div className="space-y-4">
                  {activeTab === 'overall' && COMPETITORS.map((competitor) => (
                    <div key={competitor.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: competitor.color }}
                        />
                        <h4 className="text-sm font-semibold text-gray-900">{competitor.name}</h4>
                      </div>
                      <div className="grid grid-cols-11 gap-2">
                        {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, idx) => (
                          <div key={month}>
                            <label className="text-xs text-gray-600 font-medium mb-1 block">
                              {month}:
                            </label>
                            <input
                              type="number"
                              value={editableTraffic[competitor.id][idx] ?? ''}
                              onChange={(e) => handleValueChange(competitor.id, idx, e.target.value)}
                              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="null"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {(activeTab === 'branded' || activeTab === 'non-branded') && COMPETITORS.map((competitor) => (
                    <div key={competitor.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: competitor.color }}
                        />
                        <h4 className="text-sm font-semibold text-gray-900">{competitor.name}</h4>
                      </div>
                      <div className="grid grid-cols-11 gap-2">
                        {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, idx) => (
                          <div key={month}>
                            <label className="text-xs text-gray-600 font-medium mb-1 block">
                              {month}:
                            </label>
                            <input
                              type="number"
                              value={activeTab === 'branded'
                                ? editableBrandedData[competitor.id].branded[idx] ?? ''
                                : editableBrandedData[competitor.id].nonBranded[idx] ?? ''
                              }
                              onChange={(e) => handleBrandedValueChange(
                                competitor.id,
                                activeTab === 'branded' ? 'branded' : 'nonBranded',
                                idx,
                                e.target.value
                              )}
                              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="null"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartContainer>
        </div>

        {/* Insights Section - 4 columns */}
        <div className="col-span-4 flex flex-col gap-4">
          {getInsights()}
          {getPerformanceSummary()}
        </div>
      </div>

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}