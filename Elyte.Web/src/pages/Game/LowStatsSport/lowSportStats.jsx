import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import GameTeam from '../gameTeam';
import { gameService } from 'services';
import { useProfileRoute } from 'utils';
import { ElTitle } from 'components';
import GameStatDetail from './../gameStatDetail';
import GameStatAthleteList from '../gameStatAthleteList';

const LowSportStats = () => {
    const location = useLocation();
    const history = useHistory();
    const { gameId, teamId, gameSportType } = location?.state;
    const { teamProfile } = useProfileRoute();
    const [stats, setStats] = useState({});

    useEffect(() => getStats(), []);

    const getStats = async () => {
        const res = await gameService.getLowSportTeamStats(gameId, teamId);
        if (res && res.code === 200) setStats(res.value);
    }

    const handleAvatarClick = () => history.push(teamProfile(stats?.teamId));

    const handleArrowClick = () => history.push('/gamePost', { gameId: gameId, gameSportType: gameSportType });

    return (
        <>
            <ElTitle center>Game Stats</ElTitle>
            <GameTeam url={stats?.teamImageUrl} name={stats?.teamName} rank={`Rank: ${stats?.teamCount}, ${stats?.teamRank}`} onAvatarClick={handleAvatarClick} onArrowClick={handleArrowClick} />
            <GameStatDetail title="Score" text={stats.score} divider sb />
            <GameStatDetail title="Score Allowed" text={stats.scoreAllowed} divider sb />
            <GameStatAthleteList athletes={stats.players} />
        </>
    );
};

export default LowSportStats;
