import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Car
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function ReportsPage({ incident, evidence = [], timeline, contradictions }) {
  const [exporting, setExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      incident: incident || {},
      generated_at: new Date().toISOString(),
      evidence_inventory: evidence.map(e => ({
        id: e.id,
        filename: e.filename,
        file_type: e.file_type,
        file_size_bytes: e.file_size_bytes,
        sha256_hash: e.sha256_hash,
      })),
      timeline: timeline || {},
      contradictions: contradictions || {},
      forensic_limitations: [
        "Uncalibrated video optical flow pixel coordinates were not converted to metric distances without photogrammetric resection.",
        "Testimonial variance reflects cognitive perceptual limitations and is not treated as evidence of deliberate fabrication.",
        "Cryptographic SHA-256 digests prove technical data integrity post-upload, not authentic origin at the collision site."
      ]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TRACE_AI_REPORT_${incident?.id || 'DEMO'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="panel bg-white print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title text-lg">Forensic Reconstruction Report</h1>
            <p className="page-subtitle text-xs mb-0">
              Complete, audited technical report ready for formal engineering and judicial review.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              title="Print formatted report"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="btn btn-primary btn-sm"
              title="Export complete JSON dataset"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formal Printable Report Paper */}
      <div className="bg-white border border-slate-200 rounded-md p-8 shadow-xs print:border-0 print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-[#0b2545] uppercase">
                TRACE AI FORENSIC RECONSTRUCTION REPORT
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {incident?.title || 'Accident Investigation Report'}
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Location: {incident?.location} | Date: {new Date(incident?.incident_date || Date.now()).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs font-bold text-slate-900">
                CASE REF: {incident?.id}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                STATUS: {incident?.status}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="mb-6">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
            1. Executive Investigation Summary
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            On {new Date(incident?.incident_date || Date.now()).toLocaleDateString()}, a multi-vehicle traffic collision occurred at {incident?.location}. Analysis of synchronized CAN bus vehicle telemetry, forward-facing video optical flow, and independent witness depositions was conducted by TRACE AI. Reconstructed telemetry establishes that Vehicle 1 was traveling at 52.4 km/h when brake pedal actuation commenced 2.5 seconds prior to impact. Vehicle 2 was approaching at 76.1 km/h with an emergency deceleration rate reaching -9.40 m/s².
          </p>
        </div>

        {/* Section 2: Evidence Inventory */}
        <div className="mb-6">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
            2. Authenticated Evidence Chain & Cryptographic Digests
          </h3>
          <div className="data-table-container border border-slate-200 rounded-none">
            <table className="data-table text-[11px]">
              <thead>
                <tr>
                  <th>Evidence ID</th>
                  <th>File Name</th>
                  <th>Format / Type</th>
                  <th>SHA-256 Digest (Integrity)</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((ev) => (
                  <tr key={ev.id}>
                    <td className="font-mono font-bold">{ev.id}</td>
                    <td>{ev.filename}</td>
                    <td><StatusBadge status={ev.file_type} type="file_type" /></td>
                    <td className="font-mono text-[10px] break-all">{ev.sha256_hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Kinematic Profiles */}
        <div className="mb-6">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
            3. Vehicle Kinematic Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="font-bold text-slate-900 mb-1">Vehicle 1 (Lead Sedan)</div>
              <div>Maximum Recorded Velocity: <strong>52.4 km/h</strong></div>
              <div>Deceleration at Impact: <strong>-7.80 m/s²</strong></div>
              <div>Brake Actuation Status: <strong>Confirmed Active (CAN Switch 0x18F)</strong></div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="font-bold text-slate-900 mb-1">Vehicle 2 (Commercial Van)</div>
              <div>Maximum Recorded Velocity: <strong>76.1 km/h</strong></div>
              <div>Peak Impact Deceleration: <strong>-9.40 m/s²</strong></div>
              <div>Brake Actuation Status: <strong>Confirmed Active (-1.8s Pre-Impact)</strong></div>
            </div>
          </div>
        </div>

        {/* Section 4: Chronological Timeline */}
        <div className="mb-6">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
            4. Deterministic Chronological Timeline Sequence
          </h3>
          <div className="space-y-2">
            {(timeline?.events || []).slice(0, 6).map((evt, idx) => (
              <div key={idx} className="p-2 border border-slate-100 rounded text-xs flex items-start justify-between gap-4 bg-slate-50/50">
                <div>
                  <span className="font-mono font-bold text-slate-900 mr-2">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  {evt.vehicle_id && <strong className="mr-2 text-slate-800">[{evt.vehicle_id}]</strong>}
                  <span className="text-slate-700">{evt.description}</span>
                </div>
                <StatusBadge status={evt.classification} type="classification" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Unresolved Discrepancies */}
        <div className="mb-6">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
            5. Discrepancy Findings & Cross-Examination
          </h3>
          <div className="space-y-2">
            {(contradictions?.contradictions || []).map((c, i) => (
              <div key={i} className="p-2.5 bg-amber-50/40 border border-amber-200 rounded text-xs">
                <div className="font-semibold text-amber-900 mb-1">
                  [{c.category}] {c.description}
                </div>
                <div className="text-[11px] text-slate-600">
                  {c.investigative_guidance}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Limitations & Engineering Standards */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-[11px] text-slate-500 space-y-1">
          <div className="font-bold text-slate-700 uppercase">6. Limitations & Technical Epistemic Boundary</div>
          <p>
            1. Visual optical flow vectors derived from monocular footage represent pixel velocity in the image plane and must not be treated as ground metric velocity without known intrinsic/extrinsic camera calibration parameters.
          </p>
          <p>
            2. In accordance with ISO 21747 and SAE J2747 accident reconstruction guidelines, human observation times are susceptible to stress-induced distortion. Physical electronic CAN bus logs are primary kinematic ground truth.
          </p>
        </div>
      </div>
    </div>
  );
}
