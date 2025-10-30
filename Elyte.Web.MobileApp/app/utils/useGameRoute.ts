import routes from 'el/navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { SportType } from 'el/enums';

export default function useGameRoute() {
    const navigation: any = useNavigation();

    const goScoreBoard = (gameId, gameType) => {
        if (gameType === SportType.Baseball)
            navigation.navigate(routes.BaseballScoreBoard, { gameId });
        if (gameType === SportType.Basketball)
            navigation.navigate(routes.BasketballScoreBoard, { gameId });
        if (gameType === SportType.Soccer) navigation.navigate(routes.SoccerScoreBoard, { gameId });
    };

    const goGameLog = game => {
        if (game.gameSportType === SportType.Baseball)
            navigation.navigate(routes.BaseballLog, {
                gameId: game?.id,
                gameCode: game?.gameCode,
                isOfficiate: game?.isOfficiate,
                isStatTracker: game?.isStatTracker,
            });

        if (game.gameSportType === SportType.Basketball)
            navigation.navigate(routes.BasketballLog, {
                gameId: game?.id,
                gameCode: game?.gameCode,
                isOfficiate: game?.isOfficiate,
                isStatTracker: game?.isStatTracker,
            });
        if (game.gameSportType === SportType.Soccer)
            navigation.navigate(routes.SoccerLog, {
                gameId: game?.id,
                gameCode: game?.gameCode,
                isOfficiate: game?.isOfficiate,
                isStatTracker: game?.isStatTracker,
            });
    };

    return {
        goScoreBoard,
        goGameLog,
    };
}
