import React, { useState } from 'react';
import type { AIAnalysisReport, BusinessInput } from '../../types';
import { 
  Sliders, 
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface Props {
  report: AIAnalysisReport;
  input: BusinessInput;
}

export const WhatIfAnalysisDashboard: React.FC<Props> = ({ report, input }) => {
  const curr = input.currency || '$';
  
  // Baseline values
  const baseRev = input.currentRevenue || (input.investmentBudget * 1.8);
  const baseExp = input.currentExpenses || (input.investmentBudget * 1.1);
  const baseProfit = baseRev - baseExp;
  const baseRisk = report.riskScore.score;

  // Sliders state (percentages)
  const [marketingChange, setMarketingChange] = useState<number>(15); // +15%
  const [employeeChange, setEmployeeChange] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(5); // +5%
  const [volumeChange, setVolumeChange] = useState<number>(10); // +10%
  const [opsCostChange, setOpsCostChange] = useState<number>(-5); // -5%

  // Simulation logic
  const simRevenue = Math.round(
    baseRev * (1 + priceChange / 100) * (1 + (volumeChange + marketingChange * 0.4) / 100)
  );

  const simExpenses = Math.round(
    baseExp * (1 + (employeeChange * 0.25 + opsCostChange * 0.3 + marketingChange * 0.35) / 100)
  );

  const simProfit = simRevenue - simExpenses;
  const simROI = ((simProfit / (input.investmentBudget || 100000)) * 100);
  const simRisk = Math.min(95, Math.max(30, Math.round(baseRisk - (marketingChange * 0.2) - (employeeChange * 0.1) + (opsCostChange < 0 ? 5 : 0))));

  const profitDiff = simProfit - baseProfit;
  const profitDiffPct = baseProfit > 0 ? ((profitDiff / baseProfit) * 100).toFixed(1) : '0';

  const chartData = [
    { name: 'Revenue', Current: baseRev, Proposed: simRevenue },
    { name: 'Expenses', Current: baseExp, Proposed: simExpenses },
    { name: 'Net Profit', Current: baseProfit, Proposed: simProfit }
  ];

  const presets = [
    { label: 'Aggressive Marketing (+25% Spend)', m: 25, e: 10, p: 0, v: 20, o: 0 },
    { label: 'Lean Efficiency (-10% Ops Cost)', m: 0, e: -5, p: 5, v: 5, o: -10 },
    { label: 'Premium Price Strategy (+12% Price)', m: 10, e: 0, p: 12, v: -2, o: 0 }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setMarketingChange(p.m);
    setEmployeeChange(p.e);
    setPriceChange(p.p);
    setVolumeChange(p.v);
    setOpsCostChange(p.o);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-blue-600" />
          What-If Scenario Simulator & Sensitivity Analysis
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Simulate business parameter adjustments to forecast revenue impact, net profit changes, and risk volatility.
        </p>
      </div>

      {/* Preset Quick Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Presets:</span>
        {presets.map((pr, i) => (
          <button
            key={i}
            onClick={() => applyPreset(pr)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 transition-all shadow-sm"
          >
            {pr.label}
          </button>
        ))}
      </div>

      {/* Main Simulation Grid: Sliders vs Outcome Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Scenario Parameter Sliders</h3>

          {/* Marketing Spend */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
              <span>Marketing Spend Adjustment</span>
              <span className={marketingChange >= 0 ? 'text-blue-600' : 'text-rose-600'}>
                {marketingChange >= 0 ? `+${marketingChange}%` : `${marketingChange}%`}
              </span>
            </div>
            <input 
              type="range" min="-30" max="50" value={marketingChange} 
              onChange={(e) => setMarketingChange(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Product Price */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
              <span>Product Price Change</span>
              <span className={priceChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                {priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`}
              </span>
            </div>
            <input 
              type="range" min="-20" max="40" value={priceChange} 
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Sales Volume */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
              <span>Sales Volume Growth</span>
              <span className={volumeChange >= 0 ? 'text-blue-600' : 'text-rose-600'}>
                {volumeChange >= 0 ? `+${volumeChange}%` : `${volumeChange}%`}
              </span>
            </div>
            <input 
              type="range" min="-20" max="50" value={volumeChange} 
              onChange={(e) => setVolumeChange(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Operational Costs */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
              <span>Operational Cost Change</span>
              <span className={opsCostChange <= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                {opsCostChange >= 0 ? `+${opsCostChange}%` : `${opsCostChange}%`}
              </span>
            </div>
            <input 
              type="range" min="-30" max="30" value={opsCostChange} 
              onChange={(e) => setOpsCostChange(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Employee Spend */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
              <span>Team & Headcount Spending</span>
              <span className={employeeChange >= 0 ? 'text-blue-600' : 'text-rose-600'}>
                {employeeChange >= 0 ? `+${employeeChange}%` : `${employeeChange}%`}
              </span>
            </div>
            <input 
              type="range" min="-20" max="40" value={employeeChange} 
              onChange={(e) => setEmployeeChange(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Simulation Output & Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* Output Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500 block">Proposed Revenue</span>
              <div className="text-lg font-bold text-gray-900">{curr}{simRevenue.toLocaleString()}</div>
              <span className="text-[10px] font-bold text-blue-600">
                vs {curr}{baseRev.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500 block">Proposed Expenses</span>
              <div className="text-lg font-bold text-gray-900">{curr}{simExpenses.toLocaleString()}</div>
              <span className="text-[10px] font-bold text-gray-500">
                vs {curr}{baseExp.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500 block">Proposed Net Profit</span>
              <div className="text-lg font-bold text-emerald-600">{curr}{simProfit.toLocaleString()}</div>
              <span className={`text-[10px] font-bold ${profitDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {profitDiff >= 0 ? `+${curr}${profitDiff.toLocaleString()}` : `-${curr}${Math.abs(profitDiff).toLocaleString()}`} ({profitDiffPct}%)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500 block">Risk Safety Index</span>
              <div className="text-lg font-bold text-gray-900">{simRisk} / 100</div>
              <span className="text-[10px] font-bold text-gray-500">
                Baseline: {baseRisk}
              </span>
            </div>
          </div>

          {/* Comparison Bar Chart */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-4">Current Scenario vs Proposed Scenario Comparison</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `${curr}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                  <Tooltip formatter={(val: any) => `${curr}${Number(val).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="Current" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Current Baseline" />
                  <Bar dataKey="Proposed" fill="#2563EB" radius={[4, 4, 0, 0]} name="Proposed Scenario" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Takeaway Insight */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="block text-sm font-bold text-blue-950 mb-0.5">Simulation Executive Insight:</strong>
              Under the proposed scenario, net profit changes by <strong className="text-blue-900">{curr}{profitDiff.toLocaleString()} ({profitDiffPct}%)</strong>. 
              The combination of a {priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`} price adjustment and {marketingChange >= 0 ? `+${marketingChange}%` : `${marketingChange}%`} marketing spend yields an overall ROI of <strong className="text-blue-900">{simROI.toFixed(0)}%</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
