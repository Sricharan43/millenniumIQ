import React, { useState } from 'react';
import type { AIAnalysisReport, BusinessInput, BudgetAllocation } from '../../types';
import { 
  Wallet, 
  RefreshCw, 
  Sliders,
  ArrowRight
} from 'lucide-react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface Props {
  report: AIAnalysisReport;
  input: BusinessInput;
  onUpdateBudget?: (updatedInput: Partial<BusinessInput>) => void;
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

export const FinancialPlanningDashboard: React.FC<Props> = ({ report, input, onUpdateBudget }) => {
  const curr = input.currency || '$';
  const allocations: BudgetAllocation[] = report.budgetAllocations || [];

  // Local state for interactive budget calculator inputs
  const [investment, setInvestment] = useState<number>(input.investmentBudget || 100000);
  const [revenue, setRevenue] = useState<number>(input.currentRevenue || 480000);
  const [expenses, setExpenses] = useState<number>(input.currentExpenses || 290000);

  const netProfit = Math.max(0, revenue - expenses);
  const marginPct = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : '25.0';

  const chartData = allocations.map((a) => ({
    name: a.category.split('&')[0],
    Current: a.currentAmount,
    Recommended: a.recommendedAmount
  }));

  const pieData = allocations.map((a) => ({
    name: a.category.split('&')[0],
    value: a.currentAmount
  }));

  const handleApplyChanges = () => {
    if (onUpdateBudget) {
      onUpdateBudget({
        investmentBudget: investment,
        currentRevenue: revenue,
        currentExpenses: expenses
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. High Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Total Available Capital</span>
          <div className="text-2xl font-bold text-gray-900">{curr}{investment.toLocaleString()}</div>
          <span className="text-xs text-blue-600 font-medium mt-1 block">Allocated Capital Pool</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Annual Revenue Pacing</span>
          <div className="text-2xl font-bold text-emerald-600">{curr}{revenue.toLocaleString()}</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">+18% YoY Trajectory</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Operating Expenses</span>
          <div className="text-2xl font-bold text-gray-900">{curr}{expenses.toLocaleString()}</div>
          <span className="text-xs text-gray-500 mt-1 block">Fixed & Variable Burn</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Net Profit & Margin</span>
          <div className="text-2xl font-bold text-blue-600">{curr}{netProfit.toLocaleString()}</div>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">{marginPct}% Net Profit Margin</span>
        </div>
      </div>

      {/* 2. Budget Allocation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie Chart Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-1">Current Capital Allocation</h3>
          <p className="text-xs text-gray-500 mb-4">Budget distribution across operational categories</p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => `${curr}${Number(val).toLocaleString()}`} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {allocations.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{a.category.split('&')[0]} ({a.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current vs AI Recommended Comparison Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-1">Current vs AI Recommended Allocation</h3>
          <p className="text-xs text-gray-500 mb-4">Capital optimization model recommendations</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `${curr}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                <Tooltip formatter={(val: any) => `${curr}${Number(val).toLocaleString()}`} />
                <Bar dataKey="Current" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recommended" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. AI Budget Recommendations */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          AI Budget Optimization Recommendations
        </h2>

        <div className="space-y-4">
          {allocations.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">{item.category}</h4>
                  {item.difference !== 0 && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.difference < 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {item.difference < 0 ? 'Reallocate Out' : 'Increase Capital'} ({item.difference < 0 ? '' : '+'}{curr}{Math.abs(item.difference).toLocaleString()})
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.reason}</p>
                <div className="text-xs font-semibold text-emerald-600">Expected Impact: {item.expectedImpact}</div>
              </div>

              <div className="flex items-center gap-6 shrink-0 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Current</span>
                  <span className="text-sm font-bold text-gray-700">{curr}{item.currentAmount.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase block">Recommended</span>
                  <span className="text-sm font-bold text-blue-600">{curr}{item.recommendedAmount.toLocaleString()} ({item.recommendedPercentage}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Financial Configurator */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600" />
          Interactive Financial Configurator
        </h3>
        <p className="text-xs text-gray-500">Adjust baseline inputs to instantly recalculate financial models & recommendations</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Available Investment ({curr})</label>
            <input 
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Annual Revenue ({curr})</label>
            <input 
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Annual Expenses ({curr})</label>
            <input 
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleApplyChanges}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Recalculate Budget Models
          </button>
        </div>
      </div>
    </div>
  );
};
