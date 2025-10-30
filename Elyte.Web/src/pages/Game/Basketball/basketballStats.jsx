import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import GameTeam from '../gameTeam';
import { gameService } from 'services';
import { useProfileRoute } from 'utils';
import { SportType } from 'enums';
import { ElTitle } from 'components';
import GameStatAthleteList from '../gameStatAthleteList';
import GameStatDetail from './../gameStatDetail';

const BasketballStats = () => {
    const location = useLocation();
    const history = useHistory();
    const { gameId, teamId, isLowStats } = location?.state;
    const { teamProfile } = useProfileRoute();
    const [stats, setStats] = useState({});

    useEffect(() => getStats(), []);

    const getStats = async () => {
        const res = await gameService.getBasketballTeamStats(gameId, teamId, isLowStats);
        if (res && res.code === 200) setStats(res.value);
    }

    const handleClickAthlete = (athlete) => history.push('/basketballAthleteStats', { gameId: gameId, athlete: athlete, isLowStats: isLowStats });

    const handleAvatarClick = () => history.push(teamProfile(stats?.teamId));

    const handleArrowClick = () => history.push('/gamePost', { gameId: gameId, gameSportType: SportType.Basketball });

    return (
        <>
            <ElTitle center>Game Stats</ElTitle>
            <GameTeam url={stats?.teamImageUrl} name={stats?.teamName} rank={`Rank: ${stats?.teamCount}, ${stats?.teamRank}`} onAvatarClick={handleAvatarClick} onArrowClick={handleArrowClick} />
            <GameStatDetail title="Total Points Scored" text={stats.totalPointsScored} details={stats.totalPointsScoredDetails} divider sb />
            <GameStatDetail title="Total Points Allowed" text={stats.totalPointsAllowed} divider sb />
            <GameStatDetail title="Total Point Differential" text={stats.totalPointDifferential} divider sb />
            <GameStatDetail title="2 Pointers Scored" text={stats.points2Scored} details={stats.points2ScoredDetails} divider sb />
            <GameStatDetail title="3 Pointers Scored" text={stats.points3Scored} details={stats.points3ScoredDetails} divider sb />
            <GameStatDetail title="Fouls" text={stats.fouls} details={stats.foulsDetails} divider sb />
            <GameStatDetail title="Missed Shots" text={stats.missedShots} details={stats.missedShotsDetails} divider sb />
            <GameStatDetail title="Rebounds" text={stats.rebounds} details={stats.reboundsDetails} divider sb />
            <GameStatDetail title="Steals" text={stats.steals} details={stats.stealsDetails} divider sb />
            <GameStatDetail title="Penalty Shots" text={stats.penaltyShots} details={stats.penaltyShotsDetails} divider sb />
            <GameStatDetail title="Assists" text={stats.assists} details={stats.assistsDetails} divider sb />
            <GameStatDetail title="Blocks" text={stats.blocks} details={stats.blocksDetails} divider sb />
            <GameStatAthleteList athletes={stats.players} onClickAthlete={handleClickAthlete} />
        </>
    );
};

export default BasketballStats;
