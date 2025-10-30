import { gameService } from 'el/api';
import { ElScrollContainer, ElTitle } from 'el/components';
import { SportType } from 'el/enums';
import routes from 'el/navigation/routes';
import GameField from 'el/screen/accountInfo/components/GameField';
import { useGoBack } from 'el/utils';
import React from 'react';
import GameAthlete from '../components/GameAthlete';

const SoccerPositionSelectorScreen = ({ navigation, route }) => {
    useGoBack();
    const { gameId, teamId, athlete, isMissShot, logId, gameCode, isOfficiate } = route.params;

    const handleSelectPosition = async (position) => {
        var data = {
            teamId: teamId,
            athleteId: athlete.athleteId,
            positionX: position.x,
            positionY: position.y,
            logId
        };

        const res: any = await getShotService(data);
        if (res && res.code === 200){
            if(logId){
                navigation.navigate(routes.SoccerLog, { gameId, gameCode, isOfficiate });
            }else{
                navigation.goBack();
            }
        }
    }

    const getShotService = (data) => {
        if (isMissShot)
            return gameService.recordSoccerMissShot(gameId, data);
        
        return gameService.recordSoccerScore(gameId, data);
    }

    return (
        <ElScrollContainer>
            <ElTitle>Field Position Selector</ElTitle>
            <GameAthlete uri={athlete.pictureUrl} name={athlete.athleteName}/>
            <GameField isMissShot={isMissShot} onSelectPosition={handleSelectPosition} sportType={SportType.Soccer}/>
        </ElScrollContainer>
    );
};

export default SoccerPositionSelectorScreen;
