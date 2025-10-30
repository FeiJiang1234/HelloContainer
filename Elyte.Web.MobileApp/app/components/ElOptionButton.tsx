import { Box, Flex } from 'native-base';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

type PropType = {
    icon: any;
    children: any;
    onPress?: any;
    [rest: string]: any;
};

const ElOptionButton: React.FC<PropType> = ({ icon, children, onPress, ...rest }) => {
    return (
        <Pressable onPress={onPress}>
            <Box my={1} pl={4} style={styles.root} {...rest}>
                {icon && (
                    <Flex mr={2} minW={8} align="center">
                        {icon}
                    </Flex>
                )}
                {children}
            </Box>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#F0F2F7',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        height: 56,
        fontSize: 18,
        fontWeight: 500,
        position: 'relative',
    },
});

export default ElOptionButton;
