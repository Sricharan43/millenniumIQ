import React from 'react';
import type { AIAnalysisReport, BusinessInput } from '../../types';
import { 
  Clock, 
  ArrowUpRight,
  Zap,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface Props {
  report: AIAnalysisReport;
  input: BusinessInput;
}

export const MarketIntelligenceDashboard: React.FC<Props> = ({ report, input }) => {
  const curr = input.currency || '$';
  const trends = report.marketTrends || [];

  const marketGrowthData = [
    { year: '2022', MarketSize: 850, DemandIndex: 65 },
    { year: '2023', MarketSize: 980, DemandIndex: 72 },
    { year: '2024', MarketSize: 1150, DemandIndex: 84 },
    { year: '2025 (E)', MarketSize: 1380, DemandIndex: 91 },
    { year: '2026 (P)', MarketSize: 1650, DemandIndex: 98 },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & High Level Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Market Opportunity Score</span>
          <div className="text-2xl font-bold text-gray-900">{report.marketPotentialScore.score} / 100</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> High Demand Tailwind
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">TAM (Total Addressable)</span>
          <div className="text-2xl font-bold text-gray-900">{curr}{report.tamSamSom.tam.toLocaleString()}M</div>
          <span className="text-xs text-gray-500 mt-1 block">Global Category Horizon</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">SAM (Serviceable)</span>
          <div className="text-2xl font-bold text-gray-900">{curr}{report.tamSamSom.sam.toLocaleString()}M</div>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">28% Addressable Segment</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">SOM (Obtainable 3-Yr Target)</span>
          <div className="text-2xl font-bold text-gray-900">{curr}{report.tamSamSom.som.toLocaleString()}M</div>
          <span className="text-xs text-indigo-600 font-semibold mt-1 block">Realistic Capture Target</span>
        </div>
      </div>

      {/* 2. Charts: Market Growth & Demand Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-1">Industry Market Growth Trajectory</h3>
          <p className="text-xs text-gray-500 mb-4">Historical & forecasted market expansion in {input.industry}</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0' }} />
                <Bar dataKey="MarketSize" fill="#2563EB" radius={[6, 6, 0, 0]} name="Market Size ($M)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-1">Customer Demand Index Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Search interest & purchasing intent index over time</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0' }} />
                <Line type="monotone" dataKey="DemandIndex" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} name="Demand Index (0-100)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Market Trend Recommendation Engine */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Market Trend Recommendation Engine
          </h2>
          <span className="text-xs text-gray-500 font-medium">Data-Driven Strategy Signals</span>
        </div>

        <div className="space-y-4">
          {trends.map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-blue-300 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    item.direction === 'Growing' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    item.direction === 'Declining' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}>
                    {item.indicator}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-gray-900">{item.trend}</h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {item.changePercentage}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Industry Signal Evaluation</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.priority === 'High' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    Priority: {item.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                    <Clock className="w-3 h-3 inline mr-1" /> {item.estimatedTimeline}
                  </span>
                </div>
              </div>

              {/* Recommendation Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    AI Recommendation
                  </span>
                  <p className="text-xs font-semibold text-gray-900 leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    WHY (Supporting Data)
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.whyReason}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    Expected Benefit & Action
                  </span>
                  <p className="text-xs text-gray-700 leading-relaxed mb-2">
                    {item.expectedBenefit}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                    <span>Action Plan: {item.suggestedAction}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
