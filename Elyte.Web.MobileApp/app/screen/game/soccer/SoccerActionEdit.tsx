import { gameService } from 'el/api';
import { ElBody, ElButton, ElScrollContainer, ElTitle } from 'el/components';
import routes from 'el/navigation/routes';
import { useGoBack } from 'el/utils';
import { Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import SoccerActions from './SoccerActions';

const SoccerActionEditScreen = ({ navigation, route }) => {
    useGoBack();

    const { gameId, gameCode, isOfficiate, logId } = route.params;
    const [scoreBoard, setScoreBoard] = useState({});

    useEffect(() => {
        getScoreData();
    }, []);

    const getScoreData = async () => {
        const res: any = await gameService.getSoccerScoreBoard(gameId);
        if (res && res.code === 200) setScoreBoard(res.value);
    };

    const handleGameLogClick = () => navigation.navigate(routes.SoccerLog, { gameId, gameCode, isOfficiate });

    return (
        <ElScrollContainer>
            <ElTitle>Game ID: {gameCode}</ElTitle>
            <ElBody textAlign="center">
                Please replace the action being edited by selecting the correct inputs below:
            </ElBody>
            <Box mb={2}>
                <ElButton onPress={handleGameLogClick} style={{ height: 48 }}>Game Log</ElButton>
            </Box>
            <SoccerActions scoreBoard={scoreBoard} logId={logId} />
        </ElScrollContainer>
    );
};

export default SoccerActionEditScreen;
