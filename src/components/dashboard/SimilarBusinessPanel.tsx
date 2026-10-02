import React, { useState, useEffect } from 'react';
import type { BusinessInput } from '../../types';
import type { SimilarityResult, SimilarBusiness, SimilarityOpportunity } from '../../services/deepLearningService';
import { findSimilarBusinesses } from '../../services/deepLearningService';
import { Search, ArrowRight, RefreshCw, Layers } from 'lucide-react';

interface Props { input: BusinessInput; isHighlighted?: boolean; }

const BizCard = ({ b, rank }: { b: SimilarBusiness; rank: number }) => {
  const pct = Math.round(b.similarity_score * 100);
  const col = pct > 75 ? 'bg-emerald-500' : pct > 50 ? 'bg-amber-500' : 'bg-rose-500';
  const gc  = b.growth_stage === 'High' ? 'text-emerald-600 bg-emerald-50/50 border-emerald-200/50' : 'text-amber-600 bg-amber-50/50 border-amber-200/50';
  return (
    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 hover:border-indigo-700/50 transition-colors space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div><div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-blue-50 border border-indigo-700/60 text-blue-600 text-[10px] font-bold flex items-center justify-center">{rank}</span><span className="text-sm font-bold text-gray-900">{b.name}</span></div><span className="ml-7 text-[11px] text-gray-500">{b.category}</span></div>
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${gc}`}>{b.growth_stage} Growth</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{b.description}</p>
      <div className="space-y-1"><div className="flex items-center justify-between text-[10px]"><span className="text-gray-400 font-semibold">Semantic similarity</span><span className="font-bold text-gray-700">{pct}%</span></div><div className="w-full h-1.5 rounded-full bg-gray-50"><div className={`h-1.5 rounded-full ${col}`} style={{ width: `${pct}%` }} /></div></div>
      <div className="flex items-center justify-between pt-0.5"><span className="text-[10px] text-gray-400">TAM: <strong className="text-gray-700">${b.market_size_bn}B</strong></span><span className="text-[10px] text-gray-500 italic line-clamp-1">{b.why_similar}</span></div>
    </div>
  );
};

export const SimilarBusinessPanel: React.FC<Props> = ({ input, isHighlighted = false }) => {
  const [result, setResult] = useState<SimilarityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const run = async () => { setLoading(true); const r = await findSimilarBusinesses(input, 5); setResult(r); setLoading(false); };
  useEffect(() => { run(); }, [input]);

  return (
    <div id="similar-business-card" className={`p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm space-y-5 transition-all duration-500 ${isHighlighted?'ring-4 ring-sky-400 scale-[1.01]':''}`}>
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-950 border border-sky-700/50 text-sky-400"><Search className="w-5 h-5" /></div>
          <div><h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">Semantic Similarity Search <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800/60">all-MiniLM-L6-v2 + FAISS</span></h3><p className="text-[11px] text-gray-500">Sentence embeddings find similar businesses even without exact keyword matches</p></div>
        </div>
        <button onClick={run} disabled={loading} className="p-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-500 hover:text-gray-900 disabled:opacity-40"><RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`} /></button>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3"><div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" /><p className="text-xs text-gray-500">Computing sentence embeddings & searching FAISS index…</p></div>
      ) : result ? (
        <div className="space-y-5">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-gray-200 flex items-start gap-2"><Search className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" /><p className="text-[11px] text-gray-500 italic leading-relaxed line-clamp-2"><strong className="text-gray-700 not-italic">Query: </strong>{result.query}</p></div>
          <div className="flex items-center gap-2"><span className="text-[10px] text-gray-500 font-semibold">{result.model_used}</span>{result.embedding_dim>0&&<span className="text-[10px] text-slate-600">| dim: {result.embedding_dim}</span>}</div>
          <div className="grid grid-cols-1 gap-3">{result.similar_businesses.map((b: SimilarBusiness, i: number)=><BizCard key={b.name} b={b} rank={i+1}/>)}</div>
          {result.opportunities.length>0&&<div className="space-y-3"><div className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-600" /><h4 className="text-xs font-bold text-gray-900">Derived Opportunity Insights</h4></div>
            {result.opportunities.map((o: SimilarityOpportunity, i: number)=><div key={i} className={`p-4 rounded-xl border space-y-2 ${o.priority==='High'?'bg-blue-50 border-blue-200':'bg-[#F8FAFC] border-gray-200'}`}>
              <div className="flex items-center justify-between gap-2"><span className="text-sm font-bold text-gray-900 flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-blue-600"/>{o.title}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${o.priority==='High'?'bg-blue-50 text-blue-600 border-indigo-700/60':'bg-white text-gray-700 border-gray-300'}`}>{o.priority}</span></div>
              <p className="text-xs text-gray-500 leading-relaxed">{o.rationale}</p>
              <div className="flex items-center gap-4 text-[11px]"><span className="text-gray-400">Market: <strong className="text-gray-700">{o.market_size}</strong></span><span className="text-gray-400 italic">{o.entry_angle}</span></div>
            </div>)}
          </div>}
        </div>
      ) : <p className="text-xs text-gray-400 text-center py-8">Similarity search unavailable. Check backend connection.</p>}
    </div>
  );
};
