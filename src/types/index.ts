export type RabbitState = 
  | 'idle' 
  | 'listening' 
  | 'thinking' 
  | 'analyzing' 
  | 'explaining' 
  | 'happy' 
  | 'excited' 
  | 'concerned' 
  | 'surprised' 
  | 'celebrating' 
  | 'detective' 
  | 'pointing'
  | 'researching'
  | 'calculating';

export interface BusinessInput {
  businessName: string;
  isExisting: boolean;
  industry: string;
  category: string;
  location: string;
  targetCustomers: string;
  productsServices: string;
  investmentBudget: number; // in INR ₹ or currency
  currency: string;
  currentRevenue: number;
  currentExpenses: number;
  competitors: string;
  businessGoals: string;
  currentProblems: string;
  expectedGrowth: number;
  expectedPrice?: number;
  businessExperience?: string;
  expectedMonthlySales?: number;
}

export interface MetricScore {
  score: number; // 0 - 100
  label: string;
  status: 'Critical' | 'Moderate' | 'Good' | 'Excellent';
  trend: 'up' | 'down' | 'stable';
  change: string;
  description: string;
}

export interface FinancialForecastItem {
  year: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  cashFlow: number;
}

export interface CompetitorItem {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  threatLevel: 'Low' | 'Medium' | 'High';
  counterStrategy: string;
}

export interface RiskItem {
  category: 'Financial' | 'Operational' | 'Market' | 'Customer' | 'Competitive';
  risk: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export interface OpportunityItem {
  title: string;
  category: string;
  potentialRevenueIncrease: string;
  effort: 'Low' | 'Medium' | 'High';
  timeframe: string;
  description: string;
}

export interface GrowthStrategyItem {
  phase: 'Month 1-3' | 'Month 3-6' | 'Year 1' | 'Year 2-3' | 'Year 4-5';
  title: string;
  category: string;
  actionItems: string[];
  expectedImpact: string;
  priority: 'High' | 'Medium' | 'Urgent';
}

export interface CustomerSegment {
  name: string;
  percentage: number;
  demographic: string;
  keyNeeds: string[];
}

export interface MarketTrendItem {
  trend: string;
  direction: 'Growing' | 'Stable' | 'Declining';
  indicator: '↑' | '→' | '↓';
  changePercentage: string;
  recommendation: string;
  whyReason: string;
  expectedBenefit: string;
  suggestedAction: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedTimeline: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface BudgetAllocation {
  category: string;
  currentAmount: number;
  recommendedAmount: number;
  percentage: number;
  recommendedPercentage: number;
  difference: number;
  reason: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedImpact: string;
}

export interface RoadmapTask {
  id: string;
  task: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
  budget: number;
  priority: 'High' | 'Medium' | 'Low';
  dependencies: string;
  expectedResult: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  objective: string;
  duration: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  tasks: RoadmapTask[];
}

export interface ComprehensiveRecommendation {
  id: string;
  title: string;
  category: 'MARKET' | 'FINANCE' | 'GROWTH' | 'RISK' | 'IMPLEMENTATION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  whyExplanation: string;
  supportingData: string;
  expectedImpact: string;
  estimatedCost: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  suggestedAction: string;
  timeframe: string;
}

// ── NEW IDEA VALIDATION CORE TYPES ──

export interface IdeaValidationResult {
  validationScore: number;
  verdict: 'RECOMMENDED' | 'PROCEED WITH CAUTION' | 'NOT RECOMMENDED AT CURRENT CONDITIONS';
  verdictColor: 'emerald' | 'amber' | 'rose';
  verdictReason: string;
  
  profitabilityStatus: 'PROFIT POTENTIAL' | 'HIGH RISK' | 'LOSS POTENTIAL';
  estimatedMonthlyRevenue: number;
  estimatedMonthlyExpenses: number;
  estimatedMonthlyProfit: number;
  profitMarginPercentage: number;
  breakEvenMonths: number;
  
  locationValidation: {
    score: number;
    demandLevel: string;
    competitorDensity: string;
    customerAvailability: string;
    whyReasons: string[];
    locationRisks: string[];
  };

  budgetValidation: {
    userBudget: number;
    requiredStartupInvestment: number;
    remainingBuffer: number;
    budgetSufficiencyScore: number;
    sufficiencyStatus: 'SUFFICIENT' | 'ADDITIONAL FUNDING MAY BE REQUIRED';
    breakdown: Array<{ category: string; amount: number; percentage: number }>;
  };

  marketValidationScores: {
    marketDemandPct: number;
    competitionPct: number;
    growthPotentialPct: number;
    customerOpportunityPct: number;
    locationSuitabilityPct: number;
    riskPct: number;
  };

  businessPlan: {
    overview: string;
    targetCustomers: string;
    marketOpportunity: string;
    competitivePosition: string;
    pricingStrategy: string;
    startupBudget: string;
    monthlyOperatingBudget: string;
    revenueStrategy: string;
    marketingStrategy: string;
    salesStrategy: string;
    riskManagement: string;
    growthStrategy: string;
    implementationRoadmap: string;
    expectedFinancialOutcome: string;
  };

  optimizationSuggestions: Array<{
    title: string;
    action: string;
    impact: string;
    revisedBudget: number;
  }>;
}

export interface AIAnalysisReport {
  healthScore: MetricScore;
  opportunityScore: MetricScore;
  profitabilityScore: MetricScore;
  riskScore: MetricScore;
  marketPotentialScore: MetricScore;
  scalabilityScore: MetricScore;
  growthScore?: MetricScore;
  customerScore?: MetricScore;

  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  
  financials: FinancialForecastItem[];
  tamSamSom: {
    tam: number;
    sam: number;
    som: number;
  };
  
  competitors: CompetitorItem[];
  risks: RiskItem[];
  opportunities: OpportunityItem[];
  growthStrategies: GrowthStrategyItem[];
  customerSegments: CustomerSegment[];
  pricingRecommendations: {
    strategyName: string;
    suggestedPricePoint: string;
    marginPotential: string;
    tactics: string[];
  };

  marketTrends?: MarketTrendItem[];
  budgetAllocations?: BudgetAllocation[];
  roadmapPhases?: RoadmapPhase[];
  comprehensiveRecommendations?: ComprehensiveRecommendation[];
  
  validationResult?: IdeaValidationResult;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'rabbit';
  text: string;
  timestamp: string;
  suggestedState?: RabbitState;
  highlightCardId?: string;
  actionableInsights?: string[];
}

// ── Deep Learning Extended Types ─────────────────────────────────────────────

export interface NLPUnderstandingResult {
  extracted_industry: string;
  industry_confidence: number;
  business_type: string;
  target_customers: string[];
  technologies_identified: string[];
  business_models: string[];
  problem_statement: string;
  key_entities: { technologies: string[]; markets: string[]; problems: string[]; other: string[]; };
  opportunity_keywords: string[];
  market_growth_signals: string[];
  model_used: string;
}

export interface SimilarBusiness {
  name: string; description: string; category: string;
  growth_stage: string; market_size_bn: number;
  similarity_score: number; why_similar: string;
}

export interface SimilarityOpportunity {
  title: string; rationale: string; market_size: string;
  entry_angle: string; priority: 'High' | 'Medium' | 'Low';
}

export interface SimilarityResult {
  query: string; similar_businesses: SimilarBusiness[];
  opportunities: SimilarityOpportunity[]; model_used: string; embedding_dim: number;
}

export interface Recommendation {
  rank: number; business_name: string; description: string;
  category: string; growth: string; market_size_bn: number;
  relevance_score: number; reason: string;
}

export interface RecommendationOpportunityIdea {
  title: string; angle: string; expected_impact: string; difficulty: string;
}

export interface RecommendationResult {
  recommendations: Recommendation[];
  opportunity_ideas: RecommendationOpportunityIdea[];
  model_used: string;
}

export interface AnomalyItem {
  metric: string; value: number; normal_range: string; direction: string;
  risk_type: string; severity: 'High' | 'Moderate' | 'Low'; recommendation: string;
}

export interface AnomalyDetectionResult {
  is_anomalous: boolean; anomaly_score: number;
  severity: 'Critical' | 'High' | 'Moderate' | 'Normal';
  reconstruction_error: number; anomaly_threshold: number;
  detected_anomalies: AnomalyItem[]; latent_representation: number[];
  financial_snapshot: Record<string, number>; overall_summary: string; model_used: string;
}

export interface GNNAnalysisResult {
  business_node: string; competitor_nodes: string[]; market_nodes: string[];
  technology_nodes: string[]; whitespace_segments: string[]; gnn_similar_nodes: string[];
  graph_stats: { total_nodes: number; total_edges: number; business_degree: number; };
  ecosystem_insight: string; model_used: string;
}

export interface LSTMForecastMonth {
  month: string; month_name: string; predicted_revenue: number;
  predicted_expenses: number; predicted_net_profit: number;
  confidence_upper: number; confidence_lower: number; trend_direction: string;
}

export interface LSTMForecastResult {
  monthly_forecast: LSTMForecastMonth[];
  horizon_summary: { next_1_month: number; next_3_month: number; next_6_month: number; next_12_month: number; total_annual_forecast: number; };
  model_architecture: string; mape_error_rate: string; r2_score: number;
}

// ── Authentication Types ─────────────────────────────────────────────────────

export interface User {
  email: string;
  fullName: string;
  isGuest: boolean;
}

export interface StoredUser {
  email: string;
  password: string;
  fullName: string;
}
