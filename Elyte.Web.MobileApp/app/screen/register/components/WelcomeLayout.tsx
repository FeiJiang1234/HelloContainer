import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ElContainer, ElButton, H3, H5, ElIcon, Typography } from 'el/components';
import colors from 'el/config/colors';
import routes from 'el/navigation/routes';

export default function WelcomeLayout({
    navigation,
    title,
    subtitle,
    image,
    children,
    btns,
    dotCount,
    dotIndex,
}) {
    const dots: any[] = [];
    for (var i = 0; i < dotCount; i++) {
        dots.push(
            <ElIcon
                key={i}
                name="checkbox-blank-circle"
                size={2}
                color={dotIndex === i + 1 ? colors.primary : colors.light}
                style={i > 0 && { marginLeft: 8 }}
            />,
        );
    }

    const handleGoNext = item => {
        if (item.screen === routes.BottomTabNavigator) {
            navigation.navigate(routes.DrawerNavigator, { screen: routes.BottomTabNavigator });
        } else {
            navigation.navigate(item.screen);
        }
    };

    return (
        <ElContainer style={styles.container}>
            <H3 style={styles.title}>{title}</H3>
            <H5 style={styles.subTitle}>{subtitle}</H5>
            <View style={styles.image}>{image}</View>
            <Typography style={styles.description}>{children}</Typography>

            <View style={styles.action}>
                {btns.map(btn => (
                    <View
                        key={btn.name}
                        style={{ flex: 1, marginBottom: 8, paddingLeft: 4, paddingRight: 4 }}>
                        <ElButton
                            fontSize={14}
                            onPress={() => handleGoNext(btn)}
                            variant={btn.variant ? btn.variant : 'contained'}>
                            {btn.name}
                        </ElButton>
                    </View>
                ))}
            </View>
            <View style={styles.dots}>{dots}</View>
        </ElContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16,
    },
    title: {
        color: colors.primary,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subTitle: {
        color: colors.primary,
        textAlign: 'center',
    },
    description: {
        color: colors.medium,
        textAlign: 'center',
    },
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
});
