import React, { useState } from 'react';
import { gameService, teamService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import GamePlayerSelector from '../gamePlayerSelector';
import Container from '../components/scoreBoardContainer';
import { DarkBox, NewBox } from '../components/scoreBoardBox';

const SoccerActions = ({ scoreBoard, logId }) => {
    const location = useLocation();
    const history = useHistory();
    const { gameId, gameCode, isOfficiate } = location?.state;
    const [showPlayerSelector, setShowPlayerSelector] = useState(false);
    const [players, setPlayers] = useState([]);
    const [teamId, setTeamId] = useState(null);
    const [operationType, setOperationType] = useState();
    const [rivalTeamId, setRivalTeamId] = useState(null);

    const handleFoulClick = (selectedTeamId, selectRivalTeamId) => {
        setOperationType("foul");
        setRivalTeamId(selectRivalTeamId);
        showSelectPlayerDialog(selectedTeamId);
    }

    const showSelectPlayerDialog = async (selectedTeamId) => {
        setTeamId(selectedTeamId);
        const res = await teamService.getTeamGameRoster(selectedTeamId, gameId);
        if (res && res.code === 200) {
            setPlayers(res.value);
            setShowPlayerSelector(true);
        }
    }

    const handleAthleteClick = async (athlete) => {
        setShowPlayerSelector(false);

        if (operationType === "foul") {
            history.push('/soccerFoul', { gameId, gameCode, teamId, rivalTeamId, logId, isOfficiate, athleteId: athlete.athleteId });
            return;
        }

        if (operationType === "score") {
            history.push('/soccerPositionSelector', { gameId, teamId, athlete, logId, gameCode, isOfficiate });
            return;
        }

        if (operationType === "miss-shot") {
            history.push('/soccerPositionSelector', { gameId, teamId, isMissShot: true, athlete, logId, gameCode, isOfficiate });
            return;
        }

        let res = { code: 0 }
        var data = { teamId, athleteId: athlete.athleteId, logId };
        if (operationType === "assist") res = await gameService.recordSoccerAssist(gameId, data);
        if (operationType === "steal") res = await gameService.recordSoccerSteal(gameId, data);
        if (operationType === "corner") res = await gameService.recordSoccerCorner(gameId, data);
        if (operationType === "save") res = await gameService.recordSoccerSave(gameId, data);
        if (operationType === "turn-over") res = await gameService.recordSoccerTurnOver(gameId, data);
        if (res && res.code === 200)  window.elyte.success("Data were recorded successfully.");
        if(logId) history.push('/soccerLog', { gameId, gameCode, isOfficiate });
    }

    const handleScoreClick = (selectedTeamId) => {
        setOperationType("score");
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleMissShotClick = (selectedTeamId) => {
        setOperationType("miss-shot");
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleAssistClick = (selectedTeamId) => {
        setOperationType("assist");
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleSaveClick = (selectedTeamId) => {
        setOperationType("save");
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleTurnOverClick = (selectedTeamId) => {
        setOperationType("turn-over");
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleCornerClick = (selectedTeamId) => {
        setOperationType("corner");
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleStealClick = (selectedTeamId) => {
        setOperationType("steal");
        showSelectPlayerDialog(selectedTeamId);
    }

    return (
        <>
            <Container>
                <NewBox onClick={() => handleScoreClick(scoreBoard.homeTeamId)}>Goal</NewBox>
                <NewBox onClick={() => handleAssistClick(scoreBoard.homeTeamId)}>Assist</NewBox>
                <DarkBox onClick={() => handleScoreClick(scoreBoard.awayTeamId)}>Goal</DarkBox>
                <DarkBox onClick={() => handleAssistClick(scoreBoard.awayTeamId)}>Assist</DarkBox>
            </Container>
            <Container>
                <NewBox onClick={() => handleFoulClick(scoreBoard.homeTeamId, scoreBoard.awayTeamId)}>Foul</NewBox>
                <NewBox onClick={() => handleMissShotClick(scoreBoard.homeTeamId)}>Miss Shot</NewBox>
                <DarkBox onClick={() => handleFoulClick(scoreBoard.awayTeamId, scoreBoard.homeTeamId)}>Foul</DarkBox>
                <DarkBox onClick={() => handleMissShotClick(scoreBoard.awayTeamId)}>Miss Shot</DarkBox>
            </Container>
            <Container>
                <NewBox onClick={() => handleTurnOverClick(scoreBoard.homeTeamId)}>Turn Over</NewBox>
                <NewBox onClick={() => handleStealClick(scoreBoard.homeTeamId)}>Steal</NewBox>
                <DarkBox onClick={() => handleTurnOverClick(scoreBoard.awayTeamId)}>Turn Over</DarkBox>
                <DarkBox onClick={() => handleStealClick(scoreBoard.awayTeamId)}>Steal</DarkBox>
            </Container>
            <Container>
                <NewBox onClick={() => handleCornerClick(scoreBoard.homeTeamId)}>Corner</NewBox>
                <NewBox onClick={() => handleSaveClick(scoreBoard.homeTeamId)}>Save</NewBox>
                <DarkBox onClick={() => handleCornerClick(scoreBoard.awayTeamId)}>Corner</DarkBox>
                <DarkBox onClick={() => handleSaveClick(scoreBoard.awayTeamId)}>Save</DarkBox>
            </Container>
            {
                showPlayerSelector &&
                <GamePlayerSelector open={showPlayerSelector} onClose={() => setShowPlayerSelector(false)} players={players} onAthleteClick={handleAthleteClick} />
            }
        </>
    );
};

export default SoccerActions;
