import React, { useState, useEffect } from 'react';
import { ElBody, ElScrollContainer, ElTitle } from 'el/components';
import { Box, Flex, Row, Text } from 'native-base';
import GameTeam from '../components/GameTeam';
import { useCountDown, utils, useSignalR } from 'el/utils';
import { GameStatus, SportType, SignalrEvent } from 'el/enums';
import { gameService } from 'el/api';
import GameOptions from '../components/GameOptions';
import { useNavigation } from '@react-navigation/native';
import routes from 'el/navigation/routes';

export default function BasketballLiveUserView({ game }) {
    const navigation: any = useNavigation();
    const { register, unregister } = useSignalR();
    const [scoreBoard, setScoreBoard] = useState<any>({ isGameStarted: true });
    const [gameState, setGameState] = useState(game.gameStatus);
    const { timeLeft, setLeftMilliseconds } = useCountDown({ isTimerStop: gameState === GameStatus.Paused || !scoreBoard.isGameStarted || scoreBoard.isGameOver });


    useEffect(() => {
        initScoreBoard();
        register(SignalrEvent.RefreshGame, (data) => {
            if (data.gameId === game?.id) {
                setGameState(data.gameStatus);
                initScoreBoard();
            }
        });

        return () => unregister(SignalrEvent.RefreshGame);
    }, []);

    useEffect(() => {
        if (scoreBoard.isOfficiate) return;
        if (gameState === GameStatus.Confirmed || gameState === GameStatus.End) {
            navigation.replace(routes.GamePost, { gameId: game?.id, gameSportType: SportType.Basketball });
        }
    }, [gameState]);

    const initScoreBoard = async () => {
        const res: any = await gameService.getBasketballScoreBoard(game.id);
        if (res && res.code === 200) {
            setScoreBoard(res.value);
            setLeftMilliseconds(res.value.leftMilliseconds);
        }
    };

    const isFinal = () => {
        return game.gameStatus === GameStatus.End || game.gameStatus === GameStatus.Confirmed;
    };

    return (
        <ElScrollContainer>
            <ElTitle>Score Board</ElTitle>
            <GameTeam url={scoreBoard.homeTeamImageUrl} name={scoreBoard.homeTeamName} score={scoreBoard.homeTeamScore} />
            <GameTeam url={scoreBoard.awayTeamImageUrl} name={scoreBoard.awayTeamName} score={scoreBoard.awayTeamScore} />
            <Text>Basketball details:</Text>
            <Row justifyContent="space-between">
                <Box>
                    <Text fontSize={24}>{utils.numberToOrdinal(scoreBoard.quarter)}</Text>
                    <Text fontSize={24}>
                        {timeLeft}
                        {gameState === GameStatus.Paused && <ElBody>(Paused)</ElBody>}
                        {isFinal() && <ElBody>(Final)</ElBody>}
                    </Text>
                </Box>
                <Flex ml={2} direction="row" justify="space-between" flex={1} maxW={32}>
                    <Flex>
                        <Box flex={1}></Box>
                        <ElBody flex={1}>T1</ElBody>
                        <ElBody flex={1}>T2</ElBody>
                    </Flex>
                    <Flex alignItems="center">
                        <ElBody flex={1}>F</ElBody>
                        <Text flex={1}>{scoreBoard.homeTeamFoulNumber}</Text>
                        <Text flex={1}>{scoreBoard.awayTeamFoulNumber}</Text>
                    </Flex>
                    <Flex alignItems="center">
                        <ElBody flex={1}>TOL</ElBody>
                        <Text flex={1}>{scoreBoard.homeTeamTOL}</Text>
                        <Text flex={1}>{scoreBoard.awayTeamTOL}</Text>
                    </Flex>
                    <Flex alignItems="center">
                        <ElBody flex={1}>PS</ElBody>
                        <Text flex={1}>{scoreBoard.homeTeamScore}</Text>
                        <Text flex={1}>{scoreBoard.awayTeamScore}</Text>
                    </Flex>
                </Flex>
            </Row>
            <GameOptions game={game} />
        </ElScrollContainer>
    );
}
