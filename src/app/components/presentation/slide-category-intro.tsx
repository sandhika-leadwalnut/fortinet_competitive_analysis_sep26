import { SlideContainer } from './design-system';
import { BarChart3, TrendingUp, Shield, Network, Cloud, Lock } from 'lucide-react';

interface CategoryIntroSlideProps {
  slideNumber: number;
  categoryName: string;
  categoryColor: string;
  subtitle?: string;
}

const categoryDescriptions: Record<string, { description: string; icon: any; metrics: string[] }> = {
  'NGFW / Firewall Category Performance': {
    description: 'Next-Generation Firewall market positioning and keyword performance',
    icon: Shield,
    metrics: ['Total Keywords Ranking', 'Page One Rankings', 'Organic Traffic Growth', 'AI Overview Presence']
  },
  'SD-WAN Category Performance': {
    description: 'Software-Defined Wide Area Network competitive landscape',
    icon: Network,
    metrics: ['Market Share Trends', 'Keyword Rankings', 'Traffic Performance', 'Search Visibility']
  },
  'OT Security Category Performance': {
    description: 'Operational Technology security solutions and market presence',
    icon: Shield,
    metrics: ['Industry Coverage', 'Ranking Positions', 'Organic Reach', 'Visibility Metrics']
  },
  'SASE Category Performance': {
    description: 'Secure Access Service Edge market analysis and competitive stance',
    icon: Cloud,
    metrics: ['Category Rankings', 'Traffic Analysis', 'Competitive Position', 'Growth Trends']
  },
  'Zero Trust Security Category Performance': {
    description: 'Zero Trust architecture and security framework positioning',
    icon: Lock,
    metrics: ['Solution Rankings', 'Market Visibility', 'Traffic Metrics', 'AI Integration']
  },
  'Cloud Security Category Performance': {
    description: 'Cloud security solutions competitive performance analysis',
    icon: Cloud,
    metrics: ['Market Position', 'Keyword Coverage', 'Traffic Growth', 'Category Leadership']
  }
};

export function CategoryIntroSlide({ 
  slideNumber, 
  categoryName, 
  categoryColor,
  subtitle = "Category Performance Analysis"
}: CategoryIntroSlideProps) {
  const categoryData = categoryDescriptions[categoryName] || { 
    description: 'Competitive performance analysis', 
    icon: BarChart3,
    metrics: ['Rankings', 'Traffic', 'Visibility', 'Growth']
  };
  const IconComponent = categoryData.icon;

  return (
    <SlideContainer slideNumber={slideNumber}>
      <div className="flex-1 flex flex-col justify-center items-center px-16">
        {/* Decorative Background Element */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: categoryColor }}
        />
        
        {/* Category Badge with Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: categoryColor }}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <span className="text-xl font-medium text-gray-500 uppercase tracking-wide">
            {subtitle}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-[72px] font-bold text-gray-900 text-center leading-tight max-w-5xl mb-6">
          {categoryName}
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 text-center max-w-3xl mb-12">
          {categoryData.description}
        </p>

        {/* Key Metrics Preview */}
        <div className="flex items-center gap-6 flex-wrap justify-center">
          {categoryData.metrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: categoryColor }}
              />
              <span className="text-sm font-medium text-gray-700">
                {metric}
              </span>
            </div>
          ))}
        </div>

        {/* Visual Separator */}
        <div className="mt-12 flex items-center gap-2">
          <div className="w-12 h-0.5 bg-gray-300 rounded-full" />
          <TrendingUp className="w-5 h-5 text-gray-400" />
          <div className="w-12 h-0.5 bg-gray-300 rounded-full" />
        </div>
      </div>
    </SlideContainer>
  );
}