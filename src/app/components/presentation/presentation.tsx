import { useState, useEffect } from 'react';
import { SlideCover } from './slide-cover';
import { SlideTOC } from './slide-toc';
import { SlideTrafficOverviewDivider } from './slide-traffic-overview-divider';
import { SlideTrafficOverviewTabs } from './slide-traffic-overview-tabs';
import { SlideTrafficOverviewTabsWW } from './slide-traffic-overview-tabs-ww';
import { SlideKeywordDivider } from './slide-keyword-divider';
import { SlideOpportunities } from './slide-opportunities';
import { SlideCategoryDivider } from './slide-category-divider';
import { SlideNGFW } from './slide-ngfw';
import { SlideDashboard } from './slide-dashboard';
import { SlideOTSecurity } from './slide-ot-security';
import { SlideSDWANMetrics } from './slide-sdwan-metrics';
import { SlideZeroTrust } from './slide-zero-trust';
import { SlideCloudSecurity } from './slide-cloud-security';
import { SlideRansomware } from './slide-ransomware';
import { SlideAICyberSecurity } from './slide-ai-cybersecurity';
import { SlideQuantumSecurity } from './slide-quantum-security';
import { SlideNetworkSecurity } from './slide-network-security';
import { SlideSecOps } from './slide-secops';
import { SlideLLMDivider } from './slide-llm-divider';
import { SlideProfundMetrics } from './slide-profund-metrics';
import { SlideAIOverview } from './slide-ai-overview';
import { SlideFeaturedSnippets } from './slide-featured-snippets';
import { SlideCompetitiveAnalysisDivider } from './slide-competitive-analysis-divider';
import { SlideMonthlyPerformanceDivider } from './slide-monthly-performance-divider';
import { SlideCyberglossaryTraffic } from './slide-cyberglossary-traffic';
import { SlideProductPagesTraffic } from './slide-product-pages-traffic';
import { SlideArticlesPagesTraffic } from './slide-articles-pages-traffic';
import { SlideInternationalPagesTraffic } from './slide-international-pages-traffic';
import { SlideOrganicPerformance } from './slide-organic-performance';
import { SlideOrganicPagesOverview } from './slide-organic-pages-overview';
import { SlideOrganicTrafficPerformance } from './slide-organic-traffic-performance';
import { SlideWebsitePerformance } from './slide-website-performance';
import { SlideCyberglossaryDivider } from './slide-cyberglossary-divider';
import { SlideCyberglossaryRanking } from './slide-cyberglossary-ranking';
import { SlideCyberglossaryBacklinks } from './slide-cyberglossary-backlinks';
import { SlideCyberglossaryKeywords } from './slide-cyberglossary-keywords';
import { SlideTop50KWSummary } from './slide-top50kw-summary';
import { SlideCategoryPerformance } from './slide-category-performance';
import { SlideBacklinkDivider } from './slide-backlink-divider';
import { SlideFortinetBacklinksBySource } from './slide-fortinet-backlinks-by-source';
import { SlideBacklinks } from './slide-backlinks';
import { SlideIntelDivider } from './slide-intel-divider';
import { SlideCompetitiveIntel } from './slide-competitive-intel';
import { SlideKeywordGap } from './slide-keyword-gap';
import { SlideCompetitiveFindings } from './slide-competitive-findings';
import { SlideKeyTakeaways } from './slide-key-takeaways';
import { SlideStrategicBrief } from './slide-strategic-brief';
import { SlideThankYou } from './slide-thank-you';

export function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    if (currentSlide < 48) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToHome = () => {
    setCurrentSlide(1); // Navigate to Table of Contents (slide 1)
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNextSlide();
      } else if (event.key === 'ArrowLeft') {
        goToPreviousSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  const slides = [
    <SlideCover onNavigateHome={goToHome} />,
    <SlideTOC onNavigate={(index) => setCurrentSlide(index)} onNavigateHome={goToHome} />,
    <SlideMonthlyPerformanceDivider onNavigateHome={goToHome} />,
    <SlideCyberglossaryTraffic onNavigateHome={goToHome} />,
    <SlideInternationalPagesTraffic onNavigateHome={goToHome} />,
    <SlideProductPagesTraffic onNavigateHome={goToHome} />,
    <SlideArticlesPagesTraffic onNavigateHome={goToHome} />,
    <SlideOrganicPerformance onNavigateHome={goToHome} />,
    <SlideCompetitiveAnalysisDivider onNavigateHome={goToHome} />,
    <SlideKeywordDivider onNavigateHome={goToHome} />,
    <SlideOpportunities onNavigateHome={goToHome} />,
    <SlideTop50KWSummary onNavigateHome={goToHome} />,
    <SlideTrafficOverviewDivider onNavigateHome={goToHome} />,
    <SlideTrafficOverviewTabs onNavigateHome={goToHome} />,
    <SlideTrafficOverviewTabsWW onNavigateHome={goToHome} />,
    <SlideOrganicTrafficPerformance onNavigateHome={goToHome} />,
    <SlideOrganicPagesOverview onNavigateHome={goToHome} />,
    <SlideCategoryDivider onNavigateHome={goToHome} onNavigate={(index) => setCurrentSlide(index)} />,
    <SlideNGFW onNavigateHome={goToHome} />,
    <SlideSDWANMetrics onNavigateHome={goToHome} />,
    <SlideOTSecurity onNavigateHome={goToHome} />,
    <SlideDashboard onNavigateHome={goToHome} />,
    <SlideZeroTrust onNavigateHome={goToHome} />,
    <SlideCloudSecurity onNavigateHome={goToHome} />,
    <SlideRansomware onNavigateHome={goToHome} />,
    <SlideAICyberSecurity onNavigateHome={goToHome} />,
    <SlideQuantumSecurity onNavigateHome={goToHome} />,
    <SlideNetworkSecurity onNavigateHome={goToHome} />,
    <SlideSecOps onNavigateHome={goToHome} />,
    <SlideWebsitePerformance onNavigateHome={goToHome} />,
    <SlideCyberglossaryDivider onNavigateHome={goToHome} />,
    <SlideCyberglossaryKeywords onNavigateHome={goToHome} />,
    <SlideCyberglossaryRanking onNavigateHome={goToHome} />,
    <SlideCyberglossaryBacklinks onNavigateHome={goToHome} />,
    <SlideLLMDivider onNavigateHome={goToHome} />,
    <SlideProfundMetrics onNavigateHome={goToHome} />,
    <SlideCategoryPerformance onNavigateHome={goToHome} />,
    <SlideAIOverview onNavigateHome={goToHome} />,
    <SlideFeaturedSnippets onNavigateHome={goToHome} />,
    <SlideBacklinkDivider onNavigateHome={goToHome} />,
    <SlideFortinetBacklinksBySource onNavigateHome={goToHome} />,
    <SlideBacklinks onNavigateHome={goToHome} />,
    <SlideIntelDivider onNavigateHome={goToHome} />,
    <SlideCompetitiveIntel onNavigateHome={goToHome} />,
    <SlideKeywordGap onNavigateHome={goToHome} />,
    <SlideCompetitiveFindings onNavigateHome={goToHome} />,
    <SlideKeyTakeaways onNavigateHome={goToHome} />,
    <SlideStrategicBrief onNavigateHome={goToHome} />,
    <SlideThankYou onNavigateHome={goToHome} />,
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-auto">
      {/* Slide Container */}
      <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="relative w-full h-full min-h-[600px] bg-white rounded-lg sm:rounded-xl shadow-xl overflow-auto flex items-center justify-center">
          {slides[currentSlide]}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative"
          >
            <div
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-6 sm:w-8 bg-red-500'
                  : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
            <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {index + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="hidden md:block fixed bottom-4 md:bottom-8 right-4 md:right-8 text-xs text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
        Use ← → arrow keys to navigate
      </div>
    </div>
  );
}