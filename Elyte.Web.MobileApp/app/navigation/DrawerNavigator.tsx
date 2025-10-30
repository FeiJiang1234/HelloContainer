import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import routes from './routes';
import ElDrawer from './ElDrawer';
import { StripeProvider } from '@stripe/stripe-react-native';
import { athleteService, userService } from 'el/api';

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
    const [publishableKey, setPublishableKey] = useState('');
    useEffect(() => {
        getStripePublishableKey();
    }, [])

    const getStripePublishableKey = async () => {
        const res: any = await userService.getStripePublishableKey();
        if (res && res.code == 200) {
            setPublishableKey(res?.value);
        }
    }

    return (
        <StripeProvider publishableKey={publishableKey}>
            <Drawer.Navigator
                useLegacyImplementation
                drawerContent={props => <ElDrawer {...props} />}
                screenOptions={{
                    drawerPosition: 'right',
                    drawerType: 'front',
                    swipeEnabled: false,
                    headerShown: false,
                }}>
                <Drawer.Screen name={routes.BottomTabNavigator} component={BottomTabNavigator} />
            </Drawer.Navigator>
        </StripeProvider>
    );
};

export default DrawerNavigator;
