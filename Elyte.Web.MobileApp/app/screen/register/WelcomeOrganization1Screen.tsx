import React from 'react';
import routes from '../../navigation/routes';
import WelcomeOrganization1Svg from '../../svgs/welcomeOrganization1Svg';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeOrganization1Screen({ navigation }) {
  const btns = [
    { name: 'Skip', screen: routes.BottomTabNavigator, variant: 'outlined' },
    { name: 'Next', screen: routes.WelcomeOrganization2 },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='get set up'
      subtitle='Step 1. Set up your account'
      image={<WelcomeOrganization1Svg width='239' height='230' />}
      btns={btns}
      dotCount={5}
      dotIndex={1}
    >
      Your personal account will make it easier to set up your organizations and
      will be a place to show how much you do
    </WelcomeLayout>
  );
}
