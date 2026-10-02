import type { RabbitState } from '../types';

export interface QuestionAnalysisResult {
  intent: 'PROFITABILITY' | 'REVENUE' | 'RISK_LOSS' | 'COMPETITORS' | 'BUDGET_STARTUP' | 'FINANCIAL_EXPLANATION' | 'CELEBRATION' | 'GENERAL';
  suggestedState: RabbitState;
  highlightCardId?: string;
  responsePrefix: string;
}

export function classifyQuestionIntent(query: string): QuestionAnalysisResult {
  const q = query.toLowerCase();

  if (q.includes('profitable') || q.includes('profitability') || q.includes('make money') || q.includes('margin') || q.includes('roi')) {
    return {
      intent: 'PROFITABILITY',
      suggestedState: 'thinking',
      highlightCardId: 'profitability-card',
      responsePrefix: "Let me crunch the numbers on profitability for your business idea..."
    };
  }

  if (q.includes('revenue') || q.includes('sales') || q.includes('increase') || q.includes('grow') || q.includes('more customers') || q.includes('scale')) {
    return {
      intent: 'REVENUE',
      suggestedState: 'excited',
      highlightCardId: 'opportunity-card',
      responsePrefix: "Oh! Growth strategies get me super pumped! Here is how we boost your revenue..."
    };
  }

  if (q.includes('losing money') || q.includes('loss') || q.includes('risk') || q.includes('expenses') || q.includes('failing') || q.includes('problem') || q.includes('reduce cost') || q.includes('decreasing')) {
    return {
      intent: 'RISK_LOSS',
      suggestedState: 'concerned',
      highlightCardId: 'risk-matrix-card',
      responsePrefix: "I hear your concern. Don't panic — let's analyze the cost leakages and risk factors right away..."
    };
  }

  if (q.includes('competitor') || q.includes('competition') || q.includes('beat') || q.includes('market share') || q.includes('rival')) {
    return {
      intent: 'COMPETITORS',
      suggestedState: 'detective',
      highlightCardId: 'competitor-radar-card',
      responsePrefix: "Putting on my detective specs! Let's examine what your competitors are doing and how to outsmart them..."
    };
  }

  if (q.includes('budget') || q.includes('start') || q.includes('idea') || q.includes('investment') || q.includes('lakh') || q.includes('50k') || q.includes('capital')) {
    return {
      intent: 'BUDGET_STARTUP',
      suggestedState: 'thinking',
      highlightCardId: 'market-potential-card',
      responsePrefix: "Filtering high-potential opportunities tailored specifically to your capital budget..."
    };
  }

  if (q.includes('forecast') || q.includes('prediction') || q.includes('chart') || q.includes('financial') || q.includes('5-year') || q.includes('5 year') || q.includes('projection')) {
    return {
      intent: 'FINANCIAL_EXPLANATION',
      suggestedState: 'pointing',
      highlightCardId: 'financial-forecast-card',
      responsePrefix: "Directing your attention to our 5-year predictive cash flow model..."
    };
  }

  if (q.includes('great') || q.includes('awesome') || q.includes('thank') || q.includes('love') || q.includes('amazing') || q.includes('celebrate') || q.includes('congrats')) {
    return {
      intent: 'CELEBRATION',
      suggestedState: 'celebrating',
      responsePrefix: "Woohoo! High five! You're making tremendous progress!"
    };
  }

  return {
    intent: 'GENERAL',
    suggestedState: 'explaining',
    responsePrefix: "Analyzing your query based on our MillenniumIQ business database..."
  };
}
