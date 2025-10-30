import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { ElTitle, ElBox, ElButton, ElBody, ElCheckbox, ElDialog } from 'components';
import { Divider, Typography, Box } from '@mui/material';
import { useLocation, useHistory } from 'react-router-dom';
import { gameService } from 'services';
import GameDetail from './gameDetail';
import GameTeam from './gameTeam';
import { GameStatus, SportType } from 'enums';

const useStyles = makeStyles(() => ({
    itemButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        '& > *': { width: 150 }
    }
}));

export default function GameRecapScreen () {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const [gameInfo, setGameInfo] = useState({});
    const { gameId, gameType } = location?.state;
    const [isAgree, setIsAgree] = useState(true);
    const scoreUnequalMessage = 'Teams score are same';
    const [isConfirmResult, setIsConfirmResult] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => getPostGameInfo(), []);

    const getPostGameInfo = async () => {
        const res = await gameService.getPostGameInfo(gameId);
        if (res && res.code === 200) {
            if (res.value.gameStatus === GameStatus.Confirmed) {
                return history.push('/gamePost', { gameId: gameId, gameSportType: gameType });
            }

            if (res.value.gameStatus !== GameStatus.End) {
                return history.push('/gameProfile', { params: { id: gameId } });
            }

            setGameInfo(res.value);
        }
    }

    const handleConfirm = async (isConfirmedResult) => {
        const res = await gameService.confirmGame(gameId, isConfirmedResult);
        if (res && res.code === 200) {
            history.push('/gamePost', { gameId: gameId, gameSportType: gameType });
        }else{
            if(res.Message === scoreUnequalMessage){
                setIsConfirmResult(true);
            }
        }
    }

    const handleConfirmScoreEqual = async () => {
        setLoading(true);
        await handleConfirm(true);
        setLoading(false);
    }

    const handleEditClick = () => {
        if (gameType === SportType.Baseball)
            history.push('/baseballLog', { gameId: gameId, gameCode: gameInfo.gameCode, isOfficiate: gameInfo.isOfficiate });

        if (gameType === SportType.Basketball)
            history.push('/basketballLog', { gameId: gameId, gameCode: gameInfo.gameCode, isOfficiate: gameInfo.isOfficiate });

        if (gameType === SportType.Soccer)
            history.push('/soccerLog', { gameId: gameId, gameCode: gameInfo.gameCode, isOfficiate: gameInfo.isOfficiate });
    }

    return (
        <>
            <ElTitle center>Game ID: {gameInfo.gameCode}</ElTitle>
            <Typography className="category-text">Team Match up:</Typography>

            <GameTeam url={gameInfo.homeTeamImageUrl} name={gameInfo.homeTeamName} score={gameInfo.homeTeamScore} />
            <GameTeam url={gameInfo.awayTeamImageUrl} name={gameInfo.awayTeamName} score={gameInfo.awayTeamScore} />

            {gameInfo.location && <GameDetail title="Location:" text={gameInfo.location} divider />}
            <GameDetail title="Date/Time:" text={gameInfo.startTime} divider />

            <ElBox className={classes.itemButton} mb={2}>
                <TeamScore teamName={gameInfo.homeTeamName} score={gameInfo.homeTeamScore} />
                <TeamScore teamName={gameInfo.awayTeamName} score={gameInfo.awayTeamScore} />
            </ElBox>
            <Divider />

            <Typography mt={2}>Final review:</Typography>
            <ElBox mb={6} mt={2}>
                <ElCheckbox onChange={() => setIsAgree(!isAgree)} label={<ElBody>Please verify that everything displayed is correct</ElBody>} />
            </ElBox>
            <ElBox className={classes.itemButton}>
                <ElButton media onClick={handleEditClick}>Edit</ElButton>
                <ElButton disabled={isAgree} media onClick={() => handleConfirm(false)} className="green">Confirm</ElButton>
            </ElBox>

            {
                isConfirmResult &&
                <ElDialog open={isConfirmResult} onClose={() => setIsConfirmResult(false)}
                    title="Game Result Confirm" subred
                    subTitle='The score of the two teams is the same. Are you sure you want to end the game?'
                    actions={
                        <>
                            <ElButton onClick={handleConfirmScoreEqual} loading={loading}>Yes</ElButton>
                            <ElButton onClick={() => setIsConfirmResult(false)}>No</ElButton>
                        </>
                    }>
                </ElDialog>
            }
        </>
    );
}

const TeamScore = ({ teamName, score }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>{teamName} Score:</Typography>
            <Typography sx={{ color: '#17C476', fontWeight: 600, fontSize: 15 }}>{score}</Typography>
        </Box>
    );
}