import React from 'react';
import type { AIAnalysisReport } from '../../types';
import { Compass, Lightbulb, Rocket, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface GrowthStrategyProps {
  report: AIAnalysisReport;
}

export const GrowthStrategy: React.FC<GrowthStrategyProps> = ({ report }) => {
  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="p-6 rounded-2xl bg-white border border-blue-200 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <SparklesIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-gray-900">MillenniumIQ Strategic Executive Summary</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {report.executiveSummary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-indigo-900/50">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 mb-2">
              <CheckCircle2 className="w-4 h-4" /> Core Business Strengths
            </span>
            <ul className="space-y-1.5 text-xs text-gray-700">
              {report.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1 mb-2">
              <Zap className="w-4 h-4" /> Priority Areas to Strengthen
            </span>
            <ul className="space-y-1.5 text-xs text-gray-700">
              {report.weaknesses.map((wk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Revenue Opportunities Grid */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-200">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-700/50 text-amber-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Discovered High-ROI Revenue Streams</h3>
            <p className="text-xs text-gray-500">Unlocking new customer channels and monetization models</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {report.opportunities.map((opp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    {opp.category}
                  </span>
                  <span className="text-xs font-black text-emerald-600">{opp.potentialRevenueIncrease}</span>
                </div>
                <h4 className="mt-3 text-sm font-bold text-gray-900">{opp.title}</h4>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">{opp.description}</p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
                <span>Timeframe: <strong className="text-gray-800">{opp.timeframe}</strong></span>
                <span>Effort: <strong className="text-blue-600">{opp.effort}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Phase Growth Roadmap */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-200">
          <div className="p-2 rounded-xl bg-purple-950 border border-purple-700/50 text-purple-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">5-Phase Strategic Growth Roadmap</h3>
            <p className="text-xs text-gray-500">Sequential milestones to reach market leadership</p>
          </div>
        </div>

        <div className="space-y-4 mt-5">
          {report.growthStrategies.map((strat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-800 text-purple-300 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{strat.phase}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-gray-500">{strat.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mt-0.5">{strat.title}</h4>
                  
                  <ul className="mt-2 space-y-1 text-xs text-gray-700">
                    {strat.actionItems.map((act, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:text-right shrink-0 bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold block">Expected Impact</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <Rocket className="w-3.5 h-3.5" /> {strat.expectedImpact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function SparklesIcon(props: any) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
