import React, { useEffect, useState } from 'react';
import { gameService, signalRService } from 'services';
import { useLocation } from 'react-router-dom';
import { ElTitle, ElBody, ElLink } from 'components';
import GameLog from './../gameLog';
import { GameStatus, SportType } from 'enums';

const BasketballLog = () => {
    const location = useLocation();
    const { gameId, gameCode, isOfficiate, isStatTracker } = location?.state;
    const [logs, setLogs] = useState([]);

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
        const res = await gameService.getBasketballLogs(gameId);
        if (res && res.code === 200) setLogs(res.value);
    }

    const handleRemoveLogClick = async (logId) => {
        const res = await gameService.removeBasketballLog(gameId, logId);
        if (res && res.code === 200) getLogs();
    }

    const timeFormat = (x) => `Quarter ${x.quarter}, ${x.time}`;

    return (
        <>
            <ElTitle center>Game Log</ElTitle>
            <ElBody center>Game ID: {gameCode}</ElBody>
            {
                !Array.isNullOrEmpty(logs) && logs[0].gameStatus === GameStatus.End && isOfficiate &&
                <ElLink green to={{ pathname: '/gameRecapScreen', state: { gameId, gameType: SportType.Basketball } }}>Game Recap</ElLink>
            }
            {
                !Array.isNullOrEmpty(logs) && logs[0].gameStatus === GameStatus.Paused && (isStatTracker || isOfficiate) &&
                <ElLink green to={{ pathname: '/basketballScoreBoard', state: { gameId, gameCode, isOfficiate } }}>Score Board</ElLink>
            }
            <GameLog logs={logs} timeFormat={timeFormat} onRemoveLog={handleRemoveLogClick} gameType={SportType.Basketball} gameId={gameId} gameCode={gameCode} isOfficiate={isOfficiate} />
        </>
    );
};

export default BasketballLog;
