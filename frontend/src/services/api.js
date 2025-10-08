import axios from 'axios';

// Configure the base URL for your backend API
// Change this to your actual backend URL
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch the list of ranked lawyers
 * @returns {Promise} Promise resolving to the lawyers data
 */
export const fetchLawyers = async () => {
  try {
    const response = await api.get('/lawyers');
    return response.data;
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    throw error;
  }
};

/**
 * Fetch the current weight configuration
 * @returns {Promise} Promise resolving to the config data
 */
export const fetchConfig = async () => {
  try {
    const response = await api.get('/config');
    return response.data;
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
};

/**
 * Update the weight configuration
 * @param {Object} newConfig - The new configuration object with weights
 * @returns {Promise} Promise resolving to the updated config
 */
export const updateConfig = async (newConfig) => {
  try {
    const response = await api.put('/config', newConfig);
    return response.data;
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
};

export default api;
