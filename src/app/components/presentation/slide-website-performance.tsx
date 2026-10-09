import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Trophy } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  SlideContainer, SlideHeader, SlideFooter, ChartContainer,
  InsightCard, InsightsSection, CompetitorFilter, CHART_CONFIG,
  TimeRange, getTimeRangeOffset, TimeRangeFilter,
} from './design-system';

// ─── Types ─────────────────────────────────────────────────────────────────────

type DeviceTab = 'desktop' | 'mobile';
type MetricKey = 'performance' | 'accessibility' | 'speed';

// ─── Vendors ───────────────────────────────────────────────────────────────────

const VENDORS = [
  { id: 'fortinet',    name: 'Fortinet',     color: '#EF4444' },
  { id: 'cisco',       name: 'Cisco',        color: '#FF7AB6' },
  { id: 'hpe',         name: 'HPE',          color: '#7ED957' },
  { id: 'paloalto',    name: 'Palo Alto',    color: '#FFB14A' },
  { id: 'checkpoint',  name: 'Check Point',  color: '#6C9AFF' },
  { id: 'crowdstrike', name: 'CrowdStrike',  color: '#1F2937' },
];

const MONTHS = ['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09'];

const formatMonth = (key: string) => {
  const map: Record<string,string> = {
    '2025-12':'Dec-25','2026-01':'Jan-26','2026-02':'Feb-26','2026-03':'Mar-26',
    '2026-04':'Apr-26','2026-05':'May-26','2026-06':'Jun-26','2026-07':'Jul-26','2026-08':'Aug-26','2026-09':'Sep-26',
  };
  return map[key] ?? key;
};

// ─── Data ──────────────────────────────────────────────────────────────────────

type MetricData = { performance: number[]; accessibility: number[]; speed: number[] };

const DESKTOP: Record<string, MetricData> = {
  fortinet:    { performance: [52,57,62,64,45,67,51,49,53,46], accessibility: [90,86,90,90,93,93,93,93,93,93], speed: [3.3,3.6,3.4,3.6,3.8,2.9,3.7,3.5,3.6,4.4] },
  cisco:       { performance: [83,76,74,76,67,55,48,69,63,62], accessibility: [99,94,96,94,91,90,96,96,96,96], speed: [2.0,2.0,2.0,2.0,1.4,2.4,1.9,2.5,2.3,2.0] },
  hpe:         { performance: [62,50,48,46,67,55,75,50,35,44], accessibility: [89,93,91,92,96,93,96,96,96,96], speed: [2.0,3.0,3.0,3.0,1.6,1.8,1.3,1.7,12.0,2.0] },
  paloalto:    { performance: [86,85,84,86,94,91,83,82,89,86], accessibility: [96,96,96,96,100,100,100,100,100,100], speed: [1.6,2.1,1.6,1.8,1.5,1.6,2.5,2.4,1.3,1.8] },
  checkpoint:  { performance: [100,100,100,100,100,52,100,41,28,32], accessibility: [73,73,73,73,73,99,73,99,99,99], speed: [0.2,0.2,0.2,0.2,0.2,0.2,0.2,2.6,3.2,3.0] },
  crowdstrike: { performance: [40,12,16,24,16,14,15,16,25,20], accessibility: [83,84,83,84,84,93,84,84,81,81], speed: [3.0,4.0,3.8,3.4,3.5,5.0,3.8,3.7,3.4,4.0] },
};

const MOBILE: Record<string, MetricData> = {
  fortinet:    { performance: [37,38,38,38,30,36,33,34,32,29], accessibility: [93,93,93,93,97,97,93,97,97,97], speed: [12.9,9.4,9.3,9.4,10.4,9.1,8.9,8.7,9.5,11.7] },
  cisco:       { performance: [50,38,34,38,48,29,26,33,50,46], accessibility: [99,94,90,94,91,90,98,96,96,96], speed: [9.4,10.0,9.3,8.6,6.1,9.7,10.0,12.1,7.1,7.6] },
  hpe:         { performance: [22,38,34,32,40,28,36,28,31,45], accessibility: [86,90,88,86,93,90,96,96,96,96], speed: [6.0,7.1,6.8,6.4,7.3,14.7,12.6,13.9,11.7,12.2] },
  paloalto:    { performance: [67,69,64,62,70,67,58,68,65,62], accessibility: [96,96,96,96,100,100,100,100,100,100], speed: [6.0,4.7,4.3,4.6,4.1,6.1,6.0,5.6,5.7,5.4] },
  checkpoint:  { performance: [100,100,100,100,100,33,100,32,32,34], accessibility: [73,73,73,73,73,95,73,95,95,95], speed: [0.8,0.8,0.8,0.8,0.8,9.8,0.8,11.8,10.1,10.0] },
  crowdstrike: { performance: [28,35,38,43,31,27,35,5,8,32], accessibility: [83,84,83,84,84,84,84,84,81,81], speed: [12.3,14.0,12.0,12.4,16.1,16.7,15.0,15.2,14.6,18.5] },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function SubFilter<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all border ${
            value === opt.id
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, isSpeed }: any) => {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].filter((e:any) => e.value != null)
    .sort((a:any,b:any) => isSpeed ? a.value - b.value : b.value - a.value);
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[180px]">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {sorted.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}</span>
          </div>
          <span className="font-bold text-gray-900">
            {isSpeed ? `${entry.value}s` : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function SlideWebsitePerformance({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [deviceTab, setDeviceTab]   = useState<DeviceTab>('desktop');
  const [metric, setMetric]         = useState<MetricKey>('performance');
  const [visible, setVisible]       = useState<Set<string>>(new Set(VENDORS.map(v => v.id)));
  const [timeRange, setTimeRange]   = useState<TimeRange>('all');

  const toggle = (id: string) => {
    setVisible(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const dataset = deviceTab === 'desktop' ? DESKTOP : MOBILE;
  const isSpeed = metric === 'speed';

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const chartData = MONTHS.slice(tro).map((month, i) => {
    const dp: any = { month };
    VENDORS.forEach(v => { if (visible.has(v.id)) dp[v.id] = dataset[v.id][metric][i + tro]; });
    return dp;
  });

  // Score-based color bands for reference lines (Performance / Accessibility)
  const showBands = !isSpeed;

  // ── Insights ──────────────────────────────────────────────────────────────────

  const renderInsights = () => {
    const d = dataset;
    const win = (a: number[]) => a.slice(tro);
    const nWin = MONTHS.length - tro;
    const avgOf = (a: number[]) => win(a).reduce((x, y) => x + y, 0) / nWin;
    const minOf = (a: number[]) => Math.min(...win(a));
    const maxOf = (a: number[]) => Math.max(...win(a));
    const last = MONTHS.length - 1;
    if (metric === 'performance') {
      const paAvg = avgOf(d.paloalto.performance);
      const csAvg = avgOf(d.crowdstrike.performance);
      const ftLatest = d.fortinet.performance[last];
      const cpLatest = d.checkpoint.performance[last];
      const paLatest = d.paloalto.performance[last];
      return (
        <InsightsSection>
          <InsightCard icon={Trophy} type="success" title="Palo Alto Leads"
            content={`Palo Alto leads ${deviceTab} performance in Sep 2026 at ${paLatest}/100: avg ${paAvg.toFixed(0)}/100 and a steady ${minOf(d.paloalto.performance)}–${maxOf(d.paloalto.performance)} range. No severe drops across ${nWin} months.`} />
          <InsightCard icon={AlertTriangle} type="warning" title={`Fortinet ${ftLatest} in Sep`}
            content={`Fortinet scored ${ftLatest}/100 on ${deviceTab} performance in Sep 2026. ${deviceTab === 'mobile' ? 'Mobile scores consistently lag desktop — mobile optimisation is a priority.' : `Scores fluctuate ${minOf(d.fortinet.performance)}–${maxOf(d.fortinet.performance)}, indicating inconsistent optimisation.`}`} />
          <InsightCard icon={TrendingDown} type="error" title="CrowdStrike Critical"
            content={`CrowdStrike ${deviceTab} performance avg ${csAvg.toFixed(0)}/100 — the lowest of all vendors. ${deviceTab === 'mobile' ? 'Sep 2026 mobile at 32/100 — recovery from Jul low of 5 and Aug 8.' : 'At or below 25 every month since Jan 2026.'} Check Point also volatile: scored ${cpLatest} in Sep.`} />
        </InsightsSection>
      );
    }
    if (metric === 'accessibility') {
      const paAvg = avgOf(d.paloalto.accessibility);
      const cpLatest = d.checkpoint.accessibility[last];
      const cpPerfLatest = d.checkpoint.performance[last];
      const ftLatest = d.fortinet.accessibility[last];
      const second = VENDORS.filter(v => v.id !== 'paloalto')
        .map(v => ({ name: v.name, avg: avgOf(d[v.id].accessibility) }))
        .sort((a, b) => b.avg - a.avg)[0];
      return (
        <InsightsSection>
          <InsightCard icon={Trophy} type="success" title="Palo Alto Leads"
            content={`Palo Alto scores ${paAvg.toFixed(0)}/100 avg accessibility — highest of all vendors with a perfect 100 every month since Apr 2026 (${deviceTab}). ${second.name} next at ${second.avg.toFixed(0)}/100 avg.`} />
          <InsightCard icon={TrendingUp} type="info" title={`Fortinet ${ftLatest}/100`}
            content={`Fortinet accessibility scores ${ftLatest}/100 in Sep 2026 on ${deviceTab}. ${minOf(d.fortinet.accessibility) === maxOf(d.fortinet.accessibility) ? `Scores have held at ${ftLatest}` : `Scores have stayed within ${minOf(d.fortinet.accessibility)}–${maxOf(d.fortinet.accessibility)}`} — solid foundation, room to reach 100.`} />
          <InsightCard icon={TrendingUp} type="success" title="Check Point Improved"
            content={`Check Point ${deviceTab} accessibility is now ${cpLatest}/100 in Sep 2026, up from 73 through Apr 2026. The weak spot has shifted to performance, at ${cpPerfLatest}/100.`} />
        </InsightsSection>
      );
    }
    // Speed Index
    const ftLatest = d.fortinet.speed[last]; const ftFirst = d.fortinet.speed[0];
    const paLatest = d.paloalto.speed[last];
    const csLatest = d.crowdstrike.speed[last];
    const cpLatest = d.checkpoint.speed[last];
    const bySpeed = VENDORS.map(v => ({ name: v.name, val: d[v.id].speed[last] })).sort((a, b) => a.val - b.val);
    const fastest = bySpeed[0]; const runnerUp = bySpeed[1];
    const slowest = bySpeed[bySpeed.length - 1];
    const ftAbove3 = win(d.fortinet.speed).filter(v => v > 3).length;
    return (
      <InsightsSection>
        <InsightCard icon={Trophy} type="success" title={`${fastest.name} Fastest`}
          content={`${fastest.name} ${deviceTab} Speed Index is ${fastest.val}s in Sep 2026 — fastest of all vendors (${runnerUp.name} ${runnerUp.val}s). Check Point, once ${deviceTab === 'desktop' ? '0.2s' : '0.8s'}, has slipped to ${cpLatest}s since its Jul ${deviceTab === 'desktop' ? '2.6s' : '11.8s'} spike.`} />
        <InsightCard icon={TrendingDown} type="warning" title={`Fortinet ${ftLatest}s`}
          content={`Fortinet ${deviceTab} Speed Index at ${ftLatest}s in Sep 2026. ${deviceTab === 'mobile' ? `Up from ${d.fortinet.speed[last - 1]}s in Aug (best ${d.fortinet.speed[7]}s in Jul); better than Dec's ${ftFirst}s but still slow vs Palo Alto's ${paLatest}s.` : `Above the recommended 3s target in ${ftAbove3} of ${nWin} months — Sep is the slowest in the series.`}`} />
        <InsightCard icon={TrendingDown} type="error" title="CrowdStrike Slow"
          content={`CrowdStrike ${deviceTab} Speed Index at ${csLatest}s in Sep 2026 — ${slowest.name === 'CrowdStrike' ? 'the slowest of all vendors' : `second slowest, behind ${slowest.name}'s ${slowest.val}s`}. ${deviceTab === 'mobile' ? `Range ${minOf(d.crowdstrike.speed)}–${maxOf(d.crowdstrike.speed)}s is severely slow; this directly impacts bounce rate and Core Web Vitals.` : `Peaked at 5.0s in May — never below the 3s target.`}`} />
      </InsightsSection>
    );
  };

  const metricLabel = metric === 'performance' ? 'Performance Score' : metric === 'accessibility' ? 'Accessibility Score' : 'Speed Index (seconds)';
  const yDomain = isSpeed ? [0, 'auto'] as [number, string] : [0, 100] as [number, number];

  const footerSource = `Source: Page Speed Insights · ${deviceTab === 'desktop' ? 'Desktop' : 'Mobile'} · Dec 2025 – Sep 2026`;

  return (
    <SlideContainer slideNumber={26} onNavigateHome={onNavigateHome} source="Page Speed Insights">
      <SlideHeader
        title="Website Performance by Device"
        subtitle="Page Speed Insights · Performance, Accessibility & Speed Index · Dec 2025 – Sep 2026"
      />

      <div className="flex-1 flex flex-col gap-3">

        {/* ── Device Tabs ──────────────────────────────────────────────────── */}
        <div className="flex items-end gap-1">
          {([
            { id: 'desktop' as DeviceTab, label: 'Desktop' },
            { id: 'mobile'  as DeviceTab, label: 'Mobile'  },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDeviceTab(tab.id)}
              className={`px-8 py-2.5 text-sm font-semibold transition-all duration-200 relative ${
                deviceTab === tab.id
                  ? 'bg-white text-red-600 z-10'
                  : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300'
              }`}
              style={{
                borderRadius: '12px 12px 0 0',
                marginBottom: '-2px',
                boxShadow: deviceTab === tab.id
                  ? '0 -2px 8px rgba(0,0,0,0.08), 0 2px 0 0 white'
                  : '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Metric Sub-filter ────────────────────────────────────────────── */}
        <SubFilter
          options={[
            { id: 'performance'   as MetricKey, label: 'Performance'   },
            { id: 'accessibility' as MetricKey, label: 'Accessibility' },
            { id: 'speed'         as MetricKey, label: 'Speed Index'   },
          ]}
          value={metric}
          onChange={setMetric}
        />

        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />

        {/* ── Main Grid ────────────────────────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">

          {/* Chart — 8 cols */}
          <div className="col-span-8 flex flex-col">
            <ChartContainer title="" height={380}>
              <div className="h-full flex flex-col">
                <div className="pb-3 border-b border-gray-200 mb-3">
                  <CompetitorFilter competitors={VENDORS} visibleCompetitors={visible} onToggle={toggle} />
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                      <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                      <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
                      <YAxis
                        {...CHART_CONFIG.yAxis}
                        domain={yDomain}
                        tickFormatter={(v) => isSpeed ? `${v}s` : `${v}`}
                        label={isSpeed ? undefined : { value: metricLabel, angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#9CA3AF' }, dx: -4 }}
                      />
                      <Tooltip content={(props) => <CustomTooltip {...props} isSpeed={isSpeed} />} />
                      {/* Reference lines for score zones */}
                      {showBands && (
                        <>
                          <ReferenceLine y={90} stroke="#10B981" strokeDasharray="4 3" strokeWidth={1} label={{ value: 'Good 90+', position: 'insideTopRight', fontSize: 9, fill: '#10B981' }} />
                          <ReferenceLine y={50} stroke="#F59E0B" strokeDasharray="4 3" strokeWidth={1} label={{ value: 'Needs Work 50', position: 'insideTopRight', fontSize: 9, fill: '#F59E0B' }} />
                        </>
                      )}
                      {isSpeed && (
                        <ReferenceLine y={3} stroke="#F59E0B" strokeDasharray="4 3" strokeWidth={1} label={{ value: '3s target', position: 'insideTopRight', fontSize: 9, fill: '#F59E0B' }} />
                      )}
                      {VENDORS.filter(v => visible.has(v.id)).map(v => (
                        <Line
                          key={v.id}
                          type="monotone"
                          dataKey={v.id}
                          name={v.name}
                          stroke={v.color}
                          strokeWidth={v.id === 'fortinet' ? 2.5 : 2}
                          dot={{ fill: v.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartContainer>
          </div>

          {/* Insights — 4 cols */}
          <div className="col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
            {renderInsights()}

            {/* Sep 2026 Snapshot */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 border-2 border-gray-200 rounded-xl p-4 shadow-sm flex-shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                Sep 2026 · {deviceTab === 'desktop' ? 'Desktop' : 'Mobile'} · {metricLabel}
              </p>
              <div className="space-y-1.5">
                {VENDORS.map(v => {
                  const val = dataset[v.id][metric][9];
                  const isGood = isSpeed ? val <= 3 : val >= 90;
                  const isBad  = isSpeed ? val >= 6 : val < 50;
                  return (
                    <div key={v.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: v.color }} />
                        <span className={`text-xs font-medium ${v.id === 'fortinet' ? 'text-red-700 font-bold' : 'text-gray-700'}`}>{v.name}</span>
                      </div>
                      <span className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded ${
                        isGood ? 'bg-green-100 text-green-700' :
                        isBad  ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {isSpeed ? `${val}s` : val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlideFooter source={footerSource} />
    </SlideContainer>
  );
}
