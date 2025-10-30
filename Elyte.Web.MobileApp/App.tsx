import { useState, useEffect } from 'react';
import { AppState } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { ElAccessoryDone, ElScreen } from './app/components';
import AppNavigator from 'el/navigation/AppNavigator';
import { AuthContext } from 'el/auth/context';
import authStorage from 'el/auth/storage';
import * as SplashScreen from 'expo-splash-screen';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { store } from 'el/store/store';
import theme from './theme';
import { useSignalR } from 'el/utils';
import { StripeProvider } from '@stripe/stripe-react-native';
import config from 'el/config/config';
import * as Sentry from 'sentry-expo';

const nativeBaseConfig = {
    dependencies: {
      'linear-gradient': require('expo-linear-gradient').LinearGradient,
    },
  };

SplashScreen.preventAutoHideAsync();

Sentry.init({
    dsn: config.dsn
});

const App = () => {
    const { refresh } = useSignalR();
    const [user, setUser] = useState();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === 'active') {
                refresh();
            }
        });
        restoreUser();
    }, []);

    useEffect(() => {
        if (isReady) onLayoutRootView();
    }, [isReady]);

    const restoreUser = async () => {
        const user: any = await authStorage.getUser();
        if (user) {
            setUser(user);
        }
        setIsReady(true);
    };

    const onLayoutRootView = async () => {
        await SplashScreen.hideAsync();
    };

    if (!isReady) return null;

    return (
        <NativeBaseProvider theme={theme} config={nativeBaseConfig}>
            <AuthContext.Provider value={{ user, setUser }}>
                <Provider store={store}>
                    <ElScreen>
                        <AppNavigator />
                        <StatusBar style="auto" />
                    </ElScreen>
                </Provider>
            </AuthContext.Provider>
            <ElAccessoryDone />
        </NativeBaseProvider>
    );
}

export default Sentry.Native.wrap(App);