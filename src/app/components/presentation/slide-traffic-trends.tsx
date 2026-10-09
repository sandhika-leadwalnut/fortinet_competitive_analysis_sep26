import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COMPETITORS, ORGANIC_TRAFFIC, MONTH_LABELS } from '@/app/data/seo-data';
import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
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
} from './design-system';

export function SlideTrafficTrends() {
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
    setIsEditing(false);
  };

  const handleValueChange = (competitorId: string, index: number, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setEditableTraffic((prev) => ({
      ...prev,
      [competitorId]: prev[competitorId].map((v, i) => (i === index ? numValue : v)),
    }));
  };

  // Prepare chart data - skip Sep (index 0), only show Oct-Jan
  const chartData = MONTH_LABELS.slice(1).map((label, index) => {
    const dataPoint: any = { month: label };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        dataPoint[competitor.name] = editableTraffic[competitor.id][index + 1];
      }
    });
    return dataPoint;
  });

  // Calculate dynamic Y-axis domain
  const getYAxisDomain = () => {
    let maxValue = 0;
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        const trafficData = editableTraffic[competitor.id].slice(1);
        trafficData.forEach((value) => {
          if (value !== null && value > maxValue) {
            maxValue = value;
          }
        });
      }
    });
    return [0, maxValue > 0 ? Math.ceil(maxValue * 1.1) : 100];
  };

  return (
    <SlideContainer slideNumber={3}>
      <SlideHeader
        title="Organic Traffic"
        subtitle="(Aug 2025 - Jun 2026)"
      />

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
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                      <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                      <XAxis dataKey="month" {...CHART_CONFIG.xAxis} />
                      <YAxis
                        {...CHART_CONFIG.yAxis}
                        tickFormatter={(value) => formatNumber(value)}
                        domain={getYAxisDomain()}
                      />
                      <Tooltip
                        content={(props) => (
                          <CustomChartTooltip {...props} formatter={formatNumber} />
                        )}
                      />
                      {COMPETITORS.map((competitor) => {
                        const isVisible = visibleCompetitors.has(competitor.id);
                        return (
                          <Line
                            key={competitor.id}
                            type="monotone"
                            dataKey={competitor.name}
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
                </div>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <div className="space-y-4">
                  {COMPETITORS.map((competitor) => (
                    <div key={competitor.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: competitor.color }}
                        />
                        <h4 className="text-sm font-semibold text-gray-900">{competitor.name}</h4>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {['Oct', 'Nov', 'Dec', 'Jan'].map((month, idx) => (
                          <div key={month}>
                            <label className="text-xs text-gray-600 font-medium mb-1 block">
                              {month}:
                            </label>
                            <input
                              type="number"
                              value={editableTraffic[competitor.id][idx + 1] ?? ''}
                              onChange={(e) => handleValueChange(competitor.id, idx + 1, e.target.value)}
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
        <div className="col-span-4">
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              content="Fortinet demonstrates +43.4% traffic growth (987K → 1.42M) from Aug 2025 to Jun 2026, peaking at 1.58M in Mar 2026. This indicates effective content strategy and improving organic visibility in the competitive landscape."
            />
            <InsightCard
              icon={TrendingUp}
              type="info"
              content="Cisco still leads at 1.86M in Jun 2026, below its Mar 2026 peak of 2.21M. Crowdstrike fell 1.03M → 290K (−71.8%) after an Aug 2025 spike, and Palo Alto grew 412K → 818K (+98.3%). Market presents opportunity for Fortinet to capture additional share."
            />
          </InsightsSection>
        </div>
      </div>

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}