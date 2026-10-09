import { BookOpen, BarChart2, Link2, TrendingUp } from 'lucide-react';
import { SlideContainer } from './design-system';

export function SlideCyberglossaryDivider({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const sections = [
    { name: 'Cyberglossary Ranking Performance',        color: '#3B82F6', icon: BarChart2 },
    { name: 'Cyberglossary Backlink Performance',       color: '#F97316', icon: Link2    },
    { name: 'Cyberglossary Organic Keyword & Traffic',  color: '#10B981', icon: TrendingUp },
  ];

  return (
    <SlideContainer slideNumber={27} onNavigateHome={onNavigateHome} source="">
      <div className="flex-1 flex flex-col justify-center items-center px-12">
        {/* Background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full opacity-5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400 rounded-full opacity-[0.03] blur-3xl" />
        </div>

        {/* Icon Badge */}
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl mb-8">
          <BookOpen className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-[60px] font-bold text-gray-900 mb-4 text-center leading-tight">
          Cyberglossary Competitor Analysis
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl">
          Competitive benchmarking of Cyberglossary pages across ranking, backlinks, and organic performance
        </p>

        {/* 3-card grid */}
        <div className="grid grid-cols-3 gap-5 w-full max-w-3xl">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md"
                  style={{ backgroundColor: section.color }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">{section.name}</h3>
                <div className="mt-3 w-8 h-1 rounded-full" style={{ backgroundColor: section.color }} />
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                  style={{ backgroundColor: section.color }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom indicator */}
        <div className="mt-10 flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Competitive Analysis</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-300" />
        </div>
      </div>
    </SlideContainer>
  );
}
