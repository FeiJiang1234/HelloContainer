import React from 'react';
import routes from '../../navigation/routes';
import WelcomeAthlete2Svg from '../../svgs/welcomeAthlete2Svg';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeAthlete2Screen({ navigation }) {
  const btns = [
    { name: 'Skip', screen: routes.BottomTabNavigator, variant: 'outlined' },
    { name: 'Next', screen: routes.WelcomeAthlete3 },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='team up'
      subtitle='Step 2. Create or join a team'
      image={<WelcomeAthlete2Svg width='258' height='255' />}
      btns={btns}
      dotCount={4}
      dotIndex={2}
    >
      You can search for a local team to join or create one yourself by going to
      the Teams Tab
    </WelcomeLayout>
  );
}
