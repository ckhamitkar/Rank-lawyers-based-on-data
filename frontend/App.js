import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RankingsScreen from './src/screens/RankingsScreen';
import ConfigScreen from './src/screens/ConfigScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('rankings');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConfigSaved = () => {
    // Trigger refresh of rankings when config is saved
    setRefreshKey(prev => prev + 1);
    setActiveScreen('rankings');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {activeScreen === 'rankings' ? (
        <RankingsScreen key={refreshKey} />
      ) : (
        <ConfigScreen onConfigSaved={handleConfigSaved} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
