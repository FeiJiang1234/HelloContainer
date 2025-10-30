import React, { useState } from 'react';
import { gameService, teamService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import GamePlayerSelector from '../gamePlayerSelector';
import Container from '../components/scoreBoardContainer';
import { DarkBox, NewBox } from '../components/scoreBoardBox';
import { ElButton } from 'components';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    timeout: {
        height: 80,
        background: '#F0F2F7 !important',
        '&.Mui-disabled': {
            background: 'rgba(0, 0, 0, 0.10) !important',
        },
        borderRadius: 8,
        paddingLeft: 8,
        cursor: 'pointer',
        paddingRight: 8,
        color: theme.palette.primary.main,

    },
    darkTimeout: {
        height: 80,
        borderRadius: 8,
        paddingLeft: 8,
        paddingRight: 8,
        cursor: 'pointer',
        color: 'white'
    }
}));

const BasketballActions = ({ scoreBoard, logId, onPaused, timeLeft }) => {
    const location = useLocation();
    const { gameId, gameCode, isOfficiate } = location?.state;
    const classes = useStyles();
    const history = useHistory();
    const [showPlayerSelector, setShowPlayerSelector] = useState(false);
    const [score, setScore] = useState();
    const [teamId, setTeamId] = useState(null);
    const [rivalTeamId, setRivalTeamId] = useState(null);
    const [operationType, setOperationType] = useState();
    const [players, setPlayers] = useState([]);

    const showSelectPlayerDialog = async (selectedTeamId) => {
        setTeamId(selectedTeamId);
        const res = await teamService.getTeamGameRoster(selectedTeamId, gameId);
        if (res && res.code === 200) {
            setPlayers(res.value);
            setShowPlayerSelector(true);
        }
    }

    const handleAthleteClick = async (athlete) => {
        setOperationType(null);
        if (operationType === "foul") {
            return history.push('/basketballFoul', { gameId, teamId, rivalTeamId, logId, gameCode, isOfficiate, athleteId: athlete.athleteId });
        }

        if (operationType === "score" || operationType === "miss-shot") {
            return history.push('/basketballPositionSelector', { gameId, teamId, score, athlete, logId, gameCode, isOfficiate });
        }

        setShowPlayerSelector(false);
        let res = { code: 0 }
        var data = { teamId, athleteId: athlete.athleteId, logId };
        if (operationType === "assist") res = await gameService.recordBasketballAssist(gameId, data);
        if (operationType === "steal") res = await gameService.recordBasketballSteal(gameId, data);
        if (operationType === "rebnd") res = await gameService.recordBasketballRebnd(gameId, data);
        if (operationType === "block") res = await gameService.recordBasketballBlock(gameId, data);
        if (res && res.code === 200) window.elyte.success("Data were recorded successfully.");

        if (logId) history.push('/basketballLog', { gameId, gameCode, isOfficiate });
    }

    const handleScoreClick = async (point, selectedTeamId) => {
        setOperationType("score");
        setScore(point);
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleMissShotClick = async (selectedTeamId) => {
        setOperationType("miss-shot");
        setScore(0);
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleFoulClick = async (selectedTeamId, selectRivalTeamId) => {
        setOperationType("foul");
        setRivalTeamId(selectRivalTeamId);
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleAssistClick = (selectedTeamId) => {
        setOperationType("assist");
        setTeamId(selectedTeamId);
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleStealClick = (selectedTeamId) => {
        setOperationType("steal");
        setTeamId(selectedTeamId);
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleRebndClick = (selectedTeamId) => {
        setOperationType("rebnd");
        setTeamId(selectedTeamId);
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleBlockClick = (selectedTeamId) => {
        setOperationType("block");
        setTeamId(selectedTeamId);
        showSelectPlayerDialog(selectedTeamId);
    }

    const handleTimeoutClick = async (selectedTeamId) => {
        const res = await gameService.recordBasketballTimeout(gameId, selectedTeamId, timeLeft);
        if (res && res.code === 200 && onPaused) {
            onPaused();
        }
    }

    return (
        <>
            <Container>
                <NewBox large onClick={() => handleScoreClick(1, scoreBoard.homeTeamId)}>+1</NewBox>
                <NewBox large onClick={() => handleScoreClick(2, scoreBoard.homeTeamId)}>+2</NewBox>
                <DarkBox large onClick={() => handleScoreClick(1, scoreBoard.awayTeamId)}>+1</DarkBox>
                <DarkBox large onClick={() => handleScoreClick(2, scoreBoard.awayTeamId)}>+2</DarkBox>
            </Container>
            <Container>
                <NewBox large onClick={() => handleScoreClick(3, scoreBoard.homeTeamId)}>+3</NewBox>
                <NewBox onClick={() => handleAssistClick(scoreBoard.homeTeamId)}>Assist</NewBox>
                <DarkBox large onClick={() => handleScoreClick(3, scoreBoard.awayTeamId)}>+3</DarkBox>
                <DarkBox onClick={() => handleAssistClick(scoreBoard.awayTeamId)}>Assist</DarkBox>
            </Container>
            <Container>
                <NewBox onClick={() => handleRebndClick(scoreBoard.homeTeamId)}>Rebnd</NewBox>
                <NewBox onClick={() => handleStealClick(scoreBoard.homeTeamId)}>Steal</NewBox>
                <DarkBox onClick={() => handleRebndClick(scoreBoard.awayTeamId)}>Rebnd</DarkBox>
                <DarkBox onClick={() => handleStealClick(scoreBoard.awayTeamId)}>Steal</DarkBox>
            </Container>
            <Container>
                <NewBox onClick={() => handleFoulClick(scoreBoard.homeTeamId, scoreBoard.awayTeamId)}>Foul</NewBox>
                <NewBox onClick={() => handleMissShotClick(scoreBoard.homeTeamId)}>Miss Shot</NewBox>
                <DarkBox onClick={() => handleFoulClick(scoreBoard.awayTeamId, scoreBoard.homeTeamId)}>Foul</DarkBox>
                <DarkBox onClick={() => handleMissShotClick(scoreBoard.awayTeamId)}>Miss Shot</DarkBox>
            </Container>
            <Container>
                <NewBox onClick={() => handleBlockClick(scoreBoard.homeTeamId)}>Block</NewBox>
                {
                    scoreBoard.isOfficiate &&
                    <ElButton className={classes.timeout} disabled={scoreBoard.homeTeamTimeoutTimes === 4} sx={{ fontSize: 16 }} onClick={() => handleTimeoutClick(scoreBoard.homeTeamId)}>Timeout</ElButton>
                }
                <DarkBox onClick={() => handleBlockClick(scoreBoard.awayTeamId)}>Block</DarkBox>
                {
                    scoreBoard.isOfficiate &&
                    <ElButton className={classes.darkTimeout} disabled={scoreBoard.awayTeamTimeoutTimes === 4} sx={{ fontSize: 16 }} onClick={() => handleTimeoutClick(scoreBoard.awayTeamId)}>Timeout</ElButton>
                }
            </Container>
            {
                showPlayerSelector &&
                <GamePlayerSelector open={showPlayerSelector} onClose={() => setShowPlayerSelector(false)} players={players} onAthleteClick={handleAthleteClick} />
            }
        </>
    );
};

export default BasketballActions;
