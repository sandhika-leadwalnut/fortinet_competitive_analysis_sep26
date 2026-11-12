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
    label: 'Demand & Traffic',
    points: [
      {
        type: 'win' as PointType,
        text: 'Semrush models US organic traffic at 975K in Oct: +9.6% vs Jul-25, but −18.4% MoM and −38% below the Mar peak. Non-branded demand remains the strength at 915K, or 93.8% of traffic.',
      },
      {
        type: 'watch' as PointType,
        text: 'First-party data is more cautious: Google organic sessions rose to 49.6K (+3.8% MoM) but remain −52.5% vs Mar; US GSC clicks improved to 126K (+4.1%), while impressions fell sharply to 24.1M (−40.6% MoM).',
      },
      {
        type: 'neutral' as PointType,
        text: 'Cyberglossary GA traffic fell to 81.5K (−6.5% MoM), while GSC clicks rebounded to 140.2K (+3.8%). The GA/GSC divergence requires page-level diagnosis before declaring recovery.',
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
        text: 'The footprint is getting smaller but more efficient: 227K total keywords (+7.6% MoM, −26.5% vs Jul-25) and 44.0K Page 1 rankings (−4.1% MoM, +11.7% vs Jul-25). Page 1 share improved from 12.8% to 19.4%.',
      },
      {
        type: 'win' as PointType,
        text: 'On the 48-keyword strategic set, Fortinet leads with 36 Page 1 terms and 31 at position #1 (+2 MoM), ahead of Cisco (26 Page 1) and Palo Alto (23). Firewall and SD-WAN both returned to full-strength leadership.',
      },
      {
        type: 'critical' as PointType,
        text: 'Commercial depth is the constraint: Fortinet is unranked for "zero trust solutions", "cloud security" and "cloud security services"; "cloud security providers" is only #10. These gaps sit directly inside categories where AI visibility trails Palo Alto.',
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
        text: 'AIO coverage held at 22.2K keywords (−0.2% MoM), but remains 39% below Cisco’s 36.6K. AIO traffic dropped to 96.7K (−47.5% MoM; −73.7% vs Mar peak), showing a material loss of click capture.',
      },
      {
        type: 'watch' as PointType,
        text: 'Profound visibility fell to 42.3% (−2.0pp) and share of voice to 7.5%, allowing Palo Alto to lead both metrics (43.2% / 7.8%). Citation rate improved to 9.3% vs 3.7% — Fortinet’s clearest AI-search moat.',
      },
      {
        type: 'watch' as PointType,
        text: 'AI referrals strengthened across every tracked engine in Oct; ChatGPT reached 12.5K (+12.7% MoM) and contributes ~84% of tracked AI sessions. Diversify citations for Gemini and Perplexity while protecting ChatGPT visibility.',
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
        text: 'Fortinet leads 5 of 8 Profound categories: Firewall 71.3%, SASE 70.1%, OT 42.5%, Quantum 33.6% and AI Cybersecurity 35.2%. This is broad leadership, not uniform momentum.',
      },
      {
        type: 'win' as PointType,
        text: 'Four of five leads narrowed in Oct: SASE to +1.5pp, AI Cybersecurity +7.0pp, Quantum +7.3pp and Firewall +11.2pp. Only OT expanded, to +10.3pp over Palo Alto.',
      },
      {
        type: 'critical' as PointType,
        text: 'The three losses all worsened MoM: ZTNA −19.2pp and Cloud Security −20.8pp vs Palo Alto; SecOps −39.1pp vs CrowdStrike. These are the primary growth categories for corrective investment.',
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
        text: 'Referring domains reached 66.7K (+22.6% vs Jul-25; +11.7% MoM) and backlinks 4.08M (+28.7% vs Jul-25). Authority is growing, but October’s market-wide jump likely includes a Semrush index refresh.',
      },
      {
        type: 'watch' as PointType,
        text: 'Palo Alto moved just ahead at 68.0K referring domains and Check Point reached 77.5K. Fortinet’s 4.08M backlinks narrowly exceed Palo Alto’s 3.99M, so quality and topical relevance matter more than raw volume.',
      },
      {
        type: 'watch' as PointType,
        text: 'Wiz is the velocity watch: referring domains rose 141% vs Jul-25 and 40.7% MoM, even as total backlinks remain 71% below Jul-25. Validate new-domain quality before treating velocity as durable authority.',
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
        text: 'Fortinet’s tracked content hub reached 633 pages (+9 MoM), behind Check Point 1,154, SentinelOne 1,100 and Palo Alto 814. Separately, indexed organic pages recovered to 37.7K (+8.9% MoM) but remain below the May peak.',
      },
      {
        type: 'critical' as PointType,
        text: 'The clearest asset gaps are not more generic blogs: Fortinet lacks competitor-style vulnerability databases, a branded AI-security research hub and complete agentic/SOC positioning on high-authority solution pages.',
      },
      {
        type: 'watch' as PointType,
        text: 'Use existing authority more effectively: refresh decayed glossary winners, connect informational pages to ZTNA/Cloud/SecOps decision journeys, and strengthen above-fold proof and CTA paths on commercial pages.',
      },
    ],
  },
];

const priorities = [
  {
    icon: Zap,
    color: 'bg-red-500',
    label: 'Priority 1',
    action: 'Diagnose the Demand Loss',
    detail: 'Segment the 40.6% MoM US impression decline and 52.5% Google-session gap to peak by query, URL, template, country and SERP feature; resolve indexing, canonical, content-decay and tracking issues first',
  },
  {
    icon: TrendingUp,
    color: 'bg-amber-500',
    label: 'Priority 2',
    action: 'Win the Commercial Gaps',
    detail: 'Refresh and interlink the highest-potential ZTNA, Cloud and SecOps pages around solution, provider, platform and comparison intent; establish rankings for missing head terms, then move priority terms into the top 10',
  },
  {
    icon: Link2,
    color: 'bg-blue-500',
    label: 'Priority 3',
    action: 'Turn Authority Into AI Demand',
    detail: 'Protect the 9.3% citation rate with answer-first modules, expert evidence, schema and original research; launch a vulnerability intelligence asset and recover AIO traffic toward 150K+',
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
        subtitle="Strategic Summary · Jul-25 – Oct-26 · 16-Month View · US & WW"
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

      <SlideFooter source="Source: Semrush traffic & keywords, Profound, GA, GSC, Top 50 KW & backlinks through Oct-26 · Competitive Intel through Oct-26" />
    </SlideContainer>
  );
}
