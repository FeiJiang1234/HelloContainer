import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { gameService } from 'el/api';
import { ElBody, ElLink, ElScrollContainer, ElTitle } from 'el/components';
import { GameStatus, SportType, SignalrEvent } from 'el/enums';
import routes from 'el/navigation/routes';
import { useGoBack, useSignalR, utils } from 'el/utils';
import GameLog from '../components/GameLog';

export default function BasketballLogScreen({ route }) {
    useGoBack();
    const isFocused = useIsFocused();
    const { register, unregister } = useSignalR();
    const { gameId, gameCode, isOfficiate, isStatTracker } = route.params;
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        register(SignalrEvent.RefreshGame, (data) => {
            if (data.gameId === gameId) {
                getLogs();
            }
        });

        return () => unregister(SignalrEvent.RefreshGame);
    }, []);

    useEffect(() => {
        if (isFocused) {
            getLogs();
        }
    }, [isFocused]);

    const getLogs = async () => {
        const res: any = await gameService.getBasketballLogs(gameId);
        if (res && res.code === 200) {
            setLogs(res.value);
        }
    };

    const handleRemoveLogClick = async logId => {
        const res: any = await gameService.removeBasketballLog(gameId, logId);
        if (res && res.code === 200) getLogs();
    };

    const timeFormat = x => `Quarter ${x.quarter}, ${x.time}`;

    return (
        <ElScrollContainer>
            <ElTitle>Game Log</ElTitle>
            <ElBody textAlign="center" mb={2}>Game ID: {gameCode}</ElBody>
            {
                !utils.isArrayNullOrEmpty(logs) && logs[0].gameStatus === GameStatus.End && isOfficiate &&
                <ElLink to={routes.GameRecap} params={{ gameId, gameType: SportType.Basketball }} mb={1}>Game Recap</ElLink>
            }
            {
                !utils.isArrayNullOrEmpty(logs) && logs[0].gameStatus === GameStatus.Paused && (isStatTracker || isOfficiate) &&
                <ElLink mb={1} to={routes.BasketballScoreBoard} params={{ gameId, gameCode, isOfficiate }}>Score Board</ElLink>
            }
            <GameLog
                logs={logs}
                timeFormat={timeFormat}
                onRemoveLog={handleRemoveLogClick}
                gameType={SportType.Basketball}
                gameId={gameId}
                gameCode={gameCode}
                isOfficiate={isOfficiate}
            />
        </ElScrollContainer>
    );
}
