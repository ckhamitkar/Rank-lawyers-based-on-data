import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { lawyerApi } from '../services/api';
import LawyerCard from '../components/LawyerCard';

const RankingsScreen = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLawyers = async () => {
    try {
      setError(null);
      const data = await lawyerApi.getLawyers();
      setLawyers(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load lawyers');
      console.error('Error fetching lawyers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLawyers();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer} testID="loading-indicator">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading lawyers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer} testID="error-container">
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="rankings-screen">
      <Text style={styles.title}>Lawyer Rankings</Text>
      {lawyers.length === 0 ? (
        <View style={styles.centerContainer} testID="empty-state">
          <Text style={styles.emptyText}>No lawyers found</Text>
        </View>
      ) : (
        <FlatList
          data={lawyers}
          keyExtractor={(item, index) => `${item.Name}-${index}`}
          renderItem={({ item, index }) => (
            <LawyerCard lawyer={item} rank={index + 1} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
            />
          }
          testID="lawyers-list"
        />
      )}
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default RankingsScreen;
