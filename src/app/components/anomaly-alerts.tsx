import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { ANOMALIES, COMPETITORS } from '@/app/data/seo-data';

export function AnomalyAlerts() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'alert':
        return {
          bg: 'bg-red-50/70',
          border: 'border-red-200',
          icon: 'text-red-600',
          text: 'text-red-900',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50/70',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          text: 'text-orange-900',
        };
      default:
        return {
          bg: 'bg-blue-50/70',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-900',
        };
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Anomalies & Insights</h2>
        <p className="text-sm text-gray-600">Auto-detected patterns requiring attention</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ANOMALIES.map((anomaly, index) => {
          const Icon = getIcon(anomaly.type);
          const styles = getStyles(anomaly.type);
          const competitor = anomaly.competitor
            ? COMPETITORS.find((c) => c.id === anomaly.competitor)
            : null;

          return (
            <div
              key={index}
              className={`${styles.bg} backdrop-blur-sm rounded-xl p-4 border ${styles.border} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${styles.bg} flex items-center justify-center border ${styles.border}`}>
                  <Icon className={`w-4 h-4 ${styles.icon}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {competitor && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: competitor.color }}
                      />
                    )}
                    <span className={`text-xs font-semibold ${styles.text} uppercase tracking-wide`}>
                      {anomaly.type}
                    </span>
                  </div>
                  <p className={`text-sm ${styles.text} leading-relaxed`}>
                    {anomaly.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
