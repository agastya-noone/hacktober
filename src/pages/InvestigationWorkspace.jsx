import React, { useEffect, useState } from 'react';
import { useParams, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import WorkspaceOverview from './WorkspaceOverview';
import EvidencePage from './EvidencePage';
import TimelinePage from './TimelinePage';
import ReconstructionPage from './ReconstructionPage';
import AnalysisPage from './AnalysisPage';
import ReportsPage from './ReportsPage';
import { api } from '../services/api';
import { 
  DEMO_INCIDENT, 
  DEMO_EVIDENCE, 
  DEMO_TIMELINE, 
  DEMO_CONTRADICTIONS 
} from '../services/demoData';

export default function InvestigationWorkspace() {
  const { id } = useParams();
  const location = useLocation();

  const [incident, setIncident] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [contradictions, setContradictions] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDemo = !id || id.includes('DEMO1');

  const fetchWorkspaceData = async () => {
    setLoading(true);
    if (isDemo) {
      setIncident(DEMO_INCIDENT);
      setEvidence(DEMO_EVIDENCE);
      setTimeline(DEMO_TIMELINE);
      setContradictions(DEMO_CONTRADICTIONS);
      setLoading(false);
      return;
    }

    try {
      const [incData, evData, tlData, ctData] = await Promise.allSettled([
        api.getIncident(id),
        api.getIncidentEvidence(id),
        api.getTimeline(id),
        api.getContradictions(id),
      ]);

      if (incData.status === 'fulfilled') {
        setIncident(incData.value);
      } else {
        // Fallback to placeholder or demo if id not found on backend
        setIncident({
          ...DEMO_INCIDENT,
          id: id,
          title: `Investigation Case ${id}`,
        });
      }

      setEvidence(evData.status === 'fulfilled' && evData.value?.length > 0 ? evData.value : DEMO_EVIDENCE);
      setTimeline(tlData.status === 'fulfilled' ? tlData.value : DEMO_TIMELINE);
      setContradictions(ctData.status === 'fulfilled' ? ctData.value : DEMO_CONTRADICTIONS);
    } catch (err) {
      console.warn("Failed loading live workspace data, using fallback:", err);
      setIncident(DEMO_INCIDENT);
      setEvidence(DEMO_EVIDENCE);
      setTimeline(DEMO_TIMELINE);
      setContradictions(DEMO_CONTRADICTIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  if (loading && !incident) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500 text-xs">
        Loading investigation workspace data...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-100/50">
      <Sidebar incident={incident} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
        <Routes>
          <Route
            index
            element={
              <WorkspaceOverview
                incident={incident}
                evidence={evidence}
                timeline={timeline}
                contradictions={contradictions}
              />
            }
          />
          <Route
            path="evidence"
            element={
              <EvidencePage
                incidentId={id || incident?.id}
                evidence={evidence}
                onRefresh={fetchWorkspaceData}
              />
            }
          />
          <Route
            path="timeline"
            element={
              <TimelinePage
                timeline={timeline}
              />
            }
          />
          <Route
            path="reconstruction"
            element={
              <ReconstructionPage
                incident={incident}
                timeline={timeline}
                evidence={evidence}
              />
            }
          />
          <Route
            path="analysis"
            element={
              <AnalysisPage
                incident={incident}
                contradictions={contradictions}
                evidence={evidence}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ReportsPage
                incident={incident}
                evidence={evidence}
                timeline={timeline}
                contradictions={contradictions}
              />
            }
          />
          <Route path="*" element={<Navigate to={`/investigation/${id}`} replace />} />
        </Routes>
      </main>
    </div>
  );
}
