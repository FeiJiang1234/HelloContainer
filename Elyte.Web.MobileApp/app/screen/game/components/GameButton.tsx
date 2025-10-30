import colors from 'el/config/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Pressable, Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

type PropType = {
    children: string;
    variant?: 'light' | 'dark';
    fontSize?: 'md' | 'lg';
    onPress?: any;
    disabled?: boolean;
};

const GameButton: React.FC<PropType> = ({
    children,
    onPress,
    disabled,
    fontSize = 'md',
    variant = 'light',
}) => {
    const getFontSize = () => {
        if (fontSize === 'md') return 16;
        if (fontSize === 'lg') return 24;
    };

    if (disabled) {
        return (
            <Box style={styles.box} bgColor={colors.disabled}>
                <Text color={colors.light} fontSize={getFontSize()}>
                    {children}
                </Text>
            </Box>
        );
    }

    if (variant === 'light')
        return (
            <Pressable onPress={onPress} style={styles.box} bgColor={colors.light}>
                <Text color={colors.primary} fontSize={getFontSize()}>
                    {children}
                </Text>
            </Pressable>
        );

    return (
        <Pressable onPress={onPress} style={{ flex: 1 }}>
            <LinearGradient {...colors.linear} style={styles.box}>
                <Text color={colors.white} fontSize={getFontSize()}>
                    {children}
                </Text>
            </LinearGradient>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 4,
    },
});

export default GameButton;
