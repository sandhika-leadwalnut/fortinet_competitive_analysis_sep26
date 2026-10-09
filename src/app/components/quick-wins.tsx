import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import { QUICK_WINS } from '@/app/data/seo-data';

export function QuickWins() {
  const priorityColors = {
    high: {
      bg: 'bg-red-50/70',
      border: 'border-red-200',
      icon: 'text-red-600',
      badge: 'bg-red-100 text-red-700',
    },
    medium: {
      bg: 'bg-orange-50/70',
      border: 'border-orange-200',
      icon: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-700',
    },
    low: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700',
    },
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Content Gaps & Quick Wins</h2>
        <p className="text-sm text-gray-600">Auto-suggested opportunities based on competitive analysis</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {QUICK_WINS.map((win, index) => {
          const colors = priorityColors[win.priority as keyof typeof priorityColors];
          return (
            <div
              key={index}
              className={`${colors.bg} backdrop-blur-sm rounded-xl p-5 border ${colors.border} hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center border ${colors.border}`}>
                  <Target className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                      {win.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-600">Impact: {win.impact}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{win.title}</h3>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{win.description}</p>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  View detailed analysis
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
