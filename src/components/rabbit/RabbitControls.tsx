import React from 'react';
import type { RabbitState } from '../../types';
import { Sparkles, Brain, Search, AlertCircle, Award, Target, Volume2, VolumeX, Eye } from 'lucide-react';

interface RabbitControlsProps {
  currentState: RabbitState;
  onStateChange: (state: RabbitState) => void;
  isVoiceMuted: boolean;
  onToggleVoice: () => void;
}

export const RabbitControls: React.FC<RabbitControlsProps> = ({
  currentState,
  onStateChange,
  isVoiceMuted,
  onToggleVoice
}) => {
  const statesList: { state: RabbitState; label: string; icon: React.ReactNode; color: string }[] = [
    { state: 'idle', label: 'Idle', icon: <Eye className="w-3.5 h-3.5" />, color: 'hover:bg-gray-100' },
    { state: 'thinking', label: 'Thinking', icon: <Brain className="w-3.5 h-3.5" />, color: 'hover:bg-blue-600' },
    { state: 'excited', label: 'Excited', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'hover:bg-amber-600/40' },
    { state: 'concerned', label: 'Concerned', icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'hover:bg-rose-600/40' },
    { state: 'detective', label: 'Detective', icon: <Search className="w-3.5 h-3.5" />, color: 'hover:bg-sky-600/40' },
    { state: 'pointing', label: 'Pointing', icon: <Target className="w-3.5 h-3.5" />, color: 'hover:bg-purple-600/40' },
    { state: 'celebrating', label: 'Celebrate', icon: <Award className="w-3.5 h-3.5" />, color: 'hover:bg-emerald-600/40' },
  ];

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-white border border-gray-200 backdrop-blur-md">
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-2">Animate:</span>
        {statesList.map((item) => (
          <button
            key={item.state}
            onClick={() => onStateChange(item.state)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-all duration-200 ${
              currentState === item.state
                ? 'bg-blue-600 text-gray-900 shadow-md shadow-blue-600/20 scale-105'
                : `text-gray-700 bg-gray-50 ${item.color}`
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onToggleVoice}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          isVoiceMuted
            ? 'bg-rose-50/40 border-rose-200/50 text-rose-600'
            : 'bg-emerald-50/40 border-emerald-200/50 text-emerald-600'
        }`}
        title={isVoiceMuted ? 'Unmute AI Voice Speech' : 'Mute AI Voice Speech'}
      >
        {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
        <span>{isVoiceMuted ? 'Voice Off' : 'Voice On'}</span>
      </button>
    </div>
  );
};
