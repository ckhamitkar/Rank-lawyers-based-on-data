import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LawyerCard = ({ lawyer, rank }) => {
  return (
    <View style={styles.card} testID={`lawyer-card-${rank}`}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>#{rank}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{lawyer.Name}</Text>
        <Text style={styles.score}>Score: {lawyer.score?.toFixed(2)}</Text>
        <View style={styles.metricsContainer}>
          {Object.entries(lawyer).map(([key, value]) => {
            if (key !== 'Name' && key !== 'score') {
              return (
                <Text key={key} style={styles.metric}>
                  {key}: {value}
                </Text>
              );
            }
            return null;
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    minWidth: 40,
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  score: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metric: {
    fontSize: 12,
    color: '#888',
    marginRight: 12,
    marginVertical: 2,
  },
});

export default LawyerCard;
