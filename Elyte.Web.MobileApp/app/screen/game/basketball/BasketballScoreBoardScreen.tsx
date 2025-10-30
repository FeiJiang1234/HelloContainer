import { Box, Row, ScrollView, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { gameService } from 'el/api';
import { ElBody, ElButton, ElConfirm, ElScrollContainer, ElTitle } from 'el/components';
import colors from 'el/config/colors';
import { GameStatus, SportType, SignalrEvent } from 'el/enums';
import routes from 'el/navigation/routes';
import { useCountDown, useElToast, useGoBack, useSignalR } from 'el/utils';
import BasketballActions from './BasketballActions';
import GameClock from '../components/GameClock';

export default function BasketballScoreBoardScreen({ navigation, route }) {
    const toast = useElToast();
    const isFocused = useIsFocused();
    const { gameId } = route.params;
    const { register, unregister } = useSignalR();
    const [scoreBoard, setScoreBoard] = useState<any>({ isGameStarted: true });
    const [gameState, setGameState] = useState(scoreBoard.gameStatus || '');
    const { timeLeft, setLeftMilliseconds } = useCountDown({ isTimerStop: gameState !== GameStatus.InProgress || !scoreBoard?.lastStartDateTime });
    const [showEndGameDialog, setShowEndGameDialog] = useState(false);

    useGoBack({ backTo: routes.GameProfile, params: { gameId } });

    useEffect(() => {
        register(SignalrEvent.RefreshGame, (data) => {
            if (data.gameId === gameId) {
                setGameState(data.gameStatus);
                getScoreBoard();
            }
        });

        return () => unregister(SignalrEvent.RefreshGame);
    }, []);

    useEffect(() => {
        if (isFocused) {
            getScoreBoard();
        }
    }, [isFocused]);

    useEffect(() => {
        if (scoreBoard.isGameOver) return;

        if (!scoreBoard.isOfficiate) return;

        if (scoreBoard.quarter !== 4 && scoreBoard.quarter !== 0 && timeLeft === '00:00:00' && gameState !== GameStatus.QuarterOver) {
            endCurrentQuarter();
            return;
        }

        if (scoreBoard.quarter === 4 && timeLeft === '00:00:00') {
            endCurrentQuarter();
            setShowEndGameDialog(true);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (gameState === GameStatus.Confirmed || gameState === GameStatus.End) {
            if (scoreBoard.isOfficiate) {
                return navigation.navigate(routes.GameProfile, { id: gameId });
            }

            navigation.navigate(routes.GamePost, { gameId: gameId, gameType: SportType.Basketball });
        }
    }, [gameState]);

    const getScoreBoard = async () => {
        const res: any = await gameService.getBasketballScoreBoard(gameId);
        if (res && res.code === 200) {
            setScoreBoard(res.value);
            setGameState(res.value.gameStatus);
            setLeftMilliseconds(res.value.leftMilliseconds);
        }
    };

    const handleKickoffGame = async () => {
        const res: any = await gameService.kickoffGame(gameId);
        if (res && res.code === 200) {
            toast.success('Kick off successfully!');
        }
    };

    const handlePauseGame = async () => {
        setGameState(GameStatus.Paused);
        const res: any = await gameService.pauseGame(gameId, timeLeft);
        if (res && res.code === 200) {
            toast.success('Pause game successfully!');
        }
    };

    const handleResumeGame = async () => {
        const res: any = await gameService.resumeGame(gameId);
        if (res && res.code === 200) {
            toast.success('Resume game successfully!');
        }
    };

    const handleStartNewQuarter = async () => {
        const res: any = await gameService.startNewBasketballQuarter(gameId);
        if (res && res.code === 200) {
            toast.success('Start a new quarter successfully!');
        }
    };

    const handleUndoClick = async () => {
        const res: any = await gameService.undoBasketball(gameId);
        if (res && res.code === 200) {
            toast.success('undo successfully!');
        }
        else {
            toast.error(res.Message);
        }

    };

    const endCurrentQuarter = async () => {
        const res: any = await gameService.endBasketballQuarter(gameId);
        if (res && res.code === 200) {
            toast.success('Current quarter is over!');
        }
    };

    const handleOnGameOptionClick = async () => {
        setShowEndGameDialog(false);
        navigation.navigate(routes.GameProfile, { id: gameId, fromScoreBoard: true });
    };

    const handleEndGame = async () => {
        setShowEndGameDialog(false);
        const res: any = await gameService.endGame(gameId);
        if (res.code === 200) {
            navigation.navigate(routes.GameRecap, { gameId: gameId, gameType: SportType.Basketball });
        }
    };

    const handleCancelEndGame = () => {
        setShowEndGameDialog(false);
        navigation.goBack();
    };

    return (
        <ElScrollContainer>
            <ElTitle>Game ID: {scoreBoard.gameCode}</ElTitle>
            <GameClock currentTime={timeLeft} gameId={gameId} gameState={gameState} period={scoreBoard.quarter} isOfficiate={scoreBoard.isOfficiate} />
            <Row>
                <Box flex={1} mr={1} alignItems="center" bgColor={colors.light} borderRadius={8}>
                    <Text fontSize={16} color={colors.primary}>
                        {scoreBoard.homeTeamName}:
                    </Text>
                    <Text fontSize={36} color={colors.primary}>
                        {scoreBoard.homeTeamScore}
                    </Text>
                </Box>
                <Box flex={1} ml={1} alignItems="center" bgColor={colors.light} borderRadius={8}>
                    <Text fontSize={16} color={colors.primary}>
                        {scoreBoard.awayTeamName}:
                    </Text>
                    <Text fontSize={36} color={colors.primary}>
                        {scoreBoard.awayTeamScore}
                    </Text>
                </Box>
            </Row>
            <Row my={2} h={12} alignItems="center">
                <Box flex={1} mx={4} alignItems="center" bgColor={colors.light} borderRadius={8}>
                    <Text fontSize={24} color={colors.primary}>
                        F&nbsp;:&nbsp; {scoreBoard.homeTeamFoulNumber}
                    </Text>
                </Box>
                <Box flex={1} mx={4} alignItems="center" bgColor={colors.light} borderRadius={8}>
                    <Text fontSize={24} color={colors.primary}>
                        F&nbsp;:&nbsp; {scoreBoard.awayTeamFoulNumber}
                    </Text>
                </Box>
            </Row>
            <ScrollView my={1} horizontal>
                <Row space={2}>
                    {scoreBoard.isOfficiate && !scoreBoard.isGameStarted && <ElButton size="sm" onPress={handleKickoffGame}>Start Game</ElButton>}
                    {
                        scoreBoard.isOfficiate && scoreBoard.isGameStarted && gameState !== GameStatus.Paused && gameState !== GameStatus.QuarterOver &&
                        <ElButton size="sm" onPress={handlePauseGame}>Pause</ElButton>
                    }
                    {
                        scoreBoard.isOfficiate && gameState === GameStatus.QuarterOver &&
                        <ElButton size="sm" style={{ width: 180 }} onPress={handleStartNewQuarter}>
                            Start New Quarter
                        </ElButton>
                    }
                    {
                        scoreBoard.isOfficiate && scoreBoard.isGameStarted && gameState === GameStatus.Paused &&
                        <ElButton size="sm" onPress={handleResumeGame}>Resume</ElButton>
                    }
                    <ElButton size="sm" onPress={handleOnGameOptionClick}>Game Options</ElButton>
                    <ElButton size="sm" onPress={handleUndoClick}>Undo</ElButton>
                </Row>
            </ScrollView>
            {
                scoreBoard.isGameStarted && gameState !== GameStatus.Paused && gameState !== GameStatus.QuarterOver &&
                <BasketballActions scoreBoard={scoreBoard} onPaused={() => setGameState(GameStatus.Paused)} timeLeft={timeLeft} />
            }
            <ElBody mt={4} textAlign="center">
                {gameState === GameStatus.QuarterOver && scoreBoard.isOfficiate && "You need to start a new quarter"}
                {gameState === GameStatus.QuarterOver && !scoreBoard.isOfficiate && "Wait for the officiate to start a new quarter"}
            </ElBody>
            {
                scoreBoard.isOfficiate && showEndGameDialog &&
                <ElConfirm
                    visible={showEndGameDialog}
                    title="End Game"
                    message="(Yes) When selected the game will be ended and the official will be directed to a game recap screen."
                    onCancel={handleCancelEndGame}
                    onConfirm={handleEndGame}
                />
            }
        </ElScrollContainer>
    );
}
