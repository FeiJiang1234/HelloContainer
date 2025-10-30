import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { gameService } from 'services';
import { useProfileRoute } from 'utils';
import { SportType } from 'enums';
import { ElTitle } from 'components';
import GameTeam from '../gameTeam';
import GameStatAthleteList from '../gameStatAthleteList';
import GameStatDetail from './../gameStatDetail';

const SoccerStats = () => {
    const location = useLocation();
    const { gameId, teamId, isLowStats } = location?.state;
    const [stats, setStats] = useState({});
    const { teamProfile } = useProfileRoute();
    const history = useHistory();

    useEffect(() => getStats(), []);

    const getStats = async () => {
        const res = await gameService.getSoccerTeamStats(gameId, teamId, isLowStats);
        if (res && res.code === 200) setStats(res.value);
    }

    const handleClickAthlete = (athlete) => history.push('/soccerAthleteStats', { gameId: gameId, athlete: athlete, isLowStats: isLowStats });

    const handleAvatarClick = () => history.push(teamProfile(stats?.teamId));

    const handleArrowClick = () => history.push('/gamePost', { gameId: gameId, gameSportType: SportType.Soccer });

    return (
        <>
            <ElTitle center>Game Stats</ElTitle>
            <GameTeam url={stats?.teamImageUrl} name={stats?.teamName} rank={`Rank: ${stats?.teamCount}, ${stats?.teamRank}`} onAvatarClick={handleAvatarClick} onArrowClick={handleArrowClick} />
            <GameStatDetail title="Goals Scored" text={stats.goalsScored} divider sb />
            <GameStatDetail title="Goals Allowed" text={stats.goalsAllowed} divider sb />
            <GameStatDetail title="Goal Differential" text={stats.goalDifferential} divider sb />
            <GameStatDetail title="Fouls" text={stats.fouls} divider sb />
            <GameStatDetail title="Missed Shots" text={stats.missedShots} divider sb />
            <GameStatDetail title="Penalty Kicks" text={stats.penaltyKicks} divider sb />
            <GameStatDetail title="Saves" text={stats.saves} divider sb />
            <GameStatDetail title="Steals" text={stats.steals} divider sb />
            <GameStatDetail title="Turnovers" text={stats.turnovers} divider sb />
            <GameStatDetail title="Corners" text={stats.corners} divider sb />
            <GameStatDetail title="Cards" text={stats.cards} divider sb />
            <GameStatDetail title="Assists" text={stats.assists} divider sb />
            <GameStatAthleteList athletes={stats.players} onClickAthlete={handleClickAthlete} />
        </>
    );
};

export default SoccerStats;
