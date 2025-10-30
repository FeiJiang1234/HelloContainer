import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import LoginScreen from '../screen/login/LoginScreen';
import RegisterScreen from '../screen/register/RegisterScreen';
import ResetPasswordScreen from '../screen/resetPassword/ResetPasswordScreen';
import ContactUsScreen from '../screen/contactUs/ContactUsScreen';
import AuthHeaderBar from './AuthHeaderBar';
import TermsOfServiceScreen from '../screen/terms/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screen/terms/PrivacyPolicyScreen';
import VerificationCodeScreen from 'el/screen/resetPassword/VerificationCodeScreen';
import OneTimePassCodeScreen from 'el/screen/resetPassword/OneTimePassCodeScreen';
import EnterNewPassScreen from 'el/screen/resetPassword/EnterNewPassScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={routes.Login}
            screenOptions={{
                header: props => <AuthHeaderBar {...props} />,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            <Stack.Screen
                name={routes.Login}
                component={LoginScreen}
                options={{ headerTitle: '', animationEnabled: false }}
            />
            <Stack.Screen
                name={routes.Register}
                component={RegisterScreen}
            />
            <Stack.Screen
                name={routes.ResetPassword}
                component={ResetPasswordScreen}
            />
            <Stack.Screen
                name={routes.VerificationCode}
                component={VerificationCodeScreen}
            />
            <Stack.Screen
                name={routes.OneTimePassCode}
                component={OneTimePassCodeScreen}
            />
            <Stack.Screen
                name={routes.EnterNewPass}
                component={EnterNewPassScreen}
            />
            <Stack.Screen
                name={routes.ContactUs}
                component={ContactUsScreen}
            />
            <Stack.Screen
                name={routes.TermsOfService}
                component={TermsOfServiceScreen}
            />
            <Stack.Screen
                name={routes.PrivacyPolicy}
                component={PrivacyPolicyScreen}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
