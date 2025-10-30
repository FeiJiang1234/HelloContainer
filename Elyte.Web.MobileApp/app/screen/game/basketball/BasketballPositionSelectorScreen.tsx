import { gameService } from 'el/api';
import { ElScrollContainer, ElTitle } from 'el/components';
import { SportType } from 'el/enums';
import routes from 'el/navigation/routes';
import GameField from 'el/screen/accountInfo/components/GameField';
import { useGoBack } from 'el/utils';
import React from 'react';
import GameAthlete from '../components/GameAthlete';

const BasketballPositionSelectorScreen = ({ navigation, route }) => {
    useGoBack();
    const { gameId, teamId, athlete, score, logId, gameCode, isOfficiate } = route.params;

    const handleSelectPosition = async position => {
        var data = {
            teamId: teamId,
            athleteId: athlete.athleteId,
            score: score,
            positionX: position.x,
            positionY: position.y,
            logId,
        };

        const res: any = await getShotService(data);
        if (res && res.code === 200) {
            if (logId) {
                navigation.navigate(routes.BasketballLog, { gameId, gameCode, isOfficiate });
            } else {
                navigation.goBack();
            }
        }
    };

    const getShotService = data => {
        if (score === 0) {
            return gameService.setBasketballMissShot(gameId, data);
        }

        return gameService.setBasketballScore(gameId, data);
    };

    return (
        <ElScrollContainer>
            <ElTitle>Court Position Selector</ElTitle>
            <GameAthlete uri={athlete.pictureUrl} name={athlete.athleteName}/>
            <GameField
                isMissShot={score == 0}
                onSelectPosition={handleSelectPosition}
                sportType={SportType.Basketball}
            />
        </ElScrollContainer>
    );
};

export default BasketballPositionSelectorScreen;
