import React from 'react';
import { StyleSheet } from 'react-native';
import colors from '../config/colors';
import { LinearGradient } from 'expo-linear-gradient';
import routes from '../navigation/routes';
import {
    HomeSvg,
    CalendarSvg,
    AchievementSvg,
    OrganizationSvg,
    TeamSvg,
} from '../svgs';
import defaultStyles from '../config/styles';
import { isPad } from 'el/config/constants';
import { useLayoutOffset } from 'el/utils';
import { RootState } from 'el/store/store';
import { useSelector } from 'react-redux';
import { Pressable } from 'native-base';

export default function TabBar({ state, navigation }) {
    const { layoutOffsetLeft, layoutOffsetRight } = useLayoutOffset();
    const tabBarStyle = useSelector((state: RootState) => state.tabBar);

    const getTabBarColor = focused => {
        return focused ? colors.secondary : colors.white;
    };

    return (
        <LinearGradient {...colors.linear} style={[styles.bottom, { paddingLeft: layoutOffsetLeft, paddingRight: layoutOffsetRight }, tabBarStyle]}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                return (
                    <Pressable size={12} alignItems="center" justifyContent="center" onPress={onPress} style={styles.icon} key={index}>
                        {route.name === routes.Post && (
                            <HomeSvg
                                width={isPad ? 34 : 26}
                                height={isPad ? 35 : 27}
                                stroke={getTabBarColor(isFocused)}
                            />
                        )}
                        {route.name === routes.Calendar && (
                            <CalendarSvg
                                width={isPad ? 33 : 25}
                                height={isPad ? 34 : 27}
                                stroke={getTabBarColor(isFocused)}
                            />
                        )}
                        {route.name === routes.Achievement && (
                            <AchievementSvg
                                width={isPad ? 30 : 25}
                                height={isPad ? 35 : 30}
                                stroke={getTabBarColor(isFocused)}
                            />
                        )}
                        {route.name === routes.Organization && (
                            <OrganizationSvg
                                width={isPad ? 30 : 25}
                                height={isPad ? 30 : 25}
                                stroke={getTabBarColor(isFocused)}
                            />
                        )}
                        {route.name === routes.Team && (
                            <TeamSvg
                                width={isPad ? 30 : 25}
                                height={isPad ? 30 : 25}
                                stroke={getTabBarColor(isFocused)}
                            />
                        )}
                    </Pressable>
                );
            })}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    bottom: {
        flexDirection: 'row',
        height: defaultStyles.footerHight,
        alignItems: 'center'
    },
    icon: {
        flex: 1,
        alignItems: 'center',
    },
});
