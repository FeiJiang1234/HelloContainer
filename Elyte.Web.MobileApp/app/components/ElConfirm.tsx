import { Box, Row } from 'native-base';
import React, { useState } from 'react';
import ElBody from './ElBody';
import ElButton from './ElButton';
import ElDialog from './ElDialog';

type PropType = {
    title?: any;
    message: any;
    visible: boolean;
    onCancel: Function;
    onConfirm: Function;
};

const ElConfirm: React.FC<PropType> = ({ title, message, visible, onCancel, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <ElDialog
            hideClose
            visible={visible}
            title={title}
            footer={
                <Row>
                    <Box flex={1} mr={1}>
                        <ElButton onPress={onCancel}>No</ElButton>
                    </Box>
                    <Box flex={1} mr={1}>
                        <ElButton variant="secondary" onPress={handleConfirm} loading={loading}>
                            Yes
                        </ElButton>
                    </Box>
                </Row>
            }>
            {typeof message === 'object' && message}
            {typeof message === 'string' && <ElBody style={{ textAlign: 'center' }}>{message}</ElBody>}
        </ElDialog>
    );
};

export default ElConfirm;
