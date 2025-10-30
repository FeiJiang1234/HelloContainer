import React, { useEffect, useState } from 'react';
import { ElScrollContainer, ElTitle } from 'el/components';
import { useGoBack } from 'el/utils';
import { gameService } from 'el/api';
import GameTeam from '../components/GameTeam';
import GameStatDetail from '../components/GameStatDetail';
import GameStatAthleteList from '../components/GameStatAthleteList';
import routes from 'el/navigation/routes';

const BasketballStatsScreen = ({ navigation, route }) => {
    useGoBack();
    const { gameId, teamId, isLowStats } = route.params;
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const res: any = await gameService.getBasketballTeamStats(gameId, teamId, isLowStats);
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
        navigation.navigate(routes.BasketballAthleteStats, params);
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
            <GameStatDetail title="Total Points Scored" text={stats.totalPointsScored} details={stats.totalPointsScoredDetails} />
            <GameStatDetail title="Total Points Allowed" text={stats.totalPointsAllowed} />
            <GameStatDetail title="Total Point Differential" text={stats.totalPointDifferential} />
            <GameStatDetail title="2 Pointers Scored" text={stats.points2Scored} details={stats.points2ScoredDetails} />
            <GameStatDetail title="3 Pointers Scored" text={stats.points3Scored} details={stats.points3ScoredDetails} />
            <GameStatDetail title="Fouls" text={stats.fouls} details={stats.foulsDetails} />
            <GameStatDetail title="Missed Shots" text={stats.missedShots} details={stats.missedShotsDetails} />
            <GameStatDetail title="Rebounds" text={stats.rebounds} details={stats.reboundsDetails} />
            <GameStatDetail title="Steals" text={stats.steals} details={stats.stealsDetails} />
            <GameStatDetail title="Penalty Shots" text={stats.penaltyShots} details={stats.penaltyShotsDetails} />
            <GameStatDetail title="Assists" text={stats.assists} details={stats.assistsDetails} />
            <GameStatDetail title="Blocks" text={stats.blocks} details={stats.blocksDetails} />
            <GameStatAthleteList athletes={stats.players} onAthletePress={handleAthletePress}/>
        </ElScrollContainer>
    );
};

export default BasketballStatsScreen;
