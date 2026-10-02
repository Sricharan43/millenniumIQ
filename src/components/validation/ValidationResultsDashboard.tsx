import React, { useState } from 'react';
import type { AIAnalysisReport, BusinessInput } from '../../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MapPin, 
  IndianRupee, 
  TrendingUp, 
  Award, 
  Sparkles, 
  FileText, 
  RefreshCw,
  ChevronDown,
  ChevronUp
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
  onReValidate: (updatedInput: BusinessInput) => void;
}

export const ValidationResultsDashboard: React.FC<Props> = ({ report, input, onReValidate }) => {
  const curr = input.currency || '₹';
  const val = report.validationResult || {
    validationScore: 78,
    verdict: 'RECOMMENDED',
    verdictColor: 'emerald',
    verdictReason: 'Strong market demand and adequate budget buffer.',
    profitabilityStatus: 'PROFIT POTENTIAL',
    estimatedMonthlyRevenue: 350000,
    estimatedMonthlyExpenses: 260000,
    estimatedMonthlyProfit: 90000,
    profitMarginPercentage: 25.7,
    breakEvenMonths: 11,
    locationValidation: {
      score: 84,
      demandLevel: 'High Demand',
      competitorDensity: 'Moderate',
      customerAvailability: 'Strong',
      whyReasons: ['High target customer density', 'Growing purchasing power'],
      locationRisks: ['Rental cost spikes']
    },
    budgetValidation: {
      userBudget: input.investmentBudget || 1000000,
      requiredStartupInvestment: 850000,
      remainingBuffer: 150000,
      budgetSufficiencyScore: 92,
      sufficiencyStatus: 'SUFFICIENT',
      breakdown: [
        { category: 'Equipment & Setup', amount: 250000, percentage: 30 },
        { category: 'Rent & Deposit', amount: 150000, percentage: 18 },
        { category: 'Marketing', amount: 100000, percentage: 12 },
        { category: 'Employee Salaries', amount: 150000, percentage: 18 },
        { category: 'Working Capital', amount: 100000, percentage: 12 },
        { category: 'Reserve', amount: 100000, percentage: 10 }
      ]
    },
    marketValidationScores: {
      marketDemandPct: 82,
      competitionPct: 60,
      growthPotentialPct: 78,
      customerOpportunityPct: 81,
      locationSuitabilityPct: 88,
      riskPct: 40
    },
    businessPlan: {
      overview: 'Strategic Cloud Kitchen model in Hyderabad.',
      targetCustomers: 'Working professionals & students.',
      marketOpportunity: 'High food delivery adoption rate.',
      competitivePosition: 'Hyper-local fresh positioning.',
      pricingStrategy: 'Tiered combo pricing.',
      startupBudget: '₹8,50,000 required startup investment.',
      monthlyOperatingBudget: '₹2,60,000 monthly burn.',
      revenueStrategy: '₹3,50,000 target monthly revenue.',
      marketingStrategy: 'Digital micro-influencer campaigns.',
      salesStrategy: 'Multi-platform online ordering integration.',
      riskManagement: 'Maintain ₹1.5 Lakh emergency liquidity reserve.',
      growthStrategy: 'Expand into 2nd location in Year 2.',
      implementationRoadmap: '8-Phase execution roadmap.',
      expectedFinancialOutcome: 'Break-even achieved in Month 11 with 25.7% margin.'
    },
    optimizationSuggestions: [
      {
        title: 'Lease Equipment to Reduce Startup Cost',
        action: 'Lease kitchen equipment instead of upfront purchase.',
        impact: 'Saves ₹1.5 Lakhs in initial capital investment.',
        revisedBudget: Math.round((input.investmentBudget || 1000000) * 0.8)
      }
    ]
  };

  const [expandedPlanSection, setExpandedPlanSection] = useState<boolean>(true);

  const forecastData = [
    { month: 'M1', Revenue: Math.round(val.estimatedMonthlyRevenue * 0.4), Expenses: val.estimatedMonthlyExpenses, NetProfit: Math.round(val.estimatedMonthlyRevenue * 0.4 - val.estimatedMonthlyExpenses) },
    { month: 'M3', Revenue: Math.round(val.estimatedMonthlyRevenue * 0.75), Expenses: Math.round(val.estimatedMonthlyExpenses * 0.95), NetProfit: Math.round(val.estimatedMonthlyRevenue * 0.75 - val.estimatedMonthlyExpenses * 0.95) },
    { month: 'M6', Revenue: val.estimatedMonthlyRevenue, Expenses: val.estimatedMonthlyExpenses, NetProfit: val.estimatedMonthlyProfit },
    { month: 'M9 (Break-even)', Revenue: Math.round(val.estimatedMonthlyRevenue * 1.2), Expenses: Math.round(val.estimatedMonthlyExpenses * 1.05), NetProfit: Math.round(val.estimatedMonthlyRevenue * 1.2 - val.estimatedMonthlyExpenses * 1.05) },
    { month: 'M12', Revenue: Math.round(val.estimatedMonthlyRevenue * 1.45), Expenses: Math.round(val.estimatedMonthlyExpenses * 1.1), NetProfit: Math.round(val.estimatedMonthlyRevenue * 1.45 - val.estimatedMonthlyExpenses * 1.1) },
  ];

  return (
    <div className="space-y-8">
      {/* 1. TOP VERDICT & SCORECARD BANNER */}
      <div className={`p-8 rounded-3xl border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
        val.verdict === 'RECOMMENDED' ? 'bg-emerald-50/70 border-emerald-200' :
        val.verdict === 'PROCEED WITH CAUTION' ? 'bg-amber-50/70 border-amber-200' :
        'bg-rose-50/70 border-rose-200'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${
              val.verdict === 'RECOMMENDED' ? 'bg-emerald-600 text-white' :
              val.verdict === 'PROCEED WITH CAUTION' ? 'bg-amber-500 text-white' :
              'bg-rose-600 text-white'
            }`}>
              {val.verdict === 'RECOMMENDED' && <CheckCircle2 className="w-4 h-4" />}
              {val.verdict === 'PROCEED WITH CAUTION' && <AlertTriangle className="w-4 h-4" />}
              {val.verdict === 'NOT RECOMMENDED AT CURRENT CONDITIONS' && <XCircle className="w-4 h-4" />}
              {val.verdict}
            </span>
            <span className="text-xs font-bold text-gray-500">• {input.location}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Idea Validation Score: <span className="text-blue-600">{val.validationScore} / 100</span>
          </h1>

          <p className="text-xs text-gray-700 max-w-3xl leading-relaxed">
            {val.verdictReason}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shrink-0 shadow-sm">
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Profitability Outlook</span>
            <div className={`text-xl font-black flex items-center justify-end gap-1 ${
              val.profitabilityStatus === 'PROFIT POTENTIAL' ? 'text-emerald-600' :
              val.profitabilityStatus === 'HIGH RISK' ? 'text-amber-600' : 'text-rose-600'
            }`}>
              <span>{val.profitabilityStatus}</span>
            </div>
            <span className="text-xs font-bold text-gray-600">Break-even in ~{val.breakEvenMonths} Months</span>
          </div>
          <div className={`w-12 h-12 rounded-xl font-bold flex items-center justify-center text-sm shadow-inner ${
            val.profitabilityStatus === 'PROFIT POTENTIAL' ? 'bg-emerald-100 text-emerald-700' :
            val.profitabilityStatus === 'HIGH RISK' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
          }`}>
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. PROFIT / LOSS OUTLOOK DETAILED SUMMARY */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Financial & Profitability Outlook
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block mb-1">Est. Monthly Revenue</span>
            <div className="text-xl font-bold text-gray-900">{curr}{val.estimatedMonthlyRevenue.toLocaleString()}</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block mb-1">Est. Monthly Expenses</span>
            <div className="text-xl font-bold text-gray-900">{curr}{val.estimatedMonthlyExpenses.toLocaleString()}</div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-700 block mb-1">Est. Monthly Profit</span>
            <div className="text-xl font-bold text-emerald-600">{curr}{val.estimatedMonthlyProfit.toLocaleString()}</div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <span className="text-xs font-semibold text-blue-700 block mb-1">Profit Margin %</span>
            <div className="text-xl font-bold text-blue-600">{val.profitMarginPercentage}%</div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 col-span-2 md:col-span-1">
            <span className="text-xs font-semibold text-purple-700 block mb-1">Break-Even Period</span>
            <div className="text-xl font-bold text-purple-600">{val.breakEvenMonths} Months</div>
          </div>
        </div>
      </div>

      {/* 3. LOCATION & BUDGET VALIDATION DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Validation */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              Location Validation ({input.location})
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Score: {val.locationValidation.score} / 100
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Demand</span>
              <span className="font-bold text-gray-800">{val.locationValidation.demandLevel}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Density</span>
              <span className="font-bold text-gray-800">{val.locationValidation.competitorDensity}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Customers</span>
              <span className="font-bold text-gray-800">{val.locationValidation.customerAvailability}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-gray-700 block">WHY THIS LOCATION?</span>
            {val.locationValidation.whyReasons.map((r, i) => (
              <div key={i} className="text-xs text-gray-600 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Sufficiency */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
              Budget Sufficiency Evaluation
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Score: {val.budgetValidation.budgetSufficiencyScore} / 100
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Your Budget</span>
              <span className="font-bold text-gray-900">{curr}{val.budgetValidation.userBudget.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Required Investment</span>
              <span className="font-bold text-blue-600">{curr}{val.budgetValidation.requiredStartupInvestment.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Buffer</span>
              <span className="font-bold text-emerald-600">{curr}{val.budgetValidation.remainingBuffer.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <span className="text-xs font-bold text-gray-700 block mb-2">Estimated Startup Cost Allocation:</span>
            {val.budgetValidation.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600">
                <span>• {b.category}</span>
                <span className="font-semibold">{curr}{b.amount.toLocaleString()} ({b.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. REVENUE & PROFIT FORECAST CHART */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900">12-Month Revenue & Profit Trajectory Forecast</h3>
        <p className="text-xs text-gray-500">Predicted monthly sales scaling vs operating burn</p>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorRevVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `${curr}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
              <Tooltip formatter={(val: any) => `${curr}${Number(val).toLocaleString()}`} />
              <Area type="monotone" dataKey="Revenue" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevVal)" name="Monthly Revenue" />
              <Area type="monotone" dataKey="Expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={0.05} name="Monthly Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. COMPLETE BUSINESS PLAN ACCORDION */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedPlanSection(!expandedPlanSection)}>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Generated 14-Point Executive Business Plan
          </h3>
          <button className="p-1 rounded-lg text-gray-400 hover:text-gray-900">
            {expandedPlanSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {expandedPlanSection && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="font-bold text-gray-900 block">1. Business Overview</span>
              <p className="text-gray-600 leading-relaxed">{val.businessPlan.overview}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="font-bold text-gray-900 block">2. Target Customers</span>
              <p className="text-gray-600 leading-relaxed">{val.businessPlan.targetCustomers}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="font-bold text-gray-900 block">3. Market Opportunity</span>
              <p className="text-gray-600 leading-relaxed">{val.businessPlan.marketOpportunity}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="font-bold text-gray-900 block">4. Competitive Position</span>
              <p className="text-gray-600 leading-relaxed">{val.businessPlan.competitivePosition}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="font-bold text-gray-900 block">5. Pricing Strategy</span>
              <p className="text-gray-600 leading-relaxed">{val.businessPlan.pricingStrategy}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="font-bold text-gray-900 block">6. Startup & Operating Budget</span>
              <p className="text-gray-600 leading-relaxed">{val.businessPlan.startupBudget}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="font-bold text-gray-900 block">7. Marketing & Acquisition</span>
              <p className="text-gray-600 leading-relaxed">{val.businessPlan.marketingStrategy}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="font-bold text-gray-900 block">8. Implementation & Timeline</span>
              <p className="text-gray-600 leading-relaxed">{val.businessPlan.implementationRoadmap}</p>
            </div>
          </div>
        )}
      </div>

      {/* 6. "IMPROVE MY IDEA" OPTIMIZER */}
      {val.optimizationSuggestions.length > 0 && (
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              "Improve My Idea" AI Strategy Optimizer
            </h3>
            <span className="text-xs font-semibold text-blue-700">1-Click Optimization</span>
          </div>

          <div className="space-y-3">
            {val.optimizationSuggestions.map((opt, i) => (
              <div key={i} className="p-4 bg-white rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-gray-900 block">{opt.title}</span>
                  <p className="text-gray-600">{opt.action}</p>
                  <span className="font-semibold text-emerald-600 block">{opt.impact}</span>
                </div>

                <button
                  onClick={() => {
                    onReValidate({
                      ...input,
                      investmentBudget: opt.revisedBudget
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-Validate with Revised Model
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
