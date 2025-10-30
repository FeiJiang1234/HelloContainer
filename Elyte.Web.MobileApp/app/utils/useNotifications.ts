import { Platform } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { NotificationResponse } from 'expo-notifications';
import useElToast from './useElToast';
import useNotificationRouter from './useNotificationRouter';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const useNotifications = () => {
    const [token, setToken] = useState();
    const resListener: any = useRef();
    const toast = useElToast();
    const { getProfileRoute } = useNotificationRouter();

    useEffect(() => {
        registerForPushNotificationsAsync().then(setToken);
        resListener.current = Notifications.addNotificationResponseReceivedListener(
            handleNotificationResponse,
        );
    }, []);

    const handleNotificationResponse = (res: NotificationResponse) => {
        const data = res.notification.request.content.data;
        getProfileRoute(data.Action, data.Parameters);
    };

    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            toast.error('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    };

    return { token, setToken, registerForPushNotificationsAsync };
};

export default useNotifications;
