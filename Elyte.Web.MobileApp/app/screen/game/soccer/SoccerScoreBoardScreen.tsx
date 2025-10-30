import { useIsFocused } from '@react-navigation/native';
import { gameService } from 'el/api';
import { ElBody, ElButton, ElConfirm, ElScrollContainer, ElTitle } from 'el/components';
import colors from 'el/config/colors';
import { GameStatus, SportType, SignalrEvent } from 'el/enums';
import routes from 'el/navigation/routes';
import { useElToast, useGoBack, useTimer, useSignalR } from 'el/utils';
import { Box, Row, ScrollView, Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import SoccerActions from './SoccerActions';
import GameClock from '../components/GameClock';

export default function SoccerScoreBoardScreen({ navigation, route, }) {
    const isFocused = useIsFocused();
    const toast = useElToast();
    const { gameId } = route.params;
    const { register, unregister } = useSignalR();
    const [scoreBoard, setScoreBoard] = useState<any>({ isGameStarted: true });
    const [gameState, setGameState] = useState(scoreBoard.gameStatus || '');
    const [endFirstHalfConfirm, setEndFirstHalfConfirm] = useState(false);
    const [showEndGameDialog, setShowEndGameDialog] = useState(false);
    const { timePast, setPastMilliseconds } = useTimer({ isTimerStop: gameState !== GameStatus.InProgress || gameState === GameStatus.InHalfTime || !scoreBoard?.lastStartDateTime });

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
        if (gameState === GameStatus.Confirmed || gameState === GameStatus.End) {
            if (scoreBoard.isOfficiate) {
                return navigation.navigate(routes.GameProfile, { id: gameId });
            }

            navigation.navigate(routes.GamePost, { gameId: gameId, gameType: SportType.Soccer });
        }
    }, [gameState]);

    const getScoreBoard = async () => {
        const res: any = await gameService.getSoccerScoreBoard(gameId);
        if (res && res.code === 200) {
            setScoreBoard(res.value);
            setPastMilliseconds(res.value.timePastMilliseconds);
            setGameState(res.value.gameStatus);
        }
    }

    const handlePauseGame = async () => {
        setGameState(GameStatus.Paused);
        const res: any = await gameService.pauseGame(gameId, timePast);
        if (res && res.code === 200) {
            toast.success("Pause game successfully!");
        }
    }

    const handleResumeGame = async () => {
        const res: any = await gameService.resumeGame(gameId);
        if (res && res.code === 200) {
            toast.success("Resume game successfully!");
        }
    };

    const endFirstHalf = async () => {
        const res: any = await gameService.endSoccerFirstHalf(gameId);
        if (res && res.code === 200) {
            setEndFirstHalfConfirm(false);
            toast.success("End first half successfully!");
        }
    }

    const handleStartNewHalf = async () => {
        const res: any = await gameService.startNewSoccerHalf(gameId);
        if (res && res.code === 200) {
            toast.success("Start a new half successfully!");
        }
    }

    const handleKickoffGame = async () => {
        const res: any = await gameService.kickoffGame(gameId);
        if (res && res.code === 200) {
            toast.success("Kick off successfully!");
        }
    };

    const handleEndGame = async () => {
        var res: any = await gameService.endGame(gameId);
        if (res.code === 200) {
            setShowEndGameDialog(false);
            navigation.navigate(routes.GameRecap, { gameId: gameId, gameType: SportType.Soccer });
        }
    }

    const handleUndoClick = async () => {
        const res: any = await gameService.undoSoccer(gameId);
        if (res && res.code === 200) {
            toast.success("Undo successfully!");
        }
    };

    const handleOnGameOptionClick = async () => {
        setShowEndGameDialog(false);
        navigation.navigate(routes.GameProfile, { id: gameId, fromScoreBoard: true });
    }

    return (
        <ElScrollContainer>
            <ElTitle>Game ID: {scoreBoard.gameCode}</ElTitle>
            <GameClock currentTime={timePast} gameId={gameId} gameState={gameState} period={scoreBoard.half} isOfficiate={scoreBoard.isOfficiate} />
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
                    {
                        scoreBoard.isOfficiate && !scoreBoard.isGameStarted &&
                        <ElButton size="sm" onPress={handleKickoffGame}>Start Game</ElButton>
                    }
                    {
                        scoreBoard.isOfficiate && scoreBoard.isGameStarted && gameState !== GameStatus.Paused && gameState !== GameStatus.InHalfTime &&
                        <ElButton size="sm" onPress={handlePauseGame}>Pause</ElButton>
                    }
                    {
                        scoreBoard.isOfficiate && gameState === GameStatus.InHalfTime &&
                        <ElButton size="sm" style={{ width: 140 }} onPress={handleStartNewHalf}>Start New Half</ElButton>
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
                scoreBoard.isOfficiate && scoreBoard.isGameStarted &&
                <ScrollView contentContainerStyle={{ marginRight: 8 }} my={1} horizontal>
                    <Row space={2}>
                        <ElButton disabled={scoreBoard.half === 2 || gameState === GameStatus.InHalfTime} size="sm" style={{ width: 120 }} onPress={() => setEndFirstHalfConfirm(true)}>End First Half</ElButton>
                        <ElButton size="sm" onPress={() => setShowEndGameDialog(true)}>End Game</ElButton>
                    </Row>
                </ScrollView>
            }
            {
                scoreBoard.isGameStarted && gameState !== GameStatus.Paused && gameState !== GameStatus.InHalfTime &&
                <SoccerActions scoreBoard={scoreBoard} />
            }
            <ElBody mt={4} textAlign="center">
                {gameState === GameStatus.InHalfTime && (scoreBoard.isOfficiate ? "You need to start a new half" : "Wait for the officiate to Start a new Half")}
            </ElBody>
            <ElConfirm
                title="Are you sure you want to end the first half?"
                message="(Yes) When selected the first half will be ended. (No) When selected the official will be directed back to the main game screen."
                visible={endFirstHalfConfirm}
                onCancel={() => setEndFirstHalfConfirm(false)}
                onConfirm={endFirstHalf}
            />
            {
                scoreBoard.isOfficiate &&
                <ElConfirm
                    title="End Game"
                    message="(Yes) When selected the game will be ended and the official will be directed to a game recap screen."
                    visible={showEndGameDialog}
                    onCancel={() => setShowEndGameDialog(false)}
                    onConfirm={handleEndGame}
                />
            }
        </ElScrollContainer >
    );
}
