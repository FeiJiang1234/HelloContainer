import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gameService } from 'services';
import GameDetail from '../gameDetail';
import { ElTitle } from 'components';
import GameAthlete from '../gameAthlete';
import GameField from './../gameField';
import { SportType } from 'enums';

const BasketballAthleteStats = () => {
    const location = useLocation();
    const { gameId, athlete, isLowStats } = location?.state;
    const [stats, setStats] = useState({});

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const res = await gameService.getBasketballAthleteStats(gameId, athlete.playerId, isLowStats);
        if (res && res.code === 200) setStats(res.value);
    }

    return (
        <>
            <ElTitle center>Game Athlete Stats</ElTitle>
            <GameAthlete url={athlete.playerPictureUrl} name={athlete.playerName}></GameAthlete>
            <GameField shots={stats.shots} sportType={SportType.Basketball}/>
            <GameDetail title="2 Pointers Scored" text={stats.points2Scored} divider sb/>
            <GameDetail title="3 Pointers Scored" text={stats.points3Scored} divider sb/>
            <GameDetail title="Fouls" text={stats.fouls} divider sb/>
            <GameDetail title="Missed Shots" text={stats.missedShots} divider sb/>
            <GameDetail title="Rebounds" text={stats.rebounds} divider sb/>
            <GameDetail title="Steals" text={stats.steals} divider sb/>
            <GameDetail title="Penalty Shots" text={stats.penaltyShots} divider sb/>
            <GameDetail title="Assists" text={stats.assists} divider sb/>
            <GameDetail title="Blocks" text={stats.blocks} divider sb/>
        </>
    );
};

export default BasketballAthleteStats;
