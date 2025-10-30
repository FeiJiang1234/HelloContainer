import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gameService } from 'services';
import GameDetail from '../gameDetail';
import { ElTitle } from 'components';
import GameAthlete from '../gameAthlete';
import GameField from '../gameField';
import { SportType } from 'enums';

const SoccerAthleteStats = () => {
    const location = useLocation();
    const { gameId, athlete, isLowStats } = location?.state;
    const [stats, setStats] = useState({});

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const res = await gameService.getSoccerAthleteStats(gameId, athlete.playerId, isLowStats);
        if (res && res.code === 200) setStats(res.value);
    }

    return (
        <>
            <ElTitle center>Game Athlete Stats</ElTitle>
            <GameAthlete url={athlete.playerPictureUrl} name={athlete.playerName}></GameAthlete>
            <GameField shots={stats.shots} sportType={SportType.Soccer}/>
            <GameDetail title="Goals " text={stats.goals} divider sb/>
            <GameDetail title="Fouls" text={stats.fouls} divider sb/>
            <GameDetail title="Missed Shots" text={stats.missedShots} divider sb/>
            <GameDetail title="Penalty Kicks" text={stats.penaltyKicks} divider sb/>
            <GameDetail title="Saves" text={stats.saves} divider sb/>
            <GameDetail title="Steals" text={stats.steals} divider sb/>
            <GameDetail title="Turnovers" text={stats.turnovers} divider sb/>
            <GameDetail title="Corners" text={stats.corners} divider sb/>
            <GameDetail title="Cards" text={stats.cards} divider sb/>
            <GameDetail title="Assists" text={stats.assists} divider sb/>
        </>
    );
};

export default SoccerAthleteStats;
