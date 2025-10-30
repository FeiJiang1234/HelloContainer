import React, { useState } from 'react';
import { ElButton, ElDialog, ElBody } from 'components';

function ElConfirm ({ title, content, onClose, open, onOkClick, onNoClick }) {
    const [loading, setLoading] = useState(false);

    const clickOK = async () => {
        if (onOkClick) {
            setLoading(true);
            await onOkClick();
            setLoading(false);
        }
        { onNoClick && onNoClick(true) }
        { onClose && onClose(true) }
    };

    const clickNo = async () => {
        if (onNoClick) {
            setLoading(true);
            await onNoClick();
            setLoading(false);
        }
    };

    return (
        <ElDialog open={open} title={title} onClose={onClose}
            actions={
                <>
                    <ElButton onClick={clickNo}>No</ElButton>
                    <ElButton onClick={clickOK} loading={loading} className="green">Yes</ElButton>
                </>
            }>
            <ElBody light center>{content}</ElBody>
        </ElDialog>
    );
}

export default ElConfirm;
