import React from 'react';
import routes from '../../navigation/routes';
import WelcomeOrganization4Svg from '../../svgs/welcomeOrganization4Svg';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeOrganization4Screen({ navigation }) {
  const btns = [
    { name: 'Skip', screen: routes.BottomTabNavigator, variant: 'outlined' },
    { name: 'Next', screen: routes.WelcomeOrganization5 },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='get organized'
      subtitle='Step 4. Use tools to manage your organization'
      image={<WelcomeOrganization4Svg width='239' height='230' />}
      btns={btns}
      dotCount={5}
      dotIndex={4}
    >
      Use the calendar scheduler, facility pages, officiate managment tools,
      messaging, and stat tracking modules to seamlessly manage your
      organization
    </WelcomeLayout>
  );
}
