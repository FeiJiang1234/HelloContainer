import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import Constants from 'expo-constants';
import { useLayoutOffset } from 'el/utils';

type PropType = {
    children: any;
    style?: any;
    withOffset?: boolean;
    [rest: string]: any;
};

const ElKeyboardAvoidingView = React.forwardRef<ScrollView, PropType>(
    ({ children, style, withOffset, ...rest }, ref) => {
        const offset = useHeaderHeight() + Constants.statusBarHeight;
        const { layoutOffsetLeft, layoutOffsetRight } = useLayoutOffset();

        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={withOffset ? offset : 0}
                style={styles.container}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    ref={ref}
                    style={[{ paddingLeft: layoutOffsetLeft + 16, paddingRight: layoutOffsetRight + 16 }, style]}
                    {...rest}>
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ElKeyboardAvoidingView;
