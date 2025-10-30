import { Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import { gameService } from 'el/api';
import { ElButton, ElConfirm, ElLinkBtn, ElOptionButton, ElScrollContainer } from 'el/components';
import routes from 'el/navigation/routes';
import { GameStatus, SportType, SignalrEvent } from 'el/enums';
import { EndGameSvg } from 'el/svgs';
import { useGameRoute, useGoBack, useSignalR } from 'el/utils';
import BasketballLiveUserView from './basketball/BasketballLiveUserView';
import CallCoordinator from './components/CallCoordinator';
import GameOptions from './components/GameOptions';
import GameProfileHeader from './components/GameProfileHeader';
import SoccerLiveUserView from './soccer/SoccerLiveUserView';
import OfficiateChange from './components/OfficiateChange';
import StartGame from './components/StartGame';

export default function GameProfileScreen({ navigation, route }) {
    const { id, fromScoreBoard } = route.params;
    const { goScoreBoard } = useGameRoute();
    const [gameInfo, setGameInfo] = useState<any>({});
    const { register, unregister } = useSignalR();
    const [gameState, setGameState] = useState();
    const [showEndGameDialog, setShowEndGameDialog] = useState(false);

    const getGoBackPath = (gameType) => {
        if (gameType === SportType.Baseball)
            return routes.BaseballScoreBoard;
        if (gameType === SportType.Basketball)
            return routes.BasketballScoreBoard;
        if (gameType === SportType.Soccer)
            return routes.SoccerScoreBoard;
    };
    fromScoreBoard ? useGoBack({ backTo: getGoBackPath(gameInfo.gameSportType), params: { gameId: id } }) : useGoBack();

    useEffect(() => {
        register(SignalrEvent.RefreshGame, (data) => {
            if (data.gameId === id) {
                setGameState(data.gameStatus);
                setGameInfo(pre => ({ ...pre, gameStatus: data.gameStatus }));
            }
        });

        navigation.addListener('focus', () => {
            getGameProfile(id);
        });

        return () => unregister(SignalrEvent.RefreshGame);
    }, []);

    useEffect(() => setGameState(gameInfo?.gameStatus), [gameInfo]);

    useEffect(() => {
        if (gameInfo.isOfficiate && gameState === GameStatus.Confirmed) {
            return navigation.replace(routes.GamePost, { gameId: id, gameSportType: gameInfo.gameSportType });
        }

        if (gameInfo.isOfficiate) return;

        if (gameState === GameStatus.Confirmed || gameState === GameStatus.End) {
            navigation.replace(routes.GamePost, { gameId: id, gameSportType: gameInfo.gameSportType });
        }
    }, [gameState]);

    const gameIsStart = () => {
        return gameState;
    };

    const gameIsEnd = () => {
        return gameState === GameStatus.End;
    };

    const gameIsConfirm = () => {
        return gameState === GameStatus.Confirmed;
    };

    const isNormalUser = () => {
        return !gameInfo.isOfficiate && !gameInfo.isStatTracker;
    };

    if (gameIsStart() && isNormalUser()) {
        if (gameInfo.gameSportType === SportType.Basketball) return <BasketballLiveUserView game={gameInfo} />;
        if (gameInfo.gameSportType === SportType.Soccer) return <SoccerLiveUserView game={gameInfo} />;
    }

    const handleGoToGameRecapClick = () => {
        navigation.navigate(routes.GameRecap, { gameId: gameInfo.id, gameType: gameInfo.gameSportType });
    };

    const handleConfirmEndClick = async () => {
        const res: any = await gameService.endGame(gameInfo.id);
        if (res.code === 200) {
            setShowEndGameDialog(false);
            navigation.navigate(routes.GameRecap, { gameId: gameInfo.id, gameType: gameInfo.gameSportType });
        }
    };

    const getGameProfile = async gameId => {
        if (!gameId) return;
        const res: any = await gameService.getGameProfile(gameId);
        if (res && res.code === 200) {
            setGameInfo(res.value);
        }
    };

    return (
        <ElScrollContainer>
            <GameProfileHeader game={gameInfo} />
            <Box mb={2}>
                {gameInfo.isOfficiate && !gameIsStart() && <StartGame game={gameInfo} />}
                {
                    (gameInfo.isStatTracker || (gameInfo.isOfficiate && gameIsStart())) && !gameIsEnd() &&
                    <ElButton onPress={() => goScoreBoard(gameInfo.id, gameInfo.gameSportType)}>
                        Go to Score Board
                    </ElButton>
                }
                {gameInfo.isOfficiate && gameIsEnd() && <ElButton onPress={handleGoToGameRecapClick}>Go to Game Recap</ElButton>}
            </Box>
            {gameInfo.isOfficiate && gameIsStart() && <CallCoordinator game={gameInfo} />}
            <GameOptions game={gameInfo} />
            {
                gameInfo.isOfficiate && gameIsStart() && !gameIsEnd() && !gameIsConfirm() &&
                <ElOptionButton icon={<EndGameSvg />} onPress={() => setShowEndGameDialog(true)}>
                    End Game
                </ElOptionButton>
            }
            {(gameInfo.isCurrentLeagueOfficiate || gameInfo.isCurrentTournamentOfficiate) && !gameInfo.isOfficiate && <OfficiateChange game={gameInfo} afterChange={getGameProfile} />}
            {
                gameInfo.isOfficiate && !gameIsStart() &&
                <ElLinkBtn my={1} style={{ textAlign: 'center' }}>
                    Officiate Change Code: {gameInfo.officiateGameCode}
                </ElLinkBtn>
            }
            {
                showEndGameDialog &&
                <ElConfirm
                    title="This will end the game. Are you sure?"
                    message="(Yes) When selected the game will be ended and the official will be directed to a game recap screen. (No) When selected the official will be directed back to the main game screen."
                    visible={showEndGameDialog}
                    onCancel={() => setShowEndGameDialog(false)}
                    onConfirm={handleConfirmEndClick}
                />
            }
        </ElScrollContainer>
    );
}
