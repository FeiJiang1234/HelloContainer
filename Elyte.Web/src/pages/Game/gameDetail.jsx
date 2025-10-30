import React from 'react';
import GameAthleteStat from './gameAthleteStat';
import { ElAccordion } from 'components';

const GameDetail = ({ title, text, divider, details }) => {
    return (
        <ElAccordion title={title} text={text} divider={divider} hideArrow={Array.isNullOrEmpty(details)}>
            {details && details.map(x=>(
                <GameAthleteStat key={x.id} url={x.athletePictureUrl} name={x.athleteName} count={x.count} />
            ))}
        </ElAccordion>
    );
};

export default GameDetail;
