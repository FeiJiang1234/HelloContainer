import React from 'react';
import routes from '../../navigation/routes';
import WelcomeOrganization2Svg from '../../svgs/welcomeOrganization2Svg';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeOrganization2Screen({ navigation }) {
  const btns = [
    { name: 'Skip', screen: routes.BottomTabNavigator, variant: 'outlined' },
    { name: 'Next', screen: routes.WelcomeOrganization3 },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='start creating'
      subtitle='Step 2. Create an Organization'
      image={<WelcomeOrganization2Svg width='239' height='230' />}
      btns={btns}
      dotCount={5}
      dotIndex={2}
    >
      Use our simplistic forms to set up Leagues, Tournaments, or your
      Association
    </WelcomeLayout>
  );
}
