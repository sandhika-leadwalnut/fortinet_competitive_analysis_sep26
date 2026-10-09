import { COMPETITORS, AUTHORITY_SCORE, REFERRING_DOMAINS, BACKLINKS } from '@/app/data/seo-data';
import { formatNumber } from '@/app/utils/format';

interface AuthorityMetricsProps {
  selectedMonth: number;
}

export function AuthorityMetrics({ selectedMonth }: AuthorityMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {/* Domain Authority */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Domain Authority</h2>
            <p className="text-sm text-gray-600">Authority scores across competitors</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="space-y-4">
          {COMPETITORS.map((competitor) => {
            const currentDA = AUTHORITY_SCORE[competitor.id as keyof typeof AUTHORITY_SCORE][selectedMonth];
            const previousDA = selectedMonth > 0
              ? AUTHORITY_SCORE[competitor.id as keyof typeof AUTHORITY_SCORE][selectedMonth - 1]
              : null;
            const change = previousDA ? currentDA - previousDA : 0;

            // Prepare sparkline data
            const sparklineData = MONTHS.map((_, index) => ({
              value: AUTHORITY_SCORE[competitor.id as keyof typeof AUTHORITY_SCORE][index],
            }));

            return (
              <div
                key={competitor.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: competitor.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{competitor.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mini Sparkline */}
                  <div className="w-16 h-8">
                    <ResponsiveContainer width="100%" height={32}>
                      <LineChart data={sparklineData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={competitor.color}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{currentDA}</p>
                    {change !== 0 && (
                      <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change > 0 ? '+' : ''}{change}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referring Domains */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Referring Domains</h2>
            <p className="text-sm text-gray-600">Total backlink domains by competitor</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
            <Link className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        <div className="space-y-4">
          {COMPETITORS.map((competitor) => {
            const currentRD = REFERRING_DOMAINS[competitor.id as keyof typeof REFERRING_DOMAINS][selectedMonth];
            const previousRD = selectedMonth > 0
              ? REFERRING_DOMAINS[competitor.id as keyof typeof REFERRING_DOMAINS][selectedMonth - 1]
              : null;
            const change = previousRD ? ((currentRD - previousRD) / previousRD) * 100 : 0;

            // Prepare sparkline data
            const sparklineData = MONTHS.map((_, index) => ({
              value: REFERRING_DOMAINS[competitor.id as keyof typeof REFERRING_DOMAINS][index],
            }));

            return (
              <div
                key={competitor.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: competitor.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{competitor.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mini Sparkline */}
                  <div className="w-16 h-8">
                    <ResponsiveContainer width="100%" height={32}>
                      <LineChart data={sparklineData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={competitor.color}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatNumber(currentRD)}</p>
                    {change !== 0 && (
                      <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}