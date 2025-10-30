import { SportType } from 'enums';
import { useHistory } from 'react-router-dom';

export default function useGameRoute () {
    const history = useHistory();

    const goScoreBoard = (gameId, gameType) => {
        if (gameType === SportType.Baseball)
            history.push('/baseballScoreBoard', { gameId });
        if (gameType === SportType.Basketball)
            history.push('/basketballScoreBoard', { gameId });
        if (gameType === SportType.Soccer)
            history.push('/soccerScoreBoard', { gameId });
    };

    const goLiveUserView = (gameId, gameType) => {
        if (gameType === SportType.Basketball)
            history.push("/basketballLiveUserView", { params: { gameId } });
        if (gameType === SportType.Soccer)
            history.push("/soccerLiveUserView", { params: { gameId } });
    };

    const goGameLog = (game) => {
        if (game.gameSportType === SportType.Baseball)
            history.push('/baseballLog', {
                gameId: game?.id,
                gameCode: game?.gameCode,
                isOfficiate: game?.isOfficiate,
                isStatTracker: game?.isStatTracker
            });

        if (game.gameSportType === SportType.Basketball)
            history.push('/basketballLog', {
                gameId: game?.id,
                gameCode: game?.gameCode,
                isOfficiate: game?.isOfficiate,
                isStatTracker: game?.isStatTracker
            });

        if (game.gameSportType === SportType.Soccer)
            history.push('/soccerLog', {
                gameId: game?.id,
                gameCode: game?.gameCode,
                isOfficiate: game?.isOfficiate,
                isStatTracker: game?.isStatTracker
            });
    };

    const goGameOption = (gameId, gameType) => {
        history.push('/gameOption', { gameId, gameType });
    };

    return {
        goScoreBoard,
        goLiveUserView,
        goGameLog,
        goGameOption
    };
}
