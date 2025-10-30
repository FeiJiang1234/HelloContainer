import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, Row } from 'native-base';
import GameButton from '../components/GameButton';
import { gameService, teamService } from 'el/api';
import { useElToast } from 'el/utils';
import { ElModal } from 'el/components';
import GamePlayerSelector from '../components/GamePlayerSelector';
import routes from 'el/navigation/routes';

type PropType = {
    scoreBoard: any;
    logId?: string;
    onPaused?: any;
    timeLeft?: any;
};

const BasketballActions: React.FC<PropType> = ({ scoreBoard, logId, onPaused, timeLeft }) => {
    const route = useRoute<any>();
    const navigation: any = useNavigation();
    const { gameId, gameCode, isOfficiate } = route.params;
    const [showPlayerSelector, setShowPlayerSelector] = useState(false);
    const [score, setScore] = useState<any>();
    const [teamId, setTeamId] = useState(null);
    const [rivalTeamId, setRivalTeamId] = useState(null);
    const [operationType, setOperationType] = useState<any>();
    const [players, setPlayers] = useState([]);
    const toast = useElToast();
    const { homeTeamId, awayTeamId } = scoreBoard;

    const showSelectPlayerDialog = async selectedTeamId => {
        setTeamId(selectedTeamId);
        const res: any = await teamService.getTeamGameRoster(selectedTeamId, gameId);
        if (res && res.code === 200) {
            setPlayers(res.value);
            setShowPlayerSelector(true);
        }
    };

    const handleAthleteClick = async athlete => {
        setOperationType(null);
        setShowPlayerSelector(false);

        if (operationType === 'foul') {
            return navigation.navigate(routes.BasketballFoul, {
                gameId,
                teamId,
                rivalTeamId,
                logId,
                gameCode,
                isOfficiate,
                athleteId: athlete.athleteId,
            });
        }

        if (operationType === 'score' || operationType === 'miss-shot') {
            return navigation.navigate(routes.BasketballPositionSelector, {
                gameId,
                teamId,
                score,
                athlete,
                logId,
                gameCode,
                isOfficiate,
            });
        }

        let res: any = { code: 0 };
        var data = { teamId, athleteId: athlete.athleteId, logId };
        if (operationType === 'assist')
            res = await gameService.recordBasketballAssist(gameId, data);
        if (operationType === 'steal') res = await gameService.recordBasketballSteal(gameId, data);
        if (operationType === 'rebnd') res = await gameService.recordBasketballRebnd(gameId, data);
        if (operationType === 'block') res = await gameService.recordBasketballBlock(gameId, data);
        if (res && res.code === 200) toast.success('Data were recorded successfully.');

        if (logId) navigation.navigate(routes.BasketballLog, { gameId, gameCode, isOfficiate });
    };

    const handleScoreClick = async (point, selectedTeamId) => {
        setOperationType('score');
        setScore(point);
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleMissShotClick = async selectedTeamId => {
        setOperationType('miss-shot');
        setScore(0);
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleFoulClick = async (selectedTeamId, selectRivalTeamId) => {
        setOperationType('foul');
        setRivalTeamId(selectRivalTeamId);
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleAssistClick = selectedTeamId => {
        setOperationType('assist');
        setTeamId(selectedTeamId);
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleStealClick = selectedTeamId => {
        setOperationType('steal');
        setTeamId(selectedTeamId);
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleRebndClick = selectedTeamId => {
        setOperationType('rebnd');
        setTeamId(selectedTeamId);
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleBlockClick = selectedTeamId => {
        setOperationType('block');
        setTeamId(selectedTeamId);
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleTimeoutClick = async selectedTeamId => {
        const res: any = await gameService.recordBasketballTimeout(
            gameId,
            selectedTeamId,
            timeLeft,
        );
        if (res && res.code === 200 && onPaused) {
            onPaused();
        }
    };

    return (
        <>
            <Box>
                <Row h={16}>
                    <GameButton fontSize="lg" onPress={() => handleScoreClick(1, homeTeamId)}>
                        +1
                    </GameButton>
                    <GameButton fontSize="lg" onPress={() => handleScoreClick(2, homeTeamId)}>
                        +2
                    </GameButton>
                    <GameButton
                        variant="dark"
                        fontSize="lg"
                        onPress={() => handleScoreClick(1, awayTeamId)}>
                        +1
                    </GameButton>
                    <GameButton
                        variant="dark"
                        fontSize="lg"
                        onPress={() => handleScoreClick(2, awayTeamId)}>
                        +2
                    </GameButton>
                </Row>
                <Row h={16} mt={1}>
                    <GameButton fontSize="lg" onPress={() => handleScoreClick(3, homeTeamId)}>
                        +3
                    </GameButton>
                    <GameButton onPress={() => handleAssistClick(homeTeamId)}>Assist</GameButton>
                    <GameButton
                        variant="dark"
                        fontSize="lg"
                        onPress={() => handleScoreClick(3, awayTeamId)}>
                        +3
                    </GameButton>
                    <GameButton onPress={() => handleAssistClick(awayTeamId)} variant="dark">
                        Assist
                    </GameButton>
                </Row>
                <Row h={16} mt={1}>
                    <GameButton onPress={() => handleRebndClick(homeTeamId)}>Rebnd</GameButton>
                    <GameButton onPress={() => handleStealClick(homeTeamId)}>Steal</GameButton>
                    <GameButton onPress={() => handleRebndClick(awayTeamId)} variant="dark">
                        Rebnd
                    </GameButton>
                    <GameButton onPress={() => handleStealClick(awayTeamId)} variant="dark">
                        Steal
                    </GameButton>
                </Row>
                <Row h={16} mt={1}>
                    <GameButton onPress={() => handleFoulClick(homeTeamId, awayTeamId)}>
                        Foul
                    </GameButton>
                    <GameButton onPress={() => handleMissShotClick(homeTeamId)}>
                        Miss Shot
                    </GameButton>
                    <GameButton
                        variant="dark"
                        onPress={() => handleFoulClick(awayTeamId, homeTeamId)}>
                        Foul
                    </GameButton>
                    <GameButton variant="dark" onPress={() => handleMissShotClick(awayTeamId)}>
                        Miss Shot
                    </GameButton>
                </Row>
                <Row h={16} mt={1}>
                    <GameButton onPress={() => handleBlockClick(homeTeamId)}>Block</GameButton>
                    {scoreBoard.isOfficiate && (
                        <GameButton
                            disabled={scoreBoard.homeTeamTimeoutTimes === 4}
                            onPress={() => handleTimeoutClick(homeTeamId)}>
                            Timeout
                        </GameButton>
                    )}
                    <GameButton variant="dark" onPress={() => handleBlockClick(awayTeamId)}>
                        Block
                    </GameButton>
                    {scoreBoard.isOfficiate && (
                        <GameButton
                            variant="dark"
                            disabled={scoreBoard.awayTeamTimeoutTimes === 4}
                            onPress={() => handleTimeoutClick(awayTeamId)}>
                            Timeout
                        </GameButton>
                    )}
                </Row>
            </Box>
            {showPlayerSelector && (
                <ElModal visible={showPlayerSelector} onClose={() => setShowPlayerSelector(false)}>
                    <GamePlayerSelector players={players} onAthleteClick={handleAthleteClick} />
                </ElModal>
            )}
        </>
    );
};

export default BasketballActions;
