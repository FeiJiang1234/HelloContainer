import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import React from 'react';
import colors from 'el/config/colors';
import { Text } from 'native-base';

type PropType = {
    children: any;
    to: string;
    params?: any;
    style?: any;
    [rest: string]: any;
};

const ElLink: React.FC<PropType> = ({ children, to, params, style, ...rest }) => {
    const navigation: any = useNavigation();
    return (
        <Text
            style={[styles.link, style]}
            onPress={() => navigation.navigate(to, params)}
            {...rest}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    link: {
        color: colors.secondary,
    },
});

export default ElLink;
