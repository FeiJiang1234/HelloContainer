import React, { useState } from 'react';
import { ElBody, ElSvgIcon, ElButton, ElConfirm } from 'components';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { GameStatus, SportType } from 'enums';
import { useHistory } from 'react-router-dom';

const LogBox = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        alignItems: 'center',
        marginTop: 8
    };
});

const Log = styled(Box)(() => {
    return {
        width: 338,
        height: 80,
        background: '#F0F2F7',
        borderRadius: '10px',
        padding: '8px 16px',
        position: 'relative',
        display: 'flex'
    };
});

const LogName = styled(Box)(({ theme }) => {
    return {
        color: theme.palette.primary.main,
        fontWeight: 'bold'
    };
});

const Closed = styled(ElSvgIcon)(({ theme }) => {
    return {
        stroke: `${theme.palette.primary.main} !important`,
        width: `16px !important`,
        height: `16px !important`
    };
});

const GameLog = ({ logs, timeFormat, onRemoveLog, gameType, gameId, gameCode, isOfficiate }) => {
    const history = useHistory();
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [logId, setLogId] = useState();

    const handleEditClick = (selectedLogId) => {
        var data = { gameId, gameCode, isOfficiate, logId: selectedLogId };
        if (gameType === SportType.Baseball) history.push('/baseballActionEdit', data);
        if (gameType === SportType.Basketball) history.push('/basketballActionEdit', data);
        if (gameType === SportType.Soccer) history.push('/soccerActionEdit', data);
    }

    const handRemoveClick = (id) => {
        setShowRemoveDialog(true);
        setLogId(id);
    }

    const handleRemoveClose = () => {
        setShowRemoveDialog(false);
        setLogId(null);
    }

    return (
        <LogBox>
            {
                Array.isNullOrEmpty(logs) &&
                <Box mt={2} center flex={1}>Currently no activity</Box>
            }
            {
                logs.map(x => (
                    <Log key={x.id}>
                        <Box sx={{ flex: 1 }}>
                            <LogName>{x.teamName} - {x.athleteName}</LogName>
                            <ElBody sx={{ fontSize: '15px' }}>{x.description}</ElBody>
                            <ElBody>{timeFormat(x)}</ElBody>
                        </Box>
                        {
                            (x.gameStatus === GameStatus.End || x.gameStatus === GameStatus.Paused || x.gameStatus === GameStatus.QuarterOver) && isOfficiate &&
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ElButton mr={1} small onClick={() => handleEditClick(x.id)}>Edit</ElButton>
                                <Closed name="close" onClick={() => handRemoveClick(x.id)} />
                            </Box>
                        }
                    </Log>
                ))
            }

            <ElConfirm
                title="Remove Log"
                content="Are you sure you want to remove this item?"
                open={showRemoveDialog}
                onNoClick={handleRemoveClose}
                onOkClick={() => onRemoveLog(logId)}
            />
        </LogBox>
    );
};

export default GameLog;
