import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COMPETITORS, ORGANIC_TRAFFIC, MONTHS, MONTH_LABELS } from '@/app/data/seo-data';
import { formatNumber } from '@/app/utils/format';

function TrafficTrendChart() {
  // Prepare data for the chart
  const chartData = MONTHS.map((month, index) => {
    const dataPoint: any = {
      month: MONTH_LABELS[index],
    };

    COMPETITORS.forEach((competitor) => {
      dataPoint[competitor.name] = ORGANIC_TRAFFIC[competitor.id as keyof typeof ORGANIC_TRAFFIC][index];
    });

    return dataPoint;
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
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">{entry.name}:</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatNumber(entry.value)}
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
        <h2 className="text-xl font-bold text-gray-900 mb-1">Organic Traffic Trends</h2>
        <p className="text-sm text-gray-600">Monthly organic traffic across all competitors (Jul 2025 – Sep 2026)</p>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height={384}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              {COMPETITORS.map((competitor) => (
                <linearGradient
                  key={competitor.id}
                  id={`gradient-${competitor.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={competitor.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={competitor.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
            />
            {COMPETITORS.map((competitor) => (
              <Line
                key={competitor.id}
                type="monotone"
                dataKey={competitor.name}
                stroke={competitor.color}
                strokeWidth={3}
                dot={{ r: 4, fill: competitor.color }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Missing data points shown as gaps</span>
        </div>
      </div>
    </div>
  );
}