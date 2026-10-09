import { AlertTriangle, CheckCircle, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { SlideContainer, SlideHeader, InsightCard, InsightsSection, SlideFooter } from './design-system';

export function SlideExecutive() {
  return (
    <SlideContainer slideNumber={1}>
      <SlideHeader
        title="Fortinet Competitive Performance Overview"
        subtitle="Keyword & Traffic Insights · Jul 2025 – Sep 2026"
      />

      <div className="flex-1">
        {/* Fortinet Performance Section */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-gray-900 mb-4">Fortinet Performance Highlights</h3>
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              content="Fortinet US organic traffic: +34.3% growth (890K → 1.20M, Jul 2025–Sep 2026), with Page 1 keywords up +16.5% (39.4K → 45.9K) — quality of rankings improving even as total footprint (211K) sits 42% below the Feb peak (362K)."
            />

            <InsightCard
              icon={Award}
              type="success"
              content="Category Leadership: Fortinet leads 5 of 8 Profound categories in Sep 2026 — Firewall (71.7%), SASE (71.1%), OT Security (42.2%), Quantum (38.5%) and AI Cybersecurity (39.6%, lead over CrowdStrike cut to 11.5pp)."
            />

            <InsightCard
              icon={Target}
              type="info"
              content="Non-Branded Success: Fortinet achieves +48.5% non-branded traffic growth (732K → 1.09M), now 91% of organic traffic — effective SEO beyond brand recognition, critical for market expansion."
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
              content="Cisco leads organic traffic (1.96M in Sep, 1.6× Fortinet) — non-branded surged +26% MoM to 1.57M while branded fell −41% to 390K; monitor sustainability and market share impact."
            />

            <InsightCard
              icon={AlertTriangle}
              type="warning"
              content="Gap Areas: ZTNA (−11.0pp vs PA), Cloud Security (−19.1pp vs PA), and SecOps (−30.8pp vs CrowdStrike) require strategic content investment."
            />

            <InsightCard
              icon={CheckCircle}
              type="info"
              content="Palo Alto leads ZTNA (44.1%) and Cloud Security (44.8%) and is the closest rival in SASE (63.2%), Firewall (56.4%), OT and Quantum — primary competitive benchmark for Fortinet's content strategy and positioning."
            />
          </InsightsSection>
        </div>
      </div>

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}