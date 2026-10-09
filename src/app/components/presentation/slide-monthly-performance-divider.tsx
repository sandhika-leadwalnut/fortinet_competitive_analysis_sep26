import { BarChart3, BookOpen, Layers, FileText, Globe, Activity } from 'lucide-react';
import { SlideContainer } from './design-system';

interface SlideMonthlyPerformanceDividerProps {
  onNavigateHome?: () => void;
}

export function SlideMonthlyPerformanceDivider({ onNavigateHome }: SlideMonthlyPerformanceDividerProps) {
  const sections = [
    {
      name: 'Cyberglossary Pages',
      color: '#3B82F6',
      icon: BookOpen,
    },
    {
      name: 'International Cyberglossary Pages',
      color: '#8B5CF6',
      icon: Globe,
    },
    {
      name: 'Articles Pages',
      color: '#10B981',
      icon: FileText,
    },
    {
      name: 'Product Pages',
      color: '#F97316',
      icon: Layers,
    },
    {
      name: 'Organic Performance Metrics',
      color: '#EF4444',
      icon: Activity,
    },
  ];

  return (
    <SlideContainer slideNumber={2} onNavigateHome={onNavigateHome} source="">
      <div className="flex-1 flex flex-col justify-center items-center px-12">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full opacity-5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-400 rounded-full opacity-[0.03] blur-3xl" />
        </div>

        {/* Icon Badge */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mb-8">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>

        {/* Section Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-10 bg-blue-300" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Section I</span>
          <div className="h-px w-10 bg-blue-300" />
        </div>

        {/* Title */}
        <h1 className="text-[64px] font-bold text-gray-900 mb-4 text-center leading-tight">
          Monthly Performance
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl">
          Traffic breakdown and organic performance insights across page types
        </p>

        {/* Sections Grid — 3 + 2 */}
        <div className="flex flex-col gap-4 w-full max-w-4xl">
          {/* Row 1: 3 cards */}
          <div className="grid grid-cols-3 gap-4">
            {sections.slice(0, 3).map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md"
                    style={{ backgroundColor: section.color }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{section.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 rounded-full" style={{ backgroundColor: section.color }} />
                  </div>
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                    style={{ backgroundColor: section.color }}
                  />
                </div>
              );
            })}
          </div>

          {/* Row 2: 2 cards centered */}
          <div className="grid grid-cols-2 gap-4 w-2/3 mx-auto">
            {sections.slice(3).map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md"
                    style={{ backgroundColor: section.color }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{section.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 rounded-full" style={{ backgroundColor: section.color }} />
                  </div>
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                    style={{ backgroundColor: section.color }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Indicator */}
        <div className="mt-10 flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Monthly Analysis
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-300" />
        </div>
      </div>
    </SlideContainer>
  );
}
