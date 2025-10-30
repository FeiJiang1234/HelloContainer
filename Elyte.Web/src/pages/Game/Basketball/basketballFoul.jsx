import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ElTitle, ElOptionButton, ElButton, ElSelect, ElDialog } from 'components';
import { gameService, teamService } from 'services';
import { BasketballFoulType } from 'enums';
import GamePlayerSelector from '../gamePlayerSelector';

const penaltyShotModes = [{ label: 'Shots awarded', value: 0 }, { label: 1, value: 1 }, { label: 2, value: 2 }, { label: 3, value: 3 }];
const shotsMadeModes = [{ label: 'Select the total made', value: -1 }, { label: 0, value: 0 }, { label: 1, value: 1 }, { label: 2, value: 2 }, { label: 3, value: 3 }];

const BasketballFoul = () => {
    const location = useLocation();
    const history = useHistory();
    const { gameId, teamId, rivalTeamId, athleteId, logId, gameCode, isOfficiate } = location?.state;
    const [showPenaltyShotDialog, setShowPenaltyShotDialog] = useState(false);
    const [playerSelectorDialog, setPlayerSelectorDialog] = useState(false);
    const [showShotsMadeDialog, setShowShotsMadeDialog] = useState(false);
    const [shotTimes, setShotTimes] = useState(0);
    const [shotsMades, setShotsMades] = useState(-1);
    const [athlete, setAthlete] = useState(null);
    const [players, setPlayers] = useState([]);
    const [basketballFoulId, setBasketballFoulId] = useState(null);

    const recordFoul = async (type) => {
        const res = await gameService.recordBasketballFoul(gameId, { teamId, athleteId, type, logId });
        if (res && res.code === 200) {
            setShowPenaltyShotDialog(true);
            setBasketballFoulId(res.value);
        }
    }

    const handleDialogYesClick = async () => {
        if (shotTimes === 0) {
            window.elyte.warning("Please select FTA!");
            return;
        }

        const res = await teamService.getTeamGameRoster(rivalTeamId, gameId);
        if (res && res.code === 200) {
            setPlayers(res.value);
            setShowPenaltyShotDialog(false);
            setPlayerSelectorDialog(true);
        }
    }

    const handleSelectAthleteClick = (selectedAthlete) => {
        setAthlete(selectedAthlete);
        setPlayerSelectorDialog(false);
        setShowShotsMadeDialog(true);
    }

    const handleConfirmClick = async () => {
        if (shotsMades === -1) {
            window.elyte.warning("Please select FTM!");
            return;
        }
        const res = await gameService.recordBasketballPenaltyGoal(gameId, {
            basketballFoulId: basketballFoulId,
            teamId: rivalTeamId,
            shootAthleteId: athlete.athleteId,
            penaltyShotQty: shotTimes,
            score: shotsMades,
            logId
        });
        if (res && res.code === 200) {
            setBasketballFoulId(null);
            setShowShotsMadeDialog(false);
            goBack();
        }
    }

    const goBack = () => {
        if (logId) {
            history.push('/basketballLog', { gameId, gameCode, isOfficiate });
        } else {
            history.goBack();
        }
    }

    return (
        <>
            <ElTitle center>Foul Options Page</ElTitle>
            <ElOptionButton onClick={() => recordFoul(BasketballFoulType.PersonalFoul)} iconName="foul">
                Personal Foul
            </ElOptionButton>
            <ElOptionButton onClick={() => recordFoul(BasketballFoulType.TechnicalFoul)} iconName="foul">
                Technical Foul
            </ElOptionButton>
            <ElOptionButton onClick={() => recordFoul(BasketballFoulType.Violation)} iconName="foul">
                Violation
            </ElOptionButton>
            <ElOptionButton onClick={() => recordFoul(BasketballFoulType.FlagrantFoul)} iconName="foul">
                Flagrant Foul
            </ElOptionButton>
            {
                showPenaltyShotDialog &&
                <ElDialog open={showPenaltyShotDialog} title="Penalty Shot?"
                    actions={
                        <>
                            <ElButton onClick={goBack}>No</ElButton>
                            <ElButton className="green" onClick={handleDialogYesClick}>Yes</ElButton>
                        </>
                    }>
                    <ElSelect name="penaltyShot" options={penaltyShotModes} defaultValue={penaltyShotModes[0].value} onChange={(e) => setShotTimes(e.target.value)} />
                </ElDialog>
            }
            {
                playerSelectorDialog &&
                <GamePlayerSelector open={playerSelectorDialog} onClose={() => setPlayerSelectorDialog(false)} players={players} onAthleteClick={handleSelectAthleteClick} />
            }
            {
                showShotsMadeDialog &&
                <ElDialog open={showShotsMadeDialog} title="Shots Made"
                    actions={
                        <>
                            <ElButton onClick={() => setShowShotsMadeDialog(false)}>Cancel</ElButton>
                            <ElButton className="green" onClick={handleConfirmClick}>Comfirm</ElButton>
                        </>
                    }>
                    <ElSelect name="shotsMade" options={shotsMadeModes} defaultValue={shotsMadeModes[0].value} onChange={(e) => setShotsMades(e.target.value)} />
                </ElDialog>
            }
        </>
    );
};

export default BasketballFoul;
