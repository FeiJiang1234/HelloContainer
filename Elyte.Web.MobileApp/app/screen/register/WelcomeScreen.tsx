import React from 'react';
import routes from '../../navigation/routes';
import { WelcomeSvg } from '../../svgs';
import WelcomeLayout from './components/WelcomeLayout';

export default function WelcomeScreen({ navigation }) {
  const btns = [
    { name: 'Organization', screen: routes.WelcomeOrganization1 },
    { name: 'Athlete', screen: routes.WelcomeAthlete1 },
  ];

  return (
    <WelcomeLayout
      navigation={navigation}
      title='Welcome to Elyte!'
      subtitle='Which are you?'
      image={<WelcomeSvg width="238" height="257"/>}
      btns={btns}
      dotCount={4}
      dotIndex={1}
    >
      There are multiple ways to interact with the platform.
    </WelcomeLayout>
  );
}