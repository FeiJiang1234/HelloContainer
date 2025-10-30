import React, { useEffect, useState } from 'react';
import { ElTitle, ElBody } from 'components';
import { Typography, Box, Grid } from '@mui/material';
import { gameService, signalRService } from 'services';
import GameTeam from '../gameTeam';
import { useTimer, utils } from 'utils';
import { GameStatus, SportType } from 'enums';
import { gameStyles } from 'styles';
import GameOptions from '../gameOptions';
import { useHistory } from 'react-router-dom';

export default function SoccerLiveUserView ({ game }) {
    const history = useHistory();
    const [scoreBoard, setScoreBoard] = useState({ isGameStarted: true });
    const [gameState, setGameState] = useState(scoreBoard.gameStatus || game.gameStatus);
    const { timePast, setPastMilliseconds } = useTimer({ isTimerStop: gameState !== GameStatus.InProgress || gameState === GameStatus.InHalfTime || String.isNullOrEmpty(scoreBoard?.lastStartDateTime || '') });

    useEffect(() => {
        initScoreBoard();
        signalRService.registerRefreshGameEvent((data) => {
            if (data.gameId === game.id) {
                setGameState(data.gameStatus);
                initScoreBoard();
            }
        });

        return () => signalRService.unregisterRefreshGameEvent();
    }, []);

    useEffect(() => {
        if (scoreBoard.isOfficiate) return;
        if (gameState === GameStatus.Confirmed || gameState === GameStatus.End) {
            history.push('/gamePost', { gameId: game?.id, gameSportType: SportType.Basketball });
        }
    }, [gameState]);

    const initScoreBoard = async () => {
        const res = await gameService.getSoccerScoreBoard(game.id);
        if (res && res.code === 200) {
            setScoreBoard(res.value);
            setPastMilliseconds(res.value.timePastMilliseconds);
        }
    }

    const isFinal = () => {
        return gameState === GameStatus.End || gameState === GameStatus.Confirmed;
    }

    return (
        <>
            <ElTitle center>Score Board</ElTitle>
            <GameTeam url={scoreBoard.homeTeamImageUrl} name={scoreBoard.homeTeamName} score={scoreBoard.homeTeamScore} />
            <GameTeam url={scoreBoard.awayTeamImageUrl} name={scoreBoard.awayTeamName} score={scoreBoard.awayTeamScore} />
            <Typography mt={2}>Soccer details:</Typography>
            <Box sx={gameStyles.scoreBox}>
                <Box>
                    <Box sx={gameStyles.quarter}>
                        {utils.numberToOrdinal(scoreBoard.half)}
                    </Box>
                    <Box>
                        {timePast}
                        {gameState === GameStatus.Paused && <ElBody>(Paused)</ElBody>}
                        {isFinal() && <ElBody>(Final)</ElBody>}
                    </Box>
                </Box>
                <Box ml={8} mr={1}>
                    <Grid container spacing={1}>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}><Typography sx={gameStyles.teamViewName}>F</Typography></Grid>
                        <Grid item xs={4}><Typography sx={gameStyles.teamViewName}>CK</Typography></Grid>
                        <Grid item xs={4}><Typography sx={gameStyles.teamViewName}>T1</Typography></Grid>
                        <Grid item xs={4}><Typography sx={gameStyles.teamViewContent}>{scoreBoard.homeTeamFoulNumber}</Typography></Grid>
                        <Grid item xs={4}><Typography sx={gameStyles.teamViewContent}>{scoreBoard.homeTeamCorner}</Typography></Grid>
                        <Grid item xs={4}><Typography sx={gameStyles.teamViewName}>T2</Typography></Grid>
                        <Grid item xs={4}><Typography sx={gameStyles.teamViewContent}>{scoreBoard.awayTeamFoulNumber}</Typography></Grid>
                        <Grid item xs={4}><Typography sx={gameStyles.teamViewContent}>{scoreBoard.awayTeamCorner}</Typography></Grid>
                    </Grid>
                </Box>
            </Box>
            <GameOptions game={game} />
        </>
    );
}