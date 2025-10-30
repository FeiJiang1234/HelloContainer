import { useGoBack } from 'el/utils';
import React, { useState } from 'react';
import { gameService, teamService } from 'el/api';
import routes from 'el/navigation/routes';
import { ElConfirm, ElModal, ElOptionButton, ElScrollContainer, ElTitle } from 'el/components';
import { GameFoulSvg } from 'el/svgs';
import { SoccerFoulType } from 'el/enums';
import { Text } from 'native-base';
import GamePlayerSelector from '../components/GamePlayerSelector';

const SoccerFoulScreen = ({ navigation, route }) => {
    useGoBack();
    const { gameId, gameCode, teamId, athleteId, rivalTeamId, logId, isOfficiate } = route.params;
    const [showShooterSelector, setShowShooterSelector] = useState(false);
    const [players, setPlayers] = useState([]);
    const [showKickMadeDialog, setShowKickMadeDialog] = useState(false);
    const [shooter, setShooter] = useState<any>(null);

    const recordFoul = async (type) => {
        await gameService.recordSoccerFoul(gameId, { teamId, athleteId, type, logId });
        goBack();
    }

    const recordPenaltyKickFoul = () => showSelectShooterDialog();
    const showSelectShooterDialog = async () => {
        const res: any = await teamService.getTeamGameRoster(rivalTeamId, gameId);
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
        const res: any = await gameService.recordSoccerPenaltyKick(gameId, {
            teamId, athleteId, rivalTeamId, shooterId: shooter.athleteId, score, logId
        });
        if (res && res.code === 200) {
            setShowKickMadeDialog(false);
            goBack();
        }
    }

    const goBack = () => {
        if (logId) {
            navigation.navigate(routes.SoccerLog, { gameId, gameCode, isOfficiate });
        } else {
            navigation.goBack();
        }
    }

    const handleGoSoccerCard = () => {
        navigation.navigate(routes.SoccerCard, { gameId, gameCode, teamId, athleteId, logId, isOfficiate });
    }

    return (
        <ElScrollContainer>
            <ElTitle>Foul Options Page</ElTitle>
            <ElOptionButton onPress={() => recordFoul(SoccerFoulType.IndirectKick)} icon={<GameFoulSvg />}>
                Indirect Kick
            </ElOptionButton>
            <ElOptionButton onPress={() => recordFoul(SoccerFoulType.DirectKick)} icon={<GameFoulSvg />}>
                Direct Kick
            </ElOptionButton>
            <ElOptionButton onPress={() => recordFoul(SoccerFoulType.GoalieFoul)} icon={<GameFoulSvg />}>
                Goalie Foul
            </ElOptionButton>
            <ElOptionButton onPress={() => recordPenaltyKickFoul()} icon={<GameFoulSvg />}>Penalty Kick</ElOptionButton>
            <ElOptionButton onPress={handleGoSoccerCard} icon={<GameFoulSvg />}>
                Card
            </ElOptionButton>


            {showShooterSelector && (
                <ElModal
                    visible={showShooterSelector}
                    onClose={() => {
                        setShowShooterSelector(false);
                        goBack();
                    }}>
                    <Text textAlign="center" my={1}>
                        Penalty Kick To
                    </Text>
                    <GamePlayerSelector
                        players={players}
                        onAthleteClick={handleShooterClick}
                    />
                </ElModal>
            )}

            {
                showKickMadeDialog &&
                <ElConfirm
                    title="Kicks Made"
                    message="Is Goal?"
                    visible={showKickMadeDialog}
                    onCancel={() => handleIsGoalClick(0)}
                    onConfirm={() => handleIsGoalClick(1)}
                />
            }
        </ElScrollContainer>
    );
};

export default SoccerFoulScreen;
