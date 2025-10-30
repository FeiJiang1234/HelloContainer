import React from 'react';
import routes from '../../navigation/routes';
import WelcomeAthlete3Svg from '../../svgs/welcomeAthlete3Svg';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeAthlete3Screen({ navigation }) {
  const btns = [
    { name: 'Skip', screen: routes.BottomTabNavigator, variant: 'outlined' },
    { name: 'Next', screen: routes.WelcomeAthlete4 },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='go play'
      subtitle='Step 3. Find a League or Tournament (organizations)'
      image={<WelcomeAthlete3Svg width='236' height='273' />}
      btns={btns}
      dotCount={4}
      dotIndex={3}
    >
      Use the Organizations tab to locate places to play that are relevant to
      you. You can also create your own!
    </WelcomeLayout>
  );
}