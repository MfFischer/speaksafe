import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiService = {
  submitReport: async (encryptedContent: string, reportHash: string) => {
    return axios.post(`${API_URL}/reports`, { encryptedContent, reportHash });
  },
  
  getReports: async (token: string) => {
    return axios.get(`${API_URL}/reports`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default apiService;