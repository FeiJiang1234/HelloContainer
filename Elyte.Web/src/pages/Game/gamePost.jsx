import React, { useEffect, useState } from 'react';
import { ElTitle } from 'components';
import { Typography, Box } from '@mui/material';
import { useLocation, useHistory } from 'react-router-dom';
import { gameService } from 'services';
import GameTeam from './gameTeam';
import GameDetail from './gameDetail';
import { SportType } from 'enums';
import { useProfileRoute } from 'utils';
import { GameOutcomes } from 'enums';

const GamePost = () => {
    const location = useLocation();
    const history = useHistory();
    const { gameId, gameSportType } = location?.state;
    const { teamProfile } = useProfileRoute();
    const [gameInfo, setGameInfo] = useState({});

    useEffect(() => getGameProfile(), []);

    const getGameProfile = async () => {
        const res = await gameService.getPostGameInfo(gameId);
        if (res && res.code === 200) setGameInfo(res.value);
    };

    const getStatsUrl = teamId => {
        if (gameSportType === SportType.Basketball)
            return { pathname: '/basketballStats', state: { gameId: gameId, teamId: teamId, isLowStats: gameInfo.isLowStats } };

        if (gameSportType === SportType.Soccer)
            return { pathname: '/soccerStats', state: { gameId: gameId, teamId: teamId, isLowStats: gameInfo.isLowStats } };

        return { pathname: '/lowSportStats', state: { gameId: gameId, teamId: teamId, gameSportType: gameSportType } }; 
    };

    const handleHomeTeamAvatarClick = () => history.push(teamProfile(gameInfo?.homeTeamId));

    const handleAwayTeamAvatarClick = () => history.push(teamProfile(gameInfo?.awayTeamId));

    const handleHomeTeamArrowClick = () => history.push(getStatsUrl(gameInfo?.homeTeamId));

    const handleAwayTeamArrowClick = () => history.push(getStatsUrl(gameInfo?.awayTeamId));

    return (
        <>
            <ElTitle center>Game ID: {gameInfo?.gameCode}</ElTitle>
            <Typography className="category-text">Teams:</Typography>
            <GameTeam url={gameInfo?.homeTeamImageUrl} 
                name={gameInfo?.homeTeamName} 
                isWinner={gameInfo?.homeTeamOutcomes === GameOutcomes.Win} 
                score={gameInfo.homeTeamScore} 
                onAvatarClick={handleHomeTeamAvatarClick} 
                onArrowClick={handleHomeTeamArrowClick} />
            <GameTeam url={gameInfo?.awayTeamImageUrl} 
                name={gameInfo?.awayTeamName} 
                isWinner={gameInfo?.awayTeamOutcomes === GameOutcomes.Win} 
                score={gameInfo.awayTeamScore} 
                onAvatarClick={handleAwayTeamAvatarClick} 
                onArrowClick={handleAwayTeamArrowClick} />
            {gameInfo?.location && <GameDetail title="Location:" text={gameInfo?.location} divider />}
            <GameDetail title="Date/Time:" text={gameInfo?.startTime} divider />
            <GameDetail title="Other options:" />
            <Box center sx={{ fontWeight: 400, fontSize: 18 }}>Coming soon!</Box>
        </>
    );
};

export default GamePost;
