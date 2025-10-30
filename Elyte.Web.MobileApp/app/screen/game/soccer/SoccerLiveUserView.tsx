import { useNavigation } from '@react-navigation/native';
import { gameService } from 'el/api';
import { ElBody, ElScrollContainer, ElTitle } from 'el/components';
import { GameStatus, SportType, SignalrEvent } from 'el/enums';
import routes from 'el/navigation/routes';
import { useTimer, utils, useSignalR } from 'el/utils';
import { Box, Flex, Row, Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import GameOptions from '../components/GameOptions';
import GameTeam from '../components/GameTeam';

export default function SoccerLiveUserView({ game }) {
    const navigation: any = useNavigation();
    const { register, unregister } = useSignalR();
    const [scoreBoard, setScoreBoard] = useState<any>({ isGameStarted: true });
    const [gameState, setGameState] = useState(scoreBoard.gameStatus || game.gameStatus);
    const { timePast, setPastMilliseconds } = useTimer({ isTimerStop: gameState !== GameStatus.InProgress || gameState === GameStatus.InHalfTime || !scoreBoard?.lastStartDateTime });

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
            navigation.replace(routes.GamePost, { gameId: game?.id, gameSportType: SportType.Soccer });
        }
    }, [gameState]);

    const initScoreBoard = async () => {
        const res: any = await gameService.getSoccerScoreBoard(game.id);
        if (res && res.code === 200) {
            setScoreBoard(res.value);
            setPastMilliseconds(res.value.timePastMilliseconds);
        }
    };

    const isFinal = () => {
        return gameState === GameStatus.End || gameState === GameStatus.Confirmed;
    };

    return (
        <ElScrollContainer>
            <ElTitle>Score Board</ElTitle>
            <GameTeam url={scoreBoard.homeTeamImageUrl} name={scoreBoard.homeTeamName} score={scoreBoard.homeTeamScore} />
            <GameTeam url={scoreBoard.awayTeamImageUrl} name={scoreBoard.awayTeamName} score={scoreBoard.awayTeamScore} />
            <ElBody>Soccer details:</ElBody>
            <Row justifyContent="space-between">
                <Box>
                    <Text fontSize={24}>{utils.numberToOrdinal(scoreBoard.half)}</Text>
                    <Text fontSize={24}>
                        {timePast}
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
                        <ElBody flex={1}>CK</ElBody>
                        <Text flex={1}>{scoreBoard.homeTeamCorner}</Text>
                        <Text flex={1}>{scoreBoard.awayTeamCorner}</Text>
                    </Flex>
                </Flex>
            </Row>
            <GameOptions game={game} />
        </ElScrollContainer>
    );
}
