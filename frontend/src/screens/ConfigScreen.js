import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Appbar,
  Snackbar,
  Card,
} from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

const ConfigScreen = () => {
  const { config, loading, error, saveConfig, loadConfig } = useAppContext();
  const [localConfig, setLocalConfig] = useState({});
  const [saving, setSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleWeightChange = (key, value) => {
    setLocalConfig({
      ...localConfig,
      [key]: value,
    });
  };

  const handleSave = async () => {
    // Validate all values are numbers
    const invalidKeys = [];
    const configToSave = {};
    
    for (const [key, value] of Object.entries(localConfig)) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        invalidKeys.push(key);
      } else {
        configToSave[key] = numValue;
      }
    }

    if (invalidKeys.length > 0) {
      Alert.alert(
        'Invalid Input',
        `Please enter valid numbers for: ${invalidKeys.join(', ')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    setSaving(true);
    const success = await saveConfig(configToSave);
    setSaving(false);

    if (success) {
      setSnackbarMessage('Configuration saved successfully!');
      setSnackbarVisible(true);
    } else {
      Alert.alert(
        'Error',
        'Failed to save configuration. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleReset = () => {
    setLocalConfig(config);
    setSnackbarMessage('Changes reset');
    setSnackbarVisible(true);
  };

  if (loading && Object.keys(localConfig).length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading configuration...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Weight Configuration" />
        <Appbar.Action icon="refresh" onPress={loadConfig} />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.description}>
              Adjust the weights for each criterion below. Higher weights give
              more importance to that criterion in the ranking calculation.
            </Text>
          </Card.Content>
        </Card>

        {Object.entries(localConfig).map(([key, value]) => (
          <Card key={key} style={styles.inputCard}>
            <Card.Content>
              <Text style={styles.label}>{key}</Text>
              <TextInput
                mode="outlined"
                label={`Weight for ${key}`}
                value={String(value)}
                onChangeText={(text) => handleWeightChange(key, text)}
                keyboardType="numeric"
                style={styles.input}
              />
            </Card.Content>
          </Card>
        ))}

        {Object.keys(localConfig).length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No configuration found</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleReset}
            style={styles.button}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            loading={saving}
            disabled={saving}
          >
            Save Changes
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  inputCard: {
    margin: 10,
    marginTop: 5,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ConfigScreen;
