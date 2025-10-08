import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WeightSlider = ({ label, value, onChange, testID }) => {
  // Simple increment/decrement buttons for testing purposes
  // In production, you would use a proper slider component like @react-native-community/slider
  const increment = () => {
    if (value < 5) {
      onChange(Math.min(5, value + 0.5));
    }
  };

  const decrement = () => {
    if (value > 0) {
      onChange(Math.max(0, value - 0.5));
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value.toFixed(1)}</Text>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={decrement}
          testID={`${testID}-decrease`}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <View style={styles.sliderBar}>
          <View
            style={[styles.sliderFill, { width: `${(value / 5) * 100}%` }]}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={increment}
          testID={`${testID}-increase`}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sliderBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#DEDEDE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
});

export default WeightSlider;
