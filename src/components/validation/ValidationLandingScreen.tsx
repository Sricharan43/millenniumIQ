import React, { useState } from 'react';
import type { BusinessInput } from '../../types';
import { Sparkles, MapPin, IndianRupee, Lightbulb, ArrowRight, ShieldCheck, TrendingUp, Building2 } from 'lucide-react';

interface Props {
  onValidate: (input: BusinessInput) => void;
  presetInput: BusinessInput;
}

export const ValidationLandingScreen: React.FC<Props> = ({ onValidate, presetInput }) => {
  const [idea, setIdea] = useState<string>(presetInput.businessName || 'Cloud Kitchen');
  const [budget, setBudget] = useState<number>(presetInput.investmentBudget || 1000000);
  const [location, setLocation] = useState<string>(presetInput.location || 'Hyderabad, Telangana');
  const [industry, setIndustry] = useState<string>(presetInput.industry || 'Food & Beverage / Cloud Kitchen');
  const [targetCustomers, setTargetCustomers] = useState<string>(presetInput.targetCustomers || 'Working professionals, students, food delivery users');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: BusinessInput = {
      ...presetInput,
      businessName: idea,
      industry: industry,
      category: industry,
      location: location,
      investmentBudget: budget,
      currency: '₹',
      targetCustomers: targetCustomers,
      productsServices: idea,
      currentRevenue: 0,
      currentExpenses: 0,
      isExisting: false
    };
    onValidate(input);
  };

  const sampleIdeas = [
    { title: 'Cloud Kitchen', budget: 1000000, loc: 'Hyderabad, Telangana', ind: 'Food & Beverage' },
    { title: 'B2B SaaS AI Platform', budget: 1500000, loc: 'Bangalore, Karnataka', ind: 'Technology & Software' },
    { title: 'Specialty Coffee Café', budget: 850000, loc: 'Koramangala, Bangalore', ind: 'Retail & Hospitality' },
    { title: 'Rooftop Solar Installation', budget: 2500000, loc: 'Pune, Maharashtra', ind: 'CleanTech' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      {/* Hero Banner Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          AI-Powered Business Idea Validation Engine
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight max-w-3xl mx-auto">
          Validate Your Business Idea <span className="text-blue-600">Before You Invest.</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          MillenniumIQ analyzes your business idea, budget, location, local competition, market demand, costs, and profit potential to help you make a smarter business decision.
        </p>
      </div>

      {/* Main Validation Intake Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input 1: Business Idea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                Business Idea / Concept
              </label>
              <input
                type="text"
                required
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. Cloud Kitchen, Organic Cafe..."
                className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <span className="text-[11px] text-gray-400 block">What product or service do you want to launch?</span>
            </div>

            {/* Input 2: Investment Budget */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                Available Investment (₹)
              </label>
              <input
                type="number"
                required
                min="10000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                placeholder="1000000"
                className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-gray-200 text-sm font-bold text-emerald-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <span className="text-[11px] text-gray-400 block">Total capital you plan to invest</span>
            </div>

            {/* Input 3: Target Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                Target Location / City
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hyderabad, Telangana"
                className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <span className="text-[11px] text-gray-400 block">City or commercial area for analysis</span>
            </div>
          </div>

          {/* Optional Advanced Fields */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Industry Sector</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Target Customer Segment</label>
                <input
                  type="text"
                  value={targetCustomers}
                  onChange={(e) => setTargetCustomers(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-xs font-semibold"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-bold text-gray-500 hover:text-gray-900"
            >
              {showAdvanced ? 'Hide Optional Parameters -' : '+ Add Optional Parameters (Category, Target Customers)'}
            </button>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-wide shadow-sm shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>VALIDATE MY IDEA WITH AI</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>

      {/* Preset Quick Starters */}
      <div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3 text-center">Or Try A Pre-Loaded Business Concept:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleIdeas.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setIdea(item.title);
                setBudget(item.budget);
                setLocation(item.loc);
                setIndustry(item.ind);
              }}
              className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                <span>{item.title}</span>
                <span className="text-emerald-600">₹{(item.budget / 100000).toFixed(1)} Lakhs</span>
              </div>
              <span className="text-[11px] text-gray-500 block truncate">{item.loc}</span>
              <span className="text-[10px] text-blue-600 font-semibold inline-block px-2 py-0.5 rounded-full bg-blue-50">
                Click to load
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Value Proposition Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-200">
          <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-gray-900">Market Demand Analysis</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Scans demand signals, customer purchasing power, and local search trends.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-200">
          <TrendingUp className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-gray-900">Profit & Break-even Predictor</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Calculates monthly operating costs, net margins, and break-even timeline.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-200">
          <Building2 className="w-6 h-6 text-purple-600 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-gray-900">Complete Business Plan</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Generates a 14-point execution plan and multi-phase launch roadmap.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
