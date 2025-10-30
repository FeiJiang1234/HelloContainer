import React, { useState, useEffect } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import ElInput from './ElInput';
import ElIcon from './ElIcon';
import { Actionsheet, Divider, FlatList, useDisclose, Text, Box } from 'native-base';
import colors from 'el/config/colors';
import _ from 'lodash';
import { utils } from 'el/utils';

type PropType = {
    groups: any;
    onSelectedItem?: any;
    placeholder: string;
    disabled?: boolean;
    name?: string;
    defaultValue?: any;
    [rest: string]: any;
};

const ElGroupSelect: React.FC<PropType> = ({
    groups,
    onSelectedItem,
    defaultValue,
    disabled,
    ...rest
}) => {
    const { ...other } = rest;
    const [selectItem, setSelectItem] = useState<any>();
    const [isMove, setIsMove] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();

    useEffect(() => {
        if (!groups || !defaultValue) return;

        let flatItems: any[] = groups.reduce((acc, it) => [...acc, ...it.items], []);
        const selectItem = flatItems.find(x => x?.value === defaultValue);
        setSelectItem(selectItem);
    }, [defaultValue]);

    useEffect(() => {
        onSelectedItem && onSelectedItem(selectItem);
    }, [selectItem]);

    return (
        <>
            <Pressable onPress={() => {
                if (disabled) return;
                onOpen();
            }}>
                <ElInput
                    editable={false}
                    value={selectItem?.label ?? ""}
                    onPressIn={() => setIsMove(false)}
                    onTouchMove={() => setIsMove(true)}
                    onPressOut={() => {
                        if (disabled || isMove) return;
                        onOpen();
                    }}
                    isDisabled={disabled}
                    {...other}
                />
                <ElIcon name="chevron-down" style={styles.chevronDown} />
            </Pressable>

            <Actionsheet isOpen={isOpen} onClose={onClose} useRNModal={Platform.OS === 'ios'}>
                <Actionsheet.Content w="full">
                    {!utils.isArrayNullOrEmpty(groups) && <FlatList
                        w="full"
                        data={groups}
                        keyExtractor={(_item, index) => index.toString()}
                        renderItem={({ item: group }: any) => {
                            return <>
                                <Box w="100%" h={60} px={4} justifyContent="center">
                                    <Text fontSize="16" color={colors.medium}>
                                        {group.groupName}
                                    </Text>
                                </Box>
                                <Divider />
                                {
                                    group?.items?.map((item: any) => {
                                        return <React.Fragment key={`${item.value}`}>
                                            <Actionsheet.Item
                                                alignItems="center"
                                                onPress={(e) => {
                                                    item?.onPress && item.onPress(e);
                                                    setSelectItem(item);
                                                    onClose && onClose();
                                                }}
                                            >
                                                {item?.label ?? ""}
                                            </Actionsheet.Item>
                                            <Divider />
                                        </React.Fragment>
                                    }
                                    )
                                }
                            </>
                        }}
                    >
                    </FlatList>
                    }
                </Actionsheet.Content>
            </Actionsheet>
        </>
    );
};

const styles = StyleSheet.create({
    chevronDown: {
        position: 'absolute',
        top: '35%',
        right: 10,
    },
    container: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        width: '100%',
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingTop: 8,
    },
});
export default ElGroupSelect;
