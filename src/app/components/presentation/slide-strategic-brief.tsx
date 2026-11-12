import {
  TrendingUp,
  Trophy,
  Sparkles,
  Link2,
  Brain,
  Globe,
  BarChart3,
  Shield,
  AlertTriangle,
  XCircle,
  MinusCircle,
  Zap,
  Target,
} from 'lucide-react';
import { SlideContainer, SlideHeader, SlideFooter } from './design-system';

// ─── Category Scorecard Data (Profound – Oct 2026 latest snapshot) ──────────
const CATEGORIES = [
  {
    id: 'firewall',
    name: 'Firewall',
    ft: 71.3,
    rivalName: 'Palo Alto',
    rivalPct: 60.1,
    status: 'leader' as const,
    delta: '+11.2pp vs Palo Alto',
  },
  {
    id: 'sase',
    name: 'SASE',
    ft: 70.1,
    rivalName: 'Palo Alto',
    rivalPct: 68.6,
    status: 'leader' as const,
    delta: '+1.5pp vs Palo Alto',
  },
  {
    id: 'quantum',
    name: 'Quantum Security',
    ft: 33.6,
    rivalName: 'Palo Alto',
    rivalPct: 26.3,
    status: 'leader' as const,
    delta: '+7.3pp vs Palo Alto',
  },
  {
    id: 'ot',
    name: 'OT Security',
    ft: 42.5,
    rivalName: 'Palo Alto',
    rivalPct: 32.2,
    status: 'leader' as const,
    delta: '+10.3pp vs Palo Alto',
  },
  {
    id: 'ai',
    name: 'AI Cybersecurity',
    ft: 35.2,
    rivalName: 'CrowdStrike',
    rivalPct: 28.2,
    status: 'leader' as const,
    delta: '+7.0pp vs CrowdStrike',
  },
  {
    id: 'ztna',
    name: 'ZTNA',
    ft: 32.3,
    rivalName: 'Palo Alto',
    rivalPct: 51.5,
    status: 'gap' as const,
    delta: '−19.2pp vs Palo Alto',
  },
  {
    id: 'cloud',
    name: 'Cloud Security',
    ft: 24.0,
    rivalName: 'Palo Alto',
    rivalPct: 44.8,
    status: 'gap' as const,
    delta: '−20.8pp vs Palo Alto',
  },
  {
    id: 'secops',
    name: 'SecOps',
    ft: 10.9,
    rivalName: 'CrowdStrike',
    rivalPct: 50.0,
    status: 'critical' as const,
    delta: '−39.1pp vs CrowdStrike',
  },
];

// ─── Hero KPI Data ─────────────────────────────────────────────────────────────
const KPIS = [
  {
    id: 'traffic',
    value: '975K',
    label: 'Modeled US Traffic',
    sub: '−18.4% MoM · +9.6% vs Jul-25',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: TrendingUp,
  },
  {
    id: 'llm',
    value: '9.3%',
    label: 'LLM Citation Rate',
    sub: '#1 globally · Palo Alto 3.7% (2.5×)',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: Sparkles,
  },
  {
    id: 'aio',
    value: '44.0K',
    label: 'Page 1 Keywords',
    sub: '−4.1% MoM · 19.4% of footprint',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    icon: Brain,
  },
  {
    id: 'sov',
    value: '42.3%',
    label: 'Profound Visibility',
    sub: '0.9pp behind Palo Alto (43.2%)',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: Trophy,
  },
];

// ─── Priority Gaps with severity-based coloring ────────────────────────────────
const PRIORITY_GAPS = [
  {
    cat: 'SecOps',
    ft: 10.9,
    rival: 'CrowdStrike',
    rval: 50.0,
    gap: 39.1,
    severity: 'critical' as const,
  },
  {
    cat: 'Cloud Security',
    ft: 24.0,
    rival: 'Palo Alto',
    rval: 44.8,
    gap: 20.8,
    severity: 'gap' as const,
  },
  {
    cat: 'ZTNA',
    ft: 32.3,
    rival: 'Palo Alto',
    rval: 51.5,
    gap: 19.2,
    severity: 'gap' as const,
  },
];

const GAP_SEVERITY = {
  critical: {
    icon: <XCircle size={10} className="text-red-500 flex-shrink-0 mt-0.5" />,
    bar: 'bg-red-400',
    gapText: 'text-red-600',
    catText: 'text-red-800',
  },
  gap: {
    icon: <AlertTriangle size={10} className="text-amber-500 flex-shrink-0 mt-0.5" />,
    bar: 'bg-amber-400',
    gapText: 'text-amber-700',
    catText: 'text-amber-900',
  },
  watch: {
    icon: <MinusCircle size={10} className="text-yellow-500 flex-shrink-0 mt-0.5" />,
    bar: 'bg-yellow-400',
    gapText: 'text-yellow-700',
    catText: 'text-yellow-900',
  },
};

// ─── Roadmap Data ──────────────────────────────────────────────────────────────
const ROADMAP = [
  {
    id: 'r1',
    quarter: 'NOW · 0–30 DAYS',
    icon: BarChart3,
    title: 'Demand Recovery Diagnostic',
    detail: 'Explain the 40.6% MoM US impression decline and −52.5% Google-session gap to peak by query, URL, template, country and SERP feature. Fix tracking, indexing, canonical and decay issues before scaling production.',
    tagColor: 'bg-red-100 text-red-700 border-red-200',
    barColor: 'bg-red-500',
    impact: 'HIGH',
  },
  {
    id: 'r2',
    quarter: '30–60 DAYS',
    icon: Shield,
    title: 'Commercial Intent Sprint',
    detail: 'Refresh and interlink the highest-potential ZTNA, Cloud and SecOps pages. Prioritize solution, provider, platform and comparison intent; establish visibility for currently unranked "zero trust solutions" and "cloud security".',
    tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    barColor: 'bg-amber-500',
    impact: 'HIGH',
  },
  {
    id: 'r3',
    quarter: '60–90 DAYS',
    icon: Brain,
    title: 'AI Citation-to-Traffic System',
    detail: 'Protect the 9.3% citation rate with answer-first modules, expert evidence, entity consistency and schema. Build a vulnerability intelligence asset and AI research hub; target AIO traffic recovery from 96.7K toward 150K+.',
    tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
    barColor: 'bg-blue-500',
    impact: 'HIGH',
  },
  {
    id: 'r4',
    quarter: 'Q1 2027',
    icon: Globe,
    title: 'Authority & Conversion Flywheel',
    detail: 'Use digital PR, original FortiGuard data and expert-led vertical assets to earn category-relevant links. Refresh decayed glossary winners and connect them to proof-rich product pages with measurable demo and trial CTAs.',
    tagColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    barColor: 'bg-emerald-500',
    impact: 'MED',
  },
];

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  leader:   { label: 'LEADING',  badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  gap:      { label: 'GAP',      badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  critical: { label: 'CRITICAL', badge: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
};

// ─── Category Row ──────────────────────────────────────────────────────────────
function CategoryRow({ cat }: { cat: typeof CATEGORIES[0] }) {
  const st = STATUS[cat.status];
  const isLeader = cat.status === 'leader';
  const isCritical = cat.status === 'critical';
  const rivalPct = cat.rivalPct ?? 0;

  return (
    <div className={`flex items-center gap-3 py-1.5 ${isCritical ? 'bg-red-50/60 -mx-4 px-4 rounded' : ''}`}>
      {/* Name */}
      <div className="w-32 flex-shrink-0">
        <span className={`text-[11px] font-semibold leading-tight ${isCritical ? 'text-red-800' : 'text-gray-700'}`}>
          {cat.name}
        </span>
      </div>

      {/* Bar track */}
      <div className="flex-1 h-4 bg-gray-100 rounded-full relative overflow-hidden">
        {/* Rival bar (behind) */}
        {cat.rivalPct !== null && (
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gray-300 opacity-60"
            style={{ width: `${rivalPct}%` }}
          />
        )}
        {/* Fortinet bar */}
        <div
          className={`absolute top-0 left-0 h-full rounded-full ${
            isLeader ? 'bg-emerald-500' : isCritical ? 'bg-red-500' : 'bg-amber-500'
          }`}
          style={{ width: `${cat.ft}%`, opacity: isCritical ? 0.8 : 1 }}
        />
      </div>

      {/* FT % */}
      <div className="w-11 flex-shrink-0 text-right">
        <span className={`text-[11px] font-bold ${
          isLeader ? 'text-emerald-600' : isCritical ? 'text-red-600' : 'text-amber-600'
        }`}>
          {cat.ft}%
        </span>
      </div>

      {/* Status badge */}
      <div
        className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide ${st.badge}`}
        style={{ borderColor: 'transparent' }}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
        {st.label}
      </div>

      {/* Delta */}
      <div className="w-36 flex-shrink-0">
        <span className={`text-[10px] font-medium ${
          isLeader ? 'text-emerald-600' : isCritical ? 'text-red-600' : 'text-amber-600'
        }`}>
          {isLeader ? '✓' : '▲'} {cat.delta}
        </span>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SlideStrategicBrief({ onNavigateHome }: { onNavigateHome?: () => void }) {
  return (
    <SlideContainer slideNumber={29} onNavigateHome={onNavigateHome} source="">
      <SlideHeader
        title="Executive Strategy Brief"
        subtitle="SEO Competitive Summary · Jul-25 – Oct-26 · 16-Month View · US & WW · Traffic, keywords, Profound & backlinks through Oct"
      />

      {/* ── Verdict Banner ─────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 mb-4 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white font-black text-[13px] leading-tight">
                Strong authority, but October demand softened: 5 of 8 categories led · #1 citation rate in the tracked set (9.3%) · 31 of 48 strategic keywords at position #1
              </p>
              <p className="text-red-100 text-[10px] mt-0.5">
                Four category leads narrowed · ZTNA, Cloud and SecOps gaps widened · Profound visibility trails Palo Alto by 0.9pp · modeled traffic fell 18.4% MoM while Google sessions remain 52.5% below peak
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-right pl-4">
            <div className="text-white font-black text-[28px] leading-none">5/8</div>
            <div className="text-red-200 text-[9px] font-bold tracking-wide uppercase">Categories Led</div>
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Layout ────────────────────────────────────────────── */}
      <div className="flex-1 flex gap-4 mb-4 min-h-0">

        {/* Left: Category Scorecard */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Section label */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Category Visibility Scorecard
            </span>
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[9px] text-gray-400">Source: Profound · Nov-25 – Oct-26</span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded bg-emerald-500" />
              <span className="text-[9px] text-gray-500">Fortinet (Leading)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded bg-amber-500" />
              <span className="text-[9px] text-gray-500">Fortinet (Gap)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded bg-red-500" />
              <span className="text-[9px] text-gray-500">Fortinet (Critical)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded bg-gray-300" />
              <span className="text-[9px] text-gray-500">Top Competitor</span>
            </div>
          </div>

          {/* Rows */}
          <div className="flex-1 flex flex-col justify-around bg-white rounded-xl border border-gray-200 px-4 py-2 shadow-sm">
            {CATEGORIES.map((cat, idx) => (
              <div key={cat.id}>
                <CategoryRow cat={cat} />
                {idx < CATEGORIES.length - 1 && (
                  <div className="h-px bg-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: KPIs + Priority Gaps */}
        <div className="w-[280px] flex-shrink-0 flex flex-col gap-3">

          {/* Section label */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Performance Metrics</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* 4 KPI cards in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2">
            {KPIS.map((kpi) => {
              const KpiIcon = kpi.icon;
              return (
                <div
                  key={kpi.id}
                  className={`rounded-xl border ${kpi.border} ${kpi.bg} p-3 flex flex-col gap-1`}
                >
                  <div className="flex items-center justify-between">
                    <KpiIcon size={12} className={kpi.color} strokeWidth={2.5} />
                  </div>
                  <div className={`text-[20px] font-black leading-none ${kpi.color}`}>{kpi.value}</div>
                  <div className="text-[9.5px] font-bold text-gray-700 leading-tight">{kpi.label}</div>
                  <div className="text-[9px] text-gray-500 leading-tight">{kpi.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Priority Gaps */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority Gaps</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-2.5 shadow-sm">
              {PRIORITY_GAPS.map((g) => {
                const sev = GAP_SEVERITY[g.severity];
                return (
                  <div key={g.cat} className="flex items-start gap-2">
                    {sev.icon}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold ${sev.catText}`}>{g.cat}</span>
                        <span className={`text-[9px] font-bold ${sev.gapText}`}>−{g.gap}pp</span>
                      </div>
                      <div className="text-[9px] text-gray-500">
                        {g.ft}% vs {g.rival} {g.rval}%
                      </div>
                      {/* Severity-tinted gap bar */}
                      <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${sev.bar} rounded-full`}
                          style={{ width: `${(g.ft / g.rval) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content gap note */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target size={10} className="text-red-600" />
              <span className="text-[9.5px] font-bold text-red-700 uppercase tracking-wide">Content Volume Gap</span>
            </div>
            <div className="space-y-0.5">
              {[
                { brand: 'Check Point', count: '1,154 pages' },
                { brand: 'SentinelOne', count: '1,100 pages' },
                { brand: 'Palo Alto', count: '814 pages' },
                { brand: 'CrowdStrike', count: '606 pages' },
              ].map((c) => (
                <div key={c.brand} className="flex justify-between items-center">
                  <span className="text-[9px] text-gray-600">{c.brand}</span>
                  <span className="text-[9px] font-semibold text-red-700">{c.count}</span>
                </div>
              ))}
            </div>
            <p className="text-[8.5px] text-red-400 mt-1.5 leading-tight">
              Oct-26: Fortinet 633 pages (+9). Close the gap with differentiated assets and stronger journeys—not volume alone
            </p>
          </div>
        </div>
      </div>

      {/* ── Strategic Roadmap Strip ──────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px w-4 bg-gray-200" />
          <Zap size={10} className="text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Strategic Roadmap · Recovery → Commercial Growth → AI Authority
          </span>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[9px] text-gray-400">4 Priority Actions</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {ROADMAP.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Colored top strip */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${item.barColor}`} />

                <div className="pt-1">
                  {/* Quarter + impact */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                      {item.quarter}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                      item.impact === 'HIGH'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {item.impact}
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-start gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ItemIcon size={12} className="text-gray-600" strokeWidth={2} />
                    </div>
                    <p className="text-[11px] font-bold text-gray-900 leading-tight">{item.title}</p>
                  </div>

                  {/* Detail */}
                  <p className="text-[9.5px] text-gray-500 leading-relaxed">{item.detail}</p>
                </div>

                {/* Step number */}
                <div className="absolute bottom-2.5 right-3 text-[18px] font-black text-gray-100 leading-none pointer-events-none">
                  {idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SlideFooter source="Source: Semrush traffic & keywords, Profound, GA, GSC, Top 50 KW & backlinks through Oct-26 · Competitive Intel through Oct-26" />
    </SlideContainer>
  );
}
