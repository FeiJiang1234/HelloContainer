import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { gameService } from 'el/api';
import { ElButton, ElDialog, ElInput, ElLinkBtn, ElOptionButton, H5 } from 'el/components';
import routes from 'el/navigation/routes';
import { EndGameSvg, GameLogSvg, GameRostersSvg, StatRecordingSvg, TeamLineUpSvg } from 'el/svgs';
import { useElToast, useGameRoute, utils } from 'el/utils';

type PropType = {
    game: any;
};

const GameOptions: React.FC<PropType> = ({ game }) => {
    const [isShowEnterCodeDialog, setIsShowEnterCodeDialog] = useState(false);
    const {
        id,
        isLowStats,
        isOfficiate,
        isStatTracker,
        gameSportType,
        gameStatus,
        isHomeTeamAdmin,
        isAwayTeamAdmin,
    } = game;
    const isStart = gameStatus;
    const isConfirmed = gameStatus === 'Confirmed';
    const isPaused = gameStatus === 'Paused';
    const { goGameLog, goScoreBoard } = useGameRoute();
    const navigation: any = useNavigation();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState<any>('');
    const toast = useElToast();

    const handleSaveStatRecorderCode = async () => {
        setLoading(true);
        const res: any = await gameService.joinStatTracker(id, {
            statTrackerCode: code,
        });
        if (res && res.code === 200) {
            setIsShowEnterCodeDialog(false);
            goScoreBoard(id, gameSportType);
        } else {
            toast.error(res.Message);
        }
        setLoading(false);
    };

    const handleSubstitutionsClick = () => {
        var teamId = isHomeTeamAdmin ? game.homeTeamId : game.awayTeamId;
        navigation.navigate(routes.ChangeInGamePlayer, {
            gameId: id,
            teamId: teamId,
            gameCode: game?.gameCode,
        });
    };

    const handleTeamLineUpClick = () => {
        var teamId = isHomeTeamAdmin ? game.homeTeamId : game.awayTeamId;
        var organizationId = utils.isGuidEmpty(game.leagueId) ? game.tournamentId : game.leagueId;
        var organizationType = utils.isGuidEmpty(game.leagueId) ? 'Tournament' : 'League';

        navigation.navigate(routes.GameTeamLineUp, {
            teamId: teamId,
            organizationId: organizationId,
            gameId: game.id,
            organizationType: organizationType,
            gameCode: game?.gameCode,
            sportType: gameSportType,
        });
    };

    const goStatRecorders = () => {
        navigation.navigate(routes.GameStatRecorders, {
            gameId: id,
            gameCode: game.gameCode,
            isOfficiate: isOfficiate,
        });
    };

    const goRosters = () => {
        navigation.navigate(routes.GameRoster, {
            gameId: id,
        });
    };

    const goGamePost = () => {
        navigation.navigate(routes.GamePost, {
            gameId: id,
            gameSportType: gameSportType,
        });
    };

    return (
        <>
            {(isHomeTeamAdmin || isAwayTeamAdmin) && !isStart && (
                <ElOptionButton icon={<TeamLineUpSvg />} onPress={handleTeamLineUpClick}>
                    Team Line-Up
                </ElOptionButton>
            )}
            {(isHomeTeamAdmin || isAwayTeamAdmin) && isStart && isPaused && (
                <ElOptionButton icon={<GameRostersSvg />} onPress={handleSubstitutionsClick}>
                    Substitutions
                </ElOptionButton>
            )}

            {isOfficiate && (
                <ElOptionButton icon={<StatRecordingSvg />} onPress={goStatRecorders}>
                    Stat Recorders
                </ElOptionButton>
            )}

            {!isLowStats && !isOfficiate && !isStatTracker && (
                <ElOptionButton
                    icon={<StatRecordingSvg />}
                    onPress={() => setIsShowEnterCodeDialog(true)}>
                    Stat Recording
                </ElOptionButton>
            )}

            {isStart && (
                <ElOptionButton icon={<GameLogSvg />} onPress={() => goGameLog(game)}>
                    Game Activity History
                </ElOptionButton>
            )}

            <ElOptionButton icon={<GameRostersSvg />} onPress={goRosters}>
                Game Rosters
            </ElOptionButton>

            {isConfirmed && (
                <ElOptionButton icon={<EndGameSvg />} onPress={goGamePost}>
                    Post-Game
                </ElOptionButton>
            )}

            <ElDialog
                visible={isShowEnterCodeDialog}
                onClose={() => setIsShowEnterCodeDialog(false)}
                header={
                    <>
                        <H5 style={{ textAlign: 'center' }}>Enter the Stat Tracker Code</H5>
                        <ElLinkBtn style={{ textAlign: 'center', marginTop: 4 }}>
                            If the code is valid you will be taken to the stat tracking module
                        </ElLinkBtn>
                    </>
                }>
                <ElInput
                    name="statTrackerCode"
                    placeholder="Enter the code here"
                    hideAccessory
                    onChangeText={setCode}
                    value={code}
                />
                <ElButton disabled={!code} loading={loading} onPress={handleSaveStatRecorderCode}>
                    Submit
                </ElButton>
            </ElDialog>
        </>
    );
};

export default GameOptions;
