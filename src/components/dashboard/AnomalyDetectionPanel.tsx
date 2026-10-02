import React, { useState, useEffect } from 'react';
import type { BusinessInput } from '../../types';
import type { AnomalyDetectionResult, AnomalyItem } from '../../services/deepLearningService';
import { detectAnomalies } from '../../services/deepLearningService';
import { ShieldAlert, Activity, AlertTriangle, CheckCircle, RefreshCw, BarChart2, Cpu } from 'lucide-react';

interface Props { input: BusinessInput; isHighlighted?: boolean; }

const severityStyle = (s: string) => {
  if (s === 'Critical' || s === 'High') return 'bg-rose-50/50 border-rose-200/50 text-rose-600';
  if (s === 'Moderate') return 'bg-amber-50/50 border-amber-200/50 text-amber-600';
  return 'bg-emerald-50/50 border-emerald-200/50 text-emerald-600';
};

const AnomalyCard = ({ a }: { a: AnomalyItem }) => (
  <div className={`p-3.5 rounded-xl border space-y-2 ${severityStyle(a.severity)}`}>
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span className="text-xs font-bold">{a.metric}</span>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityStyle(a.severity)}`}>
        {a.severity}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 text-[11px]">
      <span>Value: <strong className="text-gray-900">{a.value.toFixed(3)}</strong></span>
      <span>Normal: <strong className="text-gray-700">{a.normal_range}</strong></span>
      <span>Direction: <strong className="text-gray-900">{a.direction}</strong></span>
      <span>Risk: <strong className="text-gray-900">{a.risk_type}</strong></span>
    </div>
    <p className="text-[11px] leading-relaxed opacity-90">{a.recommendation}</p>
  </div>
);

const ScoreGauge = ({ score, severity }: { score: number; severity: string }) => {
  const pct  = Math.round(score * 100);
  const col  = severity === 'Critical' ? '#f87171' : severity === 'High' ? '#fb923c' : severity === 'Moderate' ? '#fbbf24' : '#34d399';
  const dash = (pct / 100) * 226;
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle cx="40" cy="40" r="36" fill="none" stroke={col} strokeWidth="6"
          strokeDasharray={`${dash} 226`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black text-gray-900">{pct}%</span>
        <span className="text-[10px] font-bold" style={{ color: col }}>{severity}</span>
      </div>
    </div>
  );
};

export const AnomalyDetectionPanel: React.FC<Props> = ({ input, isHighlighted = false }) => {
  const [result, setResult]   = useState<AnomalyDetectionResult | null>(null);
  const [loading, setLoading] = useState(true);

  const run = async () => {
    setLoading(true);
    const r = await detectAnomalies(input);
    setResult(r);
    setLoading(false);
  };
  useEffect(() => { run(); }, [input]);

  return (
    <div
      id="anomaly-detection-card"
      className={`p-6 rounded-2xl bg-white border border-gray-200 backdrop-blur-md shadow-sm space-y-5 transition-all duration-500 ${
        isHighlighted ? 'ring-4 ring-rose-400 scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-700/50 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Autoencoder Anomaly Detection
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60">
                PyTorch AE 8-4-8
              </span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Reconstruction error analysis detects unusual financial and market patterns
            </p>
          </div>
        </div>
        <button onClick={run} disabled={loading} className="p-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-500 hover:text-gray-900 disabled:opacity-40">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500">Running autoencoder reconstruction analysis...</p>
        </div>
      ) : result ? (
        <div className="space-y-5">
          {/* Anomaly score + status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-1 flex justify-center">
              <ScoreGauge score={result.anomaly_score} severity={result.severity} />
            </div>
            <div className="sm:col-span-2 space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                result.is_anomalous ? 'bg-rose-50/30 border-rose-200/50' : 'bg-emerald-50/30 border-emerald-200/50'
              }`}>
                {result.is_anomalous
                  ? <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  : <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                <p className="text-xs leading-relaxed text-gray-800">{result.overall_summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-[#F8FAFC] border border-gray-200">
                  <span className="text-gray-400">Recon Error</span>
                  <p className="font-bold text-gray-900 mt-0.5">{result.reconstruction_error.toFixed(5)}</p>
                </div>
                <div className="p-2 rounded-lg bg-[#F8FAFC] border border-gray-200">
                  <span className="text-gray-400">Threshold</span>
                  <p className="font-bold text-gray-900 mt-0.5">{result.anomaly_threshold.toFixed(5)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detected anomalies */}
          {result.detected_anomalies.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-bold text-gray-900">
                  {result.detected_anomalies.length} Anomal{result.detected_anomalies.length === 1 ? 'y' : 'ies'} Detected
                </h4>
              </div>
              {result.detected_anomalies.map((a, i) => <AnomalyCard key={i} a={a} />)}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/20 border border-emerald-900/40">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-600">All financial metrics are within normal operating ranges. No anomalies detected.</p>
            </div>
          )}

          {/* Financial snapshot */}
          {Object.keys(result.financial_snapshot).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-gray-500" />
                <h4 className="text-xs font-bold text-gray-900">Financial Snapshot (Normalised)</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(result.financial_snapshot).slice(0, 8).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-gray-200 space-y-1">
                    <span className="text-[10px] text-gray-400 leading-tight block">{k}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 rounded-full bg-gray-50">
                        <div className="h-1 rounded-full bg-blue-500" style={{ width: `${Math.min(v * 100, 100)}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700">{v.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Latent representation */}
          {result.latent_representation.length > 0 && (
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-gray-200 space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Latent Space Encoding (z-vector)</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {result.latent_representation.map((v, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-white border border-gray-200 text-[10px] font-mono text-blue-600">
                    z{i}: {v.toFixed(3)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-gray-400">Model:</span>
            <span className="text-[10px] font-semibold text-gray-500">{result.model_used}</span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-8">Anomaly detection unavailable. Check backend connection.</p>
      )}
    </div>
  );
};
