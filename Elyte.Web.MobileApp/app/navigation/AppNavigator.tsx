import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import theme from './navigationTheme';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import { useAuth } from 'el/utils';
import { ElLoader } from 'el/components';
import { useSelector } from 'react-redux';
import { RootState } from 'el/store/store';
import { requestStatus } from 'el/models/requestStatus';
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import WelcomeScreen from 'el/screen/register/WelcomeScreen';
import WelcomeAthlete1Screen from 'el/screen/register/WelcomeAthlete1Screen';
import WelcomeOrganization1Screen from 'el/screen/register/WelcomeOrganization1Screen';
import WelcomeAthlete2Screen from 'el/screen/register/WelcomeAthlete2Screen';
import WelcomeAthlete3Screen from 'el/screen/register/WelcomeAthlete3Screen';
import WelcomeAthlete4Screen from 'el/screen/register/WelcomeAthlete4Screen';
import WelcomeOrganization2Screen from 'el/screen/register/WelcomeOrganization2Screen';
import WelcomeOrganization3Screen from 'el/screen/register/WelcomeOrganization3Screen';
import WelcomeOrganization4Screen from 'el/screen/register/WelcomeOrganization4Screen';
import WelcomeOrganization5Screen from 'el/screen/register/WelcomeOrganization5Screen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user } = useAuth();
    const status = useSelector((state: RootState) => state.request);

    return (
        <NavigationContainer theme={theme}>
            <ElLoader visible={status === requestStatus.PENDING} />
            {
                user &&
                <Stack.Navigator
                    initialRouteName={user.isRegister ? routes.Welcome : routes.DrawerNavigator}
                    screenOptions={{ headerShown: false }}>
                    <Stack.Screen name={routes.DrawerNavigator} component={DrawerNavigator} />
                    <Stack.Screen name={routes.Welcome} component={WelcomeScreen} />
                    <Stack.Screen name={routes.WelcomeAthlete1} component={WelcomeAthlete1Screen} />
                    <Stack.Screen name={routes.WelcomeAthlete2} component={WelcomeAthlete2Screen} />
                    <Stack.Screen name={routes.WelcomeAthlete3} component={WelcomeAthlete3Screen} />
                    <Stack.Screen name={routes.WelcomeAthlete4} component={WelcomeAthlete4Screen} />
                    <Stack.Screen name={routes.WelcomeOrganization1} component={WelcomeOrganization1Screen} />
                    <Stack.Screen name={routes.WelcomeOrganization2} component={WelcomeOrganization2Screen} />
                    <Stack.Screen name={routes.WelcomeOrganization3} component={WelcomeOrganization3Screen} />
                    <Stack.Screen name={routes.WelcomeOrganization4} component={WelcomeOrganization4Screen} />
                    <Stack.Screen name={routes.WelcomeOrganization5} component={WelcomeOrganization5Screen} />
                </Stack.Navigator>
            }
            {!user && <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;
