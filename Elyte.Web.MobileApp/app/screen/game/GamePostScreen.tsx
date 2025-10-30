import { gameService } from 'el/api';
import { ElBody, ElScrollContainer, ElTitle } from 'el/components';
import { GameOutcomes, SportType } from 'el/enums';
import routes from 'el/navigation/routes';
import { useGoBack, useProfileRoute, utils } from 'el/utils';
import { Box } from 'native-base';
import React, { useState, useEffect } from 'react';
import GameDetail from './components/GameDetail';
import GameTeam from './components/GameTeam';

export default function GamePostScreen({ navigation, route }) {
    useGoBack();
    const { gameId, gameSportType } = route.params;
    const [gameInfo, setGameInfo] = useState<any>({});
    const { goToTeamProfile } = useProfileRoute();

    useEffect(() => {
        getGameProfile();
    }, []);

    const getGameProfile = async () => {
        const res: any = await gameService.getPostGameInfo(gameId);
        if (res && res.code === 200) setGameInfo(res.value);
    };

    const goStats = teamId => {
        if (gameSportType === SportType.Basketball){
            navigation.navigate(routes.BasketballStats, { gameId: gameId, teamId: teamId, isLowStats: gameInfo.isLowStats });
        }
        else if (gameSportType === SportType.Soccer) {
            navigation.navigate(routes.SoccerStats, { gameId: gameId, teamId: teamId, isLowStats: gameInfo.isLowStats });
        }
        else{
            navigation.navigate(routes.LowSportStats, { gameId: gameId, teamId: teamId });
        }
    };


    const goTeam = (teamId) => {
        !utils.isGuidEmpty(teamId) && goToTeamProfile(teamId);
    }

    return (
        <ElScrollContainer>
            <ElTitle>Game ID: {gameInfo?.gameCode}</ElTitle>
            <ElBody>Teams:</ElBody>
            <GameTeam
                url={gameInfo?.homeTeamImageUrl}
                name={gameInfo?.homeTeamName}
                isWinner={gameInfo?.homeTeamOutcomes === GameOutcomes.Win}
                score={gameInfo.homeTeamScore}
                onRowClick={() => goTeam(gameInfo?.homeTeamId)}
                onArrowClick={() => goStats(gameInfo?.homeTeamId)}
            />
            <GameTeam
                url={gameInfo?.awayTeamImageUrl}
                name={gameInfo?.awayTeamName}
                isWinner={gameInfo?.awayTeamOutcomes === GameOutcomes.Win}
                score={gameInfo.awayTeamScore}
                onRowClick={() => goTeam(gameInfo?.awayTeamId)}
                onArrowClick={() => goStats(gameInfo?.awayTeamId)}
            />
            {gameInfo?.location && <GameDetail title="Location:" text={gameInfo?.location} />}
            <GameDetail title="Date/Time:" text={gameInfo?.startTime} />
            <GameDetail title="Other options:" noDivider />
            <Box>Coming soon!</Box>
        </ElScrollContainer>
    );
}
