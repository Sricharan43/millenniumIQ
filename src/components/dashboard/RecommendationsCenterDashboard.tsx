import React, { useState } from 'react';
import type { AIAnalysisReport, BusinessInput } from '../../types';
import { 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';

interface Props {
  report: AIAnalysisReport;
  input: BusinessInput;
}

export const RecommendationsCenterDashboard: React.FC<Props> = ({ report }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  const recs = report.comprehensiveRecommendations || [];

  const categories = ['ALL', 'MARKET', 'FINANCE', 'GROWTH', 'RISK', 'IMPLEMENTATION'];

  const filteredRecs = recs.filter((r) => {
    const catMatch = selectedCategory === 'ALL' || r.category === selectedCategory;
    const prioMatch = selectedPriority === 'ALL' || r.priority === selectedPriority;
    return catMatch && prioMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header & Filter Toolbar */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Centralized AI Recommendations Center
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Prioritized strategic initiatives evaluated against business impact, execution risk, and cost.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Priority: All</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Recommendation List */}
      <div className="space-y-6">
        {filteredRecs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 text-sm">
            No recommendations found matching selected filters.
          </div>
        ) : (
          filteredRecs.map((rec) => (
            <div key={rec.id} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-blue-300 transition-all space-y-4">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    rec.category === 'MARKET' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    rec.category === 'FINANCE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    rec.category === 'GROWTH' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    rec.category === 'RISK' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {rec.category}
                  </span>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    rec.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    Priority: {rec.priority}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>Timeline: <strong className="text-gray-700">{rec.timeframe}</strong></span>
                  <span>•</span>
                  <span>Risk Level: <strong className={rec.riskLevel === 'Low' ? 'text-emerald-600' : 'text-amber-600'}>{rec.riskLevel}</strong></span>
                </div>
              </div>

              {/* Title & Core Statement */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{rec.title}</h3>
                <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                  {rec.recommendation}
                </p>
              </div>

              {/* AI Explanation & Supporting Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {/* WHY */}
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    WHY (Data-Driven Reason)
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {rec.whyExplanation}
                  </p>
                </div>

                {/* Supporting Data */}
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    Supporting Metrics
                  </span>
                  <p className="text-xs font-semibold text-blue-950 leading-relaxed">
                    {rec.supportingData}
                  </p>
                </div>

                {/* Impact & Cost */}
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    Expected Benefit & Cost
                  </span>
                  <div className="text-xs font-bold text-emerald-700 mb-0.5">{rec.expectedImpact}</div>
                  <div className="text-xs text-gray-500">Est. Investment: {rec.estimatedCost}</div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="flex items-start gap-2 pt-1 text-xs text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-gray-900">Recommended Action Plan: </strong>
                  <span>{rec.suggestedAction}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
