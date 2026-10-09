import {
  TrendingUp,
  Trophy,
  Sparkles,
  Link2,
  FileSearch,
  LayoutGrid,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MinusCircle,
  Zap,
} from 'lucide-react';
import { SlideContainer, SlideHeader, SlideFooter } from './design-system';

// ─── Types ────────────────────────────────────────────────────────────────────

type PointType = 'win' | 'neutral' | 'watch' | 'critical';

// ─── Data ─────────────────────────────────────────────────────────────────────

const takeaways = [
  {
    id: 'traffic',
    icon: TrendingUp,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-l-blue-500',
    badgeBg: 'bg-blue-100 text-blue-700',
    label: 'Traffic & Reach',
    points: [
      {
        type: 'win' as PointType,
        text: 'US organic traffic 890K → 1.20M (+34.3%) Jul 2025–Sep 2026 (Semrush); non-branded 732K → 1.09M (+48.5%) now 91% of traffic — authority is brand-independent. But Sep is −5.8% MoM and −24% vs Mar peak 1.58M.',
      },
      {
        type: 'watch' as PointType,
        text: 'GA Google organic sessions 47.8K in Sep (+3.4% MoM, first uptick since Mar) but −54% vs Mar peak of 104.4K; Bing 7.7K, −47% since Dec.',
      },
      {
        type: 'neutral' as PointType,
        text: 'Cyberglossary direct traffic recovered to 18.5K in Sep (+7.0% MoM); top-10 direct gainers led by proxy-server (+276) and cloud-security-tools (+97).',
      },
    ],
  },
  {
    id: 'keywords',
    icon: FileSearch,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderColor: 'border-l-violet-500',
    badgeBg: 'bg-violet-100 text-violet-700',
    label: 'Keyword Power',
    points: [
      {
        type: 'win' as PointType,
        text: 'Page 1 keywords 39.4K → 45.9K (+16.5%, +2.7% MoM); total footprint 211K is still 42% below Feb peak 362K, but page-1 share of footprint rose 12.8% → 21.8% — quality up, breadth to rebuild.',
      },
      {
        type: 'win' as PointType,
        text: 'Top-50 KW tracker (Sep): Fortinet holds 36 Page 1 KWs vs Cisco 27, Palo Alto 23, Check Point 19 (record) — 29 at #1, rebounding from 8 in Aug.',
      },
      {
        type: 'critical' as PointType,
        text: 'Key BOFU gaps: "zero trust solutions" (#32), "ai security solutions" (#5), "cloud security services" (#15); Check Point closing in on Page 1 (19 vs 14 in Aug).',
      },
    ],
  },
  {
    id: 'ai',
    icon: Sparkles,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    borderColor: 'border-l-red-500',
    badgeBg: 'bg-red-100 text-red-700',
    label: 'AI & LLM Citability',
    points: [
      {
        type: 'watch' as PointType,
        text: 'US AIO keywords rebounded to 22.2K in Sep (+14.9% MoM) but AIO traffic is flat at 184K (−50% vs Mar peak 367K) — coverage up, click capture lagging.',
      },
      {
        type: 'watch' as PointType,
        text: 'Profound visibility 44.3% (Sep) is −21.9pp vs Mar peak 66.2%; lead over Palo Alto (41.0%) shrank 24.0pp → 3.3pp. Citation rate 8.8% vs PA 3.6% (2.4×) is the moat. France AIO traffic hit 29.6K.',
      },
      {
        type: 'watch' as PointType,
        text: 'AI referrals: ChatGPT 11.1K sessions in Sep (+6.4% MoM) drives most volume; Claude fell to 123 (−45% MoM), Perplexity 179 — concentration risk.',
      },
    ],
  },
  {
    id: 'category',
    icon: Trophy,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-l-emerald-500',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    label: 'Category Leadership',
    points: [
      {
        type: 'win' as PointType,
        text: 'Leads 5 of 8 categories (Sep 2026, Profound): Firewall 71.7%, SASE 71.1%, OT 42.2%, Quantum 38.5%; AI Cyber 39.6% fell −10.4pp MoM, lead over CrowdStrike cut to 11.5pp.',
      },
      {
        type: 'win' as PointType,
        text: 'Firewall lead widened to 15.3pp (71.7% vs PA 56.4%); Quantum lead 13.2pp; SASE lead 7.9pp (71.1% vs PA 63.2%) as PA slipped −2.2pp.',
      },
      {
        type: 'critical' as PointType,
        text: 'Trailing in 3 categories: ZTNA −11.0pp (33.1% vs PA 44.1%), Cloud Security −19.1pp (25.7% vs PA 44.8%), SecOps −30.8pp (12.6% vs CrowdStrike 43.4%).',
      },
    ],
  },
  {
    id: 'backlinks',
    icon: Link2,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-l-amber-500',
    badgeBg: 'bg-amber-100 text-amber-700',
    label: 'Backlink Authority',
    points: [
      {
        type: 'win' as PointType,
        text: 'Referring domains grew 54,366 → 59,660 (+5,294 net new, +9.7%) Jul 2025–Sep 2026 (Semrush WW) — steady, but slower than 6 of 8 rivals.',
      },
      {
        type: 'watch' as PointType,
        text: 'Palo Alto grew 42.2K → 56.4K domains (+33.6%) — over 3× Fortinet\'s pace; Check Point (70.0K) still holds more referring domains.',
      },
      {
        type: 'watch' as PointType,
        text: 'Wiz surged 12.6K → 21.6K domains (+71.4%) — fastest-rising rival; monitor link velocity & quality closely.',
      },
    ],
  },
  {
    id: 'content',
    icon: LayoutGrid,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    borderColor: 'border-l-orange-500',
    badgeBg: 'bg-orange-100 text-orange-700',
    label: 'Content & Competitive Gap',
    points: [
      {
        type: 'critical' as PointType,
        text: 'Fortinet: 624 pages vs Checkpoint: 1,142, SentinelOne: 1,091, PAN: 809 — content velocity significantly lags Sep 2026.',
      },
      {
        type: 'critical' as PointType,
        text: 'Incomplete AI & Agentic messaging at hero level; SOC solutions page lacks Agentic AI / SOC Reimagined positioning.',
      },
      {
        type: 'watch' as PointType,
        text: 'SentinelOne added +154 pages in Sep 2026 alone (937 → 1,091) — largest single-month jump of any rival; content bar rising fast.',
      },
    ],
  },
];

const priorities = [
  {
    icon: Zap,
    color: 'bg-red-500',
    label: 'Priority 1',
    action: 'Elevate AI & Agentic Messaging',
    detail: 'Upgrade hero/hero-image messaging on SOC, homepage & solutions pages to match CrowdStrike\'s agentic AI narrative — target "agentic ai security", "ai soc platform" — also defends AI Cyber lead (11.5pp) and Profound visibility (3.3pp over PA)',
  },
  {
    icon: TrendingUp,
    color: 'bg-amber-500',
    label: 'Priority 2',
    action: 'Close ZTNA & Cloud Security Gaps',
    detail: 'Narrow 11.0pp ZTNA gap and 19.1pp Cloud gap vs Palo Alto — create 20+ pillar pages targeting "zero trust solutions" (SV 800) and "cloud security services" (SV 8.8K)',
  },
  {
    icon: Link2,
    color: 'bg-blue-500',
    label: 'Priority 3',
    action: 'Accelerate Content & CTA Velocity',
    detail: 'Fortinet: 624 pages (+2 in Sep) vs Checkpoint 1,142 & SentinelOne 1,091 (+154 in Sep) — increase to 8–10 pages/month; strengthen CTA placement to match CrowdStrike\'s above-fold conversion strategy',
  },
];

// ─── Point type styles ─────────────────────────────────────────────────────────

function PointIcon({ type }: { type: PointType }) {
  if (type === 'win')
    return <CheckCircle2 className="flex-shrink-0 w-3.5 h-3.5 text-emerald-500 mt-0.5" />;
  if (type === 'critical')
    return <XCircle className="flex-shrink-0 w-3.5 h-3.5 text-red-500 mt-0.5" />;
  if (type === 'watch')
    return <AlertTriangle className="flex-shrink-0 w-3.5 h-3.5 text-amber-500 mt-0.5" />;
  return <MinusCircle className="flex-shrink-0 w-3.5 h-3.5 text-yellow-500 mt-0.5" />;
}

function pointTextClass(type: PointType): string {
  if (type === 'win') return 'text-emerald-800';
  if (type === 'critical') return 'text-red-700 font-medium';
  if (type === 'watch') return 'text-amber-800';
  return 'text-yellow-800';
}

function pointRowClass(type: PointType): string {
  if (type === 'critical') return 'bg-red-50 -mx-2 px-2 py-0.5 rounded-md';
  if (type === 'win') return 'bg-emerald-50/50 -mx-2 px-2 py-0.5 rounded-md';
  return '';
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SlideKeyTakeaways({ onNavigateHome }: { onNavigateHome?: () => void }) {
  return (
    <SlideContainer slideNumber={24} onNavigateHome={onNavigateHome} source="">
      <SlideHeader
        title="Key Takeaways"
        subtitle="Strategic Summary · Jul 2025 – Sep 2026 · 15-Month View · US & WW"
      />

      {/* ── 6-card Grid ─────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-3 gap-4 pb-4">
        {takeaways.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`bg-white rounded-xl border border-gray-200 border-l-4 ${card.borderColor} p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                  <Icon className={`w-4.5 h-4.5 ${card.iconColor}`} strokeWidth={2} />
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${card.badgeBg}`}>
                  {card.label}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Bullet Points */}
              <ul className="space-y-2 flex-1">
                {card.points.map((point, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2 ${pointRowClass(point.type)}`}
                  >
                    <PointIcon type={point.type} />
                    <span className={`text-[12px] leading-snug ${pointTextClass(point.type)}`}>
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-center gap-6 mb-2">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span className="text-[9px] font-semibold text-emerald-700 uppercase tracking-wide">Positive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MinusCircle className="w-3 h-3 text-yellow-500" />
          <span className="text-[9px] font-semibold text-yellow-700 uppercase tracking-wide">Neutral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          <span className="text-[9px] font-semibold text-amber-700 uppercase tracking-wide">Monitor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <XCircle className="w-3 h-3 text-red-500" />
          <span className="text-[9px] font-semibold text-red-700 uppercase tracking-wide">Critical Gap</span>
        </div>
      </div>

      {/* ── Priority Actions Strip ───────────────────────────────────────── */}
      <div className="flex-shrink-0 mt-1 mb-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2">
            Top 3 Action Priorities
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {priorities.map((p, idx) => {
            const PIcon = p.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 bg-gray-50 rounded-xl border border-gray-200 px-4 py-3"
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-lg ${p.color} flex items-center justify-center mt-0.5`}>
                  <PIcon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{p.label}</span>
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                    <span className="text-[12px] font-bold text-gray-900 truncate">{p.action}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">{p.detail}</p>
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
