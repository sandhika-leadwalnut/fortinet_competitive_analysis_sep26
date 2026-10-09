import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TOP_KEYWORDS, COMPETITORS } from '@/app/data/seo-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

type SortKey = 'keyword' | 'position' | 'trafficShare' | 'aiPresence';
type SortDirection = 'asc' | 'desc';

export function KeywordsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('trafficShare');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedKeywords = [...TOP_KEYWORDS].sort((a, b) => {
    let comparison = 0;

    switch (sortKey) {
      case 'keyword':
        comparison = a.keyword.localeCompare(b.keyword);
        break;
      case 'position':
        comparison = a.position - b.position;
        break;
      case 'trafficShare':
        comparison = a.trafficShare - b.trafficShare;
        break;
      case 'aiPresence':
        const aiOrder = { High: 3, Medium: 2, Low: 1 };
        comparison = aiOrder[a.aiPresence as keyof typeof aiOrder] - aiOrder[b.aiPresence as keyof typeof aiOrder];
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-blue-600" />
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Top 20 Keywords</h2>
        <p className="text-sm text-gray-600">Ranked by traffic share and competitor positioning</p>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-[40%]">
                <button
                  onClick={() => handleSort('keyword')}
                  className="flex items-center font-semibold text-gray-700 hover:text-gray-900"
                >
                  Keyword
                  <SortIcon columnKey="keyword" />
                </button>
              </TableHead>
              <TableHead className="w-[15%]">
                <button
                  onClick={() => handleSort('position')}
                  className="flex items-center font-semibold text-gray-700 hover:text-gray-900"
                >
                  Avg Position
                  <SortIcon columnKey="position" />
                </button>
              </TableHead>
              <TableHead className="w-[15%]">
                <button
                  onClick={() => handleSort('trafficShare')}
                  className="flex items-center font-semibold text-gray-700 hover:text-gray-900"
                >
                  Traffic Share
                  <SortIcon columnKey="trafficShare" />
                </button>
              </TableHead>
              <TableHead className="w-[15%]">
                <button
                  onClick={() => handleSort('aiPresence')}
                  className="flex items-center font-semibold text-gray-700 hover:text-gray-900"
                >
                  AI Presence
                  <SortIcon columnKey="aiPresence" />
                </button>
              </TableHead>
              <TableHead className="w-[15%]">
                <span className="font-semibold text-gray-700">Competitor</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedKeywords.map((keyword, index) => {
              const competitor = COMPETITORS.find((c) => c.id === keyword.competitor);
              return (
                <TableRow key={index} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{keyword.keyword}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">#{keyword.position}</span>
                      {keyword.position <= 3 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Page 1
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">{keyword.trafficShare}%</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[60px]">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(keyword.trafficShare * 4, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        keyword.aiPresence === 'High'
                          ? 'bg-purple-100 text-purple-700'
                          : keyword.aiPresence === 'Medium'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {keyword.aiPresence}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: competitor?.color }}
                      />
                      <span className="text-sm text-gray-700">{competitor?.name}</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
