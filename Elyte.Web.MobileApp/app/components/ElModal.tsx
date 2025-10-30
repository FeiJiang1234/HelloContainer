import React from 'react';
import { StyleSheet, View, Modal, Pressable } from 'react-native';
import ElScreen from './ElScreen';
import colors from '../config/colors';
import H5 from './Typography/H5';

type PropType = {
    children: any;
    visible: boolean;
    onClose: Function;
    part?: boolean;
    [rest: string]: any;
};

const ElModal: React.FC<PropType> = ({ children, visible, onClose, part = false, ...rest }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={part} {...rest}>
            <ElScreen style={part && styles.container}>
                <View style={styles.action}>
                    <Pressable onPress={() => onClose()}>
                        <H5 style={{ color: '#007AFF' }}>Cancel</H5>
                    </Pressable>
                </View>
                {children}
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
        width: '100%'
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingTop: 8,
    },
});

export default ElModal;
