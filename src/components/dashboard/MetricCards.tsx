import React from 'react';
import type { AIAnalysisReport } from '../../types';
import { ShieldCheck, TrendingUp, DollarSign, Activity, Globe, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardsProps {
  report: AIAnalysisReport;
  highlightCardId?: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ report, highlightCardId }) => {
  const cards = [
    {
      id: 'health-card',
      data: report.healthScore,
      icon: <Activity className="w-5 h-5 text-blue-600" />,
      gradient: '  border-blue-200',
      ringColor: '#6366F1'
    },
    {
      id: 'opportunity-card',
      data: report.opportunityScore,
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      gradient: 'from-amber-950/60  border-amber-500/40',
      ringColor: '#F59E0B'
    },
    {
      id: 'profitability-card',
      data: report.profitabilityScore,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      gradient: 'from-emerald-950/60  border-emerald-500/40',
      ringColor: '#10B981'
    },
    {
      id: 'risk-matrix-card',
      data: report.riskScore,
      icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
      gradient: 'from-rose-950/60  border-rose-500/40',
      ringColor: '#F43F5E'
    },
    {
      id: 'market-potential-card',
      data: report.marketPotentialScore,
      icon: <Globe className="w-5 h-5 text-sky-400" />,
      gradient: 'from-sky-950/60  border-sky-500/40',
      ringColor: '#0EA5E9'
    },
    {
      id: 'scalability-card',
      data: report.scalabilityScore,
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      gradient: 'from-purple-950/60  border-purple-500/40',
      ringColor: '#A855F7'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const isHighlighted = highlightCardId === card.id;
        const score = card.data.score;
        const strokeDash = `${(score / 100) * 226} 226`;

        return (
          <div
            key={card.id}
            id={card.id}
            className={`relative p-5 rounded-2xl bg-white ${card.gradient} border backdrop-blur-md transition-all duration-500 shadow-xl ${
              isHighlighted
                ? 'ring-4 ring-indigo-400 scale-[1.02] shadow-blue-500/20 shadow-sm'
                : 'hover:border-blue-300 hover:-translate-y-0.5'
            }`}
          >
            {isHighlighted && (
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-blue-500 text-[10px] font-bold text-gray-900 uppercase tracking-wider animate-bounce">
                Analyzed by Barnaby
              </div>
            )}

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-gray-300 shadow-inner">
                  {card.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {card.data.label}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-gray-900">{score}</span>
                    <span className="text-xs font-medium text-gray-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Score Circular Gauge */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    stroke={card.ringColor}
                    strokeWidth="4.5"
                    strokeDasharray={strokeDash}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold text-gray-800">
                  {score}%
                </span>
              </div>
            </div>

            {/* Metric Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-medium">
                {card.data.trend === 'up' ? (
                  <span className="flex items-center text-emerald-600 font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5" /> {card.data.change}
                  </span>
                ) : (
                  <span className="flex items-center text-amber-600 font-bold">
                    <ArrowDownRight className="w-3.5 h-3.5" /> {card.data.change}
                  </span>
                )}
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  card.data.status === 'Excellent'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                    : card.data.status === 'Good'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                }`}
              >
                {card.data.status}
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              {card.data.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
