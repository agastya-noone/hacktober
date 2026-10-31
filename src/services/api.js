import axios from 'axios';

// Base API configuration from environment or default
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

// Centralized error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      // Backend returned HTTP error
      message = error.response.data?.detail || error.response.data?.message || `Server Error (${error.response.status})`;
    } else if (error.request) {
      // Backend is unreachable
      message = `Cannot connect to TRACE AI backend at ${BASE_URL}. Ensure the FastAPI server is running.`;
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const api = {
  // System Health & AI Status
  getHealth: () => apiClient.get('/api/health').then(r => r.data),
  getAIStatus: () => apiClient.get('/api/ai/status').then(r => r.data),

  // Incidents
  getIncidents: (params) => apiClient.get('/api/incidents', { params }).then(r => r.data),
  getIncident: (id) => apiClient.get(`/api/incidents/${id}`).then(r => r.data),
  createIncident: (data) => apiClient.post('/api/incidents', data).then(r => r.data),
  updateIncident: (id, data) => apiClient.put(`/api/incidents/${id}`, data).then(r => r.data),
  deleteIncident: (id, confirm = true) => apiClient.delete(`/api/incidents/${id}`, { params: { confirm } }).then(r => r.data),

  // Evidence
  getIncidentEvidence: (incidentId) => apiClient.get(`/api/incidents/${incidentId}/evidence`).then(r => r.data),
  getEvidenceDetail: (evidenceId) => apiClient.get(`/api/evidence/${evidenceId}`).then(r => r.data),
  deleteEvidence: (evidenceId) => apiClient.delete(`/api/evidence/${evidenceId}`).then(r => r.data),
  uploadEvidence: (incidentId, formData, onUploadProgress) => {
    return apiClient.post(`/api/incidents/${incidentId}/evidence`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }).then(r => r.data);
  },

  // Processing & Kinematics
  processTelemetry: (incidentId, evidenceId) => {
    return apiClient.post(`/api/incidents/${incidentId}/telemetry/process`, { evidence_id: evidenceId }).then(r => r.data);
  },
  processVideo: (incidentId, evidenceId, sampleRate = 5) => {
    return apiClient.post(`/api/incidents/${incidentId}/video/process`, {
      evidence_id: evidenceId,
      sample_rate_frames: sampleRate,
    }).then(r => r.data);
  },
  analyzeWitness: (incidentId, evidenceId) => {
    return apiClient.post(`/api/incidents/${incidentId}/analyze-witness`, { evidence_id: evidenceId }).then(r => r.data);
  },

  // Timeline & Contradictions
  getTimeline: (incidentId, params) => apiClient.get(`/api/incidents/${incidentId}/timeline`, { params }).then(r => r.data),
  getContradictions: (incidentId) => apiClient.get(`/api/incidents/${incidentId}/contradictions`).then(r => r.data),

  // Reports & AI Summary
  generateAISummary: (incidentId) => apiClient.post(`/api/incidents/${incidentId}/ai-summary`, { incident_id: incidentId }).then(r => r.data),
  getIncidentReport: (incidentId) => apiClient.get(`/api/incidents/${incidentId}/report`).then(r => r.data),
};

export default api;
