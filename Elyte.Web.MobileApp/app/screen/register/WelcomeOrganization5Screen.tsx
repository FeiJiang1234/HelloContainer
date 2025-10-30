import React from 'react';
import routes from '../../navigation/routes';
import WelcomeOrganization5Svg from '../../svgs/welcomeOrganization5Svg';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeOrganization5Screen({ navigation }) {
  const btns = [
    { name: 'Skip', screen: routes.BottomTabNavigator, variant: 'outlined' },
    { name: 'Next', screen: routes.BottomTabNavigator },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='give feedback'
      subtitle='Step 5. Tell us what we can do better to make your life easier!'
      image={<WelcomeOrganization5Svg width='239' height='230' />}
      btns={btns}
      dotCount={5}
      dotIndex={5}
    >
      {'Email us: support@elyte.app\nMessage user: Support Elyte'}
    </WelcomeLayout>
  );
}
