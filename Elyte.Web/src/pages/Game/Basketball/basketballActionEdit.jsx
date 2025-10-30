import React, { useEffect, useState } from 'react';
import { ElTitle, ElButton, ElBody } from 'components';
import { gameService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import BasketballActions from './basketballActions';
import Container from '../components/scoreBoardContainer';

const BasketballActionEdit = () => {
    const location = useLocation();
    const { gameId, gameCode, isOfficiate, logId } = location?.state;
    const history = useHistory();
    const [scoreBoard, setScoreBoard] = useState({});

    useEffect(() => {
        getScoreData();
    }, []);

    const getScoreData = async () => {
        const res = await gameService.getBasketballScoreBoard(gameId);
        if (res && res.code === 200) setScoreBoard(res.value);
    }

    const handleGameLogClick = () => history.push('/basketballLog', { gameId, gameCode, isOfficiate });

    return (
        <>
            <ElTitle>Game ID: {gameCode}</ElTitle>
            <ElBody>Please replace the action being edited by selecting the correct inputs below:</ElBody>
            <Container>
                <ElButton small onClick={handleGameLogClick}>Game Log</ElButton>
            </Container>
            <BasketballActions scoreBoard={scoreBoard} logId={logId} />
        </>
    );
};

export default BasketballActionEdit;
