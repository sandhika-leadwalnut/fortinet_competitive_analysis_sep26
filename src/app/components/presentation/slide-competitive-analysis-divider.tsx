import { Target, TrendingUp, Shield, BookOpen, Sparkles, Link2, Lightbulb } from 'lucide-react';
import { SlideContainer } from './design-system';

interface Props {
  onNavigateHome?: () => void;
}

const SECTIONS = [
  { num: '1', name: 'Keyword Analysis',                   color: '#FF7AB6', icon: Target    },
  { num: '2', name: 'Organic Traffic Performance',         color: '#7ED957', icon: TrendingUp },
  { num: '3', name: 'Category-Wise Performance',           color: '#FFB14A', icon: Shield     },
  { num: '4', name: 'Cyberglossary Competitor Analysis',   color: '#06B6D4', icon: BookOpen   },
  { num: '5', name: 'LLM & AI Visibility Metrics',         color: '#8B5CF6', icon: Sparkles   },
  { num: '6', name: 'Backlink Competitive Analysis',       color: '#6C9AFF', icon: Link2      },
  { num: '7', name: 'Competitive Intelligence',            color: '#FF8E5A', icon: Lightbulb  },
];

export function SlideCompetitiveAnalysisDivider({ onNavigateHome }: Props) {
  return (
    <SlideContainer slideNumber={9} onNavigateHome={onNavigateHome} source="">
      <div className="flex-1 flex flex-col justify-center items-center px-12 relative">

        {/* Background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-red-500 rounded-full opacity-[0.04] blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-blue-500 rounded-full opacity-[0.04] blur-3xl" />
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px w-10 bg-red-300" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">Section II</span>
          <div className="h-px w-10 bg-red-300" />
        </div>

        {/* Title */}
        <h1 className="text-[72px] font-bold text-gray-900 leading-none mb-3 text-center tracking-tight">
          Competitive Analysis
        </h1>
        <p className="text-lg text-gray-500 mb-12 text-center">
          7 deep-dive reports across keyword, traffic, category & AI visibility
        </p>

        {/* 7-item grid */}
        <div className="grid grid-cols-4 gap-3 w-full max-w-4xl">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${s.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 block leading-none mb-0.5">{s.num}.</span>
                  <span className="text-[11.5px] font-semibold text-gray-800 leading-tight block">{s.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom indicator */}
        <div className="mt-12 flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">7 Reports</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-300" />
        </div>
      </div>
    </SlideContainer>
  );
}
