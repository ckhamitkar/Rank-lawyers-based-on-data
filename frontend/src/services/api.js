import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const lawyerApi = {
  /**
   * Get all ranked lawyers
   */
  getLawyers: async () => {
    const response = await api.get('/lawyers');
    return response.data;
  },

  /**
   * Get current configuration weights
   */
  getConfig: async () => {
    const response = await api.get('/config');
    return response.data;
  },

  /**
   * Update configuration weights
   * @param {Object} config - The new configuration object
   */
  updateConfig: async (config) => {
    const response = await api.put('/config', config);
    return response.data;
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
