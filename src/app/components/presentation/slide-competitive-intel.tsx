import { useState } from 'react';
import { Brain, FileText, TrendingUp, ExternalLink, X, BookOpen, Calendar } from 'lucide-react';
import { SlideContainer, SlideHeader, SlideFooter } from './design-system';

export function SlideCompetitiveIntel({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showGlossaryModal, setShowGlossaryModal] = useState(false);
  const [showPagesModal, setShowPagesModal] = useState(false);
  const [showPagesDropdown, setShowPagesDropdown] = useState(false);
  const [showBlogsDropdown, setShowBlogsDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'paloalto' | 'crowdstrike' | 'sentinelone' | 'contentgap' | 'checkpoint'>('contentgap');
  const [showCheckPointDropdown, setShowCheckPointDropdown] = useState(false);
  const [showCrowdstrikeDropdown, setShowCrowdstrikeDropdown] = useState(false);
  const [showSentinelOneDropdown, setShowSentinelOneDropdown] = useState(false);

  const glossaryPages = [
    { category: 'AI Fundamentals', title: 'Artificial Intelligence (AI)', url: 'https://www.paloaltonetworks.com/cyberpedia/artificial-intelligence-ai' },
    { category: 'AI Fundamentals', title: 'Machine Learning (ML)', url: 'https://www.paloaltonetworks.com/cyberpedia/machine-learning-ml' },
    { category: 'AI Fundamentals', title: 'What is Generative AI', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-generative-ai' },
    { category: 'AI Fundamentals', title: 'What is Responsible AI', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-responsible-ai' },
    { category: 'AI Fundamentals', title: 'What is AI Bias', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-bias' },
    { category: 'AI Fundamentals', title: 'What is Federated Learning', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-federated-learning' },
    { category: 'AI Fundamentals', title: 'Black Box AI', url: 'https://www.paloaltonetworks.com/cyberpedia/black-box-ai' },
    { category: 'AI Fundamentals', title: 'What is RLHF', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-rlhf' },
    { category: 'AI Fundamentals', title: 'AI Explainability', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-explainability' },
    { category: 'AI Fundamentals', title: 'Explainable AI', url: 'https://www.paloaltonetworks.com/cyberpedia/explainable-ai' },
    { category: 'AI Fundamentals', title: 'AI Development Lifecycle', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-development-lifecycle' },
    { category: 'AI Fundamentals', title: 'What is Retrieval Augmented Generation', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-retrieval-augmented-generation' },
    { category: 'AI Security', title: 'AI Security', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-security' },
    { category: 'AI Security', title: 'AI in Threat Detection', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-in-threat-detection' },
    { category: 'AI Security', title: 'AI Infrastructure Security', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-infrastructure-security' },
    { category: 'AI Security', title: 'AI Security Policy', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-security-policy' },
    { category: 'AI Security', title: 'What is AI Prompt Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-prompt-security' },
    { category: 'AI Security', title: 'Generative AI Security Risks', url: 'https://www.paloaltonetworks.com/cyberpedia/generative-ai-security-risks' },
    { category: 'AI Security', title: 'What is Shadow AI', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-shadow-ai' },
    { category: 'AI Security', title: 'What is Agentic AI Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-agentic-ai-security' },
    { category: 'AI Security', title: 'AI Security Posture Management (AI-SPM)', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-security-posture-management-aispm' },
    { category: 'AI Security', title: 'What is AI in Endpoint Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-in-endpoint-security' },
    { category: 'AI Security', title: 'What is AI Model Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-model-security' },
    { category: 'AI Security', title: 'What is an AI BOM', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-an-ai-bom' },
    { category: 'AI Security', title: 'AI Security Concepts', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-security-concepts' },
    { category: 'AI Security', title: 'What is Data Poisoning', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-data-poisoning' },
    { category: 'AI Security', title: 'What is Inline Deep Learning', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-inline-deep-learning' },
    { category: 'AI Security', title: 'What is Precision AI', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-precision-ai' },
    { category: 'AI Security', title: 'What are AI Hallucinations', url: 'https://www.paloaltonetworks.com/cyberpedia/what-are-ai-hallucinations' },
    { category: 'Frameworks & Governance', title: 'AI Governance', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-governance' },
    { category: 'Frameworks & Governance', title: 'AI Risk Management Framework', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-risk-management-framework' },
    { category: 'Frameworks & Governance', title: 'NIST AI Risk Management Framework', url: 'https://www.paloaltonetworks.com/cyberpedia/nist-ai-risk-management-framework' },
    { category: 'Frameworks & Governance', title: 'Google Secure AI Framework', url: 'https://www.paloaltonetworks.com/cyberpedia/google-secure-ai-framework' },
    { category: 'Frameworks & Governance', title: 'MITRE ATLAS Matrix', url: 'https://www.paloaltonetworks.com/cyberpedia/mitre-sensible-regulatory-framework-atlas-matrix' },
    { category: 'Frameworks & Governance', title: 'IEEE Ethically Aligned Design', url: 'https://www.paloaltonetworks.com/cyberpedia/ieee-ethically-aligned-design' },
    { category: 'Frameworks & Governance', title: 'AI TRiSM', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-trism' },
    { category: 'Frameworks & Governance', title: 'What is Quantum Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-quantum-security' },
    { category: 'Adoption & Strategy', title: 'Steps to Successful AI Adoption in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/steps-to-successful-ai-adoption-in-cybersecurity' },
    { category: 'Adoption & Strategy', title: 'AI Risks and Benefits in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-risks-and-benefits-in-cybersecurity' },
    { category: 'Adoption & Strategy', title: 'What are Barriers to AI Adoption in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/what-are-barriers-to-ai-adoption-in-cybersecurity' },
    { category: 'Adoption & Strategy', title: 'Predictions of AI in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/predictions-of-artificial-intelligence-ai-in-cybersecurity' },
    { category: 'Adoption & Strategy', title: 'Role of AI in Security Automation', url: 'https://www.paloaltonetworks.com/cyberpedia/role-of-artificial-intelligence-ai-in-security-automation' },
    { category: 'Adoption & Strategy', title: 'What is Cybersecurity Platformization', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-cybersecurity-platformization' },
    { category: 'Adoption & Strategy', title: 'What is MLOps', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-mlops' },
    { category: 'Technologies', title: 'Generative AI in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/generative-ai-in-cybersecurity' },
    { category: 'Technologies', title: 'AI-Powered SASE', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-powered-sase' },
    { category: 'Technologies', title: 'Zero Trust and SASE', url: 'https://www.paloaltonetworks.com/cyberpedia/zero-trust-and-sase' },
    { category: 'Technologies', title: 'Threat Intelligence Use Cases and Examples', url: 'https://www.paloaltonetworks.com/cyberpedia/threat-intelligence-use-cases-and-examples' },
    { category: 'Technologies', title: 'Static Analysis, Dynamic Analysis & ML', url: 'https://www.paloaltonetworks.com/cyberpedia/why-you-need-static-analysis-dynamic-analysis-machine-learning' },
  ];

  const glossaryCategories = [
    { label: 'AI Fundamentals', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
    { label: 'AI Security', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
    { label: 'Frameworks & Governance', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    { label: 'Adoption & Strategy', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    { label: 'Technologies', color: 'bg-lime-100 text-lime-700 border-lime-200', dot: 'bg-lime-500' },
  ];

  const blogPosts = [
    { month: 'January', url: 'https://www.paloaltonetworks.com/blog/2026/01/alien-franchise-taught-cybersecurity/', title: 'What the Alien Franchise Taught Us About Cybersecurity' },
    { month: 'January', url: 'https://www.paloaltonetworks.com/blog/2026/01/bridging-cybersecurity-and-ai/', title: 'Bridging Cybersecurity and AI' },
    { month: 'January', url: 'https://www.paloaltonetworks.com/blog/2026/01/unified-ai-powered-security/', title: 'Unified AI-Powered Security' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/power-of-glean-and-prisma-airs-integration/', title: 'Power of Glean and Prisma AIR\'s Integration' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/raf-association-next-generation-cyber-resilience/', title: 'RAF Association Next-Generation Cyber Resilience' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/securing-every-identity-in-the-age-of-ai/', title: 'Securing Every Identity in the Age of AI' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/securing-the-agentic-endpoint/', title: 'Securing the Agentic Endpoint' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/soc-agentic-next-evolution-cortex/', title: 'SOC Agentic: The Next Evolution of Cortex' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/when-security-becomes-an-afterthought/', title: 'When Security Becomes an Afterthought' },
    { month: 'March', url: 'https://www.paloaltonetworks.com/blog/2026/03/service-providers-become-secure-ai-factories/', title: 'Service Providers Become Secure AI Factories' },
  ];

  const monthGroups = [
    { label: 'January 2026', color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500', posts: blogPosts.filter(p => p.month === 'January') },
    { label: 'February 2026', color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500', posts: blogPosts.filter(p => p.month === 'February') },
    { label: 'March 2026', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', posts: blogPosts.filter(p => p.month === 'March') },
  ];

  const newPages = [
    // ── Sep 2026 New Pages ───────────────────────────────────────────────────
    {
      title: 'What is AI Tool Sprawl',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-tool-sprawl',
      category: 'AI Security'
    },
    {
      title: 'What is an AI Gateway',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-an-ai-gateway',
      category: 'AI Security'
    },
    {
      title: 'What is AI Auto-Instrumentation',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-auto-instrumentation',
      category: 'AI Security'
    },
    {
      title: 'Agentic Endpoint Security',
      url: 'https://www.paloaltonetworks.com/cyberpedia/agentic-endpoint-security',
      category: 'AI Security'
    },
    {
      title: 'What is a Supply Chain Attack',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-supply-chain-attack',
      category: 'Technologies'
    },
    {
      title: 'Logs vs Metrics vs Traces',
      url: 'https://www.paloaltonetworks.com/cyberpedia/logs-vs-metrics-vs-traces',
      category: 'Technologies'
    },
    {
      title: 'What is AI Observability',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-observability',
      category: 'AI Security'
    },
    {
      title: 'AI Agent Attack Surface',
      url: 'https://www.paloaltonetworks.com/cyberpedia/ai-agent-attack-surface',
      category: 'AI Security'
    },
    {
      title: 'Telemetry Pipeline',
      url: 'https://www.paloaltonetworks.com/cyberpedia/telemetry-pipeline',
      category: 'Technologies'
    },
    {
      title: 'What is a Service Level Objective (SLO)',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-service-level-objective-slo',
      category: 'Technologies'
    },
    {
      title: 'What is an Agent Registry',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-an-agent-registry',
      category: 'AI Security'
    },
    {
      title: 'What is Agent Authorization',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-agent-authorization',
      category: 'AI Security'
    },
    {
      title: 'AI Observability Metrics',
      url: 'https://www.paloaltonetworks.com/cyberpedia/ai-observability-metrics',
      category: 'AI Security'
    },
    {
      title: 'What is AI Agent Hijacking',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-agent-hijacking',
      category: 'AI Security'
    },
  ];

  const pageCategories = [
    { label: 'AI Security', color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
    { label: 'Security Tools', color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
    { label: 'Identity Security', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    { label: 'Access Control', color: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
    { label: 'Encryption & PKI', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    { label: 'Security Standards', color: 'bg-teal-100 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
    { label: 'Threat Protection', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
    { label: 'Network Security', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500' },
    { label: 'Data Security', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    { label: 'Cloud Security', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
    { label: 'API Security', color: 'bg-lime-100 text-lime-700 border-lime-200', dot: 'bg-lime-500' },
    { label: 'Security Strategy', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    { label: 'Competitive Analysis', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  ];

  const crowdstrikePages = [
    // ── Sep 2026 New Pages ───────────────────────────────────────────────────
    { title: 'Frontier AI Resilience', url: 'https://www.crowdstrike.com/cybersecurity-101/artificial-intelligence/frontier-ai-resilience', category: 'Artificial Intelligence' },
    { title: 'Frontier AI Resilience vs AIDR', url: 'https://www.crowdstrike.com/cybersecurity-101/artificial-intelligence/frontier-ai-resilience-vs-aidr', category: 'Artificial Intelligence' },
    { title: 'Cyber Physical Systems', url: 'https://www.crowdstrike.com/cybersecurity-101/endpoint-security/cyber-physical-systems', category: 'Endpoint Security' },
    { title: 'Internet of Medical Things (IoMT)', url: 'https://www.crowdstrike.com/cybersecurity-101/endpoint-security/internet-of-medical-things-iomt', category: 'Endpoint Security' },
    { title: 'Modern Privileged Access', url: 'https://www.crowdstrike.com/cybersecurity-101/identity-security/modern-privileged-access', category: 'Identity Security' },
    { title: 'Active Directory Federation Service (ADFS)', url: 'https://www.crowdstrike.com/cybersecurity-101/identity-security/active-directory-federation-service-adfs', category: 'Identity Security' },
    { title: 'Active Directory Security', url: 'https://www.crowdstrike.com/cybersecurity-101/identity-security/active-directory-security', category: 'Identity Security' },
    { title: 'Access Control', url: 'https://www.crowdstrike.com/cybersecurity-101/identity-protection/access-control', category: 'Identity Protection' },
    { title: 'Active Directory (AD) Auditing', url: 'https://www.crowdstrike.com/cybersecurity-101/identity-protection/active-directory-ad-auditing', category: 'Identity Protection' },
    { title: 'Secure Remote Access', url: 'https://www.crowdstrike.com/cybersecurity-101/browser-security/secure-remote-access', category: 'Browser Security' },
    { title: 'Zero Standing Privileges', url: 'https://www.crowdstrike.com/cybersecurity-101/zero-trust-security/zero-standing-privileges', category: 'Zero Trust Security' },
    { title: 'Data Security', url: 'https://www.crowdstrike.com/cybersecurity-101/data-security', category: 'Data Security' },
    { title: 'Access Logs', url: 'https://www.crowdstrike.com/cybersecurity-101/observability/access-logs', category: 'Observability' },
  ];

  const crowdstrikeCategories = [
    { label: 'Artificial Intelligence', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    { label: 'Endpoint Security', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
    { label: 'Identity Security', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    { label: 'Identity Protection', color: 'bg-teal-100 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
    { label: 'Browser Security', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    { label: 'Zero Trust Security', color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
    { label: 'Data Security', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    { label: 'Observability', color: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  ];

  const sentinelOneData = [
    { category: 'cloud-security',       count: 277, color: 'bg-sky-100 text-sky-700 border-sky-200',       dot: 'bg-sky-500',    bar: 'bg-sky-400' },
    { category: 'cybersecurity',         count: 392, color: 'bg-blue-100 text-blue-700 border-blue-200',     dot: 'bg-blue-500',   bar: 'bg-blue-400' },
    { category: 'data-and-ai',           count: 95,  color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500', bar: 'bg-violet-400' },
    { category: 'endpoint-security',     count: 119, color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500', bar: 'bg-orange-400' },
    { category: 'identity-security',     count: 50,  color: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', bar: 'bg-indigo-400' },
    { category: 'services',              count: 35,  color: 'bg-teal-100 text-teal-700 border-teal-200',     dot: 'bg-teal-500',   bar: 'bg-teal-400' },
    { category: 'threat-intelligence',   count: 107, color: 'bg-red-100 text-red-700 border-red-200',       dot: 'bg-red-500',    bar: 'bg-red-400' },
    { category: 'XDR',                   count: 16,  color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500',  bar: 'bg-amber-400' },
  ];

  // data-and-ai pages from CSV (34 titled pages, parent hub excluded)
  const sentinelOneDataAndAiPages = [
    { title: 'AI Application Security',             url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-application-security/' },
    { title: 'AI Compliance',                       url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-compliance/' },
    { title: 'AI Cybersecurity Companies',          url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-cybersecurity-companies/' },
    { title: 'AI Cybersecurity Trends',             url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-cybersecurity-trends/' },
    { title: 'AI Data Security',                    url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-data-security/' },
    { title: 'AI in Cloud Security',                url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-in-cloud-security/' },
    { title: 'AI Machine Learning Security',        url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-machine-learning-security/' },
    { title: 'AI Model Security',                   url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-model-security/' },
    { title: 'AI Penetration Testing',              url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-penetration-testing/' },
    { title: 'AI Powered Cybersecurity vs. Traditional Security Tools', url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-powered-cybersecurity-vs-traditional-security-tools/' },
    { title: 'AI Red Teaming',                      url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-red-teaming/' },
    { title: 'AI Risk Assessment Framework',        url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-risk-assessment-framework/' },
    { title: 'AI Risk Mitigation',                  url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-risk-mitigation/' },
    { title: 'AI SecOps',                           url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-secops/' },
    { title: 'AI Security Assessment',              url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-security-assessment/' },
    { title: 'AI Security Awareness Training',      url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-security-awareness-training/' },
    { title: 'AI Security Best Practices',          url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-security-best-practices/' },
    { title: 'AI Security Concerns',                url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-security-concerns/' },
    { title: 'AI Security Risks',                   url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-security-risks/' },
    { title: 'AI Security Solutions',               url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-security-solutions/' },
    { title: 'AI Security Standards',               url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-security-standards/' },
    { title: 'AI Threat Detection',                 url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-threat-detection/' },
    { title: 'AI Use Cases in Cybersecurity',       url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-use-cases-in-cybersecurity/' },
    { title: 'Artificial Intelligence in Cybersecurity', url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/artificial-intelligence-in-cybersecurity/' },
    { title: 'Benefits of AI in Cybersecurity',     url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/benefits-of-ai-in-cybersecurity/' },
    { title: 'ChatGPT Security Risks',              url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/chatgpt-security-risks/' },
    { title: 'Generative AI Cybersecurity',         url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/generative-ai-cybersecurity/' },
    { title: 'Generative AI Security Policy',       url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/generative-ai-security-policy/' },
    { title: 'Generative AI Security Risks',        url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/generative-ai-security-risks/' },
    { title: 'Jailbreaking LLMs',                   url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/jailbreaking-llms/' },
    { title: 'Large Language Model (LLM) Cybersecurity', url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/large-language-model-llm-cybersecurity/' },
    { title: 'LLM Security',                        url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/llm-security/' },
    { title: 'LLM Security Risks',                  url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/llm-security-risks/' },
    { title: 'What Is AI Cybersecurity',            url: 'https://www.sentinelone.com/cybersecurity-101/data-and-ai/what-is-ai-cybersecurity/' },
  ];

  const sentinelOneTotal = sentinelOneData.reduce((s, d) => s + d.count, 0); // 1,091 (Hub Page excluded)
  const sentinelOneMax   = Math.max(...sentinelOneData.map(d => d.count));

  return (
    <SlideContainer slideNumber={21} onNavigateHome={onNavigateHome} source="">
      <SlideHeader 
        title="Content Gap" 
        subtitle="Key Insights & Strategic Actions"
      />

      {/* Tab Navigation */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('contentgap')}
          className={`px-6 py-3 rounded-lg font-bold text-[13px] transition-all ${
            activeTab === 'contentgap'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('paloalto')}
          className={`px-6 py-3 rounded-lg font-bold text-[13px] transition-all ${
            activeTab === 'paloalto'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Palo Alto
        </button>
        <button
          onClick={() => setActiveTab('crowdstrike')}
          className={`px-6 py-3 rounded-lg font-bold text-[13px] transition-all ${
            activeTab === 'crowdstrike'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          CrowdStrike
        </button>
        <button
          onClick={() => setActiveTab('sentinelone')}
          className={`px-6 py-3 rounded-lg font-bold text-[13px] transition-all ${
            activeTab === 'sentinelone'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          SentinelOne
        </button>
        <button
          onClick={() => setActiveTab('checkpoint')}
          className={`px-6 py-3 rounded-lg font-bold text-[13px] transition-all ${
            activeTab === 'checkpoint'
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Check Point
        </button>
      </div>

      {/* Palo Alto Content */}
      {activeTab === 'paloalto' && (
        <div className="flex-1 flex flex-col gap-5">
          {/* Header card */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-100">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-[18px] font-bold text-gray-900">
                    <span className="text-blue-600 underline decoration-2 decoration-blue-400">Palo Alto Networks</span> – Cyberpedia Pages
                  </h3>
                  <div className="flex-shrink-0 px-3 py-1 bg-blue-500 text-white text-[11px] font-bold rounded-full">
                    809 TOTAL PAGES
                  </div>
                </div>
                <ul className="space-y-2 mb-4 pl-1">
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-blue-500" />
                    <span>Comprehensive Cyberpedia resource hub with <strong className="text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">809 total pages</strong> covering AI security, threat intelligence, frameworks & more.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-blue-400" />
                    <span><strong>14 new pages added in Sep 2026</strong>, led by <strong>AI Observability</strong>, <strong>AI Gateway</strong>, <strong>Agent Registry &amp; Authorization</strong>, <strong>AI Agent Hijacking</strong>, and <strong>Telemetry Pipelines</strong> — Palo Alto is doubling down on agentic AI security and observability.</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowPagesDropdown(!showPagesDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[12px] font-bold">{showPagesDropdown ? 'Hide' : 'View'} 14 New Pages</span>
                </button>
              </div>
            </div>

            {/* New Pages Dropdown */}
            {showPagesDropdown && (
              <div className="mt-5 pt-5 border-t-2 border-blue-200">
                <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2">
                  {[
                    { label: 'AI Security', color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
                    { label: 'Technologies', color: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
                  ].map((cat) => {
                    const pages = newPages.filter(p => p.category === cat.label);
                    if (pages.length === 0) return null;
                    return (
                      <div key={cat.label}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.color}`}>
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-gray-400">{pages.length} page{pages.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="space-y-2 pl-1">
                          {pages.map((page, idx) => (
                            <a
                              key={idx}
                              href={page.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-start gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all"
                            >
                              <div className={`flex-shrink-0 mt-1.5 w-2 h-2 rounded-full ${cat.dot}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-gray-800 group-hover:text-blue-700 leading-snug">{page.title}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{page.url.replace('https://', '')}</p>
                              </div>
                              <ExternalLink className="flex-shrink-0 w-3 h-3 text-gray-300 group-hover:text-blue-500 mt-1" />
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* CrowdStrike Content */}
      {activeTab === 'crowdstrike' && (
        <div className="flex-1 space-y-6">
          {/* Cybersecurity 101 Pages */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-[18px] font-bold text-gray-900">
                    <span className="text-red-600 underline decoration-2 decoration-red-400">CrowdStrike</span> – Cybersecurity 101 Pages
                  </h3>
                  <div className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-[11px] font-bold rounded-full">
                    597 TOTAL PAGES
                  </div>
                </div>
                <ul className="space-y-2 mb-4 pl-1">
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-red-500" />
                    <span>Comprehensive Cybersecurity 101 resource hub with <strong className="text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">597 total pages</strong> covering threat intel, cloud security, AI & automation.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-red-400" />
                    <span><strong>13 new pages added in Sep 2026</strong> (584 → 597); the 13 new URLs span <strong>Frontier AI Resilience</strong>, <strong>Endpoint Security</strong> (Cyber Physical Systems, IoMT), <strong>Identity Security &amp; Protection</strong> (AD Security, ADFS, Access Control), <strong>Zero Trust</strong>, <strong>Data Security</strong>, and <strong>Observability</strong>.</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowCrowdstrikeDropdown(!showCrowdstrikeDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[12px] font-bold">{showCrowdstrikeDropdown ? 'Hide' : 'View'} 13 New Pages</span>
                </button>
              </div>
            </div>

            {/* Pages Dropdown */}
            {showCrowdstrikeDropdown && (
              <div className="mt-5 pt-5 border-t-2 border-red-200">
                <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
                  {crowdstrikeCategories.map((cat) => {
                    const pages = crowdstrikePages.filter(p => p.category === cat.label);
                    if (pages.length === 0) return null;
                    return (
                      <div key={cat.label}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.color}`}>
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-gray-400">{pages.length} page{pages.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="space-y-2 pl-1">
                          {pages.map((page, idx) => (
                            <a
                              key={idx}
                              href={page.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-start gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:border-red-300 hover:bg-red-50 transition-all"
                            >
                              <div className={`flex-shrink-0 mt-1.5 w-2 h-2 rounded-full ${cat.dot}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-gray-800 group-hover:text-red-700 leading-snug">
                                  {page.title}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{page.url.replace('https://', '')}</p>
                              </div>
                              <ExternalLink className="flex-shrink-0 w-3 h-3 text-gray-300 group-hover:text-red-500 mt-1" />
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SentinelOne Content */}
      {activeTab === 'sentinelone' && (
        <div className="flex-1 space-y-6">
          {/* Intro Card */}
          <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Brain className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-[18px] font-bold text-gray-900">
                    <span className="text-purple-700 underline decoration-2 decoration-purple-400">SentinelOne</span> – Cybersecurity 101 Pages
                  </h3>
                  <div className="flex-shrink-0 px-3 py-1 bg-purple-600 text-white text-[11px] font-bold rounded-full">
                    {sentinelOneTotal} TOTAL PAGES
                  </div>
                </div>
                <ul className="space-y-2 pl-1">
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-purple-500" />
                    <span>Maintains a comprehensive resource hub with <strong className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200">{sentinelOneTotal} pages</strong> across <strong>8 specialized categories</strong> — rivalling the breadth of Palo Alto's Cyberpedia.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-purple-400" />
                    <span>Top three categories — <strong>Cybersecurity (392)</strong>, <strong>Cloud Security (277)</strong>, and <strong>Endpoint Security (119)</strong> — account for <strong>72%</strong> of all resource content, signalling heavy investment in core security topics.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-purple-300" />
                    <span>The <strong>data-and-ai category (95 pages)</strong> covers AI security topics from model security and LLM risks to generative AI — targeting the same high-intent AI queries Fortinet currently lacks dedicated glossary content for.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-purple-200" />
                    <span><strong>154 new pages added in Sep 2026</strong> (937 → 1,091), driven by <strong>Cybersecurity (+110)</strong>, <strong>Cloud Security (+23)</strong>, <strong>Services (+11)</strong>, and <strong>XDR (+5)</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Category Breakdown Card */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-xl p-6">

            {/* Category breakdown table */}
            <div className="bg-white rounded-xl border border-purple-100 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_180px] gap-3 px-4 py-2.5 bg-purple-600 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider">Category</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-right">Pages</span>
                <span className="text-[11px] font-bold uppercase tracking-wider pl-2">Distribution</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-purple-50">
                {sentinelOneData.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_auto_180px] gap-3 items-center px-4 py-3 hover:bg-purple-50 transition-colors">
                    {/* Category label */}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${row.dot}`} />
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${row.color}`}>
                        {row.category}
                      </span>
                      {row.category === 'data-and-ai' && (
                        <button
                          onClick={() => setShowSentinelOneDropdown(!showSentinelOneDropdown)}
                          className={`ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                            showSentinelOneDropdown
                              ? 'bg-violet-600 text-white border-violet-600'
                              : 'bg-violet-50 text-violet-600 border-violet-300 hover:bg-violet-100'
                          }`}
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          {showSentinelOneDropdown ? 'Hide' : 'View 34 Links'}
                        </button>
                      )}
                    </div>
                    {/* Count */}
                    <span className="text-[14px] font-bold text-gray-900 text-right tabular-nums">{row.count}</span>
                    {/* Bar */}
                    <div className="flex items-center gap-2 pl-2">
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.bar} transition-all duration-500`}
                          style={{ width: `${(row.count / sentinelOneMax) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 w-8 text-right tabular-nums">
                        {((row.count / sentinelOneTotal) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grand Total row */}
              <div className="grid grid-cols-[1fr_auto_180px] gap-3 items-center px-4 py-3 bg-purple-600">
                <span className="text-[13px] font-extrabold text-white">Grand Total</span>
                <span className="text-[15px] font-extrabold text-white text-right tabular-nums">{sentinelOneTotal}</span>
                <div className="pl-2">
                  <div className="h-3 bg-purple-400 rounded-full w-full" />
                </div>
              </div>
            </div>

            {/* data-and-ai Pages Dropdown */}
            {showSentinelOneDropdown && (
              <div className="mt-5 pt-5 border-t-2 border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-violet-100 text-violet-700 border-violet-200">
                    data-and-ai
                  </span>
                  <span className="text-[11px] text-gray-400">34 pages with links</span>
                  <a
                    href="https://www.sentinelone.com/cybersecurity-101/data-and-ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-800 font-semibold transition-colors"
                  >
                    View Category Hub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {sentinelOneDataAndAiPages.map((page, idx) => (
                    <a
                      key={idx}
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 p-2.5 rounded-lg border border-violet-100 hover:border-violet-400 hover:bg-violet-50 transition-all"
                    >
                      <div className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-violet-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-800 group-hover:text-violet-700 leading-snug">
                          {page.title}
                        </p>
                      </div>
                      <ExternalLink className="flex-shrink-0 w-2.5 h-2.5 text-gray-300 group-hover:text-violet-500 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Gap Tab */}
      {activeTab === 'contentgap' && (
        <div className="flex-1 space-y-6">
          {/* Cyber Glossary Page Summary Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-gray-900 mb-3">
                  Cyber Glossary Page Summary
                </h3>
              </div>
            </div>
          </div>

          {/* Content Gap Table */}
          <div className="bg-white border-2 border-emerald-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900">
                Monthly Page Count & Sep 2026 Growth
              </h3>
            </div>

            <div className="bg-white rounded-xl border-2 border-emerald-100 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[140px_repeat(10,1fr)_100px_120px] gap-2 px-4 py-3 bg-emerald-600 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider">Vendor</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Dec 2025</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Jan 2026</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Feb 2026</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Mar 2026</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Apr 2026</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">May 2026</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Jun 2026</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Jul 2026</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Aug 2026</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Sep 2026</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Sep Growth</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-center">Trendline</span>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-emerald-50">
                {/* Fortinet */}
                <div className="grid grid-cols-[140px_repeat(10,1fr)_100px_120px] gap-2 items-center px-4 py-3 hover:bg-emerald-50 transition-colors">
                  <span className="text-[13px] font-bold text-red-600">Fortinet</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">593</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">593</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">611</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">612</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">615</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">616</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">616</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">618</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">622</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">624</span>
                  <span className="text-[13px] font-bold text-emerald-700 text-center">+2</span>
                  <div className="flex justify-center">
                    <svg width="80" height="24" className="overflow-visible">
                      <polyline points="0,22 9,22 18,9 27,9 36,6 44,6 53,6 62,4 71,1 80,0" fill="none" stroke="#EF4444" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* PAN */}
                <div className="grid grid-cols-[140px_repeat(10,1fr)_100px_120px] gap-2 items-center px-4 py-3 hover:bg-emerald-50 transition-colors">
                  <span className="text-[13px] font-bold text-blue-600">PAN</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">667</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">672</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">697</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">728</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">764</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">779</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">787</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">790</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">795</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">809</span>
                  <span className="text-[13px] font-bold text-emerald-700 text-center">+14</span>
                  <div className="flex justify-center">
                    <svg width="80" height="24" className="overflow-visible">
                      <polyline points="0,22 9,21 18,17 27,13 36,7 44,5 53,3 62,3 71,2 80,0" fill="none" stroke="#3B82F6" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Checkpoint */}
                <div className="grid grid-cols-[140px_repeat(10,1fr)_100px_120px] gap-2 items-center px-4 py-3 hover:bg-emerald-50 transition-colors">
                  <span className="text-[13px] font-bold text-orange-600">Checkpoint</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">1020</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">1021</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">1033</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">1112</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">1124</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">1142</span>
                  <span className="text-[13px] font-bold text-emerald-700 text-center">+18</span>
                  <div className="flex justify-center">
                    <svg width="80" height="24" className="overflow-visible">
                      <polyline points="36,22 44,22 53,20 62,5 71,3 80,0" fill="none" stroke="#F97316" strokeWidth="2" />
                      <circle cx="36" cy="22" r="2" fill="#F97316" />
                    </svg>
                  </div>
                </div>

                {/* Crowdstrike */}
                <div className="grid grid-cols-[140px_repeat(10,1fr)_100px_120px] gap-2 items-center px-4 py-3 hover:bg-emerald-50 transition-colors">
                  <span className="text-[13px] font-bold text-red-700">Crowdstrike</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">535</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">538</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">539</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">551</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">561</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">563</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">576</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">584</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">597</span>
                  <span className="text-[13px] font-bold text-emerald-700 text-center">+13</span>
                  <div className="flex justify-center">
                    <svg width="80" height="24" className="overflow-visible">
                      <polyline points="9,22 18,21 27,21 36,16 44,13 53,12 62,7 71,5 80,0" fill="none" stroke="#B91C1C" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Cisco */}
                <div className="grid grid-cols-[140px_repeat(10,1fr)_100px_120px] gap-2 items-center px-4 py-3 hover:bg-emerald-50 transition-colors">
                  <span className="text-[13px] font-bold text-sky-600">Cisco</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">272</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">267</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">286</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">289</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">300</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">300</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">309</span>
                  <span className="text-[13px] font-bold text-emerald-700 text-center">+9</span>
                  <div className="flex justify-center">
                    <svg width="80" height="24" className="overflow-visible">
                      <polyline points="27,19 36,22 44,12 53,10 62,5 71,5 80,0" fill="none" stroke="#0EA5E9" strokeWidth="2" />
                      <circle cx="27" cy="19" r="2" fill="#0EA5E9" />
                    </svg>
                  </div>
                </div>

                {/* SentinelOne */}
                <div className="grid grid-cols-[140px_repeat(10,1fr)_100px_120px] gap-2 items-center px-4 py-3 hover:bg-emerald-50 transition-colors">
                  <span className="text-[13px] font-bold text-purple-600">SentinelOne</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-500 text-center italic">—</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">884</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">909</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">923</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">927</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">934</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">937</span>
                  <span className="text-[13px] text-gray-700 text-center tabular-nums">1091</span>
                  <span className="text-[13px] font-bold text-emerald-700 text-center">+154</span>
                  <div className="flex justify-center">
                    <svg width="80" height="24" className="overflow-visible">
                      <polyline points="27,22 36,19 44,18 53,17 62,17 71,16 80,0" fill="none" stroke="#9333EA" strokeWidth="2" />
                      <circle cx="27" cy="22" r="2" fill="#9333EA" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-900 uppercase">Top Growth</span>
                </div>
                <p className="text-[13px] text-gray-700">
                  <strong className="text-emerald-700">SentinelOne leads</strong> with <strong>+154 pages</strong> added in Sep 2026 (937 → 1,091)
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="text-[11px] font-bold text-purple-900 uppercase">Largest Base</span>
                </div>
                <p className="text-[13px] text-gray-700">
                  <strong className="text-purple-700">Checkpoint</strong> maintains <strong>1,142 total pages</strong>, with SentinelOne close behind at <strong>1,091</strong>
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span className="text-[11px] font-bold text-red-900 uppercase">Fortinet Gap</span>
                </div>
                <p className="text-[13px] text-gray-700">
                  <strong className="text-red-700">Fortinet added only +2</strong> vs SentinelOne's <strong>+154</strong> and Checkpoint's <strong>+18</strong> in Sep 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Check Point Content */}
      {activeTab === 'checkpoint' && (
        <div className="flex-1 flex flex-col gap-5 overflow-y-auto">
          {/* Header card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-100">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-[18px] font-bold text-gray-900">
                    <span className="text-orange-600 underline decoration-2 decoration-orange-400">Check Point</span> – Cyber Hub Pages
                  </h3>
                  <div className="flex-shrink-0 px-3 py-1 bg-orange-500 text-white text-[11px] font-bold rounded-full">
                    1,142 TOTAL PAGES
                  </div>
                </div>
                <ul className="space-y-2 mb-4 pl-1">
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-orange-500" />
                    <span>Check Point's Cyber Hub holds <strong className="text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200">1,142 total pages</strong> — the largest indexed page count of any competitor in Sep 2026.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-orange-400" />
                    <span><strong>18 new pages added in Sep 2026</strong>, spread across AI Security (7), Cloud Security (4), Tools &amp; Vendors (4), and Email / Network Security (3).</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-orange-300" />
                    <span>New pages cover <strong>AI security for finance &amp; healthcare</strong>, <strong>agentic AI security solutions</strong>, <strong>AI data leakage prevention</strong>, <strong>multi-cloud security</strong>, and <strong>vendor comparison content</strong> (CTEM, ICS, multi-cloud) — high-intent topics Fortinet should counter with equivalent depth.</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowCheckPointDropdown(!showCheckPointDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[12px] font-bold">{showCheckPointDropdown ? 'Hide' : 'View'} 18 New Pages</span>
                </button>
              </div>
            </div>

            {/* New Pages Dropdown */}
            {showCheckPointDropdown && (
              <div className="mt-5 pt-5 border-t-2 border-orange-200">
                <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2">
                  {[
                    { label: 'Cloud Security', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500', pages: [
                      { title: 'What is Multi-Cloud Security Architecture', url: 'https://www.checkpoint.com/cyber-hub/cloud-security/what-is-cloud-security/what-is-multi-cloud-security-architecture/' },
                      { title: 'Top Cloud Security Challenges in 2026', url: 'https://www.checkpoint.com/cyber-hub/cloud-security/what-is-cloud-security/top-cloud-security-challenges-in-2026/' },
                      { title: 'Different Types of Cloud Security Tools', url: 'https://www.checkpoint.com/cyber-hub/cloud-security/what-is-cloud-security/different-types-of-cloud-security-tools/' },
                      { title: 'Cloud Security for Financial Service Organizations', url: 'https://www.checkpoint.com/cyber-hub/cloud-security/what-is-cloud-security/understanding-cloud-security-for-financial-service-organizations/' },
                    ]},
                    { label: 'Network & Email Security', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', pages: [
                      { title: 'FWaaS Best Practices', url: 'https://www.checkpoint.com/cyber-hub/network-security/firewall-as-a-service-fwaas/fwaas-best-practices/' },
                      { title: 'Best Email Security Platforms for Healthcare Organizations', url: 'https://www.checkpoint.com/cyber-hub/threat-prevention/what-is-email-security/best-email-security-platforms-for-healthcare-organizations/' },
                      { title: 'Best Email Security Platforms for Financial Services', url: 'https://www.checkpoint.com/cyber-hub/threat-prevention/what-is-email-security/best-email-security-platforms-for-financial-services/' },
                    ]},
                    { label: 'AI Security', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500', pages: [
                      { title: 'AI BOM', url: 'https://www.checkpoint.com/cyber-hub/cyber-security/what-is-ai-security/ai-bom/' },
                      { title: 'Prompt Engineering', url: 'https://www.checkpoint.com/cyber-hub/cyber-security/what-is-ai-security/prompt-engineering/' },
                      { title: 'AI Model Security', url: 'https://www.checkpoint.com/cyber-hub/cyber-security/what-is-ai-security/ai-model-security/' },
                      { title: 'AI Security for Finance', url: 'https://www.checkpoint.com/cyber-hub/cyber-security/what-is-ai-security/ai-security-for-finance/' },
                      { title: 'AI Security for Healthcare: Vulnerabilities &amp; How to Mitigate', url: 'https://www.checkpoint.com/cyber-hub/cyber-security/what-is-ai-security/ai-security-for-healthcare-vulnerabilities-how-to-mitigate/' },
                      { title: 'Top Agentic AI Security Solutions in 2026', url: 'https://www.checkpoint.com/cyber-hub/cyber-security/what-is-ai-security/what-is-agentic-ai-security/top-agentic-ai-security-solutions-in-2026/' },
                      { title: 'AI Data Leakage Prevention Techniques', url: 'https://www.checkpoint.com/cyber-hub/cyber-security/what-is-ai-security/what-is-ai-data-security/ai-data-leakage/ai-data-leakage-prevention-techniques/' },
                    ]},
                    { label: 'Tools & Vendors', color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500', pages: [
                      { title: 'Best CTEM &amp; Exposure Management Platforms 2026: 8 Vendors Compared', url: 'https://www.checkpoint.com/cyber-hub/tools-vendors/best-ctem-exposure-management-platforms-2026-8-vendors-compared/' },
                      { title: 'Top Cloud Network Security Vendors for Multi-Cloud Environments', url: 'https://www.checkpoint.com/cyber-hub/tools-vendors/top-cloud-network-security-vendors-for-multi-cloud-environments/' },
                      { title: 'Top Industrial Control Systems (ICS) Security Companies', url: 'https://www.checkpoint.com/cyber-hub/tools-vendors/the-top-industrial-control-systems-ics-security-companies/' },
                      { title: '7 Essential Hybrid Cloud Security Tools', url: 'https://www.checkpoint.com/cyber-hub/tools-vendors/7-essential-hybrid-cloud-security-tools/' },
                    ]},
                  ].map((cat) => (
                    <div key={cat.label}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.color}`}>
                          {cat.label}
                        </span>
                        <span className="text-[11px] text-gray-400">{cat.pages.length} page{cat.pages.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="space-y-1.5 pl-1">
                        {cat.pages.map((page, idx) => (
                          <a
                            key={idx}
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 p-2 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
                          >
                            <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                            <span className="text-[11px] text-gray-600 truncate flex-1">{page.title}</span>
                            <ExternalLink className="flex-shrink-0 w-3 h-3 text-gray-300 hover:text-orange-500" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}