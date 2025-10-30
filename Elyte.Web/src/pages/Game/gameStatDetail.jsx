import React from 'react';
import GameAthleteStat from './gameAthleteStat';
import { ElAccordion } from 'components';

const GameStatDetail = ({ title, text, divider, details }) => {
    return (
        <ElAccordion title={title + ':' + ' ' + text} divider={divider} hideArrow={Array.isNullOrEmpty(details)}>
            {
                Array.isArray(details) && details.map(x => <GameAthleteStat key={x.id} id={x.athleteId} url={x.athletePictureUrl} name={x.athleteName} count={x.count} />)
            }
        </ElAccordion>
    );
};

export default GameStatDetail;