import { COMPETITORS, BRANDED_TRAFFIC, NON_BRANDED_TRAFFIC } from '@/app/data/seo-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { formatNumber } from '@/app/utils/format';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  CustomChartTooltip,
  CHART_CONFIG,
  TEXT_STYLES,
} from './design-system';

interface EditableData {
  branded: (number | null)[];
  nonBranded: (number | null)[];
}

export function SlideBranded() {
  const [editableData, setEditableData] = useState<Record<string, EditableData>>(() => {
    const initial: Record<string, EditableData> = {};
    COMPETITORS.forEach((comp) => {
      initial[comp.id] = {
        branded: [...BRANDED_TRAFFIC[comp.id as keyof typeof BRANDED_TRAFFIC]],
        nonBranded: [...NON_BRANDED_TRAFFIC[comp.id as keyof typeof NON_BRANDED_TRAFFIC]],
      };
    });
    return initial;
  });

  const [editingCard, setEditingCard] = useState<string | null>(null);

  const handleEdit = (competitorId: string) => setEditingCard(competitorId);
  const handleSave = () => setEditingCard(null);

  const handleCancel = (competitorId: string) => {
    setEditableData((prev) => ({
      ...prev,
      [competitorId]: {
        branded: [...BRANDED_TRAFFIC[competitorId as keyof typeof BRANDED_TRAFFIC]],
        nonBranded: [...NON_BRANDED_TRAFFIC[competitorId as keyof typeof NON_BRANDED_TRAFFIC]],
      },
    }));
    setEditingCard(null);
  };

  const handleValueChange = (competitorId: string, type: 'branded' | 'nonBranded', index: number, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setEditableData((prev) => ({
      ...prev,
      [competitorId]: {
        ...prev[competitorId],
        [type]: prev[competitorId][type].map((v, i) => (i === index ? numValue : v)),
      },
    }));
  };

  // Generate insights for each competitor
  const getInsights = (competitorId: string) => {
    const brandedData = editableData[competitorId].branded;
    const nonBrandedData = editableData[competitorId].nonBranded;
    
    // Calculate growth from Oct 2025 (index 3) to Jan 2026 (index 6); arrays start Jul 2025
    const octBranded = brandedData[3];
    const janBranded = brandedData[6];
    const octNonBranded = nonBrandedData[3];
    const janNonBranded = nonBrandedData[6];
    
    const brandedGrowth = octBranded != null && janBranded != null && octBranded > 0 ? ((janBranded - octBranded) / octBranded) * 100 : 0;
    const nonBrandedGrowth = octNonBranded != null && janNonBranded != null && octNonBranded > 0 ? ((janNonBranded - octNonBranded) / octNonBranded) * 100 : 0;
    
    // Determine color based on growth
    const getColor = (growth: number) => {
      if (growth > 5) return { bg: '#10B98120', text: '#10B981', label: 'Positive' }; // Green
      if (growth < -5) return { bg: '#EF444420', text: '#EF4444', label: 'Negative' }; // Red
      return { bg: '#F59E0B20', text: '#F59E0B', label: 'Neutral' }; // Yellow
    };
    
    const brandedColor = getColor(brandedGrowth);
    const nonBrandedColor = getColor(nonBrandedGrowth);
    
    return {
      branded: {
        value: brandedGrowth,
        display: `${brandedGrowth >= 0 ? '+' : ''}${brandedGrowth.toFixed(1)}%`,
        color: brandedColor
      },
      nonBranded: {
        value: nonBrandedGrowth,
        display: `${nonBrandedGrowth >= 0 ? '+' : ''}${nonBrandedGrowth.toFixed(1)}%`,
        color: nonBrandedColor
      }
    };
  };

  // Custom tooltip that sorts by value (highest first)
  const SortedTooltip = ({ active, payload, label, formatter }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    // Sort payload by value in descending order
    const sortedPayload = [...payload].sort((a, b) => {
      const valueA = a.value ?? 0;
      const valueB = b.value ?? 0;
      return valueB - valueA;
    });

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-xs font-semibold text-gray-900 mb-2">{label}</p>
        {sortedPayload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.name}:</span>
            <span className="font-semibold text-gray-900">
              {formatter ? formatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <SlideContainer slideNumber={5}>
      <SlideHeader
        title="Branded vs Non-Branded Traffic"
        subtitle="(Oct 2025 - Jan 2026)"
      />

      <div className="flex-1 overflow-auto">
        {/* Common Legend for all charts */}
        <div className="pb-4 border-b border-gray-200 mb-6">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gray-400" style={{ backgroundColor: '#EF4444' }}></div>
              <span className="text-xs text-gray-700 font-medium">Branded Traffic (Competitor Color)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gray-400" style={{ 
                backgroundImage: 'repeating-linear-gradient(to right, #9CA3AF 0px, #9CA3AF 5px, transparent 5px, transparent 10px)',
                backgroundColor: 'transparent'
              }}></div>
              <span className="text-xs text-gray-700 font-medium">Non-Branded Traffic</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {COMPETITORS.map((competitor) => {
            const brandedData = editableData[competitor.id].branded;
            const nonBrandedData = editableData[competitor.id].nonBranded;
            const isEditing = editingCard === competitor.id;

            const chartData = [
              { month: 'Oct', Branded: brandedData[3] != null ? brandedData[3]! * 1000 : null, 'Non-Branded': nonBrandedData[3] != null ? nonBrandedData[3]! * 1000 : null },
              { month: 'Nov', Branded: brandedData[4] != null ? brandedData[4]! * 1000 : null, 'Non-Branded': nonBrandedData[4] != null ? nonBrandedData[4]! * 1000 : null },
              { month: 'Dec', Branded: brandedData[5] != null ? brandedData[5]! * 1000 : null, 'Non-Branded': nonBrandedData[5] != null ? nonBrandedData[5]! * 1000 : null },
              { month: 'Jan', Branded: brandedData[6] != null ? brandedData[6]! * 1000 : null, 'Non-Branded': nonBrandedData[6] != null ? nonBrandedData[6]! * 1000 : null },
            ];

            const latestBranded = brandedData[6] != null ? brandedData[6]! * 1000 : null;
            const latestNonBranded = nonBrandedData[6] != null ? nonBrandedData[6]! * 1000 : null;

            return (
              <div key={competitor.id} className="bg-white border border-gray-200 rounded-lg p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: competitor.color }}
                    />
                    <h3 className={`${TEXT_STYLES.metricLabel} text-gray-900`}>
                      {competitor.name}
                    </h3>
                  </div>

                  {/* Edit button */}
                  {!isEditing ? (
                    null
                  ) : (
                    <div className="flex gap-1">
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50"
                        aria-label="Save"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCancel(competitor.id)}
                        className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        aria-label="Cancel"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <>
                    {/* Chart */}
                    <div style={{ height: '160px' }} className="mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                          <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                          <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tick={{ fontSize: 10 }} />
                          <YAxis
                            {...CHART_CONFIG.yAxis}
                            tick={{ fontSize: 10 }}
                            tickFormatter={(value) => formatNumber(value)}
                          />
                          <Tooltip
                            content={(props) => (
                              <SortedTooltip {...props} formatter={formatNumber} />
                            )}
                          />
                          <Line
                            type="monotone"
                            dataKey="Branded"
                            stroke={competitor.color}
                            strokeWidth={2}
                            dot={{ fill: competitor.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Non-Branded"
                            stroke="#9CA3AF"
                            strokeWidth={2}
                            dot={{ fill: '#9CA3AF', r: 5, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Insight */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Insight</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">• Branded Traffic:</span>
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded font-bold text-xs"
                            style={{ 
                              backgroundColor: `${getInsights(competitor.id).branded.color.bg}`,
                              color: getInsights(competitor.id).branded.color.text 
                            }}
                          >
                            {getInsights(competitor.id).branded.display}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">• Non-Branded Traffic:</span>
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded font-bold text-xs"
                            style={{ 
                              backgroundColor: `${getInsights(competitor.id).nonBranded.color.bg}`,
                              color: getInsights(competitor.id).nonBranded.color.text 
                            }}
                          >
                            {getInsights(competitor.id).nonBranded.display}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className={`${TEXT_STYLES.sectionLabel} mb-2 block`}>Branded Traffic</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Oct', 'Nov', 'Dec', 'Jan'].map((month, idx) => (
                          <div key={month}>
                            <label className="text-xs text-gray-600 mb-1 block">{month}:</label>
                            <input
                              type="number"
                              value={brandedData[idx + 3] ?? ''}
                              onChange={(e) =>
                                handleValueChange(competitor.id, 'branded', idx + 3, e.target.value)
                              }
                              className="text-sm border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="null"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={`${TEXT_STYLES.sectionLabel} mb-2 block`}>Non-Branded Traffic</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Oct', 'Nov', 'Dec', 'Jan'].map((month, idx) => (
                          <div key={month}>
                            <label className="text-xs text-gray-600 mb-1 block">{month}:</label>
                            <input
                              type="number"
                              value={nonBrandedData[idx + 3] ?? ''}
                              onChange={(e) =>
                                handleValueChange(competitor.id, 'nonBranded', idx + 3, e.target.value)
                              }
                              className="text-sm border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="null"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}