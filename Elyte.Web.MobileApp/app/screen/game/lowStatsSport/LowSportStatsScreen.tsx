import React, { useEffect, useState } from 'react';
import { ElScrollContainer, ElTitle } from 'el/components';
import { useGoBack } from 'el/utils';
import { gameService } from 'el/api';
import GameTeam from '../components/GameTeam';
import GameStatDetail from '../components/GameStatDetail';
import GameStatAthleteList from '../components/GameStatAthleteList';

const LowSportStatsScreen = ({ navigation, route }) => {
    useGoBack();
    const { gameId, teamId } = route.params;
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const res: any = await gameService.getLowSportTeamStats(gameId, teamId);
        if (res && res.code === 200) setStats(res.value);
    };

    return (
        <ElScrollContainer>
            <ElTitle>Game Stats</ElTitle>
            <GameTeam
                url={stats?.teamImageUrl}
                name={stats?.teamName}
                rank={`Rank: ${stats?.teamCount}, ${stats?.teamRank}`}
                onArrowClick={() =>  navigation.goBack()}
            />
            <GameStatDetail title="Score" text={stats.score}/>
            <GameStatDetail title="Score Allowed" text={stats.scoreAllowed}/>
            <GameStatAthleteList athletes={stats.players}/>
        </ElScrollContainer>
    );


};

export default LowSportStatsScreen;
