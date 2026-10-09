import { COMPETITORS, BRANDED_TRAFFIC, NON_BRANDED_TRAFFIC } from '@/app/data/seo-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/app/utils/format';

interface BrandedComparisonProps {
  selectedMonth: number;
}

function BrandedComparison({ selectedMonth }: BrandedComparisonProps) {
  // Prepare data for the chart
  const chartData = COMPETITORS.map((competitor) => {
    const branded = BRANDED_TRAFFIC[competitor.id as keyof typeof BRANDED_TRAFFIC][selectedMonth];
    const nonBranded = NON_BRANDED_TRAFFIC[competitor.id as keyof typeof NON_BRANDED_TRAFFIC][selectedMonth];

    return {
      name: competitor.name,
      Branded: branded || 0,
      'Non-Branded': nonBranded === 0 ? null : (nonBranded || 0),
      color: competitor.color,
      hasData: branded !== null || (nonBranded !== null && nonBranded !== 0),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-sm text-gray-700">{entry.name}:</span>
              <span className="text-sm font-semibold text-gray-900">
                {entry.value === null ? 'no data' : formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Branded vs Non-Branded Traffic</h2>
        <p className="text-sm text-gray-600">Traffic split comparison for selected month</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line dataKey="Branded" fill="#9333EA" stroke="#9333EA" radius={[8, 8, 0, 0]} />
            <Line dataKey="Non-Branded" fill="#10B981" stroke="#10B981" radius={[8, 8, 0, 0]} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-6 gap-4">
        {COMPETITORS.map((competitor) => {
          const branded = BRANDED_TRAFFIC[competitor.id as keyof typeof BRANDED_TRAFFIC][selectedMonth];
          const nonBranded = NON_BRANDED_TRAFFIC[competitor.id as keyof typeof NON_BRANDED_TRAFFIC][selectedMonth];
          const hasIssue = branded === null || nonBranded === null || nonBranded === 0;

          return (
            <div
              key={competitor.id}
              className={`p-3 rounded-xl border ${
                hasIssue
                  ? 'bg-orange-50/50 border-orange-200'
                  : 'bg-gray-50/50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: competitor.color }}
                />
                <p className="text-xs font-semibold text-gray-900">{competitor.name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Branded:</span>
                  <span className="font-medium text-gray-900">{formatNumber(branded)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Non-Branded:</span>
                  <span className="font-medium text-gray-900">{formatNumber(nonBranded)}</span>
                </div>
              </div>
              {hasIssue && (
                <p className="text-xs text-orange-600 mt-2 font-medium">⚠ Data missing/zero</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}