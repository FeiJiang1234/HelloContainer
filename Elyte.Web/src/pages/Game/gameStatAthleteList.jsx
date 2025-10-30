import React from 'react';
import { ElBody, ElButton } from 'components';
import GameDetail from './gameDetail';
import IdiographRow from 'parts/Commons/idiographRow';
import { useProfileRoute } from 'utils';

const GameStatAthleteList = ({ athletes, onClickAthlete }) => {
    const { athleteProfile } = useProfileRoute();

    return (
        <>
            <GameDetail title="Athletes:" />
            {
                athletes?.map(item => (
                    <IdiographRow key={item.playerId} to={item.isBlankAccount ? null : athleteProfile(item.playerId)}
                        title={item.playerName} imgurl={item.playerPictureUrl} noDivider>
                        {onClickAthlete && <ElButton small onClick={() => onClickAthlete(item)}>Stat</ElButton>}
                        {!onClickAthlete && <ElBody>{item.score}</ElBody>} 
                    </IdiographRow>
                ))
            }
        </>
    );
};

export default GameStatAthleteList;
