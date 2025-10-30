import { ActionModel } from 'el/models/action/actionModel';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import ElConfirm from './ElConfirm';
import ElPickerModal from './ElPickModal';

type PropType = {
    onSelectedItem: any;
    items: ActionModel[];
    children: any;
    onPress?: Function;
    part?: boolean;
    disabled?: boolean;
    [rest: string]: any;
};

const ElPicker: React.FC<PropType> = ({
    onSelectedItem,
    items,
    children,
    onPress = null,
    part = false,
    ...rest
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState<ActionModel>();
    const { disabled, ...others } = rest;

    const handleSelectItem = item => {
        if (item.confirmMessage) {
            setIsShowConfirm(true);
            setConfirmAction(item);
        } else {
            onSelectedItem(item);
        }
    };

    return (
        <>
            <Pressable
                onPress={() => {
                    if (disabled || !items?.length) return;

                    const visibleItems = items.filter(x => !x.isHide);
                    if (visibleItems.length === 0) return;

                    setModalVisible(true);
                    if (onPress) onPress();
                }}
                {...others}>
                {children}
            </Pressable>

            {modalVisible && (
                <ElPickerModal
                    visible={modalVisible}
                    setVisible={setModalVisible}
                    onCancel={() => setModalVisible(false)}
                    items={items.filter(x => !x.isHide)}
                    onSelectedItem={handleSelectItem}
                    part={part}
                />
            )}

            {isShowConfirm && (
                <ElConfirm
                    visible={isShowConfirm}
                    message={confirmAction?.confirmMessage}
                    onCancel={() => setIsShowConfirm(false)}
                    onConfirm={() => onSelectedItem(confirmAction)}
                />
            )}
        </>
    );
};

export default ElPicker;
