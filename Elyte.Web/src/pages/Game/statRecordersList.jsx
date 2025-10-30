import React, { useState, useEffect } from 'react';
import { ElBox, ElTitle, ElSvgIcon, ElConfirm } from 'components';
import { useLocation } from 'react-router-dom';
import { useProfileRoute } from 'utils';
import { gameService } from 'services';
import IdiographRow from 'parts/Commons/idiographRow';
import { Box } from '@mui/material';
import GameDetail from './gameDetail';

const StatRecordersList = () => {
    const [recorders, setRecorders] = useState([]);
    const [recorderId, setRecorderId] = useState(null);
    const [code, setCode] = useState(null);
    const [isShowGenerateCode, setIsShowGenerateCode] = useState(false);
    const location = useLocation();
    const { gameId, isOfficiate } = location?.state?.params;
    const { athleteProfile } = useProfileRoute();

    useEffect(() => {
        getStatRecorders();
        getStatRecorderCode();
    }, []);

    const getStatRecorders = async () => {
        const res = await gameService.getGameStatRecorders(gameId);
        if (res && res.code === 200 && res.value) {
            setRecorders(res.value);
        }
    };

    const getStatRecorderCode = async () => {
        const res = await gameService.getStatTrackerCode(gameId);
        if (res && res.code === 200) setCode(res.value);
    };

    const handleRemoveStatTracker = async () => {
        const res = await gameService.removeStatRecorder(gameId, recorderId);
        if (res && res.code === 200) getStatRecorders();
    };

    const handleGenerateNewStatTrackerCode = async () => {
        const res = await gameService.generateNewStatTrackerCode(gameId);
        if (res && res.code === 200) {
            getStatRecorderCode();
            setIsShowGenerateCode(false);
        }
    };

    return (
        <>
            <ElTitle center>Stat Recorders</ElTitle>
            {
                isOfficiate &&
                <Box mt={2} className="flex-sb">
                    <span className="text-btn-green" onClick={() => setIsShowGenerateCode(true)}>
                        Generate new stat recorder code
                    </span>
                </Box>
            }
            {code && <GameDetail title="StatRecorderCode:" text={code} />}
            {Array.isNullOrEmpty(recorders) && <ElBox mt={2} center flex={1}>No Stat Recorders</ElBox>}
            {
                !Array.isNullOrEmpty(recorders) && recorders.map(item => (
                    <IdiographRow
                        key={item.statTrackerId}
                        to={athleteProfile(item.athleteId)}
                        title={item.title}
                        centerTitle={item.centerTitle}
                        subtitle={item.subtitle}
                        imgurl={item.avatarUrl}>
                        {isOfficiate && <ElSvgIcon light xSmall name="close" onClick={() => setRecorderId(item.statTrackerId)} />}
                    </IdiographRow>
                ))
            }
            <ElConfirm
                title="Are you sure to remove this stat tracker?"
                open={!!recorderId}
                onNoClick={() => setRecorderId(null)}
                onOkClick={handleRemoveStatTracker}
            />

            <ElConfirm
                title="Are you sure to generate new stat recorder code?"
                open={isShowGenerateCode}
                onNoClick={() => setIsShowGenerateCode(false)}
                onOkClick={handleGenerateNewStatTrackerCode}
            />
        </>
    );
};

export default StatRecordersList;
