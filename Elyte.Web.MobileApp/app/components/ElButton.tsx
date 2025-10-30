import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { Box, Flex, Text, View } from 'native-base';
import { isPad } from 'el/config/constants';

type PropType = {
    children: any;
    onPress?: any;
    variant?: 'contained' | 'outlined' | 'secondary' | 'disabled';
    disabled?: boolean;
    loading?: boolean;
    fontSize?: number;
    [rest: string]: any;
};

const ElButton: React.FC<PropType> = ({
    children,
    onPress,
    variant = 'contained',
    fontSize = 18,
    ...rest
}) => {
    const { width, size, disabled, loading, style, ...others } = rest;

    const textStyle = [styles.text, { fontSize }];
    const touchableStyle: any = [];
    const btnStyle = [styles.button, {}];

    if (size === 'sm') {
        btnStyle.push(styles.sm);
        textStyle.push({ fontSize: 14 });
        touchableStyle.push({ width: isPad ? 160 : 120 });
    }

    btnStyle.push(style);
    touchableStyle.push(style);

    if (disabled || loading)
        return (
            <View style={[...btnStyle, styles.disabled]} {...others}>
                <Text style={[...textStyle, styles.disabledText]}>{children}</Text>
                {loading && (
                    <Flex position='absolute' flex={1}>
                        <ActivityIndicator color={colors.primary} />
                    </Flex>
                )}
            </View>
        );

    return (
        <TouchableOpacity onPress={onPress} style={touchableStyle}>
            {variant === 'contained' && (
                <Box variant='linear' style={[...btnStyle]} {...others}>
                    <Text style={[...textStyle]}>{children}</Text>
                </Box>
            )}
            {variant === 'outlined' && (
                <View style={[...btnStyle, styles.outlined]} {...others}>
                    <Text style={[...textStyle, styles.outlinedText]}>{children}</Text>
                </View>
            )}
            {variant === 'secondary' && (
                <View style={[...btnStyle, styles.secondary]} {...others}>
                    <Text style={[...textStyle]}>{children}</Text>
                </View>
            )}
            {variant === 'disabled' && (
                <View style={[...btnStyle, styles.disabled]} {...others}>
                    <Text style={[...textStyle, styles.disabledText]}>{children}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 60,
    },
    sm: {
        width: isPad ? 160 : 120,
        height: 40,
    },
    outlined: {
        padding: 14,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.secondary,
    },
    disabled: {
        backgroundColor: colors.disabled,
    },
    text: {
        color: colors.white,
        fontWeight: 'bold',
    },
    outlinedText: {
        color: colors.primary,
    },
    disabledText: {
        color: colors.light,
        fontWeight: 'normal',
    },
});

export default ElButton;
