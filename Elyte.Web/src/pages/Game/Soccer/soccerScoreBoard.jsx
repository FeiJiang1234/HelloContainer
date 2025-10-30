import React, { useEffect, useState } from 'react';
import { ElTitle, ElButton, ElDialog, ElConfirm, ElBody } from 'components';
import { Box } from '@mui/material';
import { gameService, signalRService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import { useTimer, utils } from 'utils';
import { SportType, GameStatus } from 'enums';
import SoccerActions from './soccerActions';
import Container from '../components/scoreBoardContainer';
import { gameStyles } from 'styles';
import { FoulBox, ScoreBox } from '../components/scoreBoardBox';
import GameClockDialog from '../components/gameClockDialog';

const SoccerScoreBoard = () => {
    const location = useLocation();
    const history = useHistory();
    const gameId = location?.state?.gameId;
    const [scoreBoard, setScoreBoard] = useState({ isGameStarted: true });
    const [gameState, setGameState] = useState(scoreBoard.gameStatus || '');
    const [endFirstHalfConfirm, setEndFirstHalfConfirm] = useState(false);
    const [showEndGameDialog, setShowEndGameDialog] = useState(false);
    const [showGameClockDialog, setShowGameClockDialog] = useState(false);
    const { timePast, setPastMilliseconds } = useTimer({ isTimerStop: gameState !== GameStatus.InProgress || gameState === GameStatus.InHalfTime || String.isNullOrEmpty(scoreBoard?.lastStartDateTime || '') });

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
        if (gameState === GameStatus.Confirmed || gameState === GameStatus.End) {
            if (scoreBoard.isOfficiate) {
                return history.push('/gameProfile', { params: { id: gameId } });
            }

            history.push('/gamePost', { gameId: gameId, gameSportType: SportType.Soccer });
        }
    }, [gameState]);

    const getScoreBoard = async () => {
        const res = await gameService.getSoccerScoreBoard(gameId);
        if (res && res.code === 200) {
            setScoreBoard(res.value);
            setPastMilliseconds(res.value.timePastMilliseconds);
            setGameState(res.value.gameStatus);
        }
    }

    const handlePauseGame = async () => {
        setGameState(GameStatus.Paused);
        const res = await gameService.pauseGame(gameId, timePast);
        if (res && res.code === 200) {
            window.elyte.success("Pause game successfully!");
        }
    }

    const handleResumeGame = async () => {
        const res = await gameService.resumeGame(gameId);
        if (res && res.code === 200) {
            window.elyte.success("Resume game successfully!");
        }
    };

    const endFirstHalf = async () => {
        const res = await gameService.endSoccerFirstHalf(gameId);
        if (res && res.code === 200) {
            window.elyte.success("End first half successfully!");
        }
    }

    const handleStartNewHalf = async () => {
        const res = await gameService.startNewSoccerHalf(gameId);
        if (res && res.code === 200) {
            window.elyte.success("Start a new half successfully!");
        }
    }

    const handleKickoffGame = async () => {
        const res = await gameService.kickoffGame(gameId);
        if (res && res.code === 200) {
            window.elyte.success("Kick off successfully!");
        }
    };

    const handleEndGame = async () => {
        var res = await gameService.endGame(gameId);
        if (res.code === 200) history.push('/gameRecapScreen', { gameId: gameId, gameType: SportType.Soccer });
    }

    const handleUndoClick = async () => {
        const res = await gameService.undoSoccer(gameId);
        if (res && res.code === 200) {
            window.elyte.success("Undo successfully!");
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
                    {utils.numberToOrdinal(scoreBoard.half)}
                </Box>
                <Box>{timePast}</Box>
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
                    scoreBoard.isOfficiate && scoreBoard.isGameStarted && gameState !== GameStatus.Paused && gameState !== GameStatus.InHalfTime &&
                    <ElButton small sx={gameStyles.scoreBoardOptionBtn} onClick={handlePauseGame}>Pause</ElButton>
                }
                {
                    scoreBoard.isOfficiate && gameState === GameStatus.InHalfTime &&
                    <ElButton small sx={gameStyles.scoreBoardOptionBtn} onClick={handleStartNewHalf}>Start New Half</ElButton>
                }
                {
                    scoreBoard.isOfficiate && scoreBoard.isGameStarted && gameState === GameStatus.Paused &&
                    <ElButton small sx={gameStyles.scoreBoardOptionBtn} onClick={handleResumeGame}>Resume</ElButton>
                }
                <ElButton small sx={gameStyles.scoreBoardOptionBtn} onClick={handleOnGameOptionClick}>Game Options</ElButton>
                <ElButton small sx={{ borderRadius: 2 }} onClick={handleUndoClick}>Undo</ElButton>
            </Container>

            {
                scoreBoard.isOfficiate && scoreBoard.isGameStarted &&
                <Container>
                    <ElButton disabled={scoreBoard.half === 2 || gameState === GameStatus.InHalfTime} small sx={gameStyles.scoreBoardOptionBtn} onClick={() => setEndFirstHalfConfirm(true)}>End First Half</ElButton>
                    <ElButton small sx={{ borderRadius: 2 }} onClick={() => setShowEndGameDialog(true)}>End Game</ElButton>
                </Container>
            }
            {
                scoreBoard.isGameStarted && gameState !== GameStatus.Paused && gameState !== GameStatus.InHalfTime &&
                <SoccerActions scoreBoard={scoreBoard} />
            }

            <ElBody center mt={4}>
                {gameState === GameStatus.InHalfTime && (scoreBoard.isOfficiate ? "You need to start a new half" : "Wait for the officiate to Start a new Half")}
            </ElBody>

            <ElConfirm
                title="Are you sure you want to end the first half?"
                content="(Yes) When selected the first half will be ended. (No) When selected the official will be directed back to the main game screen."
                open={endFirstHalfConfirm}
                onNoClick={() => setEndFirstHalfConfirm(false)}
                onOkClick={endFirstHalf}
            />

            {
                scoreBoard.isOfficiate &&
                <ElDialog open={showEndGameDialog} title="End Game"
                    actions={
                        <>
                            <ElButton onClick={() => setShowEndGameDialog(false)}>No</ElButton>
                            <ElButton onClick={handleEndGame} className="green">Yes</ElButton>
                        </>
                    }
                >
                    <ElBody center>(Yes) When selected the game will be ended and the official will be directed to a game recap screen.</ElBody>
                </ElDialog>
            }
            {showGameClockDialog && <GameClockDialog gameId={gameId} defaultGameClock={timePast} onClose={() => setShowGameClockDialog(false)} />}
        </>
    );
};

export default SoccerScoreBoard;
