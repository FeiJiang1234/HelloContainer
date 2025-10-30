import { gameService } from 'el/api';
import { ElScrollContainer, ElTitle } from 'el/components';
import { SportType } from 'el/enums';
import GameField from 'el/screen/accountInfo/components/GameField';
import { useGoBack } from 'el/utils';
import React, { useEffect, useState } from 'react';
import GameAthlete from '../components/GameAthlete';
import GameDetail from '../components/GameDetail';

const SoccerAthleteStatsScreen = ({ route }) => {
    useGoBack();
    const { gameId, athleteId, pictureUrl, name, isLowStats } = route.params;
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const res: any = await gameService.getSoccerAthleteStats(gameId, athleteId, isLowStats);
        if (res && res.code === 200) setStats(res.value);
    }

    return (
        <ElScrollContainer>
            <ElTitle>Game Athlete Stats</ElTitle>
            <GameAthlete uri={pictureUrl} name={name}/>
            <GameField shots={stats.shots} sportType={SportType.Soccer}/>
            <GameDetail title="Goals " text={stats.goals}  direction='row' />
            <GameDetail title="Fouls" text={stats.fouls}  direction='row' />
            <GameDetail title="Missed Shots" text={stats.missedShots}  direction='row' />
            <GameDetail title="Penalty Kicks" text={stats.penaltyKicks}  direction='row' />
            <GameDetail title="Saves" text={stats.saves}  direction='row' />
            <GameDetail title="Steals" text={stats.steals}  direction='row' />
            <GameDetail title="Turnovers" text={stats.turnovers}  direction='row' />
            <GameDetail title="Corners" text={stats.corners}  direction='row' />
            <GameDetail title="Cards" text={stats.cards}  direction='row' />
            <GameDetail title="Assists" text={stats.assists}  direction='row' />
        </ElScrollContainer>
    );
};

export default SoccerAthleteStatsScreen;
