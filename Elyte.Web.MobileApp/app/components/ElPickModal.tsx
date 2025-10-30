import React from 'react';
import { StyleSheet, View, Modal, Pressable, FlatList } from 'react-native';
import ElScreen from './ElScreen';
import ElPickerItem from './ElPickerItem';
import colors from '../config/colors';
import H5 from './Typography/H5';
import { Text } from 'native-base';
import ElBody from './ElBody';
import ElListItemSeparator from './ElListItemSeparator';

type PropType = {
    onSelectedItem: any;
    title?: any;
    subtitle?: any;
    items: any;
    value?: any;
    onPress?: Function;
    visible: boolean;
    setVisible: Function;
    onCancel: any;
    PickerItem?: any;
    part?: boolean;
    [rest: string]: any;
};

const ElPickerModal: React.FC<PropType> = ({
    onSelectedItem,
    items,
    title,
    subtitle,
    visible,
    setVisible,
    onCancel,
    value = null,
    PickerItem = ElPickerItem,
    part = false,
}) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={part}>
            <ElScreen style={part && styles.container}>
                <View style={styles.action}>
                    <Pressable onPress={onCancel}>
                        <H5 style={{ color: '#007AFF' }}>Cancel</H5>
                    </Pressable>
                </View>
                {title && <Text textAlign="center">{title}</Text>}
                {subtitle && (
                    <ElBody size="sm" textAlign="center">
                        {subtitle}
                    </ElBody>
                )}
                <FlatList
                    data={items}
                    keyExtractor={item => item.label.toString()}
                    ItemSeparatorComponent={ElListItemSeparator}
                    ListEmptyComponent={
                        <Text textAlign="center" py={2}>
                            No Items
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <PickerItem
                            item={item}
                            value={value}
                            onPress={() => {
                                setVisible(false);
                                onSelectedItem(item);
                            }}
                        />
                    )}/>
            </ElScreen>
        </Modal>
    );
};

const styles = StyleSheet.create({
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

export default ElPickerModal;
