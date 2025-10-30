import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import LeaderboardScreen from '../screen/achieve/LeaderboardScreen';

const Stack = createStackNavigator();

const AchievementNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen
        name={routes.Leaderboard}
        component={LeaderboardScreen}
      />
    </Stack.Navigator>
  );
};

export default AchievementNavigator;
