import React, { useEffect, useState } from 'react';
import { ElTitle, ElButton, ElBody } from 'components';
import { gameService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import SoccerActions from './soccerActions';
import Container from '../components/scoreBoardContainer';

const SoccerActionEdit = () => {
    const location = useLocation();
    const history = useHistory();
    const { gameId, gameCode, isOfficiate, logId } = location?.state;
    const [scoreBoard, setScoreBoard] = useState({ isGameStarted: true });

    useEffect(() => {
        getScoreData();
    }, []);

    const getScoreData = async () => {
        const res = await gameService.getSoccerScoreBoard(gameId);
        if (res && res.code === 200) setScoreBoard(res.value);
    }

    const handleGameLogClick = () => history.push('/soccerLog', { gameId, gameCode, isOfficiate });

    return (
        <>
            <ElTitle>Game ID: {gameCode}</ElTitle>
            <ElBody>Please replace the action being edited by selecting the correct inputs below:</ElBody>
            <Container>
                <ElButton small onClick={handleGameLogClick}>Game Log</ElButton>
            </Container>
            <SoccerActions scoreBoard={scoreBoard} logId={logId} />
        </>
    );
};

export default SoccerActionEdit;
