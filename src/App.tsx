import { useState, useMemo, useEffect } from 'react';
import type { BusinessInput, RabbitState, AIAnalysisReport, User } from './types';
import { PRESET_BUSINESSES } from './services/presetData';
import { runBusinessAnalysis, runBusinessAnalysisAsync } from './services/analysisEngine';
import { getCurrentUser, logout } from './services/authService';
import { RabbitCanvas } from './components/rabbit/RabbitCanvas';
import { RabbitControls } from './components/rabbit/RabbitControls';

// Auth Components
import { AuthPage } from './components/auth/AuthPage';

// Idea Validation Components
import { ValidationLandingScreen } from './components/validation/ValidationLandingScreen';
import { ValidationAnimationModal } from './components/validation/ValidationAnimationModal';
import { ValidationResultsDashboard } from './components/validation/ValidationResultsDashboard';

// Sub-Dashboard Components
import { BusinessOverviewDashboard } from './components/dashboard/BusinessOverviewDashboard';
import { MarketIntelligenceDashboard } from './components/dashboard/MarketIntelligenceDashboard';
import { FinancialPlanningDashboard } from './components/dashboard/FinancialPlanningDashboard';
import { CustomerAnalyticsDashboard } from './components/dashboard/CustomerAnalyticsDashboard';
import { CompetitorMatrix } from './components/dashboard/CompetitorMatrix';
import { RiskAssessment } from './components/dashboard/RiskAssessment';
import { ExplainableAIDashboard } from './components/dashboard/ExplainableAIDashboard';
import { RecommendationsCenterDashboard } from './components/dashboard/RecommendationsCenterDashboard';
import { ImplementationPlanDashboard } from './components/dashboard/ImplementationPlanDashboard';
import { WhatIfAnalysisDashboard } from './components/dashboard/WhatIfAnalysisDashboard';
import { ReportGenerationDashboard } from './components/dashboard/ReportGenerationDashboard';
import { InputWizardModal } from './components/dashboard/InputWizardModal';
import { AIChatWindow } from './components/chat/AIChatWindow';
import { NLPUnderstandingPanel } from './components/dashboard/NLPUnderstandingPanel';

import {
  Sparkles,
  Building2,
  PlusCircle,
  LayoutDashboard,
  Brain,
  Swords,
  ShieldAlert,
  Bot,
  Activity,
  Settings,
  Users,
  Sliders,
  FileText,
  ListTodo,
  PieChart,
  CheckCircle2,
  Lightbulb,
  LogOut
} from 'lucide-react';

export function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('ai_saas');
  const [businessInput, setBusinessInput] = useState<BusinessInput>(PRESET_BUSINESSES['ai_saas']);
  const [rabbitState, setRabbitState] = useState<RabbitState>('idle');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  // Workflow states
  const [hasValidated, setHasValidated] = useState<boolean>(false);
  const [isAnimatingValidation, setIsAnimatingValidation] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<
    'validation' | 'overview' | 'market' | 'financials' | 'customer' | 'competitors' | 'risk' |
    'deeplearning' | 'recommendations' | 'implementation' | 'whatif' | 'reports' | 'nlp'
  >('validation');

  const [highlightCardId, setHighlightCardId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Check for existing session on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const baseReport: AIAnalysisReport = useMemo(() => {
    return runBusinessAnalysis(businessInput);
  }, [businessInput]);

  const [enrichedReport, setEnrichedReport] = useState<AIAnalysisReport>(baseReport);

  useEffect(() => {
    setEnrichedReport(baseReport);
    let cancelled = false;
    runBusinessAnalysisAsync(businessInput).then((asyncReport) => {
      if (!cancelled) setEnrichedReport(asyncReport);
    });
    return () => { cancelled = true; };
  }, [businessInput]);

  const handleStartValidation = (inputToValidate: BusinessInput) => {
    setBusinessInput(inputToValidate);
    setIsAnimatingValidation(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimatingValidation(false);
    setHasValidated(true);
    setActiveTab('validation');
    setRabbitState('happy');
  };

  const handlePresetSelect = (key: string) => {
    setSelectedPresetKey(key);
    if (PRESET_BUSINESSES[key]) {
      const preset = PRESET_BUSINESSES[key];
      setBusinessInput(preset);
      handleStartValidation(preset);
    }
  };

  const handleCustomSubmit = (newInput: BusinessInput) => {
    setBusinessInput(newInput);
    setSelectedPresetKey('custom');
    handleStartValidation(newInput);
  };

  const handleUpdateBudget = (updated: Partial<BusinessInput>) => {
    const updatedInput = { ...businessInput, ...updated };
    setBusinessInput(updatedInput);
    handleStartValidation(updatedInput);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  // Auth gate - show AuthPage if no user is logged in
  if (!currentUser) {
    return <AuthPage onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  const navItems = [
    { id: 'validation', label: 'Idea Validation Results', icon: CheckCircle2 },
    { id: 'overview', label: 'Business Overview', icon: LayoutDashboard },
    { id: 'market', label: 'Market Intelligence', icon: Activity },
    { id: 'financials', label: 'Financial & Budgeting', icon: PieChart },
    { id: 'customer', label: 'Customer Analytics', icon: Users },
    { id: 'competitors', label: 'Competitor Analysis', icon: Swords },
    { id: 'risk', label: 'Risk Analysis', icon: ShieldAlert },
    { id: 'deeplearning', label: 'AI Predictions & ML', icon: Brain },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
    { id: 'implementation', label: 'Implementation Plan', icon: ListTodo },
    { id: 'whatif', label: 'What-If Analysis', icon: Sliders },
    { id: 'reports', label: 'Executive Reports', icon: FileText },
    { id: 'nlp', label: 'AI Assistant', icon: Bot }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed inset-y-0 left-0 z-50">
        <div 
          onClick={() => { setHasValidated(false); setActiveTab('validation'); }}
          className="h-16 flex items-center px-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3 shadow-sm shadow-blue-600/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-lg font-bold text-gray-900 block leading-none">Millennium<span className="text-blue-600">IQ</span></span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Idea Validator AI</span>
          </div>
        </div>
        
        {/* User Info */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">
                {currentUser.isGuest ? 'G' : currentUser.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {currentUser.fullName}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {currentUser.isGuest ? 'Guest Account' : currentUser.email}
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-none">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Business Intelligence</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!hasValidated && item.id !== 'validation') {
                    handleStartValidation(businessInput);
                  }
                  setActiveTab(item.id as any);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
            <button 
              onClick={() => { setHasValidated(false); setActiveTab('validation'); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Lightbulb className="w-4 h-4 text-blue-600" />
              New Idea Validation
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
              <Settings className="w-4 h-4 text-gray-400" />
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Navigation Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 print:hidden">
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
               <Sparkles className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-gray-900">MillenniumIQ</span>
          </div>
          
          <div className="hidden lg:flex items-center text-base font-bold text-gray-900 gap-2">
            <span>{navItems.find(n => n.id === activeTab)?.label || 'Idea Validation'}</span>
            {hasValidated && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Validated
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
              <Building2 className="w-4 h-4 text-blue-600" />
              <select
                value={selectedPresetKey}
                onChange={(e) => handlePresetSelect(e.target.value)}
                className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer w-40 truncate"
              >
                <option value="ai_saas">NovaScribe AI (SaaS)</option>
                <option value="artisan_coffee">Bean & Bloom (Café)</option>
                <option value="ecosolar">SolarPulse (CleanTech)</option>
                <option value="aurafit">AuraFit (Activewear)</option>
                <option value="microlend">KisaanCredit (FinTech)</option>
                <option value="custom" disabled>Custom Concept</option>
              </select>
            </div>
            
            <button
              onClick={() => { setHasValidated(false); setActiveTab('validation'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Validate New Idea</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Animated Validation Journey Modal */}
          {isAnimatingValidation && (
            <ValidationAnimationModal
              input={businessInput}
              onComplete={handleAnimationComplete}
            />
          )}

          {/* Workflow View Logic */}
          {!hasValidated && activeTab === 'validation' ? (
            <ValidationLandingScreen
              onValidate={handleStartValidation}
              presetInput={businessInput}
            />
          ) : (
            <div className="space-y-8">
              {activeTab === 'validation' && (
                <ValidationResultsDashboard 
                  report={enrichedReport} 
                  input={businessInput}
                  onReValidate={handleStartValidation}
                />
              )}

              {activeTab === 'overview' && (
                <BusinessOverviewDashboard report={enrichedReport} input={businessInput} highlightCardId={highlightCardId} />
              )}

              {activeTab === 'market' && (
                <MarketIntelligenceDashboard report={enrichedReport} input={businessInput} />
              )}

              {activeTab === 'financials' && (
                <FinancialPlanningDashboard report={enrichedReport} input={businessInput} onUpdateBudget={handleUpdateBudget} />
              )}

              {activeTab === 'customer' && (
                <CustomerAnalyticsDashboard report={enrichedReport} input={businessInput} />
              )}

              {activeTab === 'competitors' && (
                <CompetitorMatrix competitors={enrichedReport.competitors} businessName={businessInput.businessName} />
              )}

              {activeTab === 'risk' && (
                <RiskAssessment risks={enrichedReport.risks} />
              )}

              {activeTab === 'deeplearning' && (
                <ExplainableAIDashboard input={businessInput} report={enrichedReport} isHighlighted={highlightCardId === 'explainable-ai-card'} />
              )}

              {activeTab === 'recommendations' && (
                <RecommendationsCenterDashboard report={enrichedReport} input={businessInput} />
              )}

              {activeTab === 'implementation' && (
                <ImplementationPlanDashboard report={enrichedReport} input={businessInput} />
              )}

              {activeTab === 'whatif' && (
                <WhatIfAnalysisDashboard report={enrichedReport} input={businessInput} />
              )}

              {activeTab === 'reports' && (
                <ReportGenerationDashboard report={enrichedReport} input={businessInput} />
              )}

              {activeTab === 'nlp' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                      <RabbitCanvas
                        state={rabbitState}
                        isSpeaking={isSpeaking}
                        onStateChange={setRabbitState}
                        width={220}
                        height={240}
                      />
                      <div className="mt-4 w-full">
                        <RabbitControls
                          currentState={rabbitState}
                          onStateChange={setRabbitState}
                          isVoiceMuted={isVoiceMuted}
                          onToggleVoice={() => setIsVoiceMuted(!isVoiceMuted)}
                        />
                      </div>
                    </div>
                    <NLPUnderstandingPanel input={businessInput} isHighlighted={highlightCardId === 'nlp-understanding-card'} />
                  </div>
                  <div className="lg:col-span-8">
                    <AIChatWindow
                      businessData={businessInput}
                      onStateChange={setRabbitState}
                      onHighlightCard={setHighlightCardId}
                      onSpeechSpeakingChange={setIsSpeaking}
                      isVoiceMuted={isVoiceMuted}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <InputWizardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCustomSubmit}
        initialData={businessInput}
      />
    </div>
  );
}

export default App;
