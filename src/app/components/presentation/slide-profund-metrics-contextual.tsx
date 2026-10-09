import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Award, Sparkles, TrendingUp } from 'lucide-react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  ChartContainer,
  ContextualInsightCard,
  EditButton,
  CompetitorFilter,
  CHART_CONFIG,
} from './design-system';

const VENDORS = [
  { id: 'fortinet', name: 'Fortinet', color: '#EF4444' },
  { id: 'paloalto', name: 'Palo Alto', color: '#FFB14A' },
  { id: 'checkpoint', name: 'Check Point', color: '#6C9AFF' },
  { id: 'hpe', name: 'HPE', color: '#7ED957' },
  { id: 'cisco', name: 'Cisco', color: '#FF7AB6' },
  { id: 'crowdstrike', name: 'Crowdstrike', color: '#1F2937' },
];

const VISIBILITY_DATA_INITIAL = {
  fortinet: [57.8, 62.1, 62.6],
  paloalto: [40.9, 43.5, 43.5],
  checkpoint: [14.9, 15.8, 15.9],
  hpe: [1.6, 1.8, 2.1],
  cisco: [31.3, 34.6, 33.9],
  crowdstrike: [14.5, 16.3, 16.0],
};

const SHARE_OF_VOICE_DATA_INITIAL = {
  fortinet: [10.8, 10.1, 10.0],
  paloalto: [7.9, 7.5, 7.5],
  checkpoint: [2.8, 2.8, 2.8],
  hpe: [0.3, 0.3, 0.3],
  cisco: [5.8, 6.0, 5.9],
  crowdstrike: [2.7, 2.8, 2.8],
};

const CITATION_DATA_INITIAL = {
  fortinet: [9.2, 12.2, 12.4],
  paloalto: [2.0, 1.8, 1.8],
  checkpoint: [1.4, 0.9, 0.9],
  hpe: [1.1, 0.1, 0.1],
  cisco: [1.4, 1.1, 1.1],
  crowdstrike: [1.0, 0.4, 0.4],
};

const MONTHS = ['Nov 2025', 'Dec 2025', 'Jan 2026'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const validPayload = payload.filter((entry: any) => entry.value !== null && entry.value !== undefined);
  if (!validPayload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-900 mb-2">{label}</p>
      {validPayload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs mb-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-700">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

export function SlideProfundMetricsContextual() {
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(VENDORS.map((v) => v.id))
  );

  const [editableData, setEditableData] = useState<{
    visibility: Record<string, number[]>;
    shareOfVoice: Record<string, number[]>;
    citation: Record<string, number[]>;
  }>(() => ({
    visibility: JSON.parse(JSON.stringify(VISIBILITY_DATA_INITIAL)),
    shareOfVoice: JSON.parse(JSON.stringify(SHARE_OF_VOICE_DATA_INITIAL)),
    citation: JSON.parse(JSON.stringify(CITATION_DATA_INITIAL)),
  }));

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => {
    setEditableData({
      visibility: JSON.parse(JSON.stringify(VISIBILITY_DATA_INITIAL)),
      shareOfVoice: JSON.parse(JSON.stringify(SHARE_OF_VOICE_DATA_INITIAL)),
      citation: JSON.parse(JSON.stringify(CITATION_DATA_INITIAL)),
    });
    setIsEditing(false);
  };

  const handleValueChange = (
    dataset: 'visibility' | 'shareOfVoice' | 'citation',
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
      if (newSet.has(vendorId)) newSet.delete(vendorId);
      else newSet.add(vendorId);
      return newSet;
    });
  };

  const visibilityChartData = MONTHS.map((month, index) => {
    const dataPoint: any = { month };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.visibility[vendor.id][index] ?? 0;
      }
    });
    return dataPoint;
  });

  const shareOfVoiceChartData = MONTHS.map((month, index) => {
    const dataPoint: any = { month };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.shareOfVoice[vendor.id][index] ?? 0;
      }
    });
    return dataPoint;
  });

  const citationChartData = MONTHS.map((month, index) => {
    const dataPoint: any = { month };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.citation[vendor.id][index] ?? 0;
      }
    });
    return dataPoint;
  });

  return (
    <SlideContainer slideNumber={10}>
      <SlideHeader title="LLM Metrics — Contextual Insights" subtitle="Nov 2025–Jan 2026" />

      {!isEditing ? (
        <div className="flex-1 flex flex-col gap-6">
          {/* Chart 1: AI Visibility with contextual insight */}
          <div className="flex gap-6">
            <div className="flex-[68]">
              <ChartContainer
                title="AI Visibility %"
                height={200}
                actions={<EditButton isEditing={isEditing} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} />}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visibilityChartData} margin={CHART_CONFIG.margin}>
                    <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                    <XAxis dataKey="month" {...CHART_CONFIG.xAxis} />
                    <YAxis {...CHART_CONFIG.yAxis} />
                    <Tooltip content={<CustomTooltip />} />
                    {VENDORS.map((vendor) =>
                      visibleVendors.has(vendor.id) ? (
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
                      ) : null
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="flex-[32] flex items-center">
              <ContextualInsightCard
                icon={Award}
                sentiment="positive"
                headline="Dominant AI Visibility"
                body={[
                  "Fortinet leads at 62.6% (+8.3% growth), outperforming all competitors in LLM presence.",
                  "19.1-point advantage over Palo Alto (43.5%)—significant competitive edge in emerging AI search landscape."
                ]}
              />
            </div>
          </div>

          {/* Chart 2: Share of Voice with contextual insight */}
          <div className="flex gap-6">
            <div className="flex-[68]">
              <ChartContainer title="Share of Voice %" height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={shareOfVoiceChartData} margin={CHART_CONFIG.margin}>
                    <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                    <XAxis dataKey="month" {...CHART_CONFIG.xAxis} />
                    <YAxis {...CHART_CONFIG.yAxis} />
                    <Tooltip content={<CustomTooltip />} />
                    {VENDORS.map((vendor) => (
                      <Line key={vendor.id} name={vendor.name} type="monotone" dataKey={vendor.id} stroke={vendor.color} hide={!visibleVendors.has(vendor.id)} {...CHART_CONFIG.line} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="flex-[32] flex items-center">
              <ContextualInsightCard
                icon={Sparkles}
                sentiment="positive"
                headline="AI Authority Leadership"
                body={[
                  "Fortinet dominates at 10.0%, nearly 33% higher than Palo Alto's 7.5%—strong authority in LLM responses.",
                  "Cisco maintains steady 5.9%, while HPE trails at 0.3%, indicating minimal AI platform presence."
                ]}
              />
            </div>
          </div>

          {/* Chart 3: Citation Rate with contextual insight */}
          <div className="flex gap-6">
            <div className="flex-[68]">
              <ChartContainer title="Citation Rate %" height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={citationChartData} margin={CHART_CONFIG.margin}>
                    <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                    <XAxis dataKey="month" {...CHART_CONFIG.xAxis} />
                    <YAxis {...CHART_CONFIG.yAxis} />
                    <Tooltip content={<CustomTooltip />} />
                    {VENDORS.map((vendor) => (
                      <Line key={`citation-${vendor.id}`} name={vendor.name} type="monotone" dataKey={vendor.id} stroke={vendor.color} hide={!visibleVendors.has(vendor.id)} {...CHART_CONFIG.line} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="flex-[32] flex items-center">
              <ContextualInsightCard
                icon={TrendingUp}
                sentiment="positive"
                headline="Exceptional Citation Growth"
                body={[
                  "Fortinet's citation rate surged +34.8% (9.2% → 12.4%), massively outperforming competitors.",
                  "All other vendors show declining or flat rates—major opportunity gap for Fortinet to maintain and extend lead in AI content authority."
                ]}
              />
            </div>
          </div>

          {/* Executive Note */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900">
              <span className="font-semibold">Executive Summary:</span> Fortinet demonstrates clear AI search leadership across all LLM metrics—62.6% visibility, 10.0% share of voice, and 12.4% citation rate with exceptional growth trajectory.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit AI Overview Metrics Data</h3>
            <div className="space-y-6">
              {VENDORS.map((vendor) => (
                <div key={vendor.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }} />
                    <h4 className="text-sm font-bold text-gray-900">{vendor.name}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Visibility %:</div>
                      {['Nov', 'Dec', 'Jan'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editableData.visibility[vendor.id][idx]}
                            onChange={(e) => handleValueChange('visibility', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Share of Voice %:</div>
                      {['Nov', 'Dec', 'Jan'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editableData.shareOfVoice[vendor.id][idx]}
                            onChange={(e) => handleValueChange('shareOfVoice', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Citation %:</div>
                      {['Nov', 'Dec', 'Jan'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editableData.citation[vendor.id][idx]}
                            onChange={(e) => handleValueChange('citation', vendor.id, idx, e.target.value)}
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

      {!isEditing && (
        <div className="mt-6">
          <CompetitorFilter competitors={VENDORS} visibleCompetitors={visibleVendors} onToggle={toggleVendor} />
        </div>
      )}

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}