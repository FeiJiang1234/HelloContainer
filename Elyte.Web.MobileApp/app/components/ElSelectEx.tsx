import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import ElInput from './ElInput';
import ElIcon from './ElIcon';
import { Pressable, useDisclose } from 'native-base';
import _ from 'lodash';
import ElActionsheet from './ElActionsheet';

type PropType = {
    items: any;
    onSelectedItem?: any;
    onValueChange?: any;
    placeholder: string;
    disabled?: boolean;
    name?: string;
    defaultValue?: any;
    valueField?: string;
    textField?: string;
    [rest: string]: any;
};

const ElSelectEx: React.FC<PropType> = ({
    items,
    onSelectedItem,
    onValueChange,
    valueField = 'value',
    textField = 'label',
    disabled,
    ...rest
}) => {
    const { defaultValue, name, ...other } = rest;
    const [value, setValue] = useState(defaultValue);
    const [isMove, setIsMove] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();

    const getLabel = () => React.useMemo(() => {
        const item = items?.find(x => x.value == value);
        return item?.label;
    }, [value, items]);

    return (
        <>
            <Pressable onPress={() => {
                if (disabled) return;
                onOpen();
            }}>
                <ElInput
                    editable={false}
                    defaultValue={getLabel()}
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
            {
                isOpen && <ElActionsheet
                    defaultValue={defaultValue}
                    alignItems="stretch"
                    isOpen={isOpen}
                    value={value}
                    onClose={onClose}
                    textField={textField}
                    valueField={valueField}
                    onSelectedItem={(item: any) => {
                        setValue(item?.value);
                        onValueChange && onValueChange(item?.value);
                        onSelectedItem && onSelectedItem(item);
                        onClose();
                    }}
                    items={items}
                    isShowCancel={false}
                    isShowSelectIcon={true}
                    {...rest}>
                </ElActionsheet>
            }
        </>
    );
};

const styles = StyleSheet.create({
    chevronDown: {
        position: 'absolute',
        top: '35%',
        right: 10,
    }
});
export default ElSelectEx;
