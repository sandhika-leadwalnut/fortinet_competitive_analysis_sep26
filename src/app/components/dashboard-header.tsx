import { Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface DashboardHeaderProps {
  onViewChange: (view: 'dashboard' | 'presentation') => void;
  currentView: 'dashboard' | 'presentation';
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

export function DashboardHeader({
  onViewChange,
  currentView,
  selectedMetric,
  onMetricChange,
  selectedMonth,
  onMonthChange,
}: DashboardHeaderProps) {
  const monthOptions = [
    { value: 0, label: 'Sep 2025' },
    { value: 1, label: 'Oct 2025' },
    { value: 2, label: 'Nov 2025' },
    { value: 3, label: 'Dec 2025' },
    { value: 4, label: 'Jan 2026' },
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          SEO Competitive Analysis
        </h1>
        <p className="text-sm text-gray-600">
          Jul 2025 – Sep 2026 • 9 Competitors Tracked
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Range Selector */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Select
            value={selectedMonth.toString()}
            onValueChange={(val) => onMonthChange(parseInt(val))}
          >
            <SelectTrigger className="w-[140px] border-0 shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metric Toggle */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={selectedMetric} onValueChange={onMetricChange}>
            <SelectTrigger className="w-[150px] border-0 shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="branded">Branded</SelectItem>
              <SelectItem value="non-branded">Non-Branded</SelectItem>
              <SelectItem value="combined">Combined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentView === 'dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onViewChange('presentation')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentView === 'presentation'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Presentation
          </button>
        </div>

        {/* Export Button */}
        <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
