import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, RabbitState, BusinessInput } from '../../types';
import { classifyQuestionIntent } from '../../services/sentimentEngine';
import { speakText, startSpeechRecognition } from '../../services/voiceService';
import { MessageSquare, Send, Mic, MicOff, Sparkles } from 'lucide-react';

interface AIChatWindowProps {
  businessData: BusinessInput;
  onStateChange: (state: RabbitState) => void;
  onHighlightCard: (cardId?: string) => void;
  onSpeechSpeakingChange: (isSpeaking: boolean) => void;
  isVoiceMuted: boolean;
}

export const AIChatWindow: React.FC<AIChatWindowProps> = ({
  businessData,
  onStateChange,
  onHighlightCard,
  onSpeechSpeakingChange,
  isVoiceMuted
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'rabbit',
      text: `Hello! I'm Barnaby, your AI Business Adviser for ${businessData.businessName}. Ask me anything about profitability, growth, competitors, or financial forecasts!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedState: 'happy'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const presetQuestions = [
    "Is my business idea profitable?",
    "How can I increase my revenue?",
    "My business is losing money.",
    `What business to start with ${businessData.currency}${businessData.investmentBudget.toLocaleString()}?`,
    "What are my competitors doing?",
    "Explain my financial prediction.",
    "That's a great idea!"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // NLP intent classification
    const analysis = classifyQuestionIntent(query);
    onStateChange(analysis.suggestedState);

    if (analysis.highlightCardId) {
      onHighlightCard(analysis.highlightCardId);
      setTimeout(() => onHighlightCard(undefined), 6000);
    }

    // Generate contextual response
    setTimeout(() => {
      let aiText = '';
      const bName = businessData.businessName;
      const curr = businessData.currency;
      const exp = businessData.currentExpenses;

      switch (analysis.intent) {
        case 'PROFITABILITY':
          aiText = `${bName} shows solid profit potential! With operating costs at ${curr}${exp.toLocaleString()}, optimizing raw materials can boost net margins by 18-24%.`;
          break;
        case 'REVENUE':
          aiText = `To double revenue for ${bName}, I recommend launching a recurring subscription tier and expanding micro-influencer partnerships!`;
          break;
        case 'RISK_LOSS':
          aiText = `Don't worry! For ${bName}, we can cut fixed overhead costs by 15% and implement an automated 90-day cash reserve buffer to protect cash flow.`;
          break;
        case 'COMPETITORS':
          aiText = `Examining competitors: Rivals in ${businessData.industry} rely on legacy manual processes. By automating customer onboarding, ${bName} gains a 3x speed advantage!`;
          break;
        case 'BUDGET_STARTUP':
          aiText = `With your capital budget of ${curr}${businessData.investmentBudget.toLocaleString()}, high-ROI business opportunities include B2B SaaS, Specialty Artisan Coffee, or Renewable CleanTech!`;
          break;
        case 'FINANCIAL_EXPLANATION':
          aiText = `Pointing to the 5-year forecast chart: Revenue is projected to compound at ${businessData.expectedGrowth}% annually, reaching net profitability break-even by Year 2!`;
          break;
        case 'CELEBRATION':
          aiText = `Woohoo! High paw! 🎉 Keep pushing forward — ${bName} is positioned for incredible market growth!`;
          break;
        default:
          aiText = `Analyzing '${query}' for ${bName}: Based on market trends in ${businessData.industry}, focusing on customer acquisition efficiency will yield the highest return!`;
          break;
      }

      const rabbitMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'rabbit',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedState: analysis.suggestedState,
        highlightCardId: analysis.highlightCardId
      };

      setMessages((prev) => [...prev, rabbitMsg]);

      // Voice synthesis with lip sync
      speakText(
        aiText,
        () => onSpeechSpeakingChange(true),
        () => onSpeechSpeakingChange(false),
        isVoiceMuted
      );
    }, 600);
  };

  const handleMicClick = () => {
    if (isListeningMic) {
      setIsListeningMic(false);
      return;
    }

    setIsListeningMic(true);
    startSpeechRecognition(
      (transcript) => {
        setIsListeningMic(false);
        setInputQuery(transcript);
        handleSendMessage(transcript);
      },
      () => setIsListeningMic(false),
      () => setIsListeningMic(false)
    );
  };

  return (
    <div className="flex flex-col h-[520px] rounded-3xl bg-white border border-gray-200 backdrop-blur-md shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#F8FAFC] border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 border border-indigo-700/50 text-blue-600">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Barnaby AI Advisor Chat
            </h3>
            <p className="text-[11px] text-gray-500">Natural voice & text business guidance</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Online
        </span>
      </div>

      {/* Preset Chips */}
      <div className="px-4 py-2 bg-[#F8FAFC] border-b border-gray-200 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">Ask:</span>
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-gray-900 border border-gray-300 transition-all shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-gray-900 rounded-br-none'
                  : 'bg-gray-50 text-gray-800 border border-gray-300 rounded-bl-none'
              }`}
            >
              {msg.sender === 'rabbit' && (
                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-blue-600">
                  <Sparkles className="w-3 h-3" /> Barnaby IQ
                </div>
              )}
              <p>{msg.text}</p>
            </div>
            <span className="mt-1 text-[9px] text-gray-400 px-1">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#F8FAFC] border-t border-gray-200 flex items-center gap-2">
        <button
          onClick={handleMicClick}
          className={`p-2.5 rounded-xl border transition-all ${
            isListeningMic
              ? 'bg-rose-600 border-rose-500 text-gray-900 animate-pulse'
              : 'bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900'
          }`}
          title={isListeningMic ? 'Listening...' : 'Voice Microphone Command'}
        >
          {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask Barnaby about profitability, growth, or risks..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-blue-200"
        />

        <button
          onClick={() => handleSendMessage()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-gray-900 shadow-sm shadow-blue-600/20 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
