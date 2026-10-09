import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { TrendingUp, BarChart3, Zap } from 'lucide-react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  ChartContainer,
  ContextualInsightCard,
  CompetitorFilter,
  CustomChartTooltip,
  CHART_CONFIG,
} from './design-system';

const NGFW_COMPETITORS = [
  { id: 'fortinet', name: 'Fortinet', color: '#EF4444' },
  { id: 'cisco', name: 'Cisco', color: '#FF7AB6' },
  { id: 'hpe', name: 'HPE', color: '#7ED957' },
  { id: 'paloalto', name: 'Palo Alto', color: '#FFB14A' },
  { id: 'checkpoint', name: 'Check Point', color: '#6C9AFF' },
];

const MONTHS = ['Oct-25', 'Nov-25', 'Dec-25'];

// Helper function to format month keys for display
const formatMonth = (monthKey: string) => {
  const monthMap: { [key: string]: string } = {
    '2025-10': 'Oct-25',
    '2025-11': 'Nov-25',
    '2025-12': 'Dec-25',
  };
  return monthMap[monthKey] || monthKey;
};

const MONTH_KEYS = ['2025-10', '2025-11', '2025-12'];

const TOTAL_KEYWORDS_ABS = {
  fortinet: [696, 944, 881],
  cisco: [665, 706, 742],
  hpe: [85, 103, 102],
  paloalto: [727, 756, 860],
  checkpoint: [564, 569, 562],
};

const PAGE_ONE_KW_ABS = {
  fortinet: [788, 848, 867],
  cisco: [556, 584, 601],
  hpe: [51, 64, 58],
  paloalto: [606, 634, 719],
  checkpoint: [413, 400, 371],
};

const CUMULATIVE_TRAFFIC_ABS = {
  fortinet: [23104, 24892, 27746],
  cisco: [15981, 15826, 24132],
  hpe: [782, 836, 928],
  paloalto: [11946, 12637, 21611],
  checkpoint: [4284, 5126, 4772],
};

export function SlideNGFWContextual() {
  const [visibleCompetitors, setVisibleCompetitors] = useState<Set<string>>(
    new Set(NGFW_COMPETITORS.map((c) => c.id))
  );

  const [editableData, setEditableData] = useState<{
    keywords: Record<string, number[]>;
    pageOne: Record<string, number[]>;
    traffic: Record<string, number[]>;
  }>(() => ({
    keywords: JSON.parse(JSON.stringify(TOTAL_KEYWORDS_ABS)),
    pageOne: JSON.parse(JSON.stringify(PAGE_ONE_KW_ABS)),
    traffic: JSON.parse(JSON.stringify(CUMULATIVE_TRAFFIC_ABS)),
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
    });
    setIsEditing(false);
  };

  const handleValueChange = (
    dataset: 'keywords' | 'pageOne' | 'traffic',
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
  const keywordsChartData = MONTH_KEYS.map((monthKey, index) => {
    const dataPoint: any = { month: monthKey };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id)) {
        dataPoint[comp.id] = editableData.keywords[comp.id][index] ?? 0;
      }
    });
    return dataPoint;
  });

  const trafficChartData = MONTH_KEYS.map((monthKey, index) => {
    const dataPoint: any = { month: monthKey };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id)) {
        dataPoint[comp.id] = editableData.traffic[comp.id][index] ?? 0;
      }
    });
    return dataPoint;
  });

  const pageOneChartData = MONTH_KEYS.map((monthKey, index) => {
    const dataPoint: any = { month: monthKey };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id)) {
        dataPoint[comp.id] = editableData.pageOne[comp.id][index] ?? 0;
      }
    });
    return dataPoint;
  });

  return (
    <SlideContainer slideNumber={5}>
      <SlideHeader
        title="NGFW/Firewall Category Performance — Contextual Insights"
        subtitle="Keyword and traffic analysis for next-gen firewall terms (Oct - Dec 2025)"
      />

      <div className="flex-1 flex flex-col gap-6">
        {/* Top row: 2 charts side by side with insights */}
        <div className="grid grid-cols-2 gap-6">
          {/* Chart 1: Total Keywords */}
          <div className="flex flex-col gap-4">
            <ChartContainer
              title="Total Keywords"
              height={180}
            >
              {!isEditing ? (
                <div className="h-full flex flex-col">
                  <div className="pb-2 border-b border-gray-200 mb-2">
                    <CompetitorFilter
                      competitors={NGFW_COMPETITORS}
                      visibleCompetitors={visibleCompetitors}
                      onToggle={toggleCompetitor}
                    />
                  </div>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={keywordsChartData} margin={CHART_CONFIG.margin}>
                        <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                        <XAxis dataKey="month" {...CHART_CONFIG.xAxis} />
                        <YAxis {...CHART_CONFIG.yAxis} />
                        <Tooltip content={(props) => <CustomChartTooltip {...props} />} />
                        {NGFW_COMPETITORS.map((comp) => (
                          <Bar
                            key={comp.id}
                            dataKey={comp.id}
                            fill={comp.color}
                            hide={!visibleCompetitors.has(comp.id)}
                            radius={CHART_CONFIG.bar.radius}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-auto p-2">
                  <div className="space-y-2">
                    {NGFW_COMPETITORS.map((comp) => (
                      <div key={comp.id} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />
                          <h4 className="text-xs font-semibold text-gray-900">{comp.name}</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {MONTHS.map((month, idx) => (
                            <div key={month}>
                              <label className="text-[10px] text-gray-600 font-medium mb-0.5 block">{month.split(' ')[0]}:</label>
                              <input
                                type="number"
                                value={editableData.keywords[comp.id][idx]}
                                onChange={(e) => handleValueChange('keywords', comp.id, idx, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-1 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-red-500"
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
            
            {/* Contextual Insight below chart */}
            <ContextualInsightCard
              icon={TrendingUp}
              sentiment="positive"
              headline="Fortinet NGFW Leadership"
              body="Fortinet leads with 881 keywords in Dec 2025, showing strong domain authority in next-gen firewall space with +26.6% growth Oct-Dec."
            />
          </div>

          {/* Chart 2: Page 1 Keywords */}
          <div className="flex flex-col gap-4">
            <ChartContainer
              title="No. of KWs Ranking on Page 1"
              height={180}
            >
              <div className="h-full flex flex-col">
                <div className="pb-2 border-b border-gray-200 mb-2">
                  <CompetitorFilter
                    competitors={NGFW_COMPETITORS}
                    visibleCompetitors={visibleCompetitors}
                    onToggle={toggleCompetitor}
                  />
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pageOneChartData} margin={CHART_CONFIG.margin}>
                      <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                      <XAxis dataKey="month" {...CHART_CONFIG.xAxis} />
                      <YAxis {...CHART_CONFIG.yAxis} />
                      <Tooltip content={(props) => <CustomChartTooltip {...props} />} />
                      {NGFW_COMPETITORS.map((comp) => (
                        <Bar
                          key={`bottom-${comp.id}`}
                          dataKey={comp.id}
                          fill={comp.color}
                          hide={!visibleCompetitors.has(comp.id)}
                          radius={CHART_CONFIG.bar.radius}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartContainer>

            {/* Contextual Insight below chart */}
            <ContextualInsightCard
              icon={BarChart3}
              sentiment="positive"
              headline="Exceptional Page 1 Performance"
              body="Fortinet achieves 867 Page 1 rankings (98.4% of total keywords)—highest conversion rate, demonstrating superior content quality and relevance in NGFW category."
            />
          </div>
        </div>

        {/* Bottom: Traffic chart with insight beside */}
        <div className="flex gap-6">
          {/* Chart takes 68% width */}
          <div className="flex-[68]">
            <ChartContainer title="Cumulative Traffic" height={240}>
              <div className="h-full flex flex-col">
                <div className="pb-2 border-b border-gray-200 mb-2">
                  <CompetitorFilter
                    competitors={NGFW_COMPETITORS}
                    visibleCompetitors={visibleCompetitors}
                    onToggle={toggleCompetitor}
                  />
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trafficChartData} margin={CHART_CONFIG.margin}>
                      <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                      <XAxis dataKey="month" {...CHART_CONFIG.xAxis} />
                      <YAxis {...CHART_CONFIG.yAxis} />
                      <Tooltip content={(props) => <CustomChartTooltip {...props} />} />
                      {NGFW_COMPETITORS.map((comp) => (
                        <Line
                          key={comp.id}
                          type="monotone"
                          dataKey={comp.id}
                          stroke={comp.color}
                          hide={!visibleCompetitors.has(comp.id)}
                          {...CHART_CONFIG.line}
                          dot={{ fill: comp.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 7, strokeWidth: 2 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartContainer>
          </div>

          {/* Contextual Insight Card takes 32% width */}
          <div className="flex-[32] flex items-center">
            <ContextualInsightCard
              icon={Zap}
              sentiment="negative"
              headline="Traffic Anomaly Alert"
              body={[
                "Fortinet traffic grew +20.1% (23.1K → 27.7K) showing healthy organic growth trajectory.",
                "Cisco's Dec spike (24.1K) and Palo Alto's surge (21.6K) warrant investigation—potential seasonal effects or ranking volatility."
              ]}
            />
          </div>
        </div>

        {/* Executive Note */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-900">
            <span className="font-semibold">Executive Summary:</span> Fortinet dominates NGFW category with highest keywords, best Page 1 conversion (98.4%), and consistent traffic growth—clear market leadership position.
          </p>
        </div>
      </div>

      <SlideFooter source="Source: Ahrefs" />
    </SlideContainer>
  );
}