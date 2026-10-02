import React, { useState } from 'react';
import type { BusinessInput } from '../../types';
import { X, Sparkles, Building2, Lightbulb, DollarSign, CheckCircle2 } from 'lucide-react';

interface InputWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: BusinessInput) => void;
  initialData: BusinessInput;
}

export const InputWizardModal: React.FC<InputWizardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<BusinessInput>({ ...initialData });

  if (!isOpen) return null;

  const handleChange = (field: keyof BusinessInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F8FAFC] backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 border border-indigo-700/50 text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Business Analysis Intake Wizard</h2>
              <p className="text-xs text-gray-500">Enter your business parameters for deep AI evaluation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          {/* Mode Selector */}
          <div className="flex items-center gap-4 p-1 rounded-2xl bg-[#F8FAFC] border border-gray-200">
            <button
              type="button"
              onClick={() => handleChange('isExisting', false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                !formData.isExisting
                  ? 'bg-blue-600 text-gray-900 shadow-sm shadow-blue-600/20'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Lightbulb className="w-4 h-4" /> New Business Idea
            </button>
            <button
              type="button"
              onClick={() => handleChange('isExisting', true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                formData.isExisting
                  ? 'bg-blue-600 text-gray-900 shadow-sm shadow-blue-600/20'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Building2 className="w-4 h-4" /> Existing Business
            </button>
          </div>

          {/* Business Name & Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Business Name / Idea Title</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="e.g. Apex Solar, Artisanal Bakery..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Industry Sector</label>
              <input
                type="text"
                required
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                placeholder="e.g. CleanTech, E-Commerce, SaaS, Retail..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>
          </div>

          {/* Location & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Location / Target Region</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. Austin TX, Mumbai, Global Remote..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Target Customer Base</label>
              <input
                type="text"
                value={formData.targetCustomers}
                onChange={(e) => handleChange('targetCustomers', e.target.value)}
                placeholder="e.g. SMB Marketing Agencies, Local Homeowners..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>
          </div>

          {/* Products/Services */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Products or Services Offered</label>
            <textarea
              rows={2}
              value={formData.productsServices}
              onChange={(e) => handleChange('productsServices', e.target.value)}
              placeholder="Describe what you sell or plan to launch..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
            />
          </div>

          {/* Investment Budget & Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 flex items-center justify-between mb-1.5">
                <span>Investment / Budget</span>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="bg-gray-50 text-[11px] text-blue-600 font-bold px-1.5 py-0.5 rounded border border-gray-300"
                >
                  <option value="$">USD ($)</option>
                  <option value="₹">INR (₹)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                </select>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={formData.investmentBudget}
                  onChange={(e) => handleChange('investmentBudget', Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Annual Revenue</label>
              <input
                type="number"
                value={formData.currentRevenue}
                onChange={(e) => handleChange('currentRevenue', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Annual Expenses</label>
              <input
                type="number"
                value={formData.currentExpenses}
                onChange={(e) => handleChange('currentExpenses', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>
          </div>

          {/* Competitors & Growth Target */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Known Competitors (comma separated)</label>
              <input
                type="text"
                value={formData.competitors}
                onChange={(e) => handleChange('competitors', e.target.value)}
                placeholder="e.g. Competitor A, Competitor B..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Expected Annual Growth Target (%)</label>
              <input
                type="number"
                value={formData.expectedGrowth}
                onChange={(e) => handleChange('expectedGrowth', Number(e.target.value))}
                placeholder="50"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>
          </div>

          {/* Goals & Current Problems */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Primary Business Goals</label>
              <textarea
                rows={2}
                value={formData.businessGoals}
                onChange={(e) => handleChange('businessGoals', e.target.value)}
                placeholder="e.g. Reach $1M ARR, Expand into 2nd location..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Current Business Problems / Risks</label>
              <textarea
                rows={2}
                value={formData.currentProblems}
                onChange={(e) => handleChange('currentProblems', e.target.value)}
                placeholder="e.g. High customer acquisition costs, rising supply chain prices..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Run AI Business Analysis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
