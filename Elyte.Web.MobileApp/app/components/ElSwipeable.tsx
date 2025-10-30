import React, { useRef, useState } from 'react';
import { StyleSheet, Animated, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Box, Text, View } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import colors from 'el/config/colors';
import ElIcon from './ElIcon';
import ElConfirm from './ElConfirm';
import { ActionModel } from 'el/models/action/actionModel';

type PropType = {
    children: any;
    data?: any;
    size?: number;
    disabled?: boolean;
    options: ActionModel[] | undefined;
};

const ElSwipeable: React.FC<PropType> = ({ children, disabled, data, size = 80, options = [] }) => {
    const swipeableRow = useRef<any>(null);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [selectedOption, setSelectedOption] = useState<ActionModel>();

    const renderRightActions = progress => {
        if (disabled) return;

        return (
            <View style={{ width: size * options.length, flexDirection: 'row' }}>
                {options.map((option: any, index) => (
                    <React.Fragment key={option.label || option.icon}>
                        {renderRightAction(option, (options.length - index) * size, progress)}
                    </React.Fragment>
                ))}
            </View>
        );
    };

    const renderRightAction = (option: ActionModel, size, progress) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [size, 0],
        });

        return (
            <Animated.View
                style={{
                    flex: 1,
                    borderRightColor: colors.white,
                    borderRightWidth: StyleSheet.hairlineWidth,
                    transform: [{ translateX: trans }],
                    backgroundColor: option.color,
                }}>
                <Pressable onPress={() => pressHandler(option)}>
                    {option.color ? (
                        <Box style={styles.container}>
                            {option.label && <Text style={styles.actionText}>{option.label}</Text>}
                            {option.icon && <ElIcon color="white" name={option.icon} size={28} />}
                        </Box>
                    ) : (
                        <LinearGradient {...colors.linear} style={styles.container}>
                            {option.label && <Text style={styles.actionText}>{option.label}</Text>}
                            {option.icon && <ElIcon color="white" name={option.icon} size={28} />}
                        </LinearGradient>
                    )}
                </Pressable>
            </Animated.View>
        );
    };

    const pressHandler = (option: ActionModel) => {
        if (option.confirmMessage) {
            setIsShowConfirm(true);
            setSelectedOption(option);
        } else {
            swipeableRow.current.close();
            option.onPress(data);
        }
    };

    const handleOnCancel = () => {
        swipeableRow.current.close();
        setIsShowConfirm(false);
    };

    const handleOnConfirm = async () => {
        await selectedOption?.onPress(data);
        swipeableRow.current.close();
        setIsShowConfirm(false);
    };

    return (
        <>
            <Swipeable renderRightActions={renderRightActions} ref={swipeableRow}>
                {children}
            </Swipeable>
            {isShowConfirm && (
                <ElConfirm
                    visible={isShowConfirm}
                    message={selectedOption?.confirmMessage}
                    onCancel={handleOnCancel}
                    onConfirm={handleOnConfirm}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ElSwipeable;
