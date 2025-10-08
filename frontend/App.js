import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppProvider } from './src/context/AppContext';
import RankingsScreen from './src/screens/RankingsScreen';
import ConfigScreen from './src/screens/ConfigScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <AppProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Rankings') {
                  iconName = focused ? 'podium' : 'podium-outline';
                } else if (route.name === 'Config') {
                  iconName = focused ? 'cog' : 'cog-outline';
                }

                return (
                  <MaterialCommunityIcons
                    name={iconName}
                    size={size}
                    color={color}
                  />
                );
              },
              tabBarActiveTintColor: '#6200ee',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen
              name="Rankings"
              component={RankingsScreen}
              options={{
                tabBarLabel: 'Rankings',
              }}
            />
            <Tab.Screen
              name="Config"
              component={ConfigScreen}
              options={{
                tabBarLabel: 'Configuration',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </AppProvider>
    </PaperProvider>
  );
}
