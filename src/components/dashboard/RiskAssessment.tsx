import React from 'react';
import type { RiskItem } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskAssessmentProps {
  risks: RiskItem[];
  isHighlighted?: boolean;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({
  risks,
  isHighlighted = false
}) => {
  return (
    <div
      id="risk-matrix-card"
      className={`p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm transition-all duration-500 ${
        isHighlighted ? 'ring-4 ring-rose-400 scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 rounded-xl bg-rose-50 border border-rose-700/50 text-rose-600">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Risk Matrix & Actionable Mitigation Plan</h3>
          <p className="text-xs text-gray-500">
            Proactive risk identification across financial, operational & market vectors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {risks.map((item, idx) => {
          const isHighRisk = item.impact === 'High' || item.probability === 'High';
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isHighRisk
                  ? 'bg-rose-50/20 border-rose-200/40 hover:border-rose-600/60'
                  : 'bg-[#F8FAFC] border-gray-200 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-gray-50 border border-gray-300 text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                  {item.category} Risk
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                  <span className="text-gray-500">Prob: <strong className="text-gray-900">{item.probability}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span className="text-gray-500">Impact: <strong className="text-rose-600">{item.impact}</strong></span>
                </div>
              </div>

              <h4 className="mt-2.5 text-sm font-bold text-gray-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{item.risk}</span>
              </h4>

              <div className="mt-3 pt-2.5 border-t border-gray-200 bg-white p-2.5 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Barnaby Mitigation Plan:
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {item.mitigation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
