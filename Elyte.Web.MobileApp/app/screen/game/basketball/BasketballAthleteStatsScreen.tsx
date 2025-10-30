import { gameService } from 'el/api';
import { ElScrollContainer, ElTitle } from 'el/components';
import { SportType } from 'el/enums';
import GameField from 'el/screen/accountInfo/components/GameField';
import { useGoBack } from 'el/utils';
import React, { useEffect, useState } from 'react';
import GameAthlete from '../components/GameAthlete';
import GameDetail from '../components/GameDetail';

const BasketballAthleteStatsScreen = ({ route }) => {
    useGoBack();
    const { gameId, athleteId, pictureUrl, name, isLowStats} = route.params;
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const res: any = await gameService.getBasketballAthleteStats(gameId, athleteId, isLowStats);
        if (res && res.code === 200) setStats(res.value);
    }

    return (
        <ElScrollContainer>
            <ElTitle>Game Athlete Stats</ElTitle>
            <GameAthlete uri={pictureUrl} name={name}/>
            <GameField shots={stats.shots} sportType={SportType.Basketball}/>
            <GameDetail title="2 Pointers Scored" text={stats.points2Scored} direction='row'/>
            <GameDetail title="3 Pointers Scored" text={stats.points3Scored} direction='row'/>
            <GameDetail title="Fouls" text={stats.fouls} direction='row'/>
            <GameDetail title="Missed Shots" text={stats.missedShots} direction='row'/>
            <GameDetail title="Rebounds" text={stats.rebounds} direction='row'/>
            <GameDetail title="Steals" text={stats.steals} direction='row'/>
            <GameDetail title="Penalty Shots" text={stats.penaltyShots} direction='row'/>
            <GameDetail title="Assists" text={stats.assists} direction='row'/>
            <GameDetail title="Blocks" text={stats.blocks} direction='row'/>
        </ElScrollContainer>
    );
};

export default BasketballAthleteStatsScreen;
