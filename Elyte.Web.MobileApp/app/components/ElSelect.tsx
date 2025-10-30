import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import ElInput from './ElInput';
import ElIcon from './ElIcon';
import ElPickerModal from './ElPickModal';
import { Pressable } from 'native-base';

type PropType = {
    items: any;
    onSelectedItem?: any;
    placeholder: string;
    part?: boolean;
    disabled?: boolean;
    name?: string;
    defaultValue?: any;
    [rest: string]: any;
};

const ElSelect: React.FC<PropType> = ({
    items,
    onSelectedItem,
    disabled,
    part = false,
    ...rest
}) => {
    const { defaultValue, ...other } = rest;
    const [value, setValue] = useState(defaultValue);
    const [isMove, setIsMove] = useState(false);

    useEffect(() => {
        setValue(rest.value);
    }, [rest.value]);
    
    useEffect(() => {
        if (!defaultValue) return;

        setValue(defaultValue);
    }, [defaultValue]);

    const [modalVisible, setModalVisible] = useState(false);

    const getLabel = () => {
        const item = items?.find(x => x.value == value);
        return item?.label;
    };

    return (
        <>
            <Pressable onPress={() => {
                if (disabled) return;

                setModalVisible(true);
            }}>
                <ElInput
                    editable={false}
                    defaultValue={getLabel()}
                    onPressIn={() => setIsMove(false)}
                    onTouchMove={() => setIsMove(true)}
                    onPressOut={() => {
                        if (disabled || isMove) return;

                        setModalVisible(true);
                    }}
                    isDisabled={disabled}
                    {...other}
                />
                <ElIcon name="chevron-down" style={styles.chevronDown} />
            </Pressable>

            {modalVisible && (
                <ElPickerModal
                    visible={modalVisible}
                    setVisible={setModalVisible}
                    onCancel={() => setModalVisible(false)}
                    onSelectedItem={item => {
                        setValue(item?.value);
                        onSelectedItem(item);
                    }}
                    items={items}
                    value={value}
                    part={part}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    chevronDown: {
        position: 'absolute',
        top: '35%',
        right: 10,
    },
});
export default ElSelect;
