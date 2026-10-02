import React from 'react';
import type { CustomerSegment } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Globe2, Users, Tag } from 'lucide-react';

interface MarketAnalysisProps {
  tamSamSom: { tam: number; sam: number; som: number };
  customerSegments: CustomerSegment[];
  pricingRecommendations: {
    strategyName: string;
    suggestedPricePoint: string;
    marginPotential: string;
    tactics: string[];
  };
  currencySymbol?: string;
}

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({
  tamSamSom,
  customerSegments,
  pricingRecommendations,
  currencySymbol = '$'
}) => {
  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899'];

  const formatMarketSize = (val: number) => {
    if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(1)}B`;
    return `${currencySymbol}${val}M`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* TAM / SAM / SOM Card */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <div className="p-2 rounded-xl bg-sky-950 border border-sky-700/50 text-sky-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">TAM / SAM / SOM Market Sizing</h3>
              <p className="text-[11px] text-gray-500">Macro industry addressable opportunity</p>
            </div>
          </div>

          <div className="space-y-4 mt-5">
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-gray-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">TAM (Total Addressable)</span>
                <p className="text-xs text-gray-500">Global total market demand</p>
              </div>
              <span className="text-lg font-black text-gray-900">{formatMarketSize(tamSamSom.tam)}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-gray-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">SAM (Serviceable Addressable)</span>
                <p className="text-xs text-gray-500">Target regional market segment</p>
              </div>
              <span className="text-lg font-black text-amber-600">{formatMarketSize(tamSamSom.sam)}</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/60 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">SOM (Obtainable Market)</span>
                <p className="text-xs text-gray-500">Target Year 3 realistic share</p>
              </div>
              <span className="text-xl font-black text-emerald-600">{formatMarketSize(tamSamSom.som)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Segments Donut */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
          <div className="p-2 rounded-xl bg-blue-50 border border-indigo-700/50 text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Target Customer Segments</h3>
            <p className="text-[11px] text-gray-500">Audience distribution & key requirements</p>
          </div>
        </div>

        <div className="h-[180px] w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerSegments}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
              >
                {customerSegments.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'Audience Share']}
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 text-xs">
          {customerSegments.map((seg, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-gray-700 truncate">{seg.name}</span>
              </div>
              <span className="font-bold text-gray-900">{seg.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Strategy Card */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-700/50 text-amber-600">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Pricing & Monetization Strategy</h3>
              <p className="text-[11px] text-gray-500">Optimized price points for max ROI</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200">
              <span className="text-xs text-gray-500">Suggested Price:</span>
              <span className="text-sm font-bold text-amber-600">{pricingRecommendations.suggestedPricePoint}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200">
              <span className="text-xs text-gray-500">Gross Margin Potential:</span>
              <span className="text-sm font-bold text-emerald-600">{pricingRecommendations.marginPotential}</span>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-gray-700">Tactical Recommendations:</span>
              <ul className="mt-2 space-y-1.5 text-xs text-gray-500 list-disc list-inside">
                {pricingRecommendations.tactics.map((tactic, i) => (
                  <li key={i}>{tactic}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
