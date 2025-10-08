import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { lawyerApi } from '../services/api';
import WeightSlider from '../components/WeightSlider';

const ConfigScreen = ({ onConfigSaved }) => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchConfig = async () => {
    try {
      setError(null);
      const data = await lawyerApi.getConfig();
      setConfig(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load config');
      console.error('Error fetching config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleWeightChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await lawyerApi.updateConfig(config);
      Alert.alert('Success', 'Configuration saved successfully!');
      if (onConfigSaved) {
        onConfigSaved();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to save config';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
      console.error('Error saving config:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer} testID="loading-indicator">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading configuration...</Text>
      </View>
    );
  }

  if (error && Object.keys(config).length === 0) {
    return (
      <View style={styles.centerContainer} testID="error-container">
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="config-screen">
      <Text style={styles.title}>Configuration</Text>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.description}>
          Adjust the weights for each metric. Higher weights give more importance to that metric in the ranking.
        </Text>
        {Object.entries(config).map(([key, value]) => (
          <WeightSlider
            key={key}
            label={key}
            value={value}
            onChange={(newValue) => handleWeightChange(key, newValue)}
            testID={`weight-slider-${key.replace(/\s/g, '-').toLowerCase()}`}
          />
        ))}
        {error && (
          <Text style={styles.errorText} testID="error-message">
            {error}
          </Text>
        )}
      </ScrollView>
      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
        testID="save-button"
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Configuration</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: '#ff3b30',
    textAlign: 'center',
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ConfigScreen;
