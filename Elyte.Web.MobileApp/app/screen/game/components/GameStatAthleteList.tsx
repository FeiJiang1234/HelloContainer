import { ElBody, ElIcon, ElIdiograph } from 'el/components';
import colors from 'el/config/colors';
import { Divider, Pressable, Row } from 'native-base';
import React from 'react';
import GameDetail from './GameDetail';

type PropType = {
    athletes: any;
    onAthletePress?: any;
};

const GameStatAthleteList: React.FC<PropType> = ({ athletes, onAthletePress }) => {
    return (
        <>
            <GameDetail title="Athletes:" noDivider />
            {athletes?.map(item => (
                <React.Fragment key={item.playerId}>
                    <Row py={3} alignItems='center' justifyContent='space-between'>
                        <ElIdiograph title={item.playerName} imageUrl={item.playerPictureUrl} />
                        {onAthletePress && <Pressable onPress={() => onAthletePress(item)} hitSlop={8}>
                            <ElIcon name="chevron-right" color={colors.primary} size={30} />
                        </Pressable>}
                        {!onAthletePress && <ElBody>{item.score}</ElBody>}
                    </Row>
                    <Divider />
                </React.Fragment>
            ))}
        </>
    );
};

export default GameStatAthleteList;
