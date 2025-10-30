import { Pressable, StyleSheet } from 'react-native';
import React from 'react';
import colors from 'el/config/colors';
import { Text } from 'native-base';

type PropType = {
    children: any;
    onPress?: any;
    style?: any;
    [rest: string]: any;
};

const ElLinkBtn: React.FC<PropType> = ({ children, onPress, style, ...rest }) => {
    return (
        <Pressable onPress={onPress}>
            <Text style={[styles.link, style]} {...rest}>
                {children}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    link: {
        color: colors.secondary,
    },
});

export default ElLinkBtn;
