import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { gameService } from 'services';
import { ElTitle, ElButton } from 'components';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const Card = styled(Box)(({ theme, yellow, red }) => ({
    ...({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '10px',
        padding: 16,
        gap: 8,
        marginBottom: 16,
        '& > .title': { fontWeight: 'bold', fontSize: 20 },
        '& > .MuiBox-root': { width: '100%' }
    }),
    ...(yellow && { background: '#FFE27B', '& > .MuiTypography-root': { color: theme.palette.primary.main } }),
    ...(red && { background: '#FF6666', '& > .MuiTypography-root': { color: '#fff' } })
}));

const SoccerCard = () => {
    const location = useLocation();
    const { gameId, gameCode, teamId, athleteId, logId, isOfficiate } = location?.state;
    const history = useHistory();

    const onClickYellowCard = async () => {
        const res = await gameService.recordSoccerYellowCard(gameId, { teamId, athleteId, logId });
        if (res && res.code === 200) goBack();
    }

    const onClickRedCard = async () => {
        const res = await gameService.recordSoccerRedCard(gameId, { teamId, athleteId, logId });
        if (res && res.code === 200) goBack();
    }

    const goBack = () => {
        if (logId) {
            history.push('/soccerLog', { gameId, gameCode, isOfficiate });
        }
        else {
            history.push('/soccerScoreBoard', { gameId });
        }
    }

    return (
        <>
            <ElTitle center>Card Options Page</ElTitle>
            <Card yellow>
                <Typography className="title">Yellow Card</Typography>
                <Typography>Player will receive a yellow warning count for the game</Typography>
                <ElButton onClick={onClickYellowCard}>Choose</ElButton>
            </Card>
            <Card red>
                <Typography className="title">Red Card</Typography>
                <Typography>Player will be removed from playing for the rest of the game</Typography>
                <ElButton onClick={onClickRedCard}>Choose</ElButton>
            </Card>
        </>
    );
};

export default SoccerCard;
