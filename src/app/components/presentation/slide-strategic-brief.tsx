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

// ─── Category Scorecard Data (Profound – Sep 2026 latest snapshot) ──────────
const CATEGORIES = [
  {
    id: 'firewall',
    name: 'Firewall',
    ft: 71.7,
    rivalName: 'Palo Alto',
    rivalPct: 56.4,
    status: 'leader' as const,
    delta: '+15.3pp vs Palo Alto',
  },
  {
    id: 'sase',
    name: 'SASE',
    ft: 71.1,
    rivalName: 'Palo Alto',
    rivalPct: 63.2,
    status: 'leader' as const,
    delta: '+7.9pp vs Palo Alto',
  },
  {
    id: 'quantum',
    name: 'Quantum Security',
    ft: 38.5,
    rivalName: 'Palo Alto',
    rivalPct: 25.3,
    status: 'leader' as const,
    delta: '+13.2pp vs Palo Alto',
  },
  {
    id: 'ot',
    name: 'OT Security',
    ft: 42.2,
    rivalName: 'Palo Alto',
    rivalPct: 34.1,
    status: 'leader' as const,
    delta: '+8.1pp vs Palo Alto',
  },
  {
    id: 'ai',
    name: 'AI Cybersecurity',
    ft: 39.6,
    rivalName: 'CrowdStrike',
    rivalPct: 28.1,
    status: 'leader' as const,
    delta: '+11.5pp vs CrowdStrike',
  },
  {
    id: 'ztna',
    name: 'ZTNA',
    ft: 33.1,
    rivalName: 'Palo Alto',
    rivalPct: 44.1,
    status: 'gap' as const,
    delta: '−11.0pp vs Palo Alto',
  },
  {
    id: 'cloud',
    name: 'Cloud Security',
    ft: 25.7,
    rivalName: 'Palo Alto',
    rivalPct: 44.8,
    status: 'gap' as const,
    delta: '−19.1pp vs Palo Alto',
  },
  {
    id: 'secops',
    name: 'SecOps',
    ft: 12.6,
    rivalName: 'CrowdStrike',
    rivalPct: 43.4,
    status: 'critical' as const,
    delta: '−30.8pp vs CrowdStrike',
  },
];

// ─── Hero KPI Data ─────────────────────────────────────────────────────────────
const KPIS = [
  {
    id: 'traffic',
    value: '+34.3%',
    label: 'US Traffic Growth',
    sub: '890K → 1.20M · Jul 2025–Sep 2026',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: TrendingUp,
  },
  {
    id: 'llm',
    value: '8.8%',
    label: 'LLM Citation Rate',
    sub: '#1 globally · Palo Alto 3.6% (2.4×)',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: Sparkles,
  },
  {
    id: 'aio',
    value: '22.2K',
    label: 'AIO Keywords (Sep)',
    sub: '+14.9% MoM · AIO traffic 184K',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    icon: Brain,
  },
  {
    id: 'sov',
    value: '44.3%',
    label: 'Profound Visibility',
    sub: '3.3pp lead over Palo Alto (41.0%)',
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
    ft: 12.6,
    rival: 'CrowdStrike',
    rval: 43.4,
    gap: 30.8,
    severity: 'critical' as const,
  },
  {
    cat: 'Cloud Security',
    ft: 25.7,
    rival: 'Palo Alto',
    rval: 44.8,
    gap: 19.1,
    severity: 'gap' as const,
  },
  {
    cat: 'ZTNA',
    ft: 33.1,
    rival: 'Palo Alto',
    rval: 44.1,
    gap: 11.0,
    severity: 'watch' as const,
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
    quarter: 'NOW — Q4 2026',
    icon: Brain,
    title: 'Elevate AI & Agentic Messaging',
    detail: 'Upgrade hero/hero-image messaging on SOC, homepage & solutions pages to match CrowdStrike\'s agentic AI narrative — target "agentic ai security", "ai soc platform" — also defends AI Cyber lead (11.5pp) and Profound visibility (3.3pp over PA)',
    tagColor: 'bg-red-100 text-red-700 border-red-200',
    barColor: 'bg-red-500',
    impact: 'HIGH',
  },
  {
    id: 'r2',
    quarter: 'Q4 2026',
    icon: Shield,
    title: 'ZTNA & Cloud Security Sprint',
    detail: 'Narrow 11.0pp ZTNA gap and 19.1pp Cloud gap vs Palo Alto — create 20+ pillar pages targeting "zero trust solutions" (SV 800) and "cloud security services" (SV 8.8K)',
    tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    barColor: 'bg-amber-500',
    impact: 'HIGH',
  },
  {
    id: 'r3',
    quarter: 'Q4 2026–Q1 2027',
    icon: Globe,
    title: 'AI Feature Pages & CTA Uplift',
    detail: 'Build standalone AI feature pages (AI Red Teaming, AI Discovery, AEV) like Check Point; strengthen above-fold CTAs to match CrowdStrike conversion strategy; refresh decayed pages to reverse Google organic sessions −54% vs Mar peak',
    tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
    barColor: 'bg-blue-500',
    impact: 'HIGH',
  },
  {
    id: 'r4',
    quarter: 'Q1 2027',
    icon: BarChart3,
    title: 'Content Velocity & Authority',
    detail: 'Scale to 8–10 new pages/month (vs +2 in Sep; SentinelOne added +154); launch Compliance & Certifications hub; publish AI ThreatCloud-equivalent to compete with Check Point 1,142 / SentinelOne 1,091 pages',
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
        subtitle="SEO Competitive Summary · Jul 2025 – Sep 2026 · 15-Month View · US & WW · Semrush traffic/KW to Sep · Profound to Sep · Backlinks to Sep"
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
                Fortinet leads 5 of 8 Profound categories · holds #1 AI citation rate globally (8.8% vs PA 3.6%) · US traffic +34.3% Jul 2025–Sep 2026
              </p>
              <p className="text-red-100 text-[10px] mt-0.5">
                Three strategic gaps remain: ZTNA −11.0pp, Cloud Security −19.1pp vs Palo Alto · SecOps −30.8pp vs CrowdStrike · Sep watch: Profound lead over PA shrank to 3.3pp · GA Google organic −54% vs Mar peak
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
            <span className="text-[9px] text-gray-400">Source: Profound · Nov 2025 – Sep 2026</span>
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
                { brand: 'Checkpoint', count: '1,142 pages' },
                { brand: 'SentinelOne', count: '1,091 pages' },
                { brand: 'Palo Alto', count: '809 pages' },
                { brand: 'CrowdStrike', count: '597 pages' },
              ].map((c) => (
                <div key={c.brand} className="flex justify-between items-center">
                  <span className="text-[9px] text-gray-600">{c.brand}</span>
                  <span className="text-[9px] font-semibold text-red-700">{c.count}</span>
                </div>
              ))}
            </div>
            <p className="text-[8.5px] text-red-400 mt-1.5 leading-tight">
              Fortinet: 624 pages (+2 in Sep) — content velocity lags the three largest rivals in Sep 2026
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
            Strategic Roadmap · Q4 2026 – Q1 2027
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

      <SlideFooter source="Source: Semrush traffic & keywords, Profound, GA, GSC, Top 50 KW & Competitive Intel (through Sep 2026) · Backlinks (through Sep 2026)" />
    </SlideContainer>
  );
}
