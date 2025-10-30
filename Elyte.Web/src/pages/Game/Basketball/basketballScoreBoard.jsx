import React, { useEffect, useState } from 'react';
import { ElTitle, ElButton, ElDialog, ElBody } from 'components';
import { Box } from '@mui/material';
import { gameService, signalRService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import { useCountDown, utils } from 'utils';
import { GameStatus, SportType } from 'enums';
import { gameStyles } from 'styles';
import BasketballActions from './basketballActions';
import Container from '../components/scoreBoardContainer';
import { FoulBox, ScoreBox } from '../components/scoreBoardBox';
import GameClockDialog from '../components/gameClockDialog';

const BasketballScoreBoard = () => {
    const location = useLocation();
    const gameId = location?.state?.gameId;
    const history = useHistory();
    const [scoreBoard, setScoreBoard] = useState({ isGameStarted: true });
    const [gameState, setGameState] = useState(scoreBoard.gameStatus || '');
    const { timeLeft, setLeftMilliseconds } = useCountDown({ isTimerStop: gameState !== GameStatus.InProgress || String.isNullOrEmpty(scoreBoard?.lastStartDateTime || '') });
    const [showEndGameDialog, setShowEndGameDialog] = useState(false);
    const [showGameClockDialog, setShowGameClockDialog] = useState(false);


    useEffect(() => {
        getScoreBoard();
        signalRService.registerRefreshGameEvent((data) => {
            if (data.gameId === gameId) {
                setGameState(data.gameStatus);
                getScoreBoard();
            }
        });

        return () => signalRService.unregisterRefreshGameEvent();
    }, []);

    useEffect(() => {
        if (scoreBoard.isGameOver) return;

        if (!scoreBoard.isOfficiate) return;

        if (scoreBoard.quarter !== 4 && scoreBoard.quarter !== 0 && timeLeft === '00:00:00' && gameState !== GameStatus.QuarterOver) {
            return endCurrentQuarter();
        }

        if (scoreBoard.quarter === 4 && timeLeft === '00:00:00') {
            endCurrentQuarter();
            setShowEndGameDialog(true);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (gameState === GameStatus.Confirmed || gameState === GameStatus.End) {
            if (scoreBoard.isOfficiate) {
                return history.push('/gameProfile', { params: { id: gameId } });
            }

            history.push('/gamePost', { gameId: gameId, gameSportType: SportType.Basketball });
        }
    }, [gameState]);

    const getScoreBoard = async () => {
        const res = await gameService.getBasketballScoreBoard(gameId);
        if (res && res.code === 200) {
            setScoreBoard(res.value);
            setGameState(res.value.gameStatus);
            setLeftMilliseconds(res.value.leftMilliseconds);
        }
    }

    const endCurrentQuarter = async () => {
        const res = await gameService.endBasketballQuarter(gameId);
        if (res && res.code === 200) {
            window.elyte.success("Current quarter is over!");
        }
    }

    const handleStartNewQuarter = async () => {
        const res = await gameService.startNewBasketballQuarter(gameId);
        if (res && res.code === 200) {
            window.elyte.success("Start a new quarter successfully!");
        }
    }

    const handlePauseGame = async () => {
        setGameState(GameStatus.Paused);
        const res = await gameService.pauseGame(gameId, timeLeft);
        if (res && res.code === 200) {
            window.elyte.success("Pause game successfully!");
        }
    };

    const handleResumeGame = async () => {
        const res = await gameService.resumeGame(gameId);
        if (res && res.code === 200) {
            window.elyte.success("Resume game successfully!");
        }
    };

    const handleKickoffGame = async () => {
        const res = await gameService.kickoffGame(gameId);
        if (res && res.code === 200) {
            window.elyte.success("Kick off successfully!");
        }
    };

    const handleEndGame = async () => {
        const res = await gameService.endGame(gameId);
        if (res.code === 200) {
            history.push('/gameRecapScreen', { gameId: gameId, gameType: SportType.Basketball });
        }
    }

    const handleUndoClick = async () => {
        const res = await gameService.undoBasketball(gameId);
        if (res && res.code === 200) {
            window.elyte.success("undo successfully!");
        }
    };

    const handleOnGameOptionClick = async () => {
        history.push('/gameProfile', { params: { id: gameId } });
    }

    return (
        <>
            <ElTitle>Game ID: {scoreBoard.gameCode}</ElTitle>
            <Box sx={gameStyles.scoreBoxCenter}>
                <Box mr={1} sx={gameStyles.quarter}>
                    {utils.numberToOrdinal(scoreBoard.quarter)}
                </Box>
                <Box>{timeLeft}</Box>
                {
                    scoreBoard.isOfficiate && gameState === GameStatus.Paused &&
                    <Box><ElButton small className="ml-8 mb-8" onClick={() => setShowGameClockDialog(true)}>Edit</ElButton></Box>
                }
            </Box>
            <Container>
                <ScoreBox>
                    <Box>{scoreBoard.homeTeamName}:</Box>
                    <Box>{scoreBoard.homeTeamScore}</Box>
                </ScoreBox>
                <ScoreBox>
                    <Box>{scoreBoard.awayTeamName}:</Box>
                    <Box>{scoreBoard.awayTeamScore}</Box>
                </ScoreBox>
            </Container>
            <Container>
                <FoulBox>
                    <Box>F&nbsp;:&nbsp;</Box>
                    <Box>{scoreBoard.homeTeamFoulNumber}</Box>
                </FoulBox>
                <FoulBox>
                    <Box>F&nbsp;:&nbsp;</Box>
                    <Box>{scoreBoard.awayTeamFoulNumber}</Box>
                </FoulBox>
            </Container>
            <Container>
                {
                    scoreBoard.isOfficiate && !scoreBoard.isGameStarted &&
                    <ElButton small sx={gameStyles.scoreBoardOptionBtn} onClick={handleKickoffGame}>Start Game</ElButton>
                }
                {
                    scoreBoard.isOfficiate && scoreBoard.isGameStarted && gameState !== GameStatus.Paused && gameState !== GameStatus.QuarterOver &&
                    <ElButton small sx={gameStyles.scoreBoardOptionBtn} onClick={handlePauseGame}>Pause</ElButton>
                }
                {
                    scoreBoard.isOfficiate && gameState === GameStatus.QuarterOver &&
                    <ElButton small sx={gameStyles.scoreBoardOptionBtn} onClick={handleStartNewQuarter}>Start New Quarter</ElButton>
                }
                {
                    scoreBoard.isOfficiate && scoreBoard.isGameStarted && gameState === GameStatus.Paused &&
                    <ElButton small sx={gameStyles.scoreBoardOptionBtn} onClick={handleResumeGame}>Resume</ElButton>
                }
                <ElButton small sx={gameStyles.scoreBoardOptionBtn} onClick={handleOnGameOptionClick}>Game Options</ElButton>
                <ElButton small sx={{ borderRadius: 2 }} onClick={handleUndoClick}>Undo</ElButton>
            </Container>
            {
                scoreBoard.isGameStarted && gameState !== GameStatus.Paused && gameState !== GameStatus.QuarterOver &&
                <BasketballActions scoreBoard={scoreBoard} onPaused={() => setGameState(GameStatus.Paused)} timeLeft={timeLeft} />
            }
            <ElBody center mt={4}>
                {gameState === GameStatus.QuarterOver && (scoreBoard.isOfficiate ? "You need to start a new quarter" : "Wait for the officiate to start a new quarter")}
            </ElBody>
            {
                scoreBoard.isOfficiate &&
                <ElDialog open={showEndGameDialog} title="End Game"
                    actions={<ElButton onClick={handleEndGame}>Yes</ElButton>}>
                    <ElBody center>(Yes) When selected the game will be ended and the official will be directed to a game recap screen.</ElBody>
                </ElDialog>
            }

            {showGameClockDialog && <GameClockDialog gameId={gameId} defaultGameClock={timeLeft} onClose={() => setShowGameClockDialog(false)} />}
        </>
    );
};

export default BasketballScoreBoard;
