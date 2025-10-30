import React, { useState } from 'react';
import { ElButton, ElBody, ElDialog } from 'components';

function GameKickOff ({ open, handleOK }) {
    const [loading, setLoading] = useState(false);

    const clickOK = async () => {
        setLoading(true);
        await handleOK();
        setLoading(false);
    };

    return (
        <ElDialog open={open} title="Kick off the game"
            actions={
                <ElButton onClick={clickOK} loading={loading}>Kick Off</ElButton>
            }>
            <ElBody light center>Please kick off the game</ElBody>
        </ElDialog>
    );
}

export default GameKickOff;
