import colors from 'el/config/colors';
import { Box, View } from 'native-base';
import React from 'react';
import { StyleSheet, Modal, Pressable } from 'react-native';
import ElBody from './ElBody';
import ElIcon from './ElIcon';
import H3 from './Typography/H3';

type PropType = {
    header?: any;
    title?: string;
    subTitle?: string;
    footer?: any;
    children: any;
    visible: boolean;
    hideClose?: boolean;
    onClose?: Function;
    [rest: string]: any;
};

const ElDialog: React.FC<PropType> = ({ children, onClose, ...rest }) => {
    const { visible, hideClose, title, subTitle, header, footer, ...others } = rest;

    return (
        <Modal visible={visible} transparent={true} {...others}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {header && <Box style={styles.header}>{header}</Box>}
                    {title && (
                        <Box style={styles.header}>
                            <H3 style={{ textAlign: 'center' }}>{title}</H3>
                            <ElBody style={{ textAlign: 'center' }}>{subTitle}</ElBody>
                        </Box>
                    )}
                    {!hideClose && (
                        <Pressable style={styles.close} onPress={() => onClose && onClose()}>
                            <ElIcon name="close" />
                        </Pressable>
                    )}
                    {children}
                    {footer && <Box style={styles.footer}>{footer}</Box>}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingBottom: 8,
        marginBottom: 8,
        borderBottomColor: colors.light,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    footer: {
        paddingTop: 8,
        marginTop: 8,
        borderTopColor: colors.light,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    close: {
        position: 'absolute',
        right: 8,
        top: 8,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 16,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
});

export default ElDialog;
