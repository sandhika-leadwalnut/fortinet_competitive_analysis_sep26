import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COMPETITORS, ORGANIC_KEYWORDS, PAGE_ONE_KEYWORDS, KEYWORD_MONTHS as MONTHS } from '@/app/data/seo-data';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, AlertCircle, BarChart3, Award, Trophy } from 'lucide-react';
import { formatNumber } from '@/app/utils/format';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  ChartContainer,
  InsightCard,
  InsightsSection,
  ContextualInsightCard,
  EditButton,
  CompetitorFilter,
  CustomChartTooltip,
  CHART_CONFIG,
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';

type TabType = 'organic' | 'page-one';

// Format month for display
const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(monthNum) - 1]}-${year.slice(2)}`;
};

interface SlideOpportunitiesProps {
  onNavigateHome?: () => void;
}

export function SlideOpportunities({ onNavigateHome }: SlideOpportunitiesProps) {
  const [activeTab, setActiveTab] = useState<TabType>('organic');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  // Single shared visibility state for both charts
  const [visibleCompetitors, setVisibleCompetitors] = useState<Set<string>>(
    new Set(COMPETITORS.map((c) => c.id))
  );

  const [editableOrganic, setEditableOrganic] = useState<Record<string, (number | null)[]>>(() => {
    const initial: Record<string, (number | null)[]> = {};
    COMPETITORS.forEach((comp) => {
      initial[comp.id] = [...ORGANIC_KEYWORDS[comp.id as keyof typeof ORGANIC_KEYWORDS]];
    });
    return initial;
  });

  const [editablePageOne, setEditablePageOne] = useState<Record<string, (number | null)[]>>(() => {
    const initial: Record<string, (number | null)[]> = {};
    COMPETITORS.forEach((comp) => {
      initial[comp.id] = [...PAGE_ONE_KEYWORDS[comp.id as keyof typeof PAGE_ONE_KEYWORDS]];
    });
    return initial;
  });

  const [isEditingOrganic, setIsEditingOrganic] = useState(false);
  const [isEditingPageOne, setIsEditingPageOne] = useState(false);

  const toggleCompetitor = (competitorId: string) => {
    setVisibleCompetitors((prev) => {
      const newSet = new Set(prev);
      newSet.has(competitorId) ? newSet.delete(competitorId) : newSet.add(competitorId);
      return newSet;
    });
  };

  const handleEditOrganic = () => setIsEditingOrganic(true);
  const handleSaveOrganic = () => setIsEditingOrganic(false);

  const handleCancelOrganic = () => {
    const reset: Record<string, (number | null)[]> = {};
    COMPETITORS.forEach((comp) => {
      reset[comp.id] = [...ORGANIC_KEYWORDS[comp.id as keyof typeof ORGANIC_KEYWORDS]];
    });
    setEditableOrganic(reset);
    setIsEditingOrganic(false);
  };

  const handleEditPageOne = () => setIsEditingPageOne(true);
  const handleSavePageOne = () => setIsEditingPageOne(false);

  const handleCancelPageOne = () => {
    const reset: Record<string, (number | null)[]> = {};
    COMPETITORS.forEach((comp) => {
      reset[comp.id] = [...PAGE_ONE_KEYWORDS[comp.id as keyof typeof PAGE_ONE_KEYWORDS]];
    });
    setEditablePageOne(reset);
    setIsEditingPageOne(false);
  };

  const handleOrganicValueChange = (competitorId: string, index: number, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setEditableOrganic((prev) => ({
      ...prev,
      [competitorId]: prev[competitorId].map((v, i) => (i === index ? numValue : v)),
    }));
  };

  const handlePageOneValueChange = (competitorId: string, index: number, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setEditablePageOne((prev) => ({
      ...prev,
      [competitorId]: prev[competitorId].map((v, i) => (i === index ? numValue : v)),
    }));
  };

  // Chart data - full range
  const tro = getTimeRangeOffset(timeRange, MONTHS.length);
  const organicChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: formatMonth(label) };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        dataPoint[competitor.id] = editableOrganic[competitor.id][i + tro];
      }
    });
    return dataPoint;
  });

  const pageOneChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: formatMonth(label) };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        dataPoint[competitor.id] = editablePageOne[competitor.id][i + tro];
      }
    });
    return dataPoint;
  });

  // Dynamic Y-axis domains
  const getOrganicYAxisDomain = () => {
    let maxValue = 0;
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        editableOrganic[competitor.id].forEach((value) => {
          if (value !== null && value > maxValue) maxValue = value;
        });
      }
    });
    return [0, maxValue > 0 ? Math.ceil(maxValue * 1.1) : 100];
  };

  const getPageOneYAxisDomain = () => {
    let maxValue = 0;
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        editablePageOne[competitor.id].forEach((value) => {
          if (value !== null && value > maxValue) maxValue = value;
        });
      }
    });
    return [0, maxValue > 0 ? Math.ceil(maxValue * 1.1) : 100];
  };

  const renderChart = (
    chartData: any[],
    visibleCompetitors: Set<string>,
    isEditing: boolean,
    editableData: Record<string, (number | null)[]>,
    handleValueChange: (competitorId: string, index: number, value: string) => void,
    domain: [number, number],
    chartTitle?: string
  ) => {
    if (isEditing) {
      return (
        <div className="h-full overflow-auto p-2">
          <div className="space-y-3">
            {COMPETITORS.map((competitor) => (
              <div key={competitor.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: competitor.color }} />
                  <h4 className="text-sm font-semibold text-gray-900">{competitor.name}</h4>
                </div>
                <div className="grid grid-cols-11 gap-2">
                  {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, idx) => (
                    <div key={month}>
                      <label className="text-xs text-gray-600 font-medium mb-1 block">{month}:</label>
                      <input
                        type="number"
                        value={editableData[competitor.id][idx] ?? ''}
                        onChange={(e) => handleValueChange(competitor.id, idx, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="null"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid id={`opportunities-cartesian-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
          <XAxis id={`opportunities-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} />
          <YAxis
            id={`opportunities-yaxis-${activeTab}`}
            {...CHART_CONFIG.yAxis}
            tickFormatter={(value) => formatNumber(value)}
            domain={domain}
          />
          <Tooltip id={`opportunities-tooltip-${activeTab}`} content={(props) => <CustomChartTooltip {...props} formatter={formatNumber} />} />
          {COMPETITORS.map((competitor) => {
            const isVisible = visibleCompetitors.has(competitor.id);
            return (
              <Line
                key={competitor.id}
                id={`opportunities-line-${activeTab}-${competitor.id}`}
                name={competitor.name}
                type="monotone"
                dataKey={competitor.id}
                stroke={competitor.color}
                {...CHART_CONFIG.line}
                dot={{ fill: competitor.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 2 }}
                hide={!isVisible}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const tabs = [
    { id: 'organic' as TabType, label: 'Total Organic Keywords' },
    { id: 'page-one' as TabType, label: 'Page 1 Keywords' },
  ];

  const getChartData = () => {
    return activeTab === 'organic' ? organicChartData : pageOneChartData;
  };

  const getIsEditing = () => {
    return activeTab === 'organic' ? isEditingOrganic : isEditingPageOne;
  };

  const getEditableData = () => {
    return activeTab === 'organic' ? editableOrganic : editablePageOne;
  };

  const getHandleValueChange = () => {
    return activeTab === 'organic' ? handleOrganicValueChange : handlePageOneValueChange;
  };

  const getYAxisDomain = () => {
    return activeTab === 'organic' ? getOrganicYAxisDomain() : getPageOneYAxisDomain();
  };

  const getEditActions = () => {
    if (activeTab === 'organic') {
      return {
        isEditing: isEditingOrganic,
        onEdit: handleEditOrganic,
        onSave: handleSaveOrganic,
        onCancel: handleCancelOrganic,
      };
    } else {
      return {
        isEditing: isEditingPageOne,
        onEdit: handleEditPageOne,
        onSave: handleSavePageOne,
        onCancel: handleCancelPageOne,
      };
    }
  };

  const getInsights = () => {
    if (activeTab === 'organic') {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Fortinet"
            content="From Jul 2025 to Sep 2026, total keywords fell 309K → 211K (−31.7%), Wiz also fell 41K → 28K (−32.3%)."
          />
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Competitions"
            content="From Jul 2025 to Sep 2026, Cisco fell 833K → 574K (−31.1%), while Palo Alto grew 169K → 195K (+15.4%)."
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
            content="From Jul 2025 to Sep 2026, page-1 rankings grew 39K → 46K (+16.5%), Palo Alto grew 19K → 31K (+61.3%)."
          />
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Competitions"
            content="From Jul 2025 to Sep 2026, SentinelOne surged 9.8K → 19.4K (+98.0%); Cisco grew 87K → 91K (+4.6%)."
          />
        </InsightsSection>
      );
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 14; // Sep 2026
    const dataSource = activeTab === 'organic' ? editableOrganic : editablePageOne;
    const formatValue = (val: number) => formatNumber(val);
    const ordinal = (n: number) => n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`;

    const rankings = COMPETITORS.map((c) => ({
      id: c.id,
      name: c.name,
      value: (dataSource[c.id]?.[latestIndex] as number) ?? 0,
    })).sort((a, b) => b.value - a.value);

    const fortinetRanking = rankings.find((r) => r.id === 'fortinet');
    if (!fortinetRanking) return null;

    const fortinetPosition = rankings.findIndex((r) => r.id === 'fortinet') + 1;
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
    <SlideContainer slideNumber={6} onNavigateHome={onNavigateHome}>
      <SlideHeader
        title="Keyword Opportunities & Rankings"
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
              <EditButton {...getEditActions()} />
            }
            height={400}
          >
            <div className="h-full flex flex-col">
              <div className="pb-4 border-b border-gray-200 mb-4">
                <CompetitorFilter
                  competitors={COMPETITORS}
                  visibleCompetitors={visibleCompetitors}
                  onToggle={toggleCompetitor}
                />
              </div>
              <div className="flex-1">
                {renderChart(
                  getChartData(),
                  visibleCompetitors,
                  getIsEditing(),
                  getEditableData(),
                  getHandleValueChange(),
                  getYAxisDomain()
                )}
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

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}