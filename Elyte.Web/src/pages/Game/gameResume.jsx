import React, { useState } from 'react';
import { ElButton, ElBody, ElDialog, ElLink } from 'components';
import { SportType } from 'enums';
import { useHistory } from 'react-router-dom';

function GameResume ({ open, handleOK, sportType, gameId, gameCode, isOfficiate }) {
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const clickOK = async () => {
        setLoading(true);
        await handleOK();
        setLoading(false);
    };

    const getGameLogLink = () => {
        if (sportType === SportType.Basketball)
            return { pathname: '/basketballLog', state: { gameId, gameCode, isOfficiate } };
        if (sportType === SportType.Soccer)
            return { pathname: '/soccerLog', state: { gameId, gameCode, isOfficiate } };
    }

    const goBack = () => {
        history.push('/gameProfile', { params: { id: gameId } });
    }

    return (
        <ElDialog open={open} title="This game is currently paused."
            actions={
                <>
                    {isOfficiate && <ElButton onClick={clickOK} loading={loading}>Resume</ElButton>}
                    <ElButton onClick={goBack}>Go Back</ElButton>
                </>
            }>
            <ElBody light center>
                {`Resume. When selected the game's timer will continue counting and the official will be directed to the main play screen. `}
                {isOfficiate && <ElLink green to={getGameLogLink}> Go to Game log</ElLink>}
            </ElBody>
        </ElDialog>
    );
}

export default GameResume;
