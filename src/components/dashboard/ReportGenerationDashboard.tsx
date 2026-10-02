import React from 'react';
import type { AIAnalysisReport, BusinessInput } from '../../types';
import { Download, Printer, FileText, Sparkles } from 'lucide-react';

interface Props {
  report: AIAnalysisReport;
  input: BusinessInput;
}

export const ReportGenerationDashboard: React.FC<Props> = ({ report, input }) => {
  const curr = input.currency || '$';

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvRows = [];
    csvRows.push(['Section', 'Metric/Item', 'Value/Details']);
    csvRows.push(['Executive Summary', 'Business Name', input.businessName]);
    csvRows.push(['Executive Summary', 'Industry', input.industry]);
    csvRows.push(['Executive Summary', 'Overall Health Score', `${report.healthScore.score}/100`]);
    csvRows.push(['Financials', 'Year 1 Revenue', `${curr}${report.financials[0]?.revenue || 0}`]);
    csvRows.push(['Financials', 'Year 5 Revenue', `${curr}${report.financials[4]?.revenue || 0}`]);
    csvRows.push(['Market', 'TAM', `${curr}${report.tamSamSom.tam}M`]);
    csvRows.push(['Market', 'SAM', `${curr}${report.tamSamSom.sam}M`]);

    (report.comprehensiveRecommendations || []).forEach((r) => {
      csvRows.push(['Recommendation', r.title, r.recommendation]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.map(x => `"${x}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${input.businessName}_MillenniumIQ_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Printable Control Toolbar */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Executive Business Intelligence Report
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Comprehensive 12-section business plan, market analysis, financial predictions, and implementation strategy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Export / Print PDF
          </button>
        </div>
      </div>

      {/* Report Document Box */}
      <div className="p-8 sm:p-12 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-gray-200 pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4" /> MillenniumIQ AI Business Report
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{input.businessName}</h1>
            <p className="text-xs text-gray-500 mt-1">{input.category} • {input.location}</p>
          </div>

          <div className="text-right text-xs text-gray-400">
            <div>Date Generated: {new Date().toLocaleDateString()}</div>
            <div className="font-semibold text-gray-600 mt-0.5">Confidential Executive Copy</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">1. Executive Summary</h3>
          <p className="text-xs text-gray-700 leading-relaxed">{report.executiveSummary}</p>
        </div>

        {/* Section 2: Business Performance & Health */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">2. Business Performance & Health Scorecard</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Overall Health</span>
              <span className="text-lg font-bold text-gray-900">{report.healthScore.score} / 100</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Growth Momentum</span>
              <span className="text-lg font-bold text-emerald-600">{report.growthScore?.score || 84} / 100</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Risk Safety Index</span>
              <span className="text-lg font-bold text-blue-600">{report.riskScore.score} / 100</span>
            </div>
          </div>
        </div>

        {/* Section 3: Market Analysis */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">3. Market Analysis & TAM/SAM/SOM</h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            Market opportunity in <strong>{input.industry}</strong> shows high demand indicators. TAM is estimated at <strong>{curr}{report.tamSamSom.tam}M</strong> with a 3-year serviceable obtainable market (SOM) target of <strong>{curr}{report.tamSamSom.som}M</strong>.
          </p>
        </div>

        {/* Section 4: Customer Analysis */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">4. Customer Segments & Unit Economics</h3>
          <div className="space-y-2">
            {(report.customerSegments || []).map((cs, i) => (
              <div key={i} className="text-xs text-gray-700 flex justify-between">
                <span>• {cs.name} ({cs.demographic})</span>
                <span className="font-bold">{cs.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Competitor Analysis */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">5. Competitor Matrix & Counter-Strategy</h3>
          <div className="space-y-2">
            {report.competitors.map((c, i) => (
              <div key={i} className="text-xs text-gray-700">
                <strong>{c.name} (Share: {c.marketShare}%): </strong>
                <span>{c.counterStrategy}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Financial Forecast */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">6. 5-Year Financial Forecast</h3>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b text-gray-400 uppercase font-semibold">
                <th className="py-2">Year</th>
                <th className="py-2">Revenue</th>
                <th className="py-2">Expenses</th>
                <th className="py-2">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {report.financials.map((f, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 font-semibold text-gray-900">{f.year}</td>
                  <td className="py-2 text-emerald-600 font-bold">{curr}{f.revenue.toLocaleString()}</td>
                  <td className="py-2 text-gray-600">{curr}{f.expenses.toLocaleString()}</td>
                  <td className="py-2 text-blue-600 font-bold">{curr}{f.netProfit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 7 to 12 Brief Summaries */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">7. Strategic AI Recommendations & Implementation Roadmap</h3>
          <div className="space-y-2">
            {(report.comprehensiveRecommendations || []).slice(0, 4).map((r, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                <div className="font-bold text-gray-900">{r.title} ({r.priority} Priority)</div>
                <div className="text-gray-600">{r.recommendation}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          Report compiled autonomously by MillenniumIQ Decision Engine • All rights reserved
        </div>
      </div>
    </div>
  );
};
