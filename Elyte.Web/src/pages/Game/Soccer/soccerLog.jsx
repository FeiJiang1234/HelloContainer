import React, { useEffect, useState } from 'react';
import { gameService, signalRService } from 'services';
import { useLocation } from 'react-router-dom';
import { ElTitle, ElBody, ElLink } from 'components';
import GameLog from '../gameLog';
import { GameStatus, SportType } from 'enums';

const SoccerLog = () => {
    const [logs, setLogs] = useState([]);
    const location = useLocation();
    const { gameId, gameCode, isOfficiate, isStatTracker } = location?.state;

    useEffect(() => {
        getLogs();
        signalRService.registerRefreshGameEvent((data) => {
            if (data.gameId === gameId) {
                getLogs();
            }
        });

        return () => signalRService.unregisterRefreshGameEvent();
    }, []);

    const getLogs = async () => {
        const res = await gameService.getSoccerLogs(gameId);
        if (res && res.code === 200) setLogs(res.value);
    }

    const removeLog = async (logId) => {
        const res = await gameService.removeSoccerLog(gameId, logId);
        if (res && res.code === 200) getLogs();
    }

    const timeFormat = (x) => `Half ${x.half}, ${x.time}`;

    return (
        <>
            <ElTitle center>Game Log</ElTitle>
            <ElBody center>Game ID: {gameCode}</ElBody>
            {
                !Array.isNullOrEmpty(logs) && logs[0].gameStatus === GameStatus.End && isOfficiate &&
                <ElLink green to={{ pathname: '/gameRecapScreen', state: { gameId, gameType: SportType.Soccer } }}>Game Recap</ElLink>
            }
            {
                !Array.isNullOrEmpty(logs) && logs[0].gameStatus === GameStatus.Paused && (isStatTracker || isOfficiate) &&
                <ElLink green to={{ pathname: '/soccerScoreBoard', state: { gameId, gameCode, isOfficiate } }}>Score Board</ElLink>
            }
            <GameLog logs={logs} timeFormat={timeFormat} onRemoveLog={removeLog} gameType={SportType.Soccer} gameId={gameId} gameCode={gameCode} isOfficiate={isOfficiate} />
        </>
    );
};

export default SoccerLog;
