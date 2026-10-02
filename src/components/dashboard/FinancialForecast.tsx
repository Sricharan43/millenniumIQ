import React, { useState } from 'react';
import type { FinancialForecastItem } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Sliders, TrendingUp, Zap } from 'lucide-react';

interface FinancialForecastProps {
  data: FinancialForecastItem[];
  currencySymbol?: string;
  isHighlighted?: boolean;
}

export const FinancialForecast: React.FC<FinancialForecastProps> = ({
  data,
  currencySymbol = '$',
  isHighlighted = false
}) => {
  const [growthBoost, setGrowthBoost] = useState<number>(0); // -20% to +50%
  const [costSavings, setCostSavings] = useState<number>(0); // 0% to 30%

  // Compute live adjusted forecast based on sliders
  const adjustedData = data.map((item) => {
    const revBoost = 1 + growthBoost / 100;
    const expReduction = 1 - costSavings / 100;
    const adjRev = Math.round(item.revenue * revBoost);
    const adjExp = Math.round(item.expenses * expReduction);
    const adjProfit = adjRev - adjExp;

    return {
      ...item,
      Revenue: adjRev,
      Expenses: adjExp,
      NetProfit: adjProfit,
      CashFlow: Math.round(adjProfit * 0.88)
    };
  });

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(0)}k`;
    return `${currencySymbol}${val}`;
  };

  const finalYearProfit = adjustedData[adjustedData.length - 1].NetProfit;

  return (
    <div
      id="financial-forecast-card"
      className={`p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm transition-all duration-500 ${
        isHighlighted ? 'ring-4 ring-indigo-400 scale-[1.01]' : ''
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 border border-indigo-700/50 text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                5-Year Financial Forecast & Cash Flow Trajectory
              </h3>
              <p className="text-xs text-gray-500">
                Predictive analytics model with real-time scenario simulation
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#F8FAFC] p-2.5 rounded-xl border border-gray-200">
          <div className="text-right">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Year 5 Profit Target</span>
            <div className="text-lg font-black text-emerald-600">
              {formatCurrency(finalYearProfit)}
            </div>
          </div>
          <Zap className="w-5 h-5 text-emerald-600 animate-pulse" />
        </div>
      </div>

      {/* Interactive Scenario Controls */}
      <div className="my-4 p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Revenue Growth Modifier:
            </span>
            <span className="font-bold text-amber-600">
              {growthBoost >= 0 ? `+${growthBoost}%` : `${growthBoost}%`}
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="60"
            value={growthBoost}
            onChange={(e) => setGrowthBoost(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-50 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" /> Operational Cost Cut (Efficiency):
            </span>
            <span className="font-bold text-emerald-600">-{costSavings}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={costSavings}
            onChange={(e) => setCostSavings(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-50 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={adjustedData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="year" stroke="#94A3B8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94A3B8" tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), '']}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#F8FAFC'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Area
              type="monotone"
              dataKey="Revenue"
              stroke="#6366F1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRev)"
            />
            <Area
              type="monotone"
              dataKey="NetProfit"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProfit)"
            />
            <Area
              type="monotone"
              dataKey="Expenses"
              stroke="#F43F5E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
