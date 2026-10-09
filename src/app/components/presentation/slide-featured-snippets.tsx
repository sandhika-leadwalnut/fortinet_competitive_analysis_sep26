import { useState } from 'react';
import { TrendingDown, Trophy } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  ChartContainer,
  InsightCard,
  InsightsSection,
  CompetitorFilter,
  CHART_CONFIG,
  TimeRange,
  getTimeRangeOffset,
  TimeRangeFilter,
} from './design-system';

// ─── Vendors ──────────────────────────────────────────────────────────────────

const VENDORS = [
  { id: 'fortinet',     name: 'Fortinet',      color: '#EF4444' },
  { id: 'cisco',        name: 'Cisco',         color: '#FF7AB6' },
  { id: 'hpe',          name: 'HPE',           color: '#7ED957' },
  { id: 'paloalto',     name: 'Palo Alto',     color: '#FFB14A' },
  { id: 'sentinelone',  name: 'SentinelOne',   color: '#F59E0B' },
  { id: 'crowdstrike',  name: 'CrowdStrike',   color: '#1F2937' },
  { id: 'checkpoint',   name: 'Check Point',   color: '#6C9AFF' },
  { id: 'cato',         name: 'Cato Networks', color: '#A78BFA' },
  { id: 'wiz',          name: 'Wiz',           color: '#06B6D4' },
];

// ─── Data (Dec 2025 → Sep 2026) ───────────────────────────────────────────────

const MONTH_KEYS = [
  '2025-12', '2026-01', '2026-02', '2026-03',
  '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09',
];

const formatMonth = (key: string) => {
  const map: Record<string, string> = {
    '2025-12': 'Dec-25', '2026-01': 'Jan-26', '2026-02': 'Feb-26',
    '2026-03': 'Mar-26', '2026-04': 'Apr-26', '2026-05': 'May-26',
    '2026-06': 'Jun-26', '2026-07': 'Jul-26', '2026-08': 'Aug-26', '2026-09': 'Sep-26',
  };
  return map[key] ?? key;
};

const SNIPPET_DATA: Record<string, (number | null)[]> = {
  fortinet:    [287, 359, 385, 227, 111, 116, 130, 143,  81,  13],
  cisco:       [183, 208, 201, 133,  84,  76,  61,  58,  53,   8],
  hpe:         [ 69,  82,  82,  54,  44,  39,  42,  45,  18,   1],
  paloalto:    [ 61,  70,  64,  34,  18,  20,  21,  22,  13,   3],
  sentinelone: [ 15,  34,  47,  32,  17,  10,  10,  12,   8,   3],
  crowdstrike: [ 11,  13,  14,  10,   9,   7,   3,   4,   2,   0],
  checkpoint:  [ 21,  30,  20,  12,   7,   9,   8,   4,   4,   2],
  cato:        [  1,   4,   4,   3,   4,   2,   0,   1,   1,   0],
  wiz:         [  4,   7,   9,   4,   3,   5,   4,   1,   1,   0],
};

// H2 2025 averages (Jul–Dec 2025)
const H2_AVG: Record<string, number | null> = {
  fortinet:    496,
  cisco:       299,
  hpe:         121,
  paloalto:    89,
  sentinelone: null,
  crowdstrike: 48,
  checkpoint:  43,
  cato:        null,
  wiz:         null,
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const valid = [...payload]
    .filter((e: any) => e.value != null)
    .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0));
  if (!valid.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {valid.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs mb-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-700">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SlideFeaturedSnippets({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(VENDORS.map((v) => v.id))
  );
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const toggleVendor = (id: string) => {
    setVisibleVendors((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const tro = getTimeRangeOffset(timeRange, MONTH_KEYS.length);

  const chartData = MONTH_KEYS.slice(tro).map((monthKey, i) => {
    const dp: any = { month: monthKey };
    VENDORS.forEach((v) => {
      if (visibleVendors.has(v.id)) dp[v.id] = SNIPPET_DATA[v.id]?.[i + tro] ?? null;
    });
    return dp;
  });

  // Latest (Sep 2026) rankings
  const latestIdx = 9;
  const rankings = VENDORS.map((v) => ({
    ...v,
    value: SNIPPET_DATA[v.id]?.[latestIdx] ?? 0,
    h2avg: H2_AVG[v.id],
  })).sort((a, b) => b.value - a.value);

  const ftLatest  = rankings.find((r) => r.id === 'fortinet')!;
  const ftPeak    = Math.max(...(SNIPPET_DATA.fortinet as number[])); // 385 (Feb 2026)
  const ftDecline = (((ftPeak - ftLatest.value) / ftPeak) * 100).toFixed(0);
  const ftH2Decline = (((H2_AVG.fortinet! - ftLatest.value) / H2_AVG.fortinet!) * 100).toFixed(0);
  const prevIdx = latestIdx - 1; // Aug 2026
  const ftPrev = SNIPPET_DATA.fortinet[prevIdx] as number;
  const ftMoM = Math.abs(((ftLatest.value - ftPrev) / ftPrev) * 100).toFixed(0);
  const allDeclined = VENDORS.every((v) => (SNIPPET_DATA[v.id][latestIdx] as number) < (SNIPPET_DATA[v.id][prevIdx] as number));

  return (
    <SlideContainer slideNumber={22} onNavigateHome={onNavigateHome} source="SEMrush">
      <SlideHeader
        title="Website Featured Snippets"
        subtitle="Google Featured Snippet Count · Dec 2025 – Sep 2026 · Source: SEMrush"
      />

      <div className="flex-1 flex flex-col gap-6">
        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />

        {/* ── Main content: chart + insights ──────────────────────────────── */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">

          {/* Chart — 8 cols */}
          <div className="col-span-8 flex flex-col">
            <ChartContainer title="" height={380}>
              <div className="h-full flex flex-col">
                <div className="pb-3 border-b border-gray-200 mb-3">
                  <CompetitorFilter
                    competitors={VENDORS}
                    visibleCompetitors={visibleVendors}
                    onToggle={toggleVendor}
                  />
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                      <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                      <XAxis
                        dataKey="month"
                        {...CHART_CONFIG.xAxis}
                        tickFormatter={formatMonth}
                      />
                      <YAxis {...CHART_CONFIG.yAxis} />
                      <Tooltip content={<CustomTooltip />} />
                      {VENDORS.filter((v) => visibleVendors.has(v.id)).map((v) => (
                        <Line
                          key={v.id}
                          type="monotone"
                          dataKey={v.id}
                          name={v.name}
                          stroke={v.color}
                          {...CHART_CONFIG.line}
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
          <div className="col-span-4 flex flex-col gap-4">
            <InsightsSection>
              <InsightCard
                icon={Trophy}
                type="success"
                title="Fortinet Leads"
                content={`${ftLatest.value} snippets in Sep 2026 — ${(ftLatest.value / rankings[1].value).toFixed(1)}× Cisco (#2 at ${rankings[1].value}) and clear category leader across all 9 vendors.`}
              />
              <InsightCard
                icon={TrendingDown}
                type="warning"
                title="Market Decline"
                content={`Fortinet dropped from H2 2025 avg of 496 to ${ftLatest.value} in Sep 2026 (−${ftH2Decline}% decline), mirroring a market-wide reduction in snippet saturation.`}
              />
              <InsightCard
                icon={TrendingDown}
                type="error"
                title="Sep Collapse"
                content={`Fortinet peaked at ${ftPeak} in Feb 2026 and fell to ${ftLatest.value} in Sep 2026 (−${ftDecline}% from peak, −${ftMoM}% MoM from ${ftPrev} in Aug). ${allDeclined ? 'Market-wide drop in Sep — all 9 vendors declined vs Aug.' : 'Most vendors declined vs Aug.'}`}
              />
            </InsightsSection>

          </div>
        </div>
      </div>

      <SlideFooter source="Source: SEMrush · Featured Snippets · Jul 2025 – Sep 2026" />
    </SlideContainer>
  );
}
