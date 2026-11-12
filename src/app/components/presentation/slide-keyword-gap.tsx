import { Search, AlertTriangle, Target, Users } from 'lucide-react';
import { useState } from 'react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
} from './design-system';

// Missing Keywords Data (Oct 2026) — Source: SEMrush Keyword Gap Tool
const missingKeywordsData = [
  { keyword: 'application security posture management', intent: 'Informational', volume: 1600, kd: 34, ft: 0, pa: 3, cp: 71, cisco: 40, cs: 10 },
  { keyword: 'prompt injection attack', intent: 'Informational', volume: 1300, kd: 63, ft: 0, pa: 2, cp: 34, cisco: 27, cs: 5 },
  { keyword: 'cloud security monitoring', intent: 'Informational', volume: 1000, kd: 19, ft: 0, pa: 21, cp: 77, cisco: 43, cs: 31 },
  { keyword: 'cloud waf', intent: 'Commercial, Informational', volume: 1000, kd: 57, ft: 0, pa: 15, cp: 23, cisco: 9, cs: 34 },
  { keyword: 'managed detection and response services', intent: 'Commercial, Informational', volume: 1000, kd: 56, ft: 0, pa: 1, cp: 13, cisco: 7, cs: 28 },
  { keyword: 'cloud iam', intent: 'Informational', volume: 880, kd: 55, ft: 0, pa: 51, cp: 78, cisco: 59, cs: 58 },
  { keyword: 'generative ai cybersecurity', intent: '', volume: 720, kd: 45, ft: 0, pa: 1, cp: 13, cisco: 17, cs: 11 },
  { keyword: 'machine learning in cybersecurity', intent: 'Informational', volume: 720, kd: 55, ft: 0, pa: 10, cp: 25, cisco: 2, cs: 1 },
  { keyword: 'siem monitoring', intent: 'Informational', volume: 590, kd: 53, ft: 0, pa: 14, cp: 77, cisco: 8, cs: 5 },
  { keyword: 'cloud web application firewall', intent: 'Commercial, Informational', volume: 480, kd: 65, ft: 0, pa: 11, cp: 68, cisco: 2, cs: 14 },
  { keyword: 'cloud threat detection', intent: 'Informational', volume: 390, kd: 27, ft: 0, pa: 3, cp: 46, cisco: 5, cs: 7 },
  { keyword: 'network segmentation solutions', intent: 'Informational', volume: 260, kd: 45, ft: 0, pa: 6, cp: 55, cisco: 3, cs: 17 },
  { keyword: 'cloud based endpoint protection', intent: 'Informational', volume: 210, kd: 30, ft: 0, pa: 12, cp: 27, cisco: 3, cs: 1 },
  { keyword: 'agentic systems security frameworks', intent: 'Informational', volume: 140, kd: 21, ft: 0, pa: 7, cp: 24, cisco: 44, cs: 52 },
  { keyword: 'what is healthcare cybersecurity', intent: 'Informational', volume: 140, kd: 38, ft: 0, pa: 15, cp: 17, cisco: 53, cs: 7 },
];

// Untapped Keywords Data (Oct 2026) — Source: SEMrush Keyword Gap Tool
const untappedKeywordsData = [
  { keyword: 'security operations center', intent: 'Informational', volume: 3600, kd: 63, ft: 0, pa: 5, cp: 9, cisco: 0, cs: 22 },
  { keyword: 'network security assessment', intent: 'Informational', volume: 1900, kd: 17, ft: 0, pa: 0, cp: 81, cisco: 0, cs: 64 },
  { keyword: 'data security compliance', intent: 'Informational', volume: 1600, kd: 41, ft: 0, pa: 7, cp: 0, cisco: 0, cs: 35 },
  { keyword: 'data security platform', intent: 'Informational', volume: 1600, kd: 42, ft: 0, pa: 2, cp: 0, cisco: 0, cs: 0 },
  { keyword: 'cloud security monitoring', intent: 'Informational', volume: 1000, kd: 19, ft: 0, pa: 21, cp: 77, cisco: 43, cs: 31 },
  { keyword: 'network security company', intent: 'Commercial', volume: 1000, kd: 34, ft: 0, pa: 0, cp: 2, cisco: 4, cs: 0 },
  { keyword: 'managed cloud security', intent: 'Informational', volume: 880, kd: 10, ft: 0, pa: 0, cp: 0, cisco: 0, cs: 2 },
  { keyword: 'managed sd wan', intent: 'Informational', volume: 880, kd: 13, ft: 0, pa: 8, cp: 0, cisco: 14, cs: 0 },
  { keyword: 'network security best practices', intent: 'Commercial', volume: 880, kd: 22, ft: 0, pa: 0, cp: 0, cisco: 7, cs: 0 },
  { keyword: 'cloud security products', intent: 'Commercial, Informational', volume: 720, kd: 18, ft: 0, pa: 2, cp: 39, cisco: 7, cs: 0 },
  { keyword: 'data security software', intent: 'Commercial, Informational', volume: 720, kd: 44, ft: 0, pa: 7, cp: 0, cisco: 0, cs: 0 },
];

// Weak Keywords Data (Oct 2026) — Source: SEMrush Keyword Gap Tool
const multiCompetitorData = [
  { keyword: 'ransomware', intent: 'Informational', volume: 18100, kd: 91, ft: 81, pa: 36, cp: 13, cisco: 8, cs: 17 },
  { keyword: 'cnapp', intent: 'Informational', volume: 5400, kd: 49, ft: 50, pa: 22, cp: 7, cisco: 15, cs: 29 },
  { keyword: 'cloud network security', intent: 'Informational', volume: 2400, kd: 32, ft: 67, pa: 56, cp: 5, cisco: 41, cs: 33 },
  { keyword: 'network segregation', intent: 'Informational', volume: 1300, kd: 22, ft: 40, pa: 18, cp: 13, cisco: 4, cs: 31 },
  { keyword: 'xdr software', intent: 'Informational', volume: 480, kd: 33, ft: 16, pa: 4, cp: 15, cisco: 12, cs: 6 },
  { keyword: 'cybersecurity for hospitals', intent: 'Informational', volume: 170, kd: 46, ft: 67, pa: 6, cp: 11, cisco: 27, cs: 57 },
];

export function SlideKeywordGap({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<'missing' | 'untapped' | 'multiCompetitor'>('missing');

  const getCurrentData = () => {
    switch (activeTab) {
      case 'missing': return missingKeywordsData;
      case 'untapped': return untappedKeywordsData;
      case 'multiCompetitor': return multiCompetitorData;
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'missing': return AlertTriangle;
      case 'untapped': return Target;
      case 'multiCompetitor': return Users;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'missing': return 'Missing Keywords';
      case 'untapped': return 'Untapped Keywords';
      case 'multiCompetitor': return 'Weak Keywords';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'missing': return 'Critical gaps in Fortinet\'s content strategy';
      case 'untapped': return 'High-potential keywords with minimal competition';
      case 'multiCompetitor': return 'Competitive keyword comparison with ranking positions';
    }
  };

  const IconComponent = getTabIcon();

  return (
    <SlideContainer slideNumber={45} onNavigateHome={onNavigateHome}>
      <SlideHeader 
        title="Keyword Gap" 
      />
      
      <div className="flex-1 flex flex-col gap-4 pb-4">
        {/* Main Tab Navigation - Curved Folder Style */}
        <div className="flex items-start gap-1">
          <button
            onClick={() => setActiveTab('missing')}
            className={`px-8 py-3 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'missing'
                ? 'bg-white text-red-600 z-10'
                : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
            }`}
            style={{
              borderRadius: '12px 12px 0 0',
              marginBottom: '-2px',
              boxShadow: activeTab === 'missing'
                ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Missing Keywords
          </button>
          <button
            onClick={() => setActiveTab('untapped')}
            className={`px-8 py-3 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'untapped'
                ? 'bg-white text-red-600 z-10'
                : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
            }`}
            style={{
              borderRadius: '12px 12px 0 0',
              marginBottom: '-2px',
              boxShadow: activeTab === 'untapped'
                ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Untapped Keywords
          </button>
          <button
            onClick={() => setActiveTab('multiCompetitor')}
            className={`px-8 py-3 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'multiCompetitor'
                ? 'bg-white text-red-600 z-10'
                : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
            }`}
            style={{
              borderRadius: '12px 12px 0 0',
              marginBottom: '-2px',
              boxShadow: activeTab === 'multiCompetitor'
                ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Weak Keywords
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                activeTab === 'untapped' ? 'bg-blue-50' : 'bg-red-50'
              }`}>
                <IconComponent className={`w-6 h-6 ${
                  activeTab === 'untapped' ? 'text-blue-500' : 'text-red-500'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{getTabTitle()}</h3>
                <p className="text-sm text-gray-600">{getTabDescription()}</p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-gray-50 rounded-lg overflow-hidden flex-1">
              <div className="overflow-x-auto h-full max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200 sticky top-0 z-20">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Keyword</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        {activeTab === 'multiCompetitor' ? 'Intent' : 'Intents'}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">
                        {activeTab === 'multiCompetitor' ? 'Volume' : 'Volume'}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">KD</th>
                      {activeTab === 'missing' && (
                        <>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-red-50">FT</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-orange-50">PA</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-purple-50">CP</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-blue-50">CISCO</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-gray-100">CS</th>
                        </>
                      )}
                      {activeTab === 'untapped' && (
                        <>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-red-50">FT</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-orange-50">PA</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-purple-50">CP</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-blue-50">CISCO</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-gray-100">CS</th>
                        </>
                      )}
                      {activeTab === 'multiCompetitor' && (
                        <>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-red-50">FT</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-orange-50">PA</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-purple-50">CP</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-blue-50">CISCO</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-gray-100">CS</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {getCurrentData().map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{row.keyword}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{row.intent}</td>
                        <td className="px-4 py-3 text-center text-gray-900 font-medium">{row.volume.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{row.kd}</td>
                        {activeTab === 'missing' && 'ft' in row && (
                          <>
                            <td className="px-3 py-3 text-center font-semibold bg-red-50 text-red-700">{row.ft}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-orange-50 text-orange-700">{(row as any).pa}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-purple-50 text-purple-700">{(row as any).cp}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-blue-50 text-blue-700">{(row as any).cisco}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-gray-50 text-gray-700">{(row as any).cs}</td>
                          </>
                        )}
                        {activeTab === 'untapped' && 'ft' in row && (
                          <>
                            <td className="px-3 py-3 text-center font-semibold bg-red-50 text-red-700">{row.ft}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-orange-50 text-orange-700">{(row as any).pa}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-purple-50 text-purple-700">{(row as any).cp}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-blue-50 text-blue-700">{(row as any).cisco}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-gray-50 text-gray-700">{(row as any).cs}</td>
                          </>
                        )}
                        {activeTab === 'multiCompetitor' && 'ft' in row && (
                          <>
                            <td className="px-3 py-3 text-center font-semibold bg-red-50 text-red-700">{row.ft}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-orange-50 text-orange-700">{(row as any).pa}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-purple-50 text-purple-700">{(row as any).cp}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-blue-50 text-blue-700">{(row as any).cisco}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-gray-50 text-gray-700">{(row as any).cs}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlideFooter source="Source: SEMrush Keyword Gap Tool · Oct 2026" />
    </SlideContainer>
  );
}
