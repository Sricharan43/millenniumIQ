import React from 'react';
import type { CompetitorItem } from '../../types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ShieldAlert, Crosshair, Swords } from 'lucide-react';

interface CompetitorMatrixProps {
  competitors: CompetitorItem[];
  businessName: string;
  isHighlighted?: boolean;
}

export const CompetitorMatrix: React.FC<CompetitorMatrixProps> = ({
  competitors,
  businessName,
  isHighlighted = false
}) => {
  // Radar data benchmark comparison
  const radarData = [
    { metric: 'Speed to Market', [businessName]: 92, CompetitorsAvg: 60 },
    { metric: 'Pricing Flexibility', [businessName]: 88, CompetitorsAvg: 68 },
    { metric: 'Tech & Automation', [businessName]: 95, CompetitorsAvg: 62 },
    { metric: 'Customer Support', [businessName]: 90, CompetitorsAvg: 70 },
    { metric: 'Brand Legacy', [businessName]: 65, CompetitorsAvg: 85 },
    { metric: 'Scalability', [businessName]: 94, CompetitorsAvg: 72 }
  ];

  return (
    <div
      id="competitor-radar-card"
      className={`p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm transition-all duration-500 ${
        isHighlighted ? 'ring-4 ring-sky-400 scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 rounded-xl bg-sky-950 border border-sky-700/50 text-sky-400">
          <Swords className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Competitor Benchmarking & Intelligence</h3>
          <p className="text-xs text-gray-500">
            Comparative analysis of market rivals and tactical counter-positioning
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Radar Chart */}
        <div className="h-[280px] w-full flex items-center justify-center p-2 rounded-xl bg-[#F8FAFC] border border-gray-200">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" stroke="#CBD5E1" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748B" />
              <Radar
                name={businessName}
                dataKey={businessName}
                stroke="#0EA5E9"
                fill="#0EA5E9"
                fillOpacity={0.45}
              />
              <Radar
                name="Rival Industry Avg"
                dataKey="CompetitorsAvg"
                stroke="#F43F5E"
                fill="#F43F5E"
                fillOpacity={0.25}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '10px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Competitor Cards */}
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
          {competitors.map((comp, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#F8FAFC] border border-gray-200 hover:border-sky-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-bold text-gray-900">{comp.name}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    comp.threatLevel === 'High'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}
                >
                  {comp.threatLevel} Threat ({comp.marketShare}% Share)
                </span>
              </div>

              <div className="mt-2 text-xs text-gray-700 space-y-1">
                <div>
                  <span className="font-semibold text-emerald-600">Strengths: </span>
                  {comp.strengths.join(', ')}
                </div>
                <div>
                  <span className="font-semibold text-rose-600">Weaknesses: </span>
                  {comp.weaknesses.join(', ')}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-gray-200 text-[11px] text-sky-300 flex items-start gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-400" />
                <span>
                  <strong className="text-gray-900">Counter Strategy: </strong>
                  {comp.counterStrategy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
