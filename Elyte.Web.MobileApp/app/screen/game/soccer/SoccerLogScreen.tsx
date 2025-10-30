import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ElBody, ElLink, ElScrollContainer, ElTitle } from 'el/components';
import { useGoBack, useSignalR, utils } from 'el/utils';
import { gameService } from 'el/api';
import { GameStatus, SportType, SignalrEvent } from 'el/enums';
import routes from 'el/navigation/routes';
import GameLog from '../components/GameLog';

export default function SoccerLogScreen({ route }) {
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
        const res: any = await gameService.getSoccerLogs(gameId);
        if (res && res.code === 200) {
            setLogs(res.value);
        }
    };

    const handleRemoveLogClick = async logId => {
        const res: any = await gameService.removeSoccerLog(gameId, logId);
        if (res && res.code === 200) getLogs();
    };

    const timeFormat = (x) => `Half ${x.half}, ${x.time}`;

    return (
        <ElScrollContainer>
            <ElTitle>Game Log</ElTitle>
            <ElBody textAlign="center" mb={2}>Game ID: {gameCode}</ElBody>
            {
                !utils.isArrayNullOrEmpty(logs) && logs[0].gameStatus === GameStatus.End && isOfficiate &&
                <ElLink to={routes.GameRecap} params={{ gameId, gameType: SportType.Soccer }} mb={1}>Game Recap</ElLink>
            }
            {
                !utils.isArrayNullOrEmpty(logs) && logs[0].gameStatus === GameStatus.Paused && (isStatTracker || isOfficiate) &&
                <ElLink mb={1} to={routes.SoccerScoreBoard} params={{ gameId, gameCode, isOfficiate }}>Score Board</ElLink>
            }
            <GameLog
                logs={logs}
                timeFormat={timeFormat}
                onRemoveLog={handleRemoveLogClick}
                gameType={SportType.Soccer}
                gameId={gameId}
                gameCode={gameCode}
                isOfficiate={isOfficiate}
            />
        </ElScrollContainer>
    );
}
