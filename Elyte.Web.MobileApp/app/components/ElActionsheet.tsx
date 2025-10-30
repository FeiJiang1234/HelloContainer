import colors from 'el/config/colors';
import { ActionModel } from 'el/models/action/actionModel';
import { Actionsheet, Box, Divider, FlatList, Text } from 'native-base';
import React, { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import ElIcon from './ElIcon';

type PropType = {
    isOpen: boolean,
    onClose?: (() => any) | undefined,
    onSelectedItem?: any;
    items: ActionModel[] | undefined;
    disabled?: boolean;
    title?: string;
    subtitle?: string;
    titleAlignItems?: string;
    alignItems?: string;
    valueField?: string;
    textField?: string;
    isShowCancel?: boolean;
    isShowSelectIcon?: boolean;
    [rest: string]: any;
};

const ElActionsheet: React.FC<PropType> = ({
    isOpen,
    onClose,
    onSelectedItem,
    items,
    title,
    subtitle,
    titleAlignItems = 'center',
    alignItems = 'center',
    valueField = 'value',
    textField = 'label',
    isShowCancel = true,
    isShowSelectIcon = false,
    ...rest
}) => {
    const { value, disabled, ...others } = rest;

    return (
        <Actionsheet isOpen={isOpen} onClose={onClose} useRNModal={Platform.OS === 'ios'} {...others} >
            <Actionsheet.Content w="full">
                {title && <Box w="full" px={4} mb={2} alignItems={titleAlignItems}>
                    <Text fontSize="16">
                        {title}
                    </Text>
                </Box>
                }
                {subtitle && <Box w="full" px={4} mb={2} alignItems={titleAlignItems}>
                    <Text color={colors.medium}>
                        {subtitle}
                    </Text>
                </Box>
                }
                {(title || subtitle) && <Divider />}
                <FlatList
                    w="full"
                    keyExtractor={(_item, index) => index.toString()}
                    data={items?.filter(x => !x.isHide)}
                    renderItem={({ item }: any) => {
                        const isSelected = value == item[valueField];
                        return <React.Fragment key={`${item[valueField]}`}>
                            <Actionsheet.Item
                                alignItems={alignItems}
                                {...(isShowSelectIcon && isSelected && { endIcon: <ElIcon name='check' color={colors.secondary} style={styles.checkIcon} size={25} /> })}
                                onPress={(e) => {
                                    if (item[valueField] != value) {
                                        onSelectedItem && onSelectedItem(item);
                                    }
                                    item?.onPress && item.onPress(e);
                                    onClose && onClose();
                                }}
                            >
                                <Text color={item?.color}>{item[textField] || ""}</Text>
                            </Actionsheet.Item>
                            <Divider />
                        </React.Fragment>
                    }}
                />
                {
                    isShowCancel && <>
                        <Divider height={2} />
                        <Actionsheet.Item alignItems={alignItems} onPress={onClose}><Text color={colors.blue}>Cancel</Text></Actionsheet.Item>
                    </>
                }
            </Actionsheet.Content>
        </Actionsheet >
    );
};

export default ElActionsheet;

const styles = StyleSheet.create({
    checkIcon: {
        position: 'absolute',
        right: 0
    },
});