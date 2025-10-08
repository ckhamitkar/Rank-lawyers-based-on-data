import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  ActivityIndicator,
  Appbar,
  Chip,
} from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

const RankingsScreen = () => {
  const { lawyers, loading, error, loadLawyers } = useAppContext();

  const onRefresh = () => {
    loadLawyers();
  };

  if (loading && lawyers.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading rankings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Lawyer Rankings" />
      </Appbar.Header>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {lawyers.map((lawyer, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Chip style={styles.rankChip} textStyle={styles.rankChipText}>
                  #{index + 1}
                </Chip>
                <Title style={styles.lawyerName}>{lawyer.Name}</Title>
              </View>
              
              {lawyer.Firm && (
                <Paragraph style={styles.firm}>
                  <Text style={styles.label}>Firm: </Text>
                  {lawyer.Firm}
                </Paragraph>
              )}
              
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Score: </Text>
                <Text style={styles.scoreValue}>
                  {lawyer.score ? lawyer.score.toFixed(2) : 'N/A'}
                </Text>
              </View>
              
              <View style={styles.detailsContainer}>
                {lawyer['Chambers Rank'] && (
                  <Text style={styles.detail}>
                    Chambers Rank: {lawyer['Chambers Rank']}
                  </Text>
                )}
                {lawyer['Years PE'] && (
                  <Text style={styles.detail}>
                    Years PE: {lawyer['Years PE']}
                  </Text>
                )}
                {lawyer['Law360 News'] && (
                  <Text style={styles.detail}>
                    Law360 News: {lawyer['Law360 News']}
                  </Text>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
        
        {lawyers.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No lawyers found</Text>
          </View>
        )}
      </ScrollView>
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankChip: {
    marginRight: 10,
    backgroundColor: '#6200ee',
  },
  rankChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  lawyerName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  firm: {
    marginBottom: 8,
    color: '#666',
  },
  label: {
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  detailsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
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

export default RankingsScreen;
