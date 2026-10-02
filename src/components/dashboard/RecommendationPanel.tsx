import React, { useState, useEffect } from 'react';
import type { BusinessInput } from '../../types';
import type { RecommendationResult, Recommendation } from '../../services/deepLearningService';
import { fetchRecommendations } from '../../services/deepLearningService';
import { Sparkles, Star, TrendingUp, ArrowRight, Lightbulb, RefreshCw, Trophy } from 'lucide-react';

interface Props { input: BusinessInput; isHighlighted?: boolean; }

const scoreRing = (score: number) => {
  const pct  = Math.round(score * 100);
  const col  = pct > 80 ? '#34d399' : pct > 60 ? '#fbbf24' : '#f87171';
  const dash = (pct / 100) * 88;
  return { pct, col, dash };
};

const RecommCard = ({ r }: { r: Recommendation }) => {
  const { pct, col, dash } = scoreRing(r.relevance_score);
  const gc = r.growth === 'High'
    ? 'bg-emerald-50/60 text-emerald-600 border-emerald-200/50'
    : 'bg-amber-50/60 text-amber-600 border-amber-200/50';
  return (
    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 hover:border-indigo-700/50 transition-all duration-200 space-y-3">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0 w-11 h-11">
          <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
            <circle cx="18" cy="18" r="14" fill="none" stroke={col} strokeWidth="3"
              strokeDasharray={`${dash} 88`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-gray-900">
            #{r.rank}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{r.business_name}</span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${gc}`}>{r.growth} Growth</span>
          </div>
          <span className="text-[11px] text-blue-600/80">{r.category}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
      <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2">
        <Lightbulb className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-[11px] text-indigo-200/90 leading-relaxed">{r.reason}</p>
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-gray-400">TAM: <strong className="text-gray-700">${r.market_size_bn}B</strong></span>
        <span className="text-gray-400">Relevance: <strong style={{ color: col }}>{pct}%</strong></span>
      </div>
    </div>
  );
};

export const RecommendationPanel: React.FC<Props> = ({ input, isHighlighted = false }) => {
  const [result, setResult]   = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(true);

  const run = async () => {
    setLoading(true);
    const r = await fetchRecommendations(input, 5);
    setResult(r);
    setLoading(false);
  };
  useEffect(() => { run(); }, [input]);

  return (
    <div
      id="recommendation-card"
      className={`p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm space-y-5 transition-all duration-500 ${
        isHighlighted ? 'ring-4 ring-indigo-400 scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 border border-indigo-700/50 text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Neural Recommendation Engine
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                Two-Tower BPR
              </span>
            </h3>
            <p className="text-[11px] text-gray-500">
              User-profile encoder x candidate encoder cosine similarity — personalised business opportunities
            </p>
          </div>
        </div>
        <button onClick={run} disabled={loading} className="p-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-500 hover:text-gray-900 disabled:opacity-40">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500">Encoding user profile and ranking candidates...</p>
        </div>
      ) : result ? (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] text-gray-500 font-semibold">{result.model_used}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-gray-900">Personalised Recommendations for {input.businessName}</h4>
            </div>
            {result.recommendations.map(r => <RecommCard key={r.rank} r={r} />)}
          </div>
          {result.opportunity_ideas.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-gray-900">Derived Opportunity Ideas</h4>
              </div>
              {result.opportunity_ideas.map((idea, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-50/20 border border-emerald-900/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-sm font-bold text-gray-900">{idea.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{idea.angle}</p>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-gray-400">Impact: <strong className="text-emerald-600">{idea.expected_impact}</strong></span>
                    <span className="text-gray-400">Difficulty: <strong className="text-amber-600">{idea.difficulty}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-8">Recommendations unavailable. Check backend connection.</p>
      )}
    </div>
  );
};
