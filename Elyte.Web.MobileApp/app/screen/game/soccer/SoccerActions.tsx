import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { gameService, teamService } from 'el/api';
import routes from 'el/navigation/routes';
import { useElToast } from 'el/utils';
import { Flex, Row, Square, Text } from 'native-base';
import GameButton from '../components/GameButton';
import { ElButton, ElModal } from 'el/components';
import GamePlayerSelector from '../components/GamePlayerSelector';
import { LinearGradient } from 'expo-linear-gradient';
import colors from 'el/config/colors';

type PropType = {
    scoreBoard: any;
    logId?: string;
};

const SoccerActions: React.FC<PropType> = ({ scoreBoard, logId }) => {
    const route = useRoute<any>();
    const navigation: any = useNavigation();
    const { gameId, gameCode, isOfficiate } = route.params;
    const [showPlayerSelector, setShowPlayerSelector] = useState(false);
    const [players, setPlayers] = useState([]);
    const [teamId, setTeamId] = useState(null);
    const [operationType, setOperationType] = useState<any>();
    const [rivalTeamId, setRivalTeamId] = useState(null);
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
        setShowPlayerSelector(false);

        if (operationType === 'foul') {
            return navigation.navigate(routes.SoccerFoul, {
                gameId,
                teamId,
                rivalTeamId,
                logId,
                gameCode,
                isOfficiate,
                athleteId: athlete.athleteId,
            });
        }

        if (operationType === 'score') {
            return navigation.navigate(routes.SoccerPositionSelector, {
                gameId,
                teamId,
                athlete,
                logId,
                gameCode,
                isOfficiate,
            });
        }

        if (operationType === 'miss-shot') {
            return navigation.navigate(routes.SoccerPositionSelector, {
                gameId,
                teamId,
                isMissShot: true,
                athlete,
                logId,
                gameCode,
                isOfficiate,
            });
        }

        let res: any = { code: 0 };
        var data = { teamId, athleteId: athlete.athleteId, logId };
        if (operationType === 'assist') res = await gameService.recordSoccerAssist(gameId, data);
        if (operationType === 'steal') res = await gameService.recordSoccerSteal(gameId, data);
        if (operationType === 'corner') res = await gameService.recordSoccerCorner(gameId, data);
        if (operationType === 'save') res = await gameService.recordSoccerSave(gameId, data);
        if (operationType === 'turn-over')
            res = await gameService.recordSoccerTurnOver(gameId, data);
        if (res && res.code === 200) toast.success('Data were recorded successfully.');

        if (logId) navigation.navigate(routes.SoccerLog, { gameId, gameCode, isOfficiate });
    };

    const handleFoulClick = (selectedTeamId, selectRivalTeamId) => {
        setOperationType('foul');
        setRivalTeamId(selectRivalTeamId);
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleScoreClick = selectedTeamId => {
        setOperationType('score');
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleMissShotClick = selectedTeamId => {
        setOperationType('miss-shot');
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleAssistClick = selectedTeamId => {
        setOperationType('assist');
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleSaveClick = selectedTeamId => {
        setOperationType('save');
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleTurnOverClick = selectedTeamId => {
        setOperationType('turn-over');
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleCornerClick = selectedTeamId => {
        setOperationType('corner');
        showSelectPlayerDialog(selectedTeamId);
    };

    const handleStealClick = selectedTeamId => {
        setOperationType('steal');
        showSelectPlayerDialog(selectedTeamId);
    };

    return (
        <>
            <Row h={16} mt={1}>
                <GameButton onPress={() => handleScoreClick(homeTeamId)}>Goal</GameButton>
                <GameButton onPress={() => handleAssistClick(homeTeamId)}>Assist</GameButton>
                <GameButton onPress={() => handleScoreClick(awayTeamId)} variant="dark">
                    Goal
                </GameButton>
                <GameButton onPress={() => handleAssistClick(awayTeamId)} variant="dark">
                    Assist
                </GameButton>
            </Row>
            <Row h={16} mt={1}>
                <GameButton onPress={() => handleFoulClick(homeTeamId, awayTeamId)}>
                    Foul
                </GameButton>
                <GameButton onPress={() => handleMissShotClick(homeTeamId)}>Miss Shot</GameButton>
                <GameButton onPress={() => handleFoulClick(awayTeamId, homeTeamId)} variant="dark">
                    Foul
                </GameButton>
                <GameButton onPress={() => handleMissShotClick(awayTeamId)} variant="dark">
                    Miss Shot
                </GameButton>
            </Row>
            <Row h={16} mt={1}>
                <GameButton onPress={() => handleTurnOverClick(homeTeamId)}>Turn Over</GameButton>
                <GameButton onPress={() => handleStealClick(homeTeamId)}>Steal</GameButton>
                <GameButton onPress={() => handleTurnOverClick(awayTeamId)} variant="dark">
                    Turn Over
                </GameButton>
                <GameButton onPress={() => handleStealClick(awayTeamId)} variant="dark">
                    Steal
                </GameButton>
            </Row>
            <Row h={16} mt={1}>
                <GameButton onPress={() => handleCornerClick(homeTeamId)}>Corner</GameButton>
                <GameButton onPress={() => handleSaveClick(homeTeamId)}>Save</GameButton>
                <GameButton onPress={() => handleCornerClick(awayTeamId)} variant="dark">
                    Corner
                </GameButton>
                <GameButton onPress={() => handleSaveClick(awayTeamId)} variant="dark">
                    Save
                </GameButton>
            </Row>
            {showPlayerSelector && (
                <ElModal visible={showPlayerSelector} onClose={() => setShowPlayerSelector(false)}>
                    <GamePlayerSelector players={players} onAthleteClick={handleAthleteClick} />
                </ElModal>
            )}
        </>
    );
};

export default SoccerActions;
