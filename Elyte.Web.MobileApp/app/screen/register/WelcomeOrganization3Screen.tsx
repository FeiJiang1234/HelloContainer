import React from 'react';
import routes from '../../navigation/routes';
import WelcomeOrganization3Svg from '../../svgs/welcomeOrganization3Svg';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeOrganization3Screen({ navigation }) {
  const btns = [
    { name: 'Skip', screen: routes.BottomTabNavigator, variant: 'outlined' },
    { name: 'Next', screen: routes.WelcomeOrganization4 },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='become official'
      subtitle='Step 3. Use the sign up to get your official ID'
      image={<WelcomeOrganization3Svg width='239' height='230' />}
      btns={btns}
      dotCount={5}
      dotIndex={3}
    >
      When setting up an organization you have the option to be Official or
      Unofficial. Official stats matter, Unofficial is for fun.
    </WelcomeLayout>
  );
}
