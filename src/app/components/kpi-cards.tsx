import { COMPETITORS, ORGANIC_TRAFFIC, ORGANIC_KEYWORDS, AUTHORITY_SCORE } from '@/app/data/seo-data';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { formatNumber } from '@/app/utils/format';

interface KPICardsProps {
  selectedMonth: number;
}

function calculateMoM(current: number | null, previous: number | null): { value: number; isPositive: boolean } | null {
  if (current === null || previous === null) return null;
  const change = ((current - previous) / previous) * 100;
  return { value: Math.abs(change), isPositive: change >= 0 };
}

export function KPICards({ selectedMonth }: KPICardsProps) {
  // Calculate total organic traffic for selected month
  const totalOrganic = COMPETITORS.reduce((sum, comp) => {
    const value = ORGANIC_TRAFFIC[comp.id as keyof typeof ORGANIC_TRAFFIC][selectedMonth];
    return sum + (value || 0);
  }, 0);

  // Calculate previous month for MoM
  const previousMonth = selectedMonth > 0 ? selectedMonth - 1 : null;
  const prevTotalOrganic = previousMonth !== null
    ? COMPETITORS.reduce((sum, comp) => {
        const value = ORGANIC_TRAFFIC[comp.id as keyof typeof ORGANIC_TRAFFIC][previousMonth];
        return sum + (value || 0);
      }, 0)
    : null;

  const organicMoM = calculateMoM(totalOrganic, prevTotalOrganic);

  // Find top competitor by organic traffic
  const topCompetitor = COMPETITORS.reduce((top, comp) => {
    const value = ORGANIC_TRAFFIC[comp.id as keyof typeof ORGANIC_TRAFFIC][selectedMonth];
    const topValue = ORGANIC_TRAFFIC[top.id as keyof typeof ORGANIC_TRAFFIC][selectedMonth];
    return (value || 0) > (topValue || 0) ? comp : top;
  }, COMPETITORS[0]);

  const topCompetitorValue = ORGANIC_TRAFFIC[topCompetitor.id as keyof typeof ORGANIC_TRAFFIC][selectedMonth];

  const kpis = [
    {
      title: 'Total Organic Traffic',
      value: formatNumber(totalOrganic),
      change: organicMoM,
      icon: TrendingUp,
      color: 'blue',
    },
    {
      title: 'Top Competitor',
      value: topCompetitor.name,
      subtitle: formatNumber(topCompetitorValue),
      icon: BarChart2,
      color: 'orange',
      competitorColor: topCompetitor.color,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                kpi.color === 'blue'
                  ? 'from-blue-50 to-blue-100'
                  : 'from-orange-50 to-orange-100'
              }`}
            >
              <kpi.icon
                className={`w-6 h-6 ${
                  kpi.color === 'blue'
                    ? 'text-blue-600'
                    : 'text-orange-600'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-600 font-medium">{kpi.title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
              {kpi.subtitle && (
                <p className="text-sm text-gray-500">({kpi.subtitle})</p>
              )}
            </div>

            {kpi.change && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  kpi.change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {kpi.change.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {kpi.change.value.toFixed(1)}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            )}

            {kpi.competitorColor && (
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: kpi.competitorColor }}
                />
                <span className="text-xs text-gray-600">Leading this month</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}