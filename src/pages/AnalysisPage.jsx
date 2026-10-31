import React, { useState } from 'react';
import { GitFork, ShieldCheck, FileText, Activity, AlertTriangle, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { DEMO_TELEMETRY_POINTS } from '../services/demoData';

export default function AnalysisPage({ incident, contradictions, evidence = [] }) {
  const [activeTab, setActiveTab] = useState('CONTRADICTIONS'); // 'CONTRADICTIONS' | 'TELEMETRY' | 'WITNESS'

  const contraList = contradictions?.contradictions || [];
  const telemetryData = DEMO_TELEMETRY_POINTS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="panel bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="page-title text-lg">Multi-Source Cross-Examination & Discrepancies</h1>
            <p className="page-subtitle text-xs mb-0">
              Rigorous comparative audit between physical sensor data, computer vision, and eyewitness claims.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{contraList.length} Discrepancy(ies) Flagged</span>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex border-b border-slate-200 mt-4 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('CONTRADICTIONS')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 -mb-px font-medium transition-colors ${
              activeTab === 'CONTRADICTIONS'
                ? 'border-[#0b2545] text-[#0b2545] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Contradiction Matrix ({contraList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TELEMETRY')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 -mb-px font-medium transition-colors ${
              activeTab === 'TELEMETRY'
                ? 'border-[#0b2545] text-[#0b2545] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry Kinematic Curves</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('WITNESS')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 -mb-px font-medium transition-colors ${
              activeTab === 'WITNESS'
                ? 'border-[#0b2545] text-[#0b2545] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Witness Claim Decomposition</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Contradictions Matrix */}
      {activeTab === 'CONTRADICTIONS' && (
        <div className="space-y-4">
          {/* Neutrality Mandate Notice */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Mandatory Investigative Neutrality: </span>
              In accordance with forensic engineering protocols, discrepancies between human perception and sensor streams are cataloged without declaring either source conclusively true or false. Independent physical validation (crush energy, tire marks, clock synchronization) is required before final culpability determination.
            </div>
          </div>

          {/* AI vs Deterministic Explanation Badge */}
          {contradictions?.ai_explanation && (
            <div className="panel bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-900 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Synthesis & Investigative Guidance ({contradictions.ai_available ? 'Featherless AI' : 'Deterministic Rule Engine'})</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal m-0">
                {contradictions.ai_explanation}
              </p>
            </div>
          )}

          {/* Discrepancy Cards */}
          {contraList.map((item, idx) => (
            <div key={item.contradiction_id || idx} className="panel bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {item.contradiction_id}
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Unresolved Discrepancy #{idx + 1}</span>
              </div>

              <p className="text-xs text-slate-800 font-semibold mb-3">
                {item.description}
              </p>

              {/* Source Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                {/* Source A */}
                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                    Source A ({item.source_a?.evidence_type || 'WITNESS'})
                  </div>
                  <div className="text-xs font-medium text-slate-900 italic">
                    "{item.source_a?.claim}"
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Evidence ID: <code className="font-mono text-slate-700">{item.source_a?.evidence_id}</code>
                  </div>
                </div>

                {/* Source B */}
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded">
                  <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">
                    Source B ({item.source_b?.evidence_type || 'TELEMETRY'})
                  </div>
                  <div className="text-xs font-medium text-slate-900">
                    {item.source_b?.claim}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Evidence ID: <code className="font-mono text-slate-700">{JSON.stringify(item.source_b?.evidence_id)}</code>
                  </div>
                </div>
              </div>

              {/* Guidance Footer */}
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600">
                <strong>Forensic Guidance: </strong>{item.investigative_guidance}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Telemetry Kinematic Curves */}
      {activeTab === 'TELEMETRY' && (
        <div className="space-y-4">
          <div className="panel bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Velocity Time-History (km/h)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Recorded vehicle speeds approaching collision zone from calibrated CAN bus sensors.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="t" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit=" km/h" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="veh1_speed" stroke="#1e40af" strokeWidth={2} name="Vehicle 1 (Lead Sedan)" dot />
                  <Line type="monotone" dataKey="veh2_speed" stroke="#b91c1c" strokeWidth={2} name="Vehicle 2 (Approaching Van)" dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Deceleration Spikes (m/s²)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Negative acceleration onset marking brake pedal application and high-g impact moment.
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="t" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit=" m/s²" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="veh1_accel" stroke="#0284c7" strokeWidth={2} name="Vehicle 1 Accel" />
                  <Line type="monotone" dataKey="veh2_accel" stroke="#ea580c" strokeWidth={2} name="Vehicle 2 Accel" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Witness Claim Decomposition */}
      {activeTab === 'WITNESS' && (
        <div className="panel bg-white p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 m-0">Eyewitness Statement Structured Claims</h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              Natural language extracted quotes versus deterministic instrument limits.
            </p>
          </div>

          <div className="data-table-container border-0 rounded-none">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Claim Category</th>
                  <th>Exact Statement Quote</th>
                  <th>Interpreted Parameter</th>
                  <th>Physical Corroboration Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono text-xs">CLM-01</td>
                  <td><span className="badge badge-ai">Speed Claim</span></td>
                  <td className="text-xs italic text-slate-800">"Vehicle 2 was speeding excessively at well over 100 km/h."</td>
                  <td className="text-xs font-semibold">100+ km/h</td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Disputed: Telemetry max was 76.1 km/h
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="font-mono text-xs">CLM-02</td>
                  <td><span className="badge badge-ai">Braking Claim</span></td>
                  <td className="text-xs italic text-slate-800">"I never heard any tire screech or saw brake lights before impact."</td>
                  <td className="text-xs font-semibold">No brake actuation</td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Disputed: CAN log shows active brake
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="font-mono text-xs">CLM-03</td>
                  <td><span className="badge badge-ai">Temporal Claim</span></td>
                  <td className="text-xs italic text-slate-800">"The crash happened right around 14:15."</td>
                  <td className="text-xs font-semibold">14:15 approx</td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Variance: GPS recorded 14:22:15
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
