import React from 'react';
import { ElTitle } from 'components';
import GameAthlete from './../gameAthlete';
import GameField from './../gameField';
import { SportType } from 'enums';
import { useLocation, useHistory } from 'react-router-dom';
import { gameService } from 'services';

const BasketballPositionSelector = () => {
    const history = useHistory();
    const location = useLocation();
    const { gameId, teamId, athlete, score, logId, gameCode, isOfficiate } = location?.state;

    const handleSelectPosition = async (position) => {
        var data = {
            teamId: teamId,
            athleteId: athlete.athleteId,
            score: score,
            positionX: position.x,
            positionY: position.y,
            logId
        };

        const res = await getShotService(data);
        if (res && res.code === 200){
            if(logId){
                history.push('/basketballLog', { gameId, gameCode, isOfficiate });
            }else{
                history.goBack();
            }
        }
    }

    const getShotService = (data) => {
        if (score === 0) {
            return gameService.setBasketballMissShot(gameId, data);
        }
        
        return gameService.setBasketballScore(gameId, data);
    }
   
    return (
        <>
            <ElTitle>Court Position Selector</ElTitle>
            <GameAthlete url={athlete.pictureUrl} name={athlete.athleteName}></GameAthlete>
            <GameField isMissShot={score==0} onSelectPosition={handleSelectPosition} sportType={SportType.Basketball}/>
        </>
    );
};

export default BasketballPositionSelector;
