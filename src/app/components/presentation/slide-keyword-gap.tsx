import { Search, AlertTriangle, Target, Users } from 'lucide-react';
import { useState } from 'react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
} from './design-system';

// Missing Keywords Data (Sep 2026) — Source: SEMrush Keyword Gap Tool
const missingKeywordsData = [
  { keyword: 'data loss protection', intent: 'Informational', volume: 2900, kd: 47, ft: 0, pa: 29, cp: 17, cisco: 27, cs: 3 },
  { keyword: 'cloud native security', intent: 'Informational', volume: 2400, kd: 42, ft: 0, pa: 1, cp: 77, cisco: 65, cs: 24 },
  { keyword: 'cspm tools', intent: 'Commercial', volume: 1300, kd: 41, ft: 0, pa: 5, cp: 17, cisco: 46, cs: 28 },
  { keyword: 'cloud security monitoring', intent: 'Informational', volume: 1000, kd: 19, ft: 0, pa: 21, cp: 77, cisco: 43, cs: 31 },
  { keyword: 'generative ai security', intent: 'Informational', volume: 1000, kd: 32, ft: 0, pa: 3, cp: 8, cisco: 51, cs: 19 },
  { keyword: 'cloud web security', intent: 'Informational', volume: 720, kd: 55, ft: 0, pa: 7, cp: 29, cisco: 45, cs: 28 },
  { keyword: 'prompt injections', intent: 'Informational', volume: 720, kd: 74, ft: 0, pa: 6, cp: 20, cisco: 21, cs: 8 },
  { keyword: 'waf rules', intent: 'Informational', volume: 590, kd: 38, ft: 0, pa: 16, cp: 10, cisco: 42, cs: 13 },
  { keyword: 'web application firewall software', intent: 'Informational', volume: 590, kd: 75, ft: 0, pa: 5, cp: 30, cisco: 1, cs: 17 },
  { keyword: 'cloud web application firewall', intent: 'Commercial, Informational', volume: 480, kd: 61, ft: 0, pa: 80, cp: 33, cisco: 4, cs: 19 },
  { keyword: 'cybersecurity assessments', intent: 'Informational', volume: 480, kd: 40, ft: 0, pa: 7, cp: 55, cisco: 70, cs: 35 },
  { keyword: 'cloud based endpoint security', intent: 'Informational', volume: 390, kd: 33, ft: 0, pa: 3, cp: 23, cisco: 8, cs: 64 },
];

// Untapped Keywords Data (Sep 2026) — Source: SEMrush Keyword Gap Tool
const untappedKeywordsData = [
  { keyword: 'cybersecurity tips', intent: 'Informational', volume: 450000, kd: 48, ft: 0, pa: 0, cp: 12, cisco: 0, cs: 0 },
  { keyword: 'cloud migration', intent: 'Informational', volume: 5400, kd: 43, ft: 0, pa: 43, cp: 0, cisco: 30, cs: 0 },
  { keyword: 'ai risk management', intent: 'Informational', volume: 3600, kd: 73, ft: 0, pa: 5, cp: 0, cisco: 0, cs: 0 },
  { keyword: 'security operations center', intent: 'Informational', volume: 3600, kd: 50, ft: 0, pa: 5, cp: 0, cisco: 0, cs: 0 },
  { keyword: 'behavioral segmentation', intent: 'Informational', volume: 2900, kd: 40, ft: 0, pa: 0, cp: 0, cisco: 13, cs: 0 },
  { keyword: 'ai observability', intent: 'Informational', volume: 2400, kd: 51, ft: 0, pa: 31, cp: 0, cisco: 0, cs: 0 },
  { keyword: 'ai monitoring', intent: 'Informational', volume: 1300, kd: 52, ft: 0, pa: 0, cp: 0, cisco: 0, cs: 6 },
  { keyword: 'cloud security monitoring', intent: 'Informational', volume: 1000, kd: 19, ft: 0, pa: 21, cp: 77, cisco: 43, cs: 31 },
  { keyword: 'cloud security threats', intent: 'Informational', volume: 880, kd: 35, ft: 0, pa: 19, cp: 0, cisco: 0, cs: 14 },
  { keyword: 'cloud security managed services', intent: 'Informational', volume: 720, kd: 19, ft: 0, pa: 0, cp: 35, cisco: 53, cs: 13 },
  { keyword: 'security operations services', intent: 'Navigational', volume: 590, kd: 50, ft: 0, pa: 6, cp: 0, cisco: 0, cs: 0 },
];

// Weak Keywords Data (Sep 2026) — Source: SEMrush Keyword Gap Tool
const multiCompetitorData = [
  { keyword: 'vulnerability management', intent: 'Informational', volume: 6600, kd: 26, ft: 56, pa: 30, cp: 50, cisco: 34, cs: 10 },
  { keyword: 'cyber threat intelligence', intent: 'Informational', volume: 5400, kd: 51, ft: 25, pa: 1, cp: 4, cisco: 3, cs: 5 },
  { keyword: 'prompt injection', intent: 'Informational', volume: 5400, kd: 72, ft: 45, pa: 5, cp: 33, cisco: 25, cs: 8 },
  { keyword: 'data security in cloud', intent: 'Informational', volume: 390, kd: 43, ft: 58, pa: 18, cp: 44, cisco: 23, cs: 4 },
  { keyword: 'cloud native application security', intent: 'Informational', volume: 320, kd: 36, ft: 51, pa: 1, cp: 14, cisco: 23, cs: 9 },
  { keyword: 'network security products', intent: 'Informational', volume: 260, kd: 40, ft: 31, pa: 2, cp: 3, cisco: 4, cs: 9 },
  { keyword: 'secure cloud infrastructure', intent: 'Informational', volume: 210, kd: 15, ft: 24, pa: 12, cp: 9, cisco: 5, cs: 22 },
  { keyword: 'edr security solutions', intent: 'Informational', volume: 170, kd: 54, ft: 15, pa: 8, cp: 9, cisco: 6, cs: 3 },
  { keyword: 'types of cloud security', intent: 'Commercial, Informational', volume: 170, kd: 35, ft: 16, pa: 2, cp: 3, cisco: 9, cs: 12 },
  { keyword: 'what is cloud data security', intent: 'Informational', volume: 170, kd: 41, ft: 64, pa: 4, cp: 24, cisco: 35, cs: 3 },
  { keyword: 'cloud incident response framework', intent: 'Informational', volume: 50, kd: 23, ft: 54, pa: 3, cp: 36, cisco: 52, cs: 14 },
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
    <SlideContainer slideNumber={22} onNavigateHome={onNavigateHome}>
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

      <SlideFooter source="Source: SEMrush Keyword Gap Tool · Sep 2026" />
    </SlideContainer>
  );
}