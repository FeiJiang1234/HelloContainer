import { ElTitle } from 'el/components';
import { useProfileRoute, utils } from 'el/utils';
import { Text } from 'native-base';
import React from 'react';
import GameDetail from './GameDetail';
import GameTeam from './GameTeam';

export default function GameProfileHeader({ game }) {
    const { goToTeamProfile } = useProfileRoute();

    const goTeam = (teamId) => {
        !utils.isGuidEmpty(teamId) && goToTeamProfile(teamId);
    }

    return (
        <>
            <ElTitle>Game ID: {game.gameCode || ''}</ElTitle>
            <Text>Team:</Text>
            <GameTeam url={game.homeTeamImageUrl} name={game.homeTeamName || ''} onRowClick={() => goTeam(game.homeTeamId)} />
            <GameTeam url={game.awayTeamImageUrl} name={game.awayTeamName || ''} onRowClick={() => goTeam(game.awayTeamId)} />
            <GameDetail title="Location:" text={game.location || ''} />
            <GameDetail title="Date / Time:" text={game.startTime || ''} />
            <GameDetail title="SportType:" text={game.gameSportType || ''} />
        </>
    );
}
