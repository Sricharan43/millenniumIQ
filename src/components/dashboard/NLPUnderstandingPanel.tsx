import React, { useState, useEffect } from 'react';
import type { BusinessInput } from '../../types';
import type { NLPUnderstandingResult } from '../../services/deepLearningService';
import { understandBusinessIdea } from '../../services/deepLearningService';
import { Brain, Tag, Users, Cpu, Lightbulb, TrendingUp, BookOpen, RefreshCw } from 'lucide-react';

interface Props { input: BusinessInput; isHighlighted?: boolean; }

export const NLPUnderstandingPanel: React.FC<Props> = ({ input, isHighlighted = false }) => {
  const [result, setResult] = useState<NLPUnderstandingResult | null>(null);
  const [loading, setLoading] = useState(true);

  const run = async () => { setLoading(true); const r = await understandBusinessIdea(input); setResult(r); setLoading(false); };
  useEffect(() => { run(); }, [input]);

  const Chip = ({ label, col = 'indigo' }: { label: string; col?: string }) => (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-${col}-950/60 text-${col}-300 border border-${col}-800/50`}>{label}</span>
  );

  return (
    <div id="nlp-understanding-card" className={`p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm space-y-5 transition-all duration-500 ${isHighlighted?'ring-4 ring-violet-400 scale-[1.01]':''}`}>
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-violet-950 border border-violet-700/50 text-violet-400"><Brain className="w-5 h-5" /></div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">Transformer NLP — Business Idea Understanding <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-950 text-violet-300 border border-violet-800/60">BART-MNLI / Zero-Shot</span></h3>
            <p className="text-[11px] text-gray-500">Extracts industry, business type, customers, technologies & growth signals from your description</p>
          </div>
        </div>
        <button onClick={run} disabled={loading} className="p-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-500 hover:text-gray-900 disabled:opacity-40"><RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`} /></button>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /><p className="text-xs text-gray-500">Running Transformer NLP inference…</p></div>
      ) : result ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Extracted Industry</span>
              <p className="text-sm font-bold text-violet-300">{result.extracted_industry}</p>
              <div className="flex items-center gap-1.5 mt-1"><div className="flex-1 h-1.5 rounded-full bg-gray-50"><div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${Math.round(result.industry_confidence*100)}%` }} /></div><span className="text-[10px] text-gray-500 font-semibold">{Math.round(result.industry_confidence*100)}%</span></div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-gray-200 space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Type</span><p className="text-sm font-bold text-sky-300">{result.business_type}</p></div>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-gray-200 space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Problem Statement</span><p className="text-xs text-gray-700 leading-relaxed line-clamp-3">{result.problem_statement}</p></div>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 space-y-2"><div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-emerald-600" /><span className="text-xs font-bold text-gray-900">Target Customer Segments</span></div><div className="flex flex-wrap gap-2">{result.target_customers.map((c,i)=><Chip key={i} label={c} col="emerald"/>)}</div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 space-y-2"><div className="flex items-center gap-2 mb-1"><Cpu className="w-4 h-4 text-cyan-400" /><span className="text-xs font-bold text-gray-900">Technologies Identified</span></div><div className="flex flex-wrap gap-2">{result.technologies_identified.length>0?result.technologies_identified.map((t,i)=><Chip key={i} label={t} col="cyan"/>):<span className="text-xs text-gray-400">None detected</span>}</div></div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 space-y-2"><div className="flex items-center gap-2 mb-1"><BookOpen className="w-4 h-4 text-amber-600" /><span className="text-xs font-bold text-gray-900">Business Models</span></div><div className="flex flex-wrap gap-2">{result.business_models.map((m,i)=><Chip key={i} label={m} col="amber"/>)}</div></div>
          </div>
          {result.opportunity_keywords.length>0&&<div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 space-y-2"><div className="flex items-center gap-2 mb-1"><Tag className="w-4 h-4 text-rose-600" /><span className="text-xs font-bold text-gray-900">Opportunity Keywords</span></div><div className="flex flex-wrap gap-2">{result.opportunity_keywords.map((k,i)=><Chip key={i} label={k} col="rose"/>)}</div></div>}
          {result.market_growth_signals.length>0&&<div className="p-4 rounded-xl bg-[#F8FAFC] border border-emerald-900/40 space-y-2"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-emerald-600" /><span className="text-xs font-bold text-gray-900">Market Growth Signals</span></div><div className="flex flex-wrap gap-2">{result.market_growth_signals.map((s,i)=><span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50/60 text-emerald-600 border border-emerald-200/50"><Lightbulb className="w-3 h-3"/>{s}</span>)}</div></div>}
          <div className="flex items-center gap-2 pt-1"><span className="text-[10px] text-gray-400">Model:</span><span className="text-[10px] font-semibold text-gray-500">{result.model_used}</span></div>
        </div>
      ) : <p className="text-xs text-gray-400 text-center py-8">NLP analysis unavailable. Check backend connection.</p>}
    </div>
  );
};
