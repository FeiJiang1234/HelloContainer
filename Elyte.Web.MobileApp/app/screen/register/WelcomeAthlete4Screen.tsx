import React from 'react';
import routes from '../../navigation/routes';
import WelcomeAthlete4Svg from '../../svgs/welcomeAthlete4Svg';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeAthlete4Screen({ navigation }) {
  const btns = [
    { name: 'Skip', screen: routes.BottomTabNavigator, variant: 'outlined' },
    { name: 'Next', screen: routes.BottomTabNavigator },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='be legendary'
      subtitle='Step 4. Level up and show your skills to the World'
      image={<WelcomeAthlete4Svg width='227' height='266' />}
      btns={btns}
      dotCount={4}
      dotIndex={4}
    >
      ELYTE is your window to the world. Level up by playing in Official
      Organizations and share your stats and growth across the platform!
    </WelcomeLayout>
  );
}
