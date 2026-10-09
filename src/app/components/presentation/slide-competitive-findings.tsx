import { ExternalLink, Target, Zap, Brain, Network } from 'lucide-react';
import { useState } from 'react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
} from './design-system';

// Tab 1 – Turning Cybersecurity Expertise Into Brand Assets (Check Point)
import imgZeroTrust from '../../../imports/sum_tab_1.png';

// Tab 2 – Competitive Shift: From Security Blogs to Threat Intelligence Hubs (Wiz)
import imgZeroTrustInfographic from '../../../imports/sum_tab_2.png';

// Tab 3 – PQC Readiness Tester (Wiz)
import imgZeroTrustService from '../../../imports/sum_tab_3.png';

// Tab 4 – Turn Key Takeaways Into AI-Search-Ready Summaries (Wiz)
import imgStrategicCTA from '../../../imports/sum_tab_4.png';


interface Finding {
  icon: any;
  color: string;
  bgColor: string;
  title: string;
  description: (string | { text: string; link: string; linkDisplay: string })[];
  competitor: string;
  url?: string;
  urlDisplay?: string;
  screenshot?: string;
  screenshot2?: string;
  screenshot3?: string;
  screenshot4?: string;
  screenshot5?: string;
  midText?: string;
  midTextUrl?: string;
}

const findings: Finding[] = [
  // ── Tab 1 ──────────────────────────────────────────────────────────────────
  {
    icon: Brain,
    color: '#F97316',
    bgColor: '#FFF7ED',
    title: 'Turning Cybersecurity Expertise Into Brand Assets',
    description: [
      'Create proprietary, research-led reports that turn our cybersecurity expertise into authoritative, high-value brand assets.',
      'Use each report to build sustained SEO/AEO visibility, thought leadership, PR, backlinks, and downstream content.',
    ],
    competitor: 'Check Point',
    url: 'https://www.checkpoint.com/resources/ai-security-report-2026/',
    urlDisplay: 'checkpoint.com/resources/ai-security-report-2026',
    screenshot: imgZeroTrust,
  },
  // ── Tab 2 ──────────────────────────────────────────────────────────────────
  {
    icon: Network,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    title: 'Competitive Shift: From Security Blogs to Threat Intelligence Hubs',
    description: [
      'Competitors are moving beyond blogs to build data-led threat intelligence hubs designed to capture broad, high-intent search demand across threats, actors, techniques, vulnerabilities, and incidents.',
      'These evergreen hubs strengthen topical authority, improve AI/search visibility, and create scalable entry points into their broader security platforms and research.',
    ],
    competitor: 'Wiz',
    url: 'https://www.wiz.io/cloud-threat-landscape',
    urlDisplay: 'wiz.io/cloud-threat-landscape',
    screenshot: imgZeroTrustInfographic,
  },
  // ── Tab 3 ──────────────────────────────────────────────────────────────────
  {
    icon: Zap,
    color: '#0EA5E9',
    bgColor: '#F0F9FF',
    title: 'PQC Tester: Turn Quantum Awareness Into Action',
    description: [
      'Build a Fortinet PQC Readiness Tester to turn quantum-security awareness into action.',
      'Fortinet could create a differentiated version that uses its existing PQC expertise to generate an actionable readiness assessment and naturally connect prospects to Fortinet\'s quantum-safe solutions.',
    ],
    competitor: 'Wiz',
    url: 'https://www.wiz.io/pqc-tester',
    urlDisplay: 'wiz.io/pqc-tester',
    screenshot: imgZeroTrustService,
  },
  // ── Tab 4 ──────────────────────────────────────────────────────────────────
  {
    icon: Target,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    title: 'Turn Key Takeaways Into an AI-Search-Ready Summary',
    description: [
      'Create concise, answer-ready summaries that help users quickly grasp the topic while giving search engines and AI platforms clear, authoritative information to surface.',
    ],
    competitor: 'Wiz',
    url: 'https://www.wiz.io/academy/ai-guardrails',
    urlDisplay: 'wiz.io/academy/ai-guardrails',
    screenshot: imgStrategicCTA,
  },
];

export function SlideCompetitiveFindings({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [selectedFinding, setSelectedFinding] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <SlideContainer slideNumber={23} onNavigateHome={onNavigateHome} source="">
      <SlideHeader
        title="Web Experience"
        subtitle="Strategic Observations from Competitor Websites"
      />

      <div className="flex-1 flex flex-col gap-4 pb-4 overflow-hidden">
        {/* Top Panel – Horizontal Tab Buttons */}
        <div className="flex-shrink-0 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:opacity-0 hover:[&::-webkit-scrollbar]:opacity-100 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 transition-all">
          <div className="flex gap-3 min-w-max">
            {findings.map((finding, idx) => {
              const Icon = finding.icon;
              const isSelected = selectedFinding === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFinding(idx)}
                  className={`w-[200px] flex-shrink-0 text-left bg-white border-2 rounded-xl p-3 transition-all duration-200 ${
                    isSelected
                      ? 'border-red-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: finding.bgColor }}
                    >
                      <Icon className="w-4 h-4" style={{ color: finding.color }} />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">{finding.title}</h3>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block truncate max-w-full"
                    style={{ backgroundColor: finding.bgColor, color: finding.color }}
                  >
                    {finding.competitor}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Panel – Detail + Screenshot */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 flex items-start gap-3 mb-4 pb-4 border-b border-gray-200">
            {(() => {
              const Icon = findings[selectedFinding].icon;
              return (
                <>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: findings[selectedFinding].bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: findings[selectedFinding].color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900">{findings[selectedFinding].title}</h3>
                    {Array.isArray(findings[selectedFinding].description) ? (
                      <ul className="text-xs text-gray-600 mt-2 list-disc list-inside space-y-1">
                        {(findings[selectedFinding].description as (string | { text: string; link: string; linkDisplay: string })[]).map((bullet, i) => (
                          <li key={i}>
                            {typeof bullet === 'string' ? (
                              bullet
                            ) : (
                              <>
                                {bullet.text}{' '}
                                <a
                                  href={bullet.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3 h-3 inline flex-shrink-0" />
                                  {bullet.linkDisplay}
                                </a>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-600 mt-1">{findings[selectedFinding].description as string}</p>
                    )}
                    {findings[selectedFinding].url && (
                      <a
                        href={findings[selectedFinding].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors group mt-2"
                      >
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                        <span className="truncate max-w-full">{findings[selectedFinding].urlDisplay}</span>
                      </a>
                    )}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Screenshots */}
          <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-start justify-center overflow-y-auto">
            {findings[selectedFinding].screenshot ? (
              <div className="w-full space-y-3">
                {/* Primary Screenshot */}
                <div
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-zoom-in hover:shadow-md transition-shadow"
                  onClick={() => setLightboxImage(findings[selectedFinding].screenshot!)}
                >
                  <img
                    src={findings[selectedFinding].screenshot}
                    alt={findings[selectedFinding].title}
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Secondary Screenshot */}
                {findings[selectedFinding].screenshot2 && (
                  <>
                    {findings[selectedFinding].midText ? (
                      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <a
                          href={findings[selectedFinding].midTextUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors group"
                        >
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                          <span className="font-medium">{findings[selectedFinding].midText}</span>
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-gray-300" />
                        <div className="flex-1 h-px bg-gray-300" />
                      </div>
                    )}

                    <div
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-zoom-in hover:shadow-md transition-shadow"
                      onClick={() => setLightboxImage(findings[selectedFinding].screenshot2!)}
                    >
                      <img
                        src={findings[selectedFinding].screenshot2}
                        alt={`${findings[selectedFinding].title} 2`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </>
                )}

                {/* Tertiary Screenshot */}
                {findings[selectedFinding].screenshot3 && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-300" />
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <div
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-zoom-in hover:shadow-md transition-shadow"
                      onClick={() => setLightboxImage(findings[selectedFinding].screenshot3!)}
                    >
                      <img
                        src={findings[selectedFinding].screenshot3}
                        alt={`${findings[selectedFinding].title} 3`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </>
                )}

                {/* Fourth Screenshot */}
                {findings[selectedFinding].screenshot4 && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-300" />
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <div
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-zoom-in hover:shadow-md transition-shadow"
                      onClick={() => setLightboxImage(findings[selectedFinding].screenshot4!)}
                    >
                      <img
                        src={findings[selectedFinding].screenshot4}
                        alt={`${findings[selectedFinding].title} 4`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </>
                )}

                {/* Fifth Screenshot */}
                {findings[selectedFinding].screenshot5 && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-300" />
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <div
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-zoom-in hover:shadow-md transition-shadow"
                      onClick={() => setLightboxImage(findings[selectedFinding].screenshot5!)}
                    >
                      <img
                        src={findings[selectedFinding].screenshot5}
                        alt={`${findings[selectedFinding].title} 5`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                  <ExternalLink className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No screenshot available</p>
                <p className="text-xs text-gray-400 mt-1">Visit the link to view the content</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-8"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            ×
          </button>
          <div className="max-w-7xl max-h-full overflow-auto">
            <img
              src={lightboxImage}
              alt="Enlarged view"
              className="w-auto h-auto max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <SlideFooter />
    </SlideContainer>
  );
}