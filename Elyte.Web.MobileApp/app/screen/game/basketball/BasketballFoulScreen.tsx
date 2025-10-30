import { gameService, teamService } from 'el/api';
import { ElModal, ElOptionButton, ElScrollContainer, ElTitle } from 'el/components';
import ElPickerModal from 'el/components/ElPickModal';
import { BasketballFoulType } from 'el/enums';
import routes from 'el/navigation/routes';
import { GameFoulSvg } from 'el/svgs';
import { useGoBack } from 'el/utils';
import { Text } from 'native-base';
import React, { useState } from 'react';
import GamePlayerSelector from '../components/GamePlayerSelector';

const penaltyShotModes = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
];
const shotsMadeModes = [
    { label: 0, value: 0 },
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
];

const BasketballFoulScreen = ({ navigation, route }) => {
    useGoBack();
    const { gameId, teamId, rivalTeamId, athleteId, logId, gameCode, isOfficiate } = route.params;
    const [showPenaltyShotDialog, setShowPenaltyShotDialog] = useState(false);
    const [playerSelectorDialog, setPlayerSelectorDialog] = useState(false);
    const [showShotsMadeDialog, setShowShotsMadeDialog] = useState(false);
    const [shotTimes, setShotTimes] = useState(0);
    const [athlete, setAthlete] = useState<any>(null);
    const [players, setPlayers] = useState([]);
    const [basketballFoulId, setBasketballFoulId] = useState(null);

    const recordFoul = async type => {
        const res: any = await gameService.recordBasketballFoul(gameId, {
            teamId,
            athleteId,
            type,
            logId,
        });
        if (res && res.code === 200) {
            setShowPenaltyShotDialog(true);
            setBasketballFoulId(res.value);
        }
    };

    const handleDialogYesClick = async item => {
        setShotTimes(item.value);
        const res: any = await teamService.getTeamGameRoster(rivalTeamId, gameId);
        if (res && res.code === 200) {
            setPlayers(res.value);
            setShowPenaltyShotDialog(false);
            setPlayerSelectorDialog(true);
        }
    };

    const handleSelectAthleteClick = selectedAthlete => {
        setAthlete(selectedAthlete);
        setPlayerSelectorDialog(false);
        setShowShotsMadeDialog(true);
    };

    const handleConfirmClick = async item => {
        const res: any = await gameService.recordBasketballPenaltyGoal(gameId, {
            basketballFoulId: basketballFoulId,
            teamId: rivalTeamId,
            shootAthleteId: athlete?.athleteId,
            penaltyShotQty: shotTimes,
            score: item.value,
            logId,
        });
        if (res && res.code === 200) {
            setBasketballFoulId(null);
            setShowShotsMadeDialog(false);
            goBack();
        }
    };

    const goBack = () => {
        if (logId) {
            navigation.navigate(routes.BasketballLog, { gameId, gameCode, isOfficiate });
        } else {
            navigation.goBack();
        }
    }

    return (
        <ElScrollContainer>
            <ElTitle>Foul Options Page</ElTitle>
            <ElOptionButton
                onPress={() => recordFoul(BasketballFoulType.PersonalFoul)}
                icon={<GameFoulSvg />}>
                Personal Foul
            </ElOptionButton>
            <ElOptionButton
                onPress={() => recordFoul(BasketballFoulType.TechnicalFoul)}
                icon={<GameFoulSvg />}>
                Technical Foul
            </ElOptionButton>
            <ElOptionButton
                onPress={() => recordFoul(BasketballFoulType.Violation)}
                icon={<GameFoulSvg />}>
                Violation
            </ElOptionButton>
            <ElOptionButton
                onPress={() => recordFoul(BasketballFoulType.FlagrantFoul)}
                icon={<GameFoulSvg />}>
                Flagrant Foul
            </ElOptionButton>

            {showPenaltyShotDialog && (
                <ElPickerModal
                    title="Penalty Shot Awarded"
                    visible={showPenaltyShotDialog}
                    onCancel={() => {
                        setShowPenaltyShotDialog(false);
                        goBack();
                    }}
                    setVisible={setShowPenaltyShotDialog}
                    items={penaltyShotModes}
                    onSelectedItem={handleDialogYesClick}
                    part
                />
            )}

            {playerSelectorDialog && (
                <ElModal
                    visible={playerSelectorDialog}
                    onClose={() => {
                        setPlayerSelectorDialog(false);
                        goBack();
                    }}>
                    <Text textAlign="center" my={1}>
                        Penalty Shot Awarded To
                    </Text>
                    <GamePlayerSelector
                        players={players}
                        onAthleteClick={handleSelectAthleteClick}
                    />
                </ElModal>
            )}

            {showShotsMadeDialog && (
                <ElPickerModal
                    title="Shots Made"
                    visible={showShotsMadeDialog}
                    onCancel={() => {
                        setShowShotsMadeDialog(false);
                        goBack();
                    }}
                    setVisible={setShowShotsMadeDialog}
                    items={shotsMadeModes.filter(x => x.value <= shotTimes)}
                    onSelectedItem={handleConfirmClick}
                    part
                />
            )}
        </ElScrollContainer>
    );
};

export default BasketballFoulScreen;
