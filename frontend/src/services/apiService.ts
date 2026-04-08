import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface SubmitReportPayload {
  /** AES-GCM encrypted report content (base64) */
  encryptedContent: string;
  /** keccak256 hash of the raw report content */
  reportHash: string;
  /** ZK nullifier hash — prevents the same identity submitting the same report twice */
  nullifierHash: string;
  /** Groth16 proof object — null for sponsored/identified submissions */
  proof: object | null;
  /** Public signals from the ZK circuit */
  publicSignals: string[];
  category: string;
  severity: string;
  location?: string;
  isAnonymous: boolean;
  /** True when the platform relayer is paying gas on behalf of the reporter */
  isSponsored: boolean;
}

const apiService = {
  submitReport: async (payload: SubmitReportPayload) => {
    return axios.post(`${API_URL}/reports`, payload);
  },

  getReports: async (token: string) => {
    return axios.get(`${API_URL}/reports`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getReportStatus: async (reportId: string) => {
    return axios.get(`${API_URL}/reports/${reportId}/status`);
  },

  /** Called after the client-side blockchain tx confirms to update the DB record. */
  confirmOnChain: async (reportId: string, txHash: string, blockNumber?: number) => {
    return axios.patch(`${API_URL}/reports/${reportId}/confirm`, { txHash, blockNumber });
  }
};

export default apiService;
