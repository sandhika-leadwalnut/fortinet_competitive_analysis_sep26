import { Brain, Sparkles, MessageSquare, TrendingUp } from 'lucide-react';
import { AI_METRICS } from '@/app/data/seo-data';

export function AIVisibility() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {/* AI Readiness Score */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">LLM Readiness Score</h2>
            <p className="text-sm text-gray-600">Content optimized for AI search engines</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="flex items-end gap-4 mb-6">
          <div className="text-5xl font-bold text-gray-900">{AI_METRICS.aiReadinessScore}</div>
          <div className="text-2xl text-gray-400 mb-2">/100</div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${AI_METRICS.aiReadinessScore}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-green-600 font-medium">+8% vs last month</span>
        </div>
      </div>

      {/* AI Metrics Grid */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">AI Visibility Metrics</h2>
            <p className="text-sm text-gray-600">Performance in LLM-powered search</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI-Triggering Queries</p>
                <p className="text-2xl font-bold text-gray-900">{AI_METRICS.aiTriggeringQueries}</p>
              </div>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              +12%
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50/50 to-transparent rounded-xl border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">LLM Citations</p>
                <p className="text-2xl font-bold text-gray-900">{AI_METRICS.llmCitations}</p>
              </div>
            </div>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
              +18%
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-medium">Top AI Keywords:</p>
          <div className="flex flex-wrap gap-2">
            {AI_METRICS.topAIKeywords.map((keyword, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
