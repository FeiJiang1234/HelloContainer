import React from 'react';
import { ElTitle } from 'components';
import { Typography } from '@mui/material';
import { useProfileRoute, utils } from 'utils';
import { useHistory } from 'react-router-dom';
import GameTeam from './gameTeam';
import GameDetail from './gameDetail';

export default function GameProfileHeader ({ game }) {
    const history = useHistory();
    const { teamProfile } = useProfileRoute();

    const handleHomeTeamRowClick = () => !utils.isGuidEmpty(game.homeTeamId) && history.push(teamProfile(game.homeTeamId));
    const handleAwayTeamRowClick = () => !utils.isGuidEmpty(game.awayTeamId) && history.push(teamProfile(game.awayTeamId));

    return (
        <>
            <ElTitle center>Game ID: {game.gameCode || ''}</ElTitle>
            <Typography className="category-text">Team:</Typography>
            <GameTeam url={game.homeTeamImageUrl} name={game.homeTeamName || ''} onRowClick={handleHomeTeamRowClick} />
            <GameTeam url={game.awayTeamImageUrl} name={game.awayTeamName || ''} onRowClick={handleAwayTeamRowClick} />
            <GameDetail title="Location:" text={game.location || ''} divider />
            <GameDetail title="Date/Time:" text={game.startTime || ''} divider />
            <GameDetail title="SportType:" text={game.gameSportType || ''} divider />
        </>
    );
}
