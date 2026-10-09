import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COMPETITORS, TRAFFIC_MONTHS as MONTHS } from '@/app/data/seo-data';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react';
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
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';

// Format month for display
const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(monthNum) - 1]}-${year.slice(2)}`;
};

// ─────────────────────────────────────────────────────────────
// WW Traffic Data  (Source: Semrush · Location: WW · Jul 2025 – Sep 2026)
// ─────────────────────────────────────────────────────────────
const ORGANIC_TRAFFIC_WW: Record<string, (number | null)[]> = {
  fortinet:     [4600000, 5200000, 4700000, 4500000, 4400000, 4900000, 4800000, 4900000, 5400000, 5100000, 5000000, 5000000, 5100000, 4800000, 4600000],
  cisco:        [6100000, 6100000, 5800000, 19700000, 33500000, 26300000, 4400000, 5400000, 5500000, 5000000, 4800000, 4300000, 4600000, 4400000, 4900000],
  hpe:          [1800000, 2000000, 1900000, 1700000, 1600000, 1700000, 1600000, 1500000, 1500000, 1400000, 1500000, 1400000, 1400000, 1400000, 1600000],
  paloalto:     [700000,  900000,  1000000, 1300000, 1000000, 1000000, 900000,  1000000, 900000,  1000000, 1400000, 1300000, 1300000, 1200000, 1200000],
  checkpoint:   [1000000, 1000000, 1000000, 1100000, 862000,  838000,  737000,  742000,  751000,  730000,  737000,  812000,  836000,  871000,  2132000],
  crowdstrike:  [1065000, 2074000, 946000,  679000,  799000,  569000,  545000,  701000,  546000,  549000,  499000,  554000,  561000,  581000,  632000],
  catonetworks: [49000,   58000,   52000,   53000,   51000,   55000,   58000,   58000,   63000,   59000,   66000,   60000,   64000,   69000,   60000],
  sentinelone:  [346000,  348000,  363000,  405000,  511000,  383000,  413000,  509000,  444000,  487000,  515000,  475000,  502000,  501000,  464000],
  wiz:          [245000,  250000,  293000,  327000,  369000,  384000,  246000,  235000,  402000,  242000,  197000,  128000,  119000,  128000,  131000],
};

const BRANDED_TRAFFIC_WW: Record<string, (number | null)[]> = {
  fortinet:     [915790,  909300,  945910,  876570,  699660,  592310,  539740,  535500,  479330,  496100,  376770,  379940,  486600,  467130,  493000],
  cisco:        [2400000, 2400000, 2510000, 2170000, 1880000, 1680000, 1510000, 2290000, 2060000, 1600000, 1260000, 1090000, 1190000, 1170000, 900000],
  hpe:          [437920,  472980,  511020,  482410,  411390,  412380,  376850,  349900,  331060,  357250,  343860,  335570,  362930,  412010,  395870],
  paloalto:     [213470,  265170,  425440,  303500,  228210,  256460,  222660,  229450,  184550,  206410,  172850,  152090,  193710,  179960,  205900],
  checkpoint:   [191110,  209410,  203580,  192480,  179210,  159230,  157640,  139400,  126870,  124080,  112060,  99020,   113760,  115850,  106590],
  crowdstrike:  [647550,  1534900, 514460,  267720,  218810,  143380,  147050,  198360,  140990,  125630,  114250,  96360,   134710,  146890,  162430],
  catonetworks: [23650,   26240,   23690,   25650,   25090,   22370,   27170,   26710,   23710,   27750,   28000,   26580,   28850,   28520,   22480],
  sentinelone:  [166620,  156590,  157690,  155380,  156220,  149490,  142120,  151600,  102490,  131880,  86490,   115020,  119000,  91150,   86710],
  wiz:          [171510,  162800,  164290,  143800,  140090,  130490,  150230,  126920,  144160,  143600,  104260,  44400,   39880,   47620,   36650],
};

const NON_BRANDED_TRAFFIC_WW: Record<string, (number | null)[]> = {
  fortinet:     [3690000, 4260000, 3740000, 3620000, 3730000, 4300000, 4280000, 4330000, 4970000, 4620000, 4580000, 4620000, 4580000, 4350000, 4110000],
  cisco:        [3660000, 3730000, 3310000, 17550000,31650000,24620000,2880000, 3130000, 3490000, 3380000, 3520000, 3210000, 3410000, 3240000, 4010000],
  hpe:          [1390000, 1570000, 1380000, 1240000, 1160000, 1300000, 1190000, 1170000, 1190000, 1080000, 1110000, 1110000, 1050000, 1020000, 1180000],
  paloalto:     [527750,  612870,  609700,  950640,  747050,  722390,  678780,  772520,  690110,  815410,  1188170, 1125990, 1142250, 1061160, 1041960],
  checkpoint:   [825450,  827280,  824600,  870940,  682380,  678830,  579010,  602100,  623840,  605780,  625190,  712580,  722710,  755230,  2025220],
  crowdstrike:  [417500,  539290,  431240,  411780,  579770,  425580,  397580,  502550,  405480,  422970,  384660,  457440,  426580,  433710,  469580],
  catonetworks: [25620,   32200,   28490,   27670,   26010,   32320,   30760,   30970,   39520,   30910,   38040,   33690,   34980,   40530,   37630],
  sentinelone:  [179060,  191390,  204820,  249250,  354290,  233820,  271010,  357130,  341200,  354770,  428310,  360270,  383110,  409680,  376980],
  wiz:          [73500,   87660,   129080,  183010,  228570,  253310,  96050,   108120,  257400,  98150,   92460,   83180,   79170,   80050,   94710],
};

type TabType = 'overall' | 'branded' | 'non-branded';

interface EditableData {
  branded: (number | null)[];
  nonBranded: (number | null)[];
}

interface SlideTrafficOverviewTabsWWProps {
  onNavigateHome?: () => void;
}

export function SlideTrafficOverviewTabsWW({ onNavigateHome }: SlideTrafficOverviewTabsWWProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overall');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleCompetitors, setVisibleCompetitors] = useState<Set<string>>(
    new Set(COMPETITORS.map((c) => c.id))
  );

  const [editableTraffic, setEditableTraffic] = useState<Record<string, (number | null)[]>>(() => {
    const initial: Record<string, (number | null)[]> = {};
    COMPETITORS.forEach((comp) => {
      initial[comp.id] = [...ORGANIC_TRAFFIC_WW[comp.id]];
    });
    return initial;
  });

  const [editableBrandedData, setEditableBrandedData] = useState<Record<string, EditableData>>(() => {
    const initial: Record<string, EditableData> = {};
    COMPETITORS.forEach((comp) => {
      initial[comp.id] = {
        branded: [...BRANDED_TRAFFIC_WW[comp.id]],
        nonBranded: [...NON_BRANDED_TRAFFIC_WW[comp.id]],
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
      reset[comp.id] = [...ORGANIC_TRAFFIC_WW[comp.id]];
    });
    setEditableTraffic(reset);

    const resetBranded: Record<string, EditableData> = {};
    COMPETITORS.forEach((comp) => {
      resetBranded[comp.id] = {
        branded: [...BRANDED_TRAFFIC_WW[comp.id]],
        nonBranded: [...NON_BRANDED_TRAFFIC_WW[comp.id]],
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

  const handleBrandedValueChange = (
    competitorId: string,
    type: 'branded' | 'nonBranded',
    index: number,
    value: string
  ) => {
    const numValue = value === '' ? null : parseFloat(value);
    setEditableBrandedData((prev) => ({
      ...prev,
      [competitorId]: {
        ...prev[competitorId],
        [type]: prev[competitorId][type].map((v, i) => (i === index ? numValue : v)),
      },
    }));
  };

  // Chart data builders
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

  const brandedChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: label };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        dataPoint[competitor.id] = editableBrandedData[competitor.id].branded[i + tro];
      }
    });
    return dataPoint;
  });

  const nonBrandedChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: label };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        dataPoint[competitor.id] = editableBrandedData[competitor.id].nonBranded[i + tro];
      }
    });
    return dataPoint;
  });

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
          if (value !== null && value > maxValue) maxValue = value;
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
            content="From Jul 2025 to Sep 2026, WW traffic flat 4.6M → 4.6M (0%), Wiz fell 245K → 131K (−46.5%)."
          />
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Competitions"
            content="From Jul 2025 to Sep 2026, Cisco fell 6.1M → 4.9M (−19.7%), Crowdstrike 1.07M → 632K (−40.7%)."
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
            content="From Jul 2025 to Sep 2026, WW branded fell 916K → 493K (−46.2%), Wiz 172K → 37K (−78.6%)."
          />
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Competitions"
            content="From Jul 2025 to Sep 2026, Cisco fell 2.40M → 900K (−62.5%), Palo Alto 213K → 206K (−3.5%)."
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
            content="From Jul 2025 to Sep 2026, WW non-branded grew 3.69M → 4.11M (+11.4%), Palo Alto 528K → 1.04M (+97.4%)."
          />
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Competitions"
            content="From Jul 2025 to Sep 2026, Cisco grew 3.66M → 4.01M (+9.6%), Crowdstrike 418K → 470K (+12.5%)."
          />
        </InsightsSection>
      );
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 14; // Sep 2026
    let dataSource: Record<string, number[]>;

    if (activeTab === 'overall') {
      dataSource = {};
      COMPETITORS.forEach((c) => { dataSource[c.id] = editableTraffic[c.id] as number[]; });
    } else if (activeTab === 'branded') {
      dataSource = {};
      COMPETITORS.forEach((c) => { dataSource[c.id] = editableBrandedData[c.id].branded as number[]; });
    } else {
      dataSource = {};
      COMPETITORS.forEach((c) => { dataSource[c.id] = editableBrandedData[c.id].nonBranded as number[]; });
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
    const ordinal = (n: number) => n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`;

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

  const visibleCompetitorsList = COMPETITORS.filter((c) => visibleCompetitors.has(c.id));

  return (
    <SlideContainer slideNumber={15} onNavigateHome={onNavigateHome}>
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
                boxShadow:
                  activeTab === tab.id
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
        {/* Chart Section – 8 columns */}
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
                    key={`ww-${activeTab}-${Array.from(visibleCompetitors).sort().join('-')}`}
                  >
                    <LineChart id={`ww-linechart-${activeTab}`} data={getChartData()} margin={CHART_CONFIG.margin}>
                      <CartesianGrid id={`ww-cartesian-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
                      <XAxis id={`ww-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
                      <YAxis
                        id={`ww-yaxis-${activeTab}`}
                        {...CHART_CONFIG.yAxis}
                        tickFormatter={(value) => formatNumber(value)}
                        domain={getYAxisDomain(activeTab)}
                      />
                      <Tooltip
                        id={`ww-tooltip-${activeTab}`}
                        content={(props) => (
                          <CustomChartTooltip {...props} formatter={formatNumber} monthFormatter={formatMonth} />
                        )}
                      />
                      {visibleCompetitorsList.map((competitor) => (
                        <Line
                          key={`ww-${competitor.id}-${activeTab}`}
                          id={`ww-line-${activeTab}-${competitor.id}`}
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
                  {activeTab === 'overall' &&
                    COMPETITORS.map((competitor) => (
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
                                className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="null"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  {(activeTab === 'branded' || activeTab === 'non-branded') &&
                    COMPETITORS.map((competitor) => (
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
                                value={
                                  activeTab === 'branded'
                                    ? editableBrandedData[competitor.id].branded[idx] ?? ''
                                    : editableBrandedData[competitor.id].nonBranded[idx] ?? ''
                                }
                                onChange={(e) =>
                                  handleBrandedValueChange(
                                    competitor.id,
                                    activeTab === 'branded' ? 'branded' : 'nonBranded',
                                    idx,
                                    e.target.value
                                  )
                                }
                                className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

        {/* Insights Section – 4 columns */}
        <div className="col-span-4 flex flex-col gap-4">
          {getInsights()}
          {getPerformanceSummary()}
        </div>
      </div>

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}