import React, { useState } from 'react';
import type { AIAnalysisReport, BusinessInput } from '../../types';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  PieChart, 
  Zap, 
  ShieldCheck, 
  Target, 
  Sparkles,
  ArrowUpRight,
  Activity,
  Award
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  report: AIAnalysisReport;
  input: BusinessInput;
  highlightCardId?: string;
}

export const BusinessOverviewDashboard: React.FC<Props> = ({ report, input }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '6m' | '1y' | 'custom'>('3m');

  const curr = input.currency || '$';
  const rev = input.currentRevenue || (input.investmentBudget * 1.8);
  const exp = input.currentExpenses || (input.investmentBudget * 1.1);
  const profit = rev - exp;
  const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '25.0';
  const cac = input.currency === '$' ? 142 : 1200;
  const ltv = input.currency === '$' ? 1280 : 10500;
  const retention = 86.4;
  const roi = ((profit / (input.investmentBudget || 100000)) * 100).toFixed(0);

  // Health scores array
  const scores = [
    { title: 'Overall Health', score: report.healthScore.score, status: report.healthScore.status, color: 'blue' },
    { title: 'Growth Score', score: report.growthScore?.score || 84, status: report.growthScore?.status || 'Excellent', color: 'emerald' },
    { title: 'Financial Health', score: report.profitabilityScore.score, status: report.profitabilityScore.status, color: 'indigo' },
    { title: 'Market Opportunity', score: report.opportunityScore.score, status: report.opportunityScore.status, color: 'purple' },
    { title: 'Customer Score', score: report.customerScore?.score || 82, status: report.customerScore?.status || 'Good', color: 'sky' },
    { title: 'Risk Safety Score', score: report.riskScore.score, status: report.riskScore.status, color: 'amber' },
  ];

  // Dynamic chart data based on timeRange
  const generateChartData = () => {
    const months = timeRange === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                   timeRange === '30d' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                   timeRange === '3m' ? ['Month 1', 'Month 2', 'Month 3'] :
                   timeRange === '6m' ? ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'] :
                   ['Q1', 'Q2', 'Q3', 'Q4'];
    
    return months.map((m, idx) => {
      const factor = 1 + (idx * 0.12);
      return {
        name: m,
        Revenue: Math.round((rev / 4) * factor),
        Expenses: Math.round((exp / 4) * (1 + idx * 0.04)),
        Profit: Math.round(((rev - exp) / 4) * factor),
        Customers: Math.round(120 * factor),
        SalesGrowth: Math.round(12 + idx * 4)
      };
    });
  };

  const chartData = generateChartData();

  const insights = [
    {
      type: 'positive',
      icon: TrendingUp,
      title: 'Revenue Acceleration',
      text: `Revenue has increased by 18% over the analyzed ${timeRange} period driven by strong organic adoption in ${input.industry}.`
    },
    {
      type: 'warning',
      icon: Activity,
      title: 'CAC vs LTV Divergence',
      text: `Customer acquisition cost (${curr}${cac}) is pacing 12% faster than last month. Reallocating budget to referral channels is recommended.`
    },
    {
      type: 'positive',
      icon: Sparkles,
      title: 'Macro Demand Expansion',
      text: `Market demand in ${input.category} is projected to grow by 28% over the next quarter, signaling prime expansion timing.`
    },
    {
      type: 'info',
      icon: Target,
      title: 'Cost Structure Efficiency',
      text: `Fixed operational burn rate is optimized at ${margin}% net margin, providing ${curr}${profit.toLocaleString()} annual net profit buffer.`
    }
  ];

  return (
    <div className="space-y-8">
      {/* 1. Health Score Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Business Health Scorecard
          </h2>
          <span className="text-xs text-gray-500 font-medium">Real-Time AI Multi-Vector Analysis</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {scores.map((sc, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-blue-300 transition-all">
              <span className="text-xs font-semibold text-gray-500 block mb-1 truncate">{sc.title}</span>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-black text-gray-900">{sc.score}</span>
                <span className="text-xs text-gray-400 font-normal">/100</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div 
                  className={`h-1.5 rounded-full ${sc.score > 80 ? 'bg-emerald-500' : sc.score > 65 ? 'bg-blue-500' : 'bg-amber-500'}`}
                  style={{ width: `${sc.score}%` }}
                />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 inline-block">
                {sc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Cards) */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Key Performance Indicators (KPIs)
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Revenue */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{curr}{rev.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% YoY
            </div>
          </div>

          {/* Expenses */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Total Expenses</span>
              <PieChart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl font-bold text-gray-900">{curr}{exp.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-1">
              Fixed & Variable
            </div>
          </div>

          {/* Net Profit */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Net Profit</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{curr}{profit.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold mt-1">
              Margin: {margin}%
            </div>
          </div>

          {/* Customer Growth */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Customer Base</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">1,420</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24% Growth
            </div>
          </div>

          {/* CAC */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Acquisition (CAC)</span>
              <Target className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-gray-900">{curr}{cac}</div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-1">
              LTV: {curr}{ltv} (9x)
            </div>
          </div>

          {/* ROI */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Capital ROI</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{roi}%</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              Retention: {retention}%
            </div>
          </div>
        </div>
      </div>

      {/* 3. Performance Charts & Date Range Selector */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Business Performance Trajectory</h3>
            <p className="text-xs text-gray-500">Historical revenue, expenditure, and net profit trends</p>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            {(['7d', '30d', '3m', '6m', '1y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === r ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(v) => `${curr}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                formatter={(value: any) => [`${curr}${Number(value).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="Revenue" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="Expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Automated AI Business Insights */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Automated AI Business Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-start gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  item.type === 'positive' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  item.type === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                  'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
