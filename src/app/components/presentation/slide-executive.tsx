import { AlertTriangle, CheckCircle, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { SlideContainer, SlideHeader, InsightCard, InsightsSection, SlideFooter } from './design-system';

export function SlideExecutive() {
  return (
    <SlideContainer slideNumber={1}>
      <SlideHeader
        title="Fortinet Competitive Performance Overview"
        subtitle="Keyword & Traffic Insights · Jul-25 – Oct-26"
      />

      <div className="flex-1">
        {/* Fortinet Performance Section */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-gray-900 mb-4">Fortinet Performance Highlights</h3>
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              content="Fortinet US organic traffic is up 9.6% Jul-25→Oct-26 (890K → 975K) but fell 18.4% MoM. Page-1 keywords remain 11.7% above Jul at 44.0K, while the 227K footprint is 37% below the Feb peak."
            />

            <InsightCard
              icon={Award}
              type="success"
              content="Category Leadership: Fortinet leads 5 of 8 Profound categories in Oct-26 — Firewall 71.3%, SASE 70.1%, OT Security 42.5%, Quantum 33.6% and AI Cybersecurity 35.2%; SASE’s lead narrowed to 1.5pp."
            />

            <InsightCard
              icon={Target}
              type="info"
              content="Non-Branded Strength: Fortinet non-branded traffic is up 25.0% since Jul-25 (732K → 915K) and accounts for 93.8% of Oct traffic, though it declined 15.8% MoM."
            />
          </InsightsSection>
        </div>

        {/* Competitor Intelligence Section */}
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 mb-4">Competitive Landscape Insights</h3>
          <InsightsSection>
            <InsightCard
              icon={BarChart3}
              type="warning"
              content="Cisco leads US organic traffic at 1.37M in Oct, 1.4× Fortinet. Its non-branded traffic fell 36.1% MoM to 1.00M and branded traffic eased 5.3% to 369K, making the market-wide Oct contraction the main watchpoint."
            />

            <InsightCard
              icon={AlertTriangle}
              type="warning"
              content="Gap Areas widened in Oct: ZTNA −19.2pp vs Palo Alto, Cloud Security −20.8pp vs Palo Alto, and SecOps −39.1pp vs CrowdStrike require priority investment."
            />

            <InsightCard
              icon={CheckCircle}
              type="info"
              content="Palo Alto leads ZTNA (51.5%) and Cloud Security (44.8%) and is now only 1.5pp behind in SASE (68.6% vs Fortinet 70.1%); it remains the primary positioning benchmark."
            />
          </InsightsSection>
        </div>
      </div>

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}
