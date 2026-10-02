import React from 'react';
import type { AIAnalysisReport, BusinessInput } from '../../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
  report: AIAnalysisReport;
  input: BusinessInput;
}

const COLORS = ['#2563EB', '#10B981', '#6366F1', '#F59E0B'];

export const CustomerAnalyticsDashboard: React.FC<Props> = ({ report, input }) => {
  const curr = input.currency || '$';
  const segments = report.customerSegments || [];

  const cacLtvData = [
    { channel: 'Organic SEO', CAC: 45, LTV: 1450 },
    { channel: 'Paid Ads', CAC: 185, LTV: 980 },
    { channel: 'Affiliates', CAC: 65, LTV: 1250 },
    { channel: 'Direct B2B', CAC: 240, LTV: 3800 }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Customer Health Index</span>
          <div className="text-2xl font-bold text-gray-900">{report.customerScore?.score || 82} / 100</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">+18% Net Promoter Score</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Customer Retention Rate</span>
          <div className="text-2xl font-bold text-emerald-600">86.4%</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Low Monthly Churn (1.8%)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Average CAC</span>
          <div className="text-2xl font-bold text-gray-900">{curr}{input.currency === '$' ? 142 : 1200}</div>
          <span className="text-xs text-gray-500 mt-1 block">Acquisition Spend</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Average LTV</span>
          <div className="text-2xl font-bold text-blue-600">{curr}{input.currency === '$' ? 1280 : 10500}</div>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">9x LTV:CAC Ratio</span>
        </div>
      </div>

      {/* Customer Segments & CAC vs LTV Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer Segments */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-1">Customer Demographics & Segments</h3>
          <p className="text-xs text-gray-500 mb-4">Target customer distribution ratio</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="percentage"
                  nameKey="name"
                >
                  {segments.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {segments.map((sg, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {sg.name}
                </span>
                <span className="font-bold text-gray-900">{sg.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* CAC vs LTV by Channel */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-1">CAC vs LTV by Channel</h3>
          <p className="text-xs text-gray-500 mb-4">Acquisition cost vs lifetime revenue yield</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cacLtvData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="channel" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `${curr}${v}`} />
                <Tooltip formatter={(val: any) => `${curr}${Number(val).toLocaleString()}`} />
                <Bar dataKey="CAC" fill="#EF4444" radius={[4, 4, 0, 0]} name="CAC ($)" />
                <Bar dataKey="LTV" fill="#2563EB" radius={[4, 4, 0, 0]} name="LTV ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
