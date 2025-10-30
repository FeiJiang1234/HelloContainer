import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import routes from './routes';
import OrganizationNavigator from './OrganizationNavigator';
import PostNavigator from './PostNavigator';
import CalendarNavigator from './CalendarNavigator';
import AchievementNavigator from './AchievementNavigator';
import TeamNavigator from './TeamNavigator';
import HeaderBar from './HeaderBar';
import TabBar from './TabBar';
import { useAuth, useNotifications } from 'el/utils';
import { athleteService } from 'el/api';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const { token, setToken, registerForPushNotificationsAsync } = useNotifications();
    const { user, setUser } = useAuth();

    useEffect(() => {
        if (!token) return;
        handleRegisterPushNotificationToken();
    }, [token]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', appState => {
            if (appState === 'active') {
                registerForPushNotificationsAsync().then(setToken);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const handleRegisterPushNotificationToken = async () => {
        setUser({...user, pushNotificationToken: token});
        await athleteService.registerPushNotificationToken(user.id, token, Platform.OS);
    };

    return (
        <Tab.Navigator
            initialRouteName={routes.Post}
            tabBar={props => <TabBar {...props} />}
            screenOptions={{
                header: props => <HeaderBar {...props} />,
            }}>
            <Tab.Screen name={routes.Post} component={PostNavigator} />
            <Tab.Screen name={routes.Calendar} component={CalendarNavigator} />
            <Tab.Screen name={routes.Achievement} component={AchievementNavigator} />
            <Tab.Screen name={routes.Organization} component={OrganizationNavigator} />
            <Tab.Screen name={routes.Team} component={TeamNavigator} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
