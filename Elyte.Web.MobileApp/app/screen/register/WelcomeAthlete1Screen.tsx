import React from 'react';
import routes from '../../navigation/routes';
import WelcomeAthlete1Svg from '../../svgs/welcomeAthlete1Svg';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeAthlete1Screen({ navigation }) {
  const btns = [
    { name: 'Skip', screen: routes.BottomTabNavigator, variant: 'outlined' },
    { name: 'Next', screen: routes.WelcomeAthlete2 },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='get set up'
      subtitle='Step 1. Set up your account'
      image={<WelcomeAthlete1Svg width='239' height='230' />}
      btns={btns}
      dotCount={4}
      dotIndex={1}
    >
      Get all your account information correct. This will help ensure you can
      find teams and places to play.
    </WelcomeLayout>
  );
}
