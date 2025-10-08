import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchLawyers, fetchConfig, updateConfig } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [lawyers, setLawyers] = useState([]);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch lawyers data
  const loadLawyers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchLawyers();
      if (response.success) {
        setLawyers(response.data);
      } else {
        setError(response.message || 'Failed to load lawyers');
      }
    } catch (err) {
      setError(err.message || 'Failed to load lawyers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch config data
  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchConfig();
      if (response.success) {
        setConfig(response.data);
      } else {
        setError(response.message || 'Failed to load config');
      }
    } catch (err) {
      setError(err.message || 'Failed to load config');
    } finally {
      setLoading(false);
    }
  };

  // Update config
  const saveConfig = async (newConfig) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateConfig(newConfig);
      if (response.success) {
        setConfig(response.data);
        // Reload lawyers with new config
        await loadLawyers();
        return true;
      } else {
        setError(response.message || 'Failed to update config');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Failed to update config');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadLawyers();
    loadConfig();
  }, []);

  const value = {
    lawyers,
    config,
    loading,
    error,
    loadLawyers,
    loadConfig,
    saveConfig,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
