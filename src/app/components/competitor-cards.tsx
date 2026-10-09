import { COMPETITORS, ORGANIC_TRAFFIC, ORGANIC_KEYWORDS, PAGE_ONE_KEYWORDS } from '@/app/data/seo-data';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '@/app/utils/format';

interface CompetitorCardsProps {
  selectedMonth: number;
}

export function CompetitorCards({ selectedMonth }: CompetitorCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {COMPETITORS.map((competitor) => {
        const organic = ORGANIC_TRAFFIC[competitor.id as keyof typeof ORGANIC_TRAFFIC][selectedMonth];
        const organicKeywords = ORGANIC_KEYWORDS[competitor.id as keyof typeof ORGANIC_KEYWORDS][selectedMonth];
        const pageOneKeywords = PAGE_ONE_KEYWORDS[competitor.id as keyof typeof PAGE_ONE_KEYWORDS][selectedMonth];

        return (
          <div
            key={competitor.id}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            style={{
              borderTop: `3px solid ${competitor.color}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: competitor.color }}
                />
                <h3 className="font-bold text-gray-900">{competitor.name}</h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Organic</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(organic)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Organic Keywords</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(organicKeywords)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Page 1 Keywords</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(pageOneKeywords)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}