import { Input } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import colors from '../config/colors';
import defaultStyles from '../config/styles';

type PropType = {
    style?: any;
    name?: string;
    placeholder?: string;
    defaultValue?: any;
    hideLabel?: boolean;
    hideAccessory?: boolean;
    disabled?: boolean;
    inputAccessoryViewID?: any;
    [rest: string]: any;
};

const ElInput: React.FC<PropType> = ({
    style,
    inputAccessoryViewID = 'InputAccessoryDone',
    ...rest
}) => {
    const { placeholder, defaultValue, hideLabel, name, hideAccessory, disabled } = rest;
    const [isShowLabel, setIsShowLabel] = useState(false);

    const handleOnChange = ({ nativeEvent: { eventCount, target, text } }) =>
        setIsShowLabel(text !== undefined && text !== '');

    return (
        <View style={styles.container}>
            {!hideLabel && (defaultValue || isShowLabel) && (
                <Text style={styles.label}>{placeholder}</Text>
            )}
            <Input
                autoCapitalize="none"
                spellCheck={false}
                autoCorrect={false}
                placeholder={placeholder}
                placeholderTextColor={colors.medium}
                flex={1}
                borderWidth={0}
                bgColor={colors.light}
                style={style ? [defaultStyles.text, style] : defaultStyles.text}
                onChange={handleOnChange}
                inputAccessoryViewID={hideAccessory ? 'hideAccessory' : inputAccessoryViewID}
                testID={name}
                isDisabled={disabled}
                {...rest}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        borderRadius: 15,
        flexDirection: 'row',
        padding: 6,
        marginVertical: 10,
    },
    label: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'ios' ? -8 : -10,
        fontSize: 12,
        color: colors.medium,
    },
});

export default ElInput;
