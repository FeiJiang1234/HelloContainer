import React, { useState } from 'react';
import { ElOptionButton } from 'components';
import { useHistory } from 'react-router-dom';
import { useGameRoute, utils } from 'utils';
import GameStatRecorder from './gameStatRecorder';

export default function GameOptions ({ game }) {
    const history = useHistory();
    const { goGameLog } = useGameRoute();
    const [isShowEnterCodeDialog, setIsShowEnterCodeDialog] = useState(false);
    const { id, isLowStats, isOfficiate, isStatTracker, gameSportType, gameStatus, isHomeTeamAdmin, isAwayTeamAdmin } = game;
    const isStart = gameStatus;
    const isConfirmed = gameStatus === 'Confirmed';
    const isPaused = gameStatus === 'Paused';

    const handleStatRecordersClick = () => {
        history.push('/statRecordersList', { params: { gameId: id, gameCode: game.gameCode, isOfficiate: isOfficiate } });
    }

    const handlePostGameClick = () =>
        history.push('/gamePost', { gameId: id, gameSportType: gameSportType });

    const handleSubstitutionsClick = () => {
        var teamId = isHomeTeamAdmin ? game.homeTeamId : game.awayTeamId;
        history.push('/changeInGamePlayer', { gameId: id, teamId: teamId, gameCode: game?.gameCode });
    }

    const handleTeamLineUpClick = () => {
        var teamId = isHomeTeamAdmin ? game.homeTeamId : game.awayTeamId;
        var organizationId = utils.isGuidEmpty(game.leagueId) ? game.tournamentId : game.leagueId;
        var organizationType = utils.isGuidEmpty(game.leagueId) ? 'Tournament' : 'League';

        history.push('/teamLineUp', { teamId: teamId, organizationId: organizationId, gameId: game.id, organizationType: organizationType, gameCode: game?.gameCode, sportType: gameSportType });
    }

    return (
        <>
            {(isHomeTeamAdmin || isAwayTeamAdmin) && !isStart && <ElOptionButton iconName="teamLineUp" onClick={handleTeamLineUpClick}>Team Line-Up</ElOptionButton>}

            {(isHomeTeamAdmin || isAwayTeamAdmin) && isPaused && <ElOptionButton onClick={handleSubstitutionsClick} iconName="gameRosters">Substitutions</ElOptionButton>}

            {isOfficiate && <ElOptionButton iconName="statRecording" onClick={handleStatRecordersClick}>Stat Recorders</ElOptionButton>}

            {!isLowStats && !isOfficiate && !isStatTracker && <ElOptionButton iconName="statRecording" onClick={() => setIsShowEnterCodeDialog(true)}>Stat Recording</ElOptionButton>}

            <GameStatRecorder isOpen={isShowEnterCodeDialog} gameId={id} onclose={setIsShowEnterCodeDialog} gameSportType={gameSportType} />

            {isStart && <ElOptionButton iconName="gameLog" onClick={() => goGameLog(game)}>Game Activity History</ElOptionButton>}

            <ElOptionButton iconName="gameRosters" onClick={() => history.push('/gameRoster', { params: id })}>Game Rosters</ElOptionButton>

            {isConfirmed && <ElOptionButton iconName="gameRosters" onClick={handlePostGameClick}>Post-Game</ElOptionButton>}
        </>
    );
}
