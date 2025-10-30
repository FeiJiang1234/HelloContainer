import React, { useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import colors from 'el/config/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Center, Flex, Pressable, Text, View } from 'native-base';

type PropType = {
    text?: string;
    textOn?: string;
    textOff?: string;
    fullWidth?: boolean;
    value: boolean;
    onToggle: Function;
    [rest: string]: any;
};

const ElSwitch: React.FC<PropType> = ({ onToggle, textOn = 'On', textOff = 'Off', ...rest }) => {
    const { text, value, fullWidth, ...others } = rest;
    const [switchWidth, setSwitchWidth] = useState<number>(0);
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        progress.setValue(value ? switchWidth / 2 : 0);
    }, [switchWidth]);

    useEffect(() => {
        Animated.timing(progress, {
            toValue: value ? switchWidth / 2 : 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [value]);

    const onToggleSwitch = async () => {
        await onToggle(!value);
    };

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setSwitchWidth(width);
    };

    return (
        <Flex direction="row" align="center" justify="space-between" {...others}>
            {text && <Text color={colors.medium}>{text}</Text>}
            <Pressable
                onLayout={onLayout}
                onPress={onToggleSwitch}
                w={100}
                flex={fullWidth ? 1 : 0}>
                <LinearGradient {...colors.linear} style={{ borderRadius: 10 }}>
                    <Flex direction="row" justify="space-between">
                        <Animated.View
                            style={[
                                styles.sliderContainer,
                                {
                                    transform: [
                                        {
                                            translateX: progress,
                                        },
                                    ],
                                },
                            ]}>
                            <View style={styles.slider}></View>
                        </Animated.View>
                        <Center flex={1} h={9}>
                            <Text color={colors.white} fontSize={12}>
                                {textOff}
                            </Text>
                        </Center>
                        <Center flex={1} h={9}>
                            <Text color={colors.white} fontSize={12}>
                                {textOn}
                            </Text>
                        </Center>
                    </Flex>
                </LinearGradient>
            </Pressable>
        </Flex>
    );
};

const styles = StyleSheet.create({
    sliderContainer: {
        width: '50%',
        position: 'absolute',
        top: 6,
    },
    slider: {
        backgroundColor: colors.secondary,
        height: 24,
        borderRadius: 5,
        marginLeft: 4,
        marginRight: 4,
    },
});

export default ElSwitch;
