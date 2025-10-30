import React from 'react';
import { SportType } from 'el/enums';
import { Flex, Text, useDisclose } from 'native-base';
import ElIcon from './ElIcon';
import colors from 'el/config/colors';
import { ActionModel } from 'el/models/action/actionModel';
import ElActionsheet from './ElActionsheet';
import { Pressable } from 'react-native';

export default function SportSelect({ sportType, onTabclick, ...rest }) {
    const { isOpen, onOpen, onClose } = useDisclose();

    const menuItems = (): ActionModel[] => {
        const sports = Object.keys(SportType);
        return sports.map(x=> ({
            label: x,
            onPress: () => onTabclick(x)
        }));
    };

    return (
        <>
            <Flex direction="row" justifyContent="space-between" mb="2" {...rest}>
                <Text color={colors.medium}>{sportType}</Text>
                <Pressable onPress={onOpen}>
                    <ElIcon name="chevron-down" />
                </Pressable>
            </Flex>
            <ElActionsheet isOpen={isOpen} onClose={onClose} items={menuItems()} />
        </>
    );
}
