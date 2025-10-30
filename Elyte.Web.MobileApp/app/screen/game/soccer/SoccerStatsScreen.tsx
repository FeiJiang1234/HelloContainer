import React, { useEffect, useState } from 'react';
import { ElScrollContainer, ElTitle } from 'el/components';
import { useGoBack } from 'el/utils';
import { gameService } from 'el/api';
import GameTeam from '../components/GameTeam';
import GameStatDetail from '../components/GameStatDetail';
import GameStatAthleteList from '../components/GameStatAthleteList';
import routes from 'el/navigation/routes';

const SoccerStatsScreen = ({ navigation, route }) => {
    useGoBack();
    const { gameId, teamId, isLowStats } = route.params;
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const res: any = await gameService.getSoccerTeamStats(gameId, teamId, isLowStats);
        if (res && res.code === 200) setStats(res.value);
    };
    
    const handleAthletePress = (athlete) => {
        const params = {
            gameId: gameId, 
            athleteId: athlete.playerId,
            pictureUrl: athlete.playerPictureUrl,
            name: athlete.playerName,
            isLowStats: isLowStats
        }
        navigation.navigate(routes.SoccerAthleteStats, params);
    }

    return (
        <ElScrollContainer>
            <ElTitle>Game Stats</ElTitle>
            <GameTeam
                url={stats?.teamImageUrl}
                name={stats?.teamName}
                rank={`Rank: ${stats?.teamCount}, ${stats?.teamRank}`}
                onArrowClick={() =>  navigation.goBack()}
            />
            <GameStatDetail title="Goals Scored" text={stats.goalsScored} />
            <GameStatDetail title="Goals Allowed" text={stats.goalsAllowed} />
            <GameStatDetail title="Goal Differential" text={stats.goalDifferential} />
            <GameStatDetail title="Fouls" text={stats.fouls} />
            <GameStatDetail title="Missed Shots" text={stats.missedShots} />
            <GameStatDetail title="Penalty Kicks" text={stats.penaltyKicks} />
            <GameStatDetail title="Saves" text={stats.saves} />
            <GameStatDetail title="Steals" text={stats.steals} />
            <GameStatDetail title="Turnovers" text={stats.turnovers} />
            <GameStatDetail title="Corners" text={stats.corners} />
            <GameStatDetail title="Cards" text={stats.cards} />
            <GameStatDetail title="Assists" text={stats.assists} />
            <GameStatAthleteList athletes={stats.players} onAthletePress={handleAthletePress}/>
        </ElScrollContainer>
    );
};

export default SoccerStatsScreen;
