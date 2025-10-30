import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ElTitle, ElOptionButton, ElLink, ElButton, ElDialog } from 'components';
import { gameService, teamService } from 'services';
import { SoccerFoulType } from 'enums';
import GamePlayerSelector from './../gamePlayerSelector';

const SoccerFoul = () => {
    const history = useHistory();
    const location = useLocation();
    const { gameId, gameCode, teamId, athleteId, rivalTeamId, logId, isOfficiate } = location?.state;
    const [showShooterSelector, setShowShooterSelector] = useState(false);
    const [players, setPlayers] = useState([]);
    const [showKickMadeDialog, setShowKickMadeDialog] = useState(false);
    const [shooter, setShooter] = useState(null);

    const recordFoul = async (type) => {
        await gameService.recordSoccerFoul(gameId, { teamId, athleteId, type, logId });
        goBack();
    }

    const recordPenaltyKickFoul = () => {
        showSelectShooterDialog();
    }

    const showSelectShooterDialog = async () => {
        const res = await teamService.getTeamGameRoster(rivalTeamId, gameId);
        if (res && res.code === 200) {
            setPlayers(res.value);
            setShowShooterSelector(true);
        }
    }

    const handleShooterClick = (selectedShooter) => {
        setShooter(selectedShooter);
        setShowShooterSelector(false);
        setShowKickMadeDialog(true);
    }

    const handleIsGoalClick = async (score) => {
        const res = await gameService.recordSoccerPenaltyKick(gameId, {
            teamId, athleteId, rivalTeamId, shooterId: shooter.athleteId, score, logId
        });
        if (res && res.code === 200) {
            setShowKickMadeDialog(false);
            goBack();
        }
    }

    const goBack = () => {
        if (logId) {
            history.push('/soccerLog', { gameId, gameCode, isOfficiate });
        } else {
            history.goBack();
        }
    }

    return (
        <>
            <ElTitle center>Foul Options Page</ElTitle>
            <ElOptionButton onClick={() => recordFoul(SoccerFoulType.IndirectKick)} iconName="foul">
                Indirect Kick
            </ElOptionButton>
            <ElOptionButton onClick={() => recordFoul(SoccerFoulType.DirectKick)} iconName="foul">
                Direct Kick
            </ElOptionButton>
            <ElOptionButton onClick={() => recordFoul(SoccerFoulType.GoalieFoul)} iconName="foul">
                Goalie Foul
            </ElOptionButton>
            <ElOptionButton onClick={() => recordPenaltyKickFoul()} iconName="foul">Penalty Kick</ElOptionButton>
            <ElLink to={{ pathname: '/soccerCard', state: { gameId, gameCode, teamId, athleteId, logId, isOfficiate } }}>
                <ElOptionButton iconName="foul">Card</ElOptionButton>
            </ElLink>

            {
                showShooterSelector &&
                <GamePlayerSelector open={showShooterSelector} onClose={() => setShowShooterSelector(false)} players={players} onAthleteClick={handleShooterClick} />
            }

            {
                showKickMadeDialog &&
                <ElDialog open={showKickMadeDialog} title="Kicks Made"
                    actions={
                        <>
                            <ElButton onClick={() => handleIsGoalClick(0)}>No</ElButton>
                            <ElButton className="green" onClick={() => handleIsGoalClick(1)}>Yes</ElButton>
                        </>
                    }>
                    Is Goal?
                </ElDialog>
            }



        </>
    );
};

export default SoccerFoul;
