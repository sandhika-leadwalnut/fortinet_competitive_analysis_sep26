import { ChevronRight, TrendingUp, Target, BarChart3, Sparkles, Link2, Lightbulb, BookOpen, Shield } from 'lucide-react';
import { SlideContainer, TEXT_STYLES } from './design-system';

interface TOCProps {
  onNavigate: (slideIndex: number) => void;
  onNavigateHome?: () => void;
}

export function SlideTOC({ onNavigate, onNavigateHome }: TOCProps) {
  const monthlyItems = [
    { label: 'Cyberglossary Pages',               slideIndex: 3 },
    { label: 'International Cyberglossary Pages',  slideIndex: 4 },
    { label: 'Product Pages',                      slideIndex: 5 },
    { label: 'Articles Pages',                     slideIndex: 6 },
    { label: 'Organic Performance Metrics',        slideIndex: 7 },
  ];

  const competitiveSubSections = [
    {
      num: '1',
      title: 'Keyword Analysis',
      icon: Target,
      color: '#FF7AB6',
      items: [
        { label: 'Keyword Opportunities & Rankings', slideIndex: 10 },
        { label: 'Top 50 KW Summary',                slideIndex: 11 },
      ],
    },
    {
      num: '2',
      title: 'Organic Traffic Performance',
      icon: TrendingUp,
      color: '#7ED957',
      items: [
        { label: 'Traffic Overview (US)',              slideIndex: 13 },
        { label: 'Traffic Overview (WW)',              slideIndex: 14 },
        { label: 'Organic Traffic Performance',        slideIndex: 15 },
        { label: 'Organic Pages Performance Overview', slideIndex: 16 },
      ],
    },
    {
      num: '3',
      title: 'Category-Wise Performance',
      icon: Shield,
      color: '#FFB14A',
      items: [
        { label: 'NGFW / Firewall',               slideIndex: 18 },
        { label: 'SD-WAN Metrics',                slideIndex: 19 },
        { label: 'OT Security',                   slideIndex: 20 },
        { label: 'Security Dashboard',            slideIndex: 21 },
        { label: 'Zero Trust Security',           slideIndex: 22 },
        { label: 'Cloud Security',                slideIndex: 23 },
        { label: 'Ransomware',                    slideIndex: 24 },
        { label: 'AI CyberSecurity',              slideIndex: 25 },
        { label: 'Quantum Security',              slideIndex: 26 },
        { label: 'Network Security',              slideIndex: 27 },
        { label: 'SecOps',                        slideIndex: 28 },
        { label: 'Website Performance by Device', slideIndex: 29 },
      ],
    },
    {
      num: '4',
      title: 'Cyberglossary Competitor Analysis',
      icon: BookOpen,
      color: '#06B6D4',
      items: [
        { label: 'Organic Keyword & Traffic', slideIndex: 31 },
        { label: 'Ranking Performance',       slideIndex: 32 },
        { label: 'Backlink Performance',      slideIndex: 33 },
      ],
    },
    {
      num: '5',
      title: 'LLM & AI Visibility Metrics',
      icon: Sparkles,
      color: '#8B5CF6',
      items: [
        { label: 'LLM Metrics',                  slideIndex: 35 },
        { label: 'Focused Category Performance', slideIndex: 36 },
        { label: 'AI Overview Metrics',          slideIndex: 37 },
        { label: 'Featured Snippets',            slideIndex: 38 },
      ],
    },
    {
      num: '6',
      title: 'Backlink Competitive Analysis',
      icon: Link2,
      color: '#6C9AFF',
      items: [
        { label: 'Fortinet Backlinks by Source',   slideIndex: 40 },
        { label: 'Backlink Competitive Analysis',   slideIndex: 41 },
      ],
    },
    {
      num: '7',
      title: 'Competitive Intelligence',
      icon: Lightbulb,
      color: '#FF8E5A',
      items: [
        { label: 'Competitive Intel',     slideIndex: 43 },
        { label: 'Keyword Gap Analysis',  slideIndex: 44 },
        { label: 'Competitive Findings',  slideIndex: 45 },
        { label: 'Key Takeaways',         slideIndex: 46 },
        { label: 'Strategic Brief',       slideIndex: 47 },
      ],
    },
  ];

  return (
    <SlideContainer>
      <div className="w-full h-full flex flex-col px-8 py-5 gap-4">

        {/* Page title */}
        <div className="text-center flex-shrink-0">
          <h1 className={`${TEXT_STYLES.slideTitle} text-[32px] mb-1.5`}>Table of Contents</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full" />
        </div>

        {/* ── I. Monthly Performance ─────────────────────────────────────── */}
        <div className="flex-shrink-0 bg-white border-2 border-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-gray-100">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50">
              <BarChart3 className="w-4 h-4 text-red-500" />
            </div>
            <h2 className="text-[13px] font-bold text-gray-900">I.&nbsp;&nbsp;Monthly Performance</h2>
          </div>
          <div className="flex flex-wrap gap-1">
            {monthlyItems.map((item) => (
              <button
                key={item.slideIndex}
                onClick={() => onNavigate(item.slideIndex)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all group border border-gray-100 hover:border-red-200"
              >
                <ChevronRight className="w-3 h-3 flex-shrink-0 text-gray-300 group-hover:text-red-500 transition-all" />
                <span className="font-medium">{item.label}</span>
                <span className="text-[10px] text-gray-300 tabular-nums ml-1 group-hover:text-red-400">{item.slideIndex + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── II. Competitive Analysis ───────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-2.5 min-h-0">
          {/* Section II header label */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100">
              <BarChart3 className="w-4 h-4 text-gray-500" />
            </div>
            <h2 className="text-[13px] font-bold text-gray-900">II.&nbsp;&nbsp;Competitive Analysis</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* 7 sub-sections grid */}
          <div className="flex-1 grid grid-cols-4 gap-3 min-h-0">
            {competitiveSubSections.map((section) => {
              const Icon = section.icon;
              const isLarge = section.items.length >= 8;
              return (
                <div
                  key={section.num}
                  className={`bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col ${isLarge ? 'col-span-2' : ''}`}
                >
                  {/* Sub-section header */}
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2 flex-shrink-0">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${section.color}18` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: section.color }} />
                    </div>
                    <h3 className="text-[11px] font-bold text-gray-900 leading-snug">
                      <span className="text-gray-400 mr-0.5">{section.num}.</span> {section.title}
                    </h3>
                  </div>

                  {/* Items */}
                  <div className={`flex-1 ${isLarge ? 'grid grid-cols-2 gap-x-1' : 'space-y-0.5'}`}>
                    {section.items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => onNavigate(item.slideIndex)}
                        className="w-full flex items-center gap-1 px-1.5 py-1 rounded-lg text-left text-[11px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all group"
                      >
                        <ChevronRight className="w-2.5 h-2.5 flex-shrink-0 text-gray-300 group-hover:text-red-500 transition-all" />
                        <span className="flex-1 font-medium leading-tight">{item.label}</span>
                        <span className="text-[9px] text-gray-300 tabular-nums group-hover:text-gray-400">{item.slideIndex + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center flex-shrink-0">
          <p className="text-xs text-gray-400">Click any item to navigate directly to that slide · 49 slides total</p>
        </div>
      </div>
    </SlideContainer>
  );
}
