import React from 'react';
import { useAuth } from '../utils';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import routes from '../navigation/routes';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../config/colors';
import { useDispatch } from 'react-redux';
import { CLEAR_POST } from 'el/store/slices/postSlice';
import { userService } from 'el/api';

const ElDrawer = ({ navigation }) => {
    const { user, logout } = useAuth();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        dispatch(CLEAR_POST());
        navigation.closeDrawer();
        if(user.pushNotificationToken){
            await userService.logout(user.pushNotificationToken);
        }
        logout();
    };

    return (
        <DrawerContentScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontWeight: 'bold' }}>Account Info</Text>
                <Pressable onPress={() => navigation.closeDrawer()}>
                    <Ionicons name="close" size={24} color={colors.black} />
                </Pressable>
            </View>
            <DrawerItem label="My Profile" onPress={() => navigation.navigate(routes.MyProfile)} />
            <DrawerItem
                label="Sign In and Account Security"
                onPress={() => navigation.navigate(routes.AccountSecurity)}
            />
            <DrawerItem
                label="Payment History"
                onPress={() => navigation.navigate(routes.PaymentHistory)}
            />
            <View style={{ flex: 1 }}></View>
            <View style={styles.logout}>
                <DrawerItem label="Log Out" onPress={handleLogout} />
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    header: {
        paddingLeft: 16,
        paddingRight: 16,
        height: 50,
        borderBottomColor: colors.light,
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    logout: {
        borderTopColor: colors.light,
        borderTopWidth: 1,
        height: 70,
    },
});

export default ElDrawer;
