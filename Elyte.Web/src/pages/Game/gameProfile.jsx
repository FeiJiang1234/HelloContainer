import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { ElButton, ElConfirm, ElLinkBtn, ElOptionButton } from 'components';
import { useLocation, useHistory } from 'react-router-dom';
import { gameService, signalRService } from 'services';
import { useGameRoute } from 'utils';
import BasketballLiveUserView from './Basketball/basketballLiveUserView';
import { SportType, GameStatus } from 'enums';
import SoccerLiveUserView from './Soccer/soccerLiveUserView';
import OfficiateChange from './officiateChange';
import GameProfileHeader from './gameProfileHeader';
import CallCoordinator from './callCoordinator';
import StartGame from './startGame';
import GameOptions from './gameOptions';

const useStyles = makeStyles(theme => ({
    startGameBtn: {
        fontSize: '20px !important',
        fontWeight: '500 !important',
        marginTop: theme.spacing(5),
    }
}));

export default function GameProfile () {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const routerParams = location.state?.params;
    const { goScoreBoard } = useGameRoute();
    const [gameInfo, setGameInfo] = useState({});
    const [showEndGameDialog, setShowEndGameDialog] = useState(false);
    const [gameState, setGameState] = useState();

    useEffect(() => {
        signalRService.registerRefreshGameEvent((data) => {
            if (data.gameId === routerParams?.id) {
                setGameState(data.gameStatus);
                setGameInfo(pre => ({ ...pre, gameStatus: data.gameStatus }));
            }
        });

        return () => signalRService.unregisterRefreshGameEvent();
    }, []);

    useEffect(() => getGameProfile(routerParams?.id), [routerParams]);

    useEffect(() => setGameState(gameInfo?.gameStatus), [gameInfo]);

    useEffect(() => {
        if (gameInfo.isOfficiate && gameState === GameStatus.Confirmed) {
            return history.push('/gamePost', { gameId: routerParams?.id, gameSportType: gameInfo.gameSportType });
        }
        if (gameInfo.isOfficiate) return;
        if (gameState === GameStatus.Confirmed || gameState === GameStatus.End) {
            history.push('/gamePost', { gameId: routerParams?.id, gameSportType: gameInfo.gameSportType });
        }
    }, [gameState]);

    const gameIsStart = () => {
        return gameState;
    }

    const gameIsEnd = () => {
        return gameState === GameStatus.End;
    }

    const gameIsConfirm = () => {
        return gameState === GameStatus.Confirmed;
    }

    const isNormalUser = () => {
        return !gameInfo.isOfficiate && !gameInfo.isStatTracker;
    }

    const getGameProfile = async gameId => {
        if (!gameId) return;
        const res = await gameService.getGameProfile(gameId);
        if (res && res.code === 200) {
            setGameInfo(res.value);
        }
    };

    const handleGoToGameRecapClick = () => {
        history.push('/gameRecapScreen', { gameId: gameInfo.id, gameType: gameInfo.gameSportType });
    }

    const handleYesClick = async () => {
        const res = await gameService.endGame(gameInfo.id);
        if (res.code === 200) {
            setShowEndGameDialog(false)
            history.push('/gameRecapScreen', { gameId: gameInfo.id, gameType: gameInfo.gameSportType });
        }
    }

    if (gameIsStart() && isNormalUser()) {
        if (gameInfo.gameSportType === SportType.Basketball) return <BasketballLiveUserView game={gameInfo} />;
        if (gameInfo.gameSportType === SportType.Soccer) return <SoccerLiveUserView game={gameInfo} />;
    }

    return (
        <>
            <GameProfileHeader game={gameInfo} />
            {
                <>
                    {
                        gameInfo.isOfficiate && !gameIsStart() && <StartGame game={gameInfo} />
                    }
                    {
                        (gameInfo.isStatTracker || (gameInfo.isOfficiate && gameIsStart())) && !gameIsEnd() &&
                        <ElButton className={classes.startGameBtn} onClick={() => goScoreBoard(gameInfo.id, gameInfo.gameSportType)} media ml={3} mr={3}>Go to Score Board</ElButton>
                    }
                    {
                        gameInfo.isOfficiate && gameIsEnd() &&
                        <ElButton className={classes.startGameBtn} onClick={handleGoToGameRecapClick} media ml={3} mr={3}>Go to Game Recap</ElButton>
                    }
                    {
                        gameInfo.isOfficiate && gameIsStart() && <CallCoordinator game={gameInfo} />
                    }

                    <GameOptions game={gameInfo} />

                    {gameInfo.isOfficiate && gameIsStart() && !gameIsEnd() && !gameIsConfirm() && <ElOptionButton iconName="endGame" onClick={() => setShowEndGameDialog(true)}>End Game</ElOptionButton>}

                    {(gameInfo.isCurrentLeagueOfficiate || gameInfo.isCurrentTournamentOfficiate) && !gameInfo.isOfficiate && <OfficiateChange game={gameInfo} afterChange={getGameProfile} />}
                    {
                        gameInfo.isOfficiate && !gameIsStart() && <ElLinkBtn mt={1} style={{ textAlign: 'center', fontSize: 18 }}>Officiate Change Code: {gameInfo.officiateGameCode}</ElLinkBtn>
                    }
                </>
            }

          

            <ElConfirm
                title="This will end the game. Are you sure?"
                content="(Yes) When selected the game will be ended and the official will be directed to a game recap screen. (No) When selected the official will be directed back to the main game screen."
                open={showEndGameDialog}
                onNoClick={() => setShowEndGameDialog(false)}
                onOkClick={handleYesClick}
            />
        </>
    );
}
