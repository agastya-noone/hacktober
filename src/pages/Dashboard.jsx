import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Files, Car, AlertCircle, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { DEMO_INCIDENT } from '../services/demoData';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalInvestigations: 0,
    evidenceFiles: 0,
    vehiclesIdentified: 0,
    pendingAnalysis: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getIncidents();
      const list = Array.isArray(data) ? data : [];
      
      // If list is empty from freshly initialized db, include the demo incident in the display
      const displayList = list.length > 0 ? list : [DEMO_INCIDENT];
      setIncidents(displayList);

      // Compute dashboard stats
      let totalEvidence = 0;
      let totalVehicles = 0;
      let pending = 0;

      displayList.forEach(inc => {
        totalEvidence += inc.evidence_count || (inc.id === DEMO_INCIDENT.id ? DEMO_INCIDENT.evidence_count : 0);
        totalVehicles += inc.vehicle_ids?.length || (inc.id === DEMO_INCIDENT.id ? DEMO_INCIDENT.vehicle_ids.length : 1);
        if (inc.status === 'OPEN' || inc.status === 'UNDER_INVESTIGATION') {
          pending += 1;
        }
      });

      setStats({
        totalInvestigations: displayList.length,
        evidenceFiles: totalEvidence,
        vehiclesIdentified: Math.max(totalVehicles, 2),
        pendingAnalysis: pending,
      });
    } catch (err) {
      // Backend unavailable fallback: show demo incident cleanly
      setIncidents([DEMO_INCIDENT]);
      setStats({
        totalInvestigations: 1,
        evidenceFiles: DEMO_INCIDENT.evidence_count,
        vehiclesIdentified: DEMO_INCIDENT.vehicle_ids.length,
        pendingAnalysis: 1,
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="content-wrapper">
      {/* Page Title & Clear Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Investigations Dashboard</h1>
          <p className="page-subtitle mb-0">
            Overview of ongoing and reconstructed vehicle accident case files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="btn btn-secondary btn-sm"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link to="/new-investigation" className="btn btn-primary">
            <Plus className="w-4 h-4" />
            <span>New Investigation</span>
          </Link>
        </div>
      </div>

      {/* Essential Metrics (4 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="panel p-4 mb-0 bg-white">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Investigations
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {stats.totalInvestigations}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Recorded collision cases</div>
        </div>

        <div className="panel p-4 mb-0 bg-white">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Evidence Files
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {stats.evidenceFiles}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Video, telemetry & statements</div>
        </div>

        <div className="panel p-4 mb-0 bg-white">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Vehicles Identified
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {stats.vehiclesIdentified}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Instrumented & visual entities</div>
        </div>

        <div className="panel p-4 mb-0 bg-white">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Analysis
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">
            {stats.pendingAnalysis}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active investigations</div>
        </div>
      </div>

      {/* Backend connection warning banner if server is offline */}
      {error && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Local Backend Offline: </span>
              <span>{error}</span>
              <div className="text-[11px] text-amber-700 mt-0.5">
                Displaying authentic demonstration case below. Start FastAPI backend with <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">uvicorn app.main:app --reload --port 8000</code> to connect live.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Investigations List */}
      <div className="panel p-0 bg-white overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 m-0">Recent Accident Investigations</h2>
          <span className="text-xs text-slate-500">{incidents.length} record(s)</span>
        </div>

        <div className="data-table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case Reference</th>
                <th>Title & Location</th>
                <th>Incident Date</th>
                <th>Status</th>
                <th>Evidence Items</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id}>
                  <td className="font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                    {inc.id}
                  </td>
                  <td>
                    <div className="font-semibold text-slate-900 text-xs">
                      {inc.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      {inc.location}
                    </div>
                  </td>
                  <td className="text-xs text-slate-600 whitespace-nowrap">
                    {new Date(inc.incident_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td>
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className="text-xs text-slate-600">
                    <span className="font-mono font-bold text-slate-800">
                      {inc.evidence_count !== undefined ? inc.evidence_count : (inc.id === DEMO_INCIDENT.id ? DEMO_INCIDENT.evidence_count : 0)}
                    </span> files
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <Link
                      to={`/investigation/${inc.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0b2545] hover:text-[#134074] hover:underline"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
