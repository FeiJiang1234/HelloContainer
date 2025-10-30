import React from 'react';
import colors from 'el/config/colors';
import { useToast, Text, Pressable, Row } from 'native-base';
import { useWindowDimensions } from 'react-native';
import ElIcon from 'el/components/ElIcon';

const useElToast = () => {
    const toast = useToast();

    const error = (message, placement: any = 'bottom') => {
        toast.show({
            render: () => {
                return (
                    <ToastBox
                        icon="alert-circle-outline"
                        bg={colors.danger}
                        onPress={() => toast.closeAll()}>
                        {message}
                    </ToastBox>
                );
            },
            placement: placement,
        });
    };

    const warning = (message, placement: any = 'bottom') => {
        toast.show({
            render: () => {
                return (
                    <ToastBox icon="cancel" bg="#FFE27B" onPress={() => toast.closeAll()}>
                        {message}
                    </ToastBox>
                );
            },
            placement: placement,
        });
    };

    const info = (message, placement: any = 'bottom') => {
        toast.show({
            render: () => {
                return (
                    <ToastBox
                        icon="alert-circle-outline"
                        bg="#6096FF"
                        onPress={() => toast.closeAll()}>
                        {message}
                    </ToastBox>
                );
            },
            placement: placement,
        });
    };

    const success = (message, placement: any = 'bottom') => {
        toast.show({
            render: () => {
                return (
                    <ToastBox
                        icon="check-circle-outline"
                        bg={colors.secondary}
                        onPress={() => toast.closeAll()}>
                        {message}
                    </ToastBox>
                );
            },
            placement: placement,
        });
    };

    return { success, warning, error, info };
};

const ToastBox = ({ onPress, icon, bg, children }) => {
    const { width } = useWindowDimensions();
    return (
        <Pressable onPress={onPress}>
            <Row
                bg={bg}
                p={2}
                pr={8}
                mb={2}
                width={width - 16}
                minHeight={16}
                alignItems='center'
                borderRadius={8}>
                <ElIcon name={icon} color={colors.white} mr={1} />
                <Text color={colors.white}>{children}</Text>
            </Row>
        </Pressable>
    );
};

export default useElToast;
