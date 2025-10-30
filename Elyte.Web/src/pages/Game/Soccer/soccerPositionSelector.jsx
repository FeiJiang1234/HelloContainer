import React from 'react';
import { ElTitle } from 'components';
import GameAthlete from '../gameAthlete';
import GameField from './../gameField';
import { SportType } from 'enums';
import { gameService } from 'services';
import { useHistory, useLocation } from 'react-router-dom';

const SoccerPositionSelector = () => {
    const history = useHistory();
    const location = useLocation();
    const { gameId, teamId, athlete, isMissShot, logId, gameCode, isOfficiate } = location?.state;

    const handleSelectPosition = async (position) => {
        var data = {
            teamId: teamId,
            athleteId: athlete.athleteId,
            positionX: position.x,
            positionY: position.y,
            logId
        };

        const res = await getShotService(data);
        if (res && res.code === 200){
            if(logId){
                history.push('/soccerLog', { gameId, gameCode, isOfficiate });
            }else{
                history.goBack();
            }
        }
    }

    const getShotService = (data) => {
        if (isMissShot)
            return gameService.recordSoccerMissShot(gameId, data);
        
        return gameService.recordSoccerScore(gameId, data);
    }

    return (
        <>
            <ElTitle>Field Position Selector</ElTitle>
            <GameAthlete url={athlete.pictureUrl} name={athlete.athleteName}></GameAthlete>
            <GameField isMissShot={isMissShot} onSelectPosition={handleSelectPosition} sportType={SportType.Soccer}/>
        </>
    );
};

export default SoccerPositionSelector;
