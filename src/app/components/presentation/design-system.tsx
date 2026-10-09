import { createContext, useContext, ReactNode } from 'react';
import { LucideIcon, Home } from 'lucide-react';

/**
 * STANDARDIZED DESIGN SYSTEM FOR SEO COMPETITIVE ANALYSIS PRESENTATION
 * 
 * This file defines all consistent design tokens, components, and patterns
 * to ensure visual uniformity across all 18 slides.
 */

// ============================================================================
// TYPOGRAPHY SYSTEM (Exactly 3 text styles as required)
// ============================================================================

export const TEXT_STYLES = {
  // Style 1: Slide Titles
  slideTitle: 'text-[32px] font-bold text-gray-900 leading-tight tracking-tight',
  
  // Style 2: Section Labels & Metric Names
  sectionLabel: 'text-[14px] font-medium text-gray-600 uppercase tracking-wide',
  metricLabel: 'text-[14px] font-medium text-gray-700',
  
  // Style 3: Key Metrics & Numbers (largest emphasis)
  metricValue: 'text-[28px] font-bold text-gray-900 tracking-tight',
  metricLarge: 'text-[36px] font-bold text-gray-900 tracking-tight',
} as const;

// ============================================================================
// COLOR SYSTEM
// ============================================================================

export const COLORS = {
  // Primary Brand Color (Fortinet Red)
  primary: '#EF4444',
  primaryHover: '#DC2626',
  
  // Accent Color
  accent: '#8B5CF6',
  accentHover: '#7C3AED',
  
  // Neutral Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Chart Colors (Competitor colors from data file)
  fortinet: '#EF4444',
  cisco: '#FF7AB6',
  hpe: '#7ED957',
  paloalto: '#FFB14A',
  checkpoint: '#6C9AFF',
  crowdstrike: '#FF8E5A',
} as const;

// ============================================================================
// SPACING SYSTEM (8pt grid)
// ============================================================================

export const SPACING = {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '40px',
  xxl: '48px',
} as const;

// ============================================================================
// LAYOUT CONSTANTS
// ============================================================================

export const LAYOUT = {
  containerMaxWidth: 'max-w-7xl',
  contentPadding: 'px-12 py-10',
  chartHeight: 360, // Standard chart height
  chartHeightLarge: 420, // For emphasis charts
  gridGap: 'gap-6',
} as const;

// ============================================================================
// TIME RANGE FILTER
// ============================================================================

export type TimeRange = 'all' | '6m' | '3m';

export function getTimeRangeOffset(range: TimeRange, totalMonths: number): number {
  if (range === '3m') return Math.max(0, totalMonths - 3);
  if (range === '6m') return Math.max(0, totalMonths - 6);
  return 0;
}

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeFilter({ value, onChange }: TimeRangeFilterProps) {
  const options: { key: TimeRange; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: '6m', label: '6M' },
    { key: '3m', label: '3M' },
  ];
  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-1 self-end mb-0.5">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
            value === key
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// SLIDE META CONTEXT  (source + slideNumber passed from container → header)
// ============================================================================

interface SlideMeta { source: string; slideNumber?: number; }
const SlideMetaContext = createContext<SlideMeta | null>(null);

// ============================================================================
// STANDARDIZED SLIDE CONTAINER
// ============================================================================

interface SlideContainerProps {
  children: ReactNode;
  slideNumber?: number;
  totalSlides?: number;
  onNavigateHome?: () => void;
  source?: string;
}

export function SlideContainer({ 
  children, 
  slideNumber, 
  totalSlides = 19, 
  onNavigateHome,
  source = "Semrush"
}: SlideContainerProps) {
  return (
    <SlideMetaContext.Provider value={{ source, slideNumber }}>
      <div className="w-full h-full bg-white p-12 relative">
        <div className={`${LAYOUT.containerMaxWidth} mx-auto h-full flex flex-col`}>
          {/* Home Button — top-right, no source text here */}
          {onNavigateHome && (
            <div className="absolute top-8 right-12 z-20">
              <button
                onClick={onNavigateHome}
                className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow"
                aria-label="Go to Table of Contents"
              >
                <Home size={18} />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </SlideMetaContext.Provider>
  );
}

// ============================================================================
// STANDARDIZED SLIDE HEADER
// ============================================================================

interface SlideHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function SlideHeader({ title, subtitle, actions }: SlideHeaderProps) {
  const meta = useContext(SlideMetaContext);

  // Build source · country string
  let sourceLine = '';
  if (meta?.source) {
    sourceLine = `Source: ${meta.source}`;
    const sn = meta.slideNumber;
    if (sn !== undefined) {
      if ([3, 9, 10, 12, 13, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27].includes(sn)) {
        sourceLine += ' · Country: US';
      } else if ([15, 16].includes(sn)) {
        sourceLine += ' · Country: WW';
      }
    }
  }

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className={TEXT_STYLES.slideTitle}>{title}</h1>
        {subtitle && (
          <p className="text-[14px] text-gray-500 mt-1">{subtitle}</p>
        )}
        {sourceLine && (
          <p className="text-[11px] text-gray-400 font-medium mt-1.5 tracking-wide">{sourceLine}</p>
        )}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
}

// ============================================================================
// STANDARDIZED INSIGHT CARD
// ============================================================================

interface InsightCardProps {
  icon?: LucideIcon;
  title?: string;
  content: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function InsightCard({ icon: Icon, title, content, type = 'default' }: InsightCardProps) {
  const typeStyles = {
    default: 'bg-gray-50 border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-orange-50 border-orange-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const iconColors = {
    default: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  };

  return (
    <div className={`${typeStyles[type]} border rounded-lg p-5`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={`${iconColors[type]} flex-shrink-0 mt-0.5`}>
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <div className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${iconColors[type]}`}>
              {title}
            </div>
          )}
          <p className={`${TEXT_STYLES.metricLabel} text-gray-700 font-normal leading-relaxed`}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INSIGHTS SECTION WRAPPER
// ============================================================================

interface InsightsSectionProps {
  children: ReactNode;
  title?: string;
}

export function InsightsSection({ children, title = 'Key Insights' }: InsightsSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className={`${TEXT_STYLES.sectionLabel} mb-4`}>{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// CHART CONTAINER
// ============================================================================

interface ChartContainerProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  height?: number;
}

export function ChartContainer({ children, title, actions, height = LAYOUT.chartHeight }: ChartContainerProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3 className={`${TEXT_STYLES.metricLabel} text-gray-900`}>{title}</h3>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div style={{ height: `${height}px` }}>
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// METRIC CARD
// ============================================================================

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
}

export function MetricCard({ label, value, change, changeType = 'neutral', icon: Icon }: MetricCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between mb-3">
        <span className={TEXT_STYLES.sectionLabel}>{label}</span>
        {Icon && <Icon size={20} className="text-gray-400" />}
      </div>
      <div className={TEXT_STYLES.metricValue}>{value}</div>
      {change && (
        <div className={`${TEXT_STYLES.metricLabel} ${changeColors[changeType]} mt-2`}>
          {change}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CONTEXTUAL INSIGHT CARD (for beside charts)
// ============================================================================

interface ContextualInsightCardProps {
  icon?: LucideIcon;
  sentiment?: 'positive' | 'neutral' | 'negative';
  headline: string;
  body: string | string[];
}

export function ContextualInsightCard({ 
  icon: Icon, 
  sentiment = 'neutral', 
  headline, 
  body 
}: ContextualInsightCardProps) {
  const sentimentStyles = {
    positive: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconColor: 'text-green-600',
      headlineColor: 'text-green-900',
    },
    neutral: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-600',
      headlineColor: 'text-blue-900',
    },
    negative: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      iconColor: 'text-orange-600',
      headlineColor: 'text-orange-900',
    },
  };

  const styles = sentimentStyles[sentiment];
  const bodyLines = Array.isArray(body) ? body : [body];

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-4 shadow-sm`}>
      {Icon && (
        <div className="mb-3">
          <Icon className={`${styles.iconColor} w-5 h-5`} />
        </div>
      )}
      <h4 className={`text-base font-semibold ${styles.headlineColor} mb-2 leading-tight`}>
        {headline}
      </h4>
      <div className="space-y-1.5">
        {bodyLines.map((line, idx) => (
          <p key={idx} className="text-[13px] leading-[1.4] text-gray-700">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SLIDE FOOTER
// ============================================================================

interface SlideFooterProps {
  source?: string;
}

export function SlideFooter({ source = '' }: SlideFooterProps) {
  if (!source) return null;
  
  return (
    <div className="absolute bottom-12 left-12 z-10">

    </div>
  );
}

// ============================================================================
// STANDARDIZED CHART CONFIGURATION
// ============================================================================

export const CHART_CONFIG = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  cartesianGrid: {
    strokeDasharray: '3 3',
    stroke: COLORS.gray200,
    vertical: false,
  },
  xAxis: {
    axisLine: false,
    tickLine: false,
    tick: { fill: COLORS.gray600, fontSize: 10, fontWeight: 500 },
    dy: 8,
    interval: 0,
    minTickGap: -1,
  },
  yAxis: {
    axisLine: false,
    tickLine: false,
    tick: { fill: COLORS.gray600, fontSize: 12, fontWeight: 500 },
    dx: -10,
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      border: `1px solid ${COLORS.gray200}`,
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    labelStyle: {
      color: COLORS.gray900,
      fontWeight: 600,
      fontSize: 12,
      marginBottom: 8,
    },
    itemStyle: {
      color: COLORS.gray700,
      fontSize: 12,
      padding: '2px 0',
    },
  },
  line: {
    strokeWidth: 2.5,
    dot: false,
    activeDot: { r: 5, strokeWidth: 0 },
  },
  bar: {
    radius: [4, 4, 0, 0] as [number, number, number, number],
  },
} as const;

// ============================================================================
// EDIT BUTTON (Standardized)
// ============================================================================

interface EditButtonProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditButton({ isEditing, onEdit, onSave, onCancel }: EditButtonProps) {
  if (!isEditing) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={onSave}
        className="text-green-600 hover:text-green-700 transition-colors p-2 rounded-lg hover:bg-green-50"
        aria-label="Save changes"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
      <button
        onClick={onCancel}
        className="text-red-600 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
        aria-label="Cancel editing"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ============================================================================
// COMPETITOR FILTER TOGGLES (Standardized)
// ============================================================================

interface CompetitorFilterProps {
  competitors: Array<{ id: string; name: string; color: string }>;
  visibleCompetitors: Set<string>;
  onToggle: (id: string) => void;
}

export function CompetitorFilter({ competitors, visibleCompetitors, onToggle }: CompetitorFilterProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 italic">Click on competitors to toggle comparison</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {competitors.map((comp) => (
          <button
            key={comp.id}
            onClick={() => onToggle(comp.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              visibleCompetitors.has(comp.id)
                ? 'bg-white border-gray-300 text-gray-900 shadow-sm'
                : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: comp.color }}
            />
            {comp.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CUSTOM TOOLTIP FOR CHARTS
// ============================================================================

export function CustomChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload || !payload.length) return null;

  const validPayload = payload.filter((entry: any) => entry.value !== null && entry.value !== undefined);
  if (!validPayload.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-900 mb-2">{label}</p>
      {validPayload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs mb-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700">{entry.name}:</span>
          <span className="font-semibold text-gray-900">
            {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}