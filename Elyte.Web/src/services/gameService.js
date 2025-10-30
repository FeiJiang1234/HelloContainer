import http from './httpService';

function getGameProfile (gameId) {
    return http.get(`games/${gameId}`);
}

function startGame (gameId) {
    return http.put(`games/${gameId}/start`);
}

function pauseGame (gameId, timeLeft) {
    return http.put(`games/${gameId}/pause`, { timeLeft: timeLeft });
}

function resumeGame (gameId) {
    return http.put(`games/${gameId}/resume`);
}

function forfeitLeagueGame (gameId, teamId, leagueId) {
    return http.put(`games/${gameId}/leagues/${leagueId}/teams/${teamId}/forfeit`);
}

function forfeitTournamentGame (gameId, teamId, tournamentId) {
    return http.put(`games/${gameId}/tournaments/${tournamentId}/teams/${teamId}/forfeit`);
}

function getGameRoster (gameId) {
    return http.get(`games/${gameId}/roster`);
}

function replaceGameOfficiate (gameId, athleteId, data) {
    return http.post(`games/${gameId}/athletes/${athleteId}/replace-officiate`, data);
}

function getBaseballScoreBoard (gameId) {
    return http.get(`games/${gameId}/baseball/score-board`);
}

function getBasketballScoreBoard (gameId) {
    return http.get(`games/${gameId}/basketball/score-board`);
}

function setBasketballScore (gameId, data) {
    return http.post(`games/${gameId}/basketball/score`, data);
}

function setBasketballMissShot (gameId, data) {
    return http.post(`games/${gameId}/basketball/miss-shot`, data);
}

function recordBasketballFoul (gameId, data) {
    return http.post(`games/${gameId}/basketball/foul`, data);
}

function recordBasketballPenaltyGoal (gameId, data) {
    return http.post(`games/${gameId}/basketball/penalty-goal`, data);
}

function recordBasketballAssist (gameId, data) {
    return http.post(`games/${gameId}/basketball/assist`, data);
}

function recordBasketballSteal (gameId, data) {
    return http.post(`games/${gameId}/basketball/steal`, data);
}

function recordBasketballRebnd (gameId, data) {
    return http.post(`games/${gameId}/basketball/rebnd`, data);
}

function recordBasketballBlock (gameId, data) {
    return http.post(`games/${gameId}/basketball/block`, data);
}

function getBasketballTeamStats (gameId, teamId, isLowStats) {
    return http.get(`games/${gameId}/basketball/teams/${teamId}/stats?isLowStats=${isLowStats}`);
}

function getLowSportTeamStats (gameId, teamId) {
    return http.get(`games/${gameId}/lowsport/teams/${teamId}/stats`);
}

function getBasketballLogs (gameId) {
    return http.get(`games/${gameId}/basketball/logs`);
}

function getBasketballAthleteStats (gameId, athleteId, isLowStats) {
    return http.get(`games/${gameId}/basketball/athletes/${athleteId}/stats?isLowStats=${isLowStats}`);
}

function startNewBasketballQuarter (gameId) {
    return http.put(`games/${gameId}/basketball/start-quarter`);
}

function endBasketballQuarter (gameId) {
    return http.put(`games/${gameId}/basketball/end-quarter`);
}

function endGame (gameId) {
    return http.put(`games/${gameId}/end`);
}

function kickoffGame (gameId) {
    return http.put(`games/${gameId}/kick-off`);
}

function getPostGameInfo (gameId) {
    return http.get(`games/${gameId}/post-info`);
}

function getSoccerTeamStats (gameId, teamId, isLowStats) {
    return http.get(`games/${gameId}/soccer/teams/${teamId}/stats?isLowStats=${isLowStats}`);
}

function getSoccerScoreBoard (gameId) {
    return http.get(`games/${gameId}/soccer/score-board`);
}

function startNewSoccerHalf (gameId) {
    return http.put(`games/${gameId}/soccer/start-half`);
}

function recordSoccerFoul (gameId, data) {
    return http.post(`games/${gameId}/soccer/foul`, data);
}

function recordSoccerPenaltyKick (gameId, data) {
    return http.post(`games/${gameId}/soccer/penalty-kick`, data);
}

function recordSoccerYellowCard (gameId, data) {
    return http.post(`games/${gameId}/soccer/yellow-card`, data);
}

function recordSoccerRedCard (gameId, data) {
    return http.post(`games/${gameId}/soccer/red-card`, data);
}

function recordSoccerScore (gameId, data) {
    return http.post(`games/${gameId}/soccer/score`, data);
}

function recordSoccerMissShot (gameId, data) {
    return http.post(`games/${gameId}/soccer/miss-shot`, data);
}

function recordSoccerAssist (gameId, data) {
    return http.post(`games/${gameId}/soccer/assist`, data);
}

function recordSoccerSave (gameId, data) {
    return http.post(`games/${gameId}/soccer/save`, data);
}

function recordSoccerTurnOver (gameId, data) {
    return http.post(`games/${gameId}/soccer/turn-over`, data);
}

function recordSoccerCorner (gameId, data) {
    return http.post(`games/${gameId}/soccer/corner`, data);
}

function recordSoccerSteal (gameId, data) {
    return http.post(`games/${gameId}/soccer/steal`, data);
}

function getSoccerLogs (gameId) {
    return http.get(`games/${gameId}/soccer/logs`);
}

function getSoccerAthleteStats (gameId, athleteId, isLowStats) {
    return http.get(`games/${gameId}/soccer/athletes/${athleteId}/stats?isLowStats=${isLowStats}`);
}

function recordBasketballTimeout (gameId, teamId, timeLeft) {
    return http.post(`games/${gameId}/basketball/teams/${teamId}/timeout`, { timeLeft: timeLeft });
}

function confirmGame (gameId, isConfirmedResult) {
    return http.put(`games/${gameId}/confirm`, { gameId, isConfirmedResult });
}

function undoBasketball (gameId) {
    return http.put(`games/${gameId}/basketball/undo`);
}

function removeBasketballLog (gameId, logId) {
    return http.delete(`games/${gameId}/basketball/logs/${logId}/remove`);
}

function getBasketballLastAction (gameId) {
    return http.get(`games/${gameId}/basketball/last-action`);
}

function undoSoccer (gameId) {
    return http.put(`games/${gameId}/soccer/undo`);
}

function getSoccerLastAction (gameId) {
    return http.get(`games/${gameId}/soccer/last-action`);
}

function removeSoccerLog (gameId, logId) {
    return http.delete(`games/${gameId}/soccer/logs/${logId}/remove`);
}

function joinStatTracker (gameId, data) {
    return http.post(`games/${gameId}/stat-trackers`, data);
}

function endSoccerFirstHalf (gameId) {
    return http.put(`games/${gameId}/end-first-half`);
}

function callCoordinator (gameId) {
    return http.post(`games/${gameId}/call-coordinator`);
}

function finishCallingCoordinator (gameId, recordId) {
    return http.put(`games/${gameId}/recordsOfCallingCoordinator/${recordId}/finish-calling-coordinator`);
}

function cancelCallingCoordinator (gameId, recordId) {
    return http.put(`games/${gameId}/recordsOfCallingCoordinator/${recordId}/cancel-calling-coordinator`);
}

function getGameStatRecorders (gameId) {
    return http.get(`games/${gameId}/stat-recorder`);
}

function removeStatRecorder (gameId, statRecorderId) {
    return http.delete(`games/${gameId}/stat-recorders/${statRecorderId}`);
}

function generateNewStatTrackerCode (gameId) {
    return http.put(`games/${gameId}/stat-recorder-code`);
}

function getStatTrackerCode (gameId) {
    return http.get(`games/${gameId}/stat-recorder-code`);
}

function changeGameClock (gameId, clock) {
    return http.put(`games/${gameId}/clock`, { clock });
}

function deleteGame (gameId) {
    return http.delete(`games/${gameId}`);
}

function setScores (gameId, data) {
    return http.put(`games/${gameId}/scores`, data);
}

function submitScores(gameId, data) {
    return http.put(`games/${gameId}/scores/submit`, data);
}

function getScoresByRound (gameId, round) {
    return http.get(`games/${gameId}/rounds/${round}/scores`);
}

function getRounds (gameId) {
    return http.get(`games/${gameId}/rounds`);
}

function endLowStatsGame(gameId) {
    return http.put(`games/${gameId}/lowstats/end`);
}

function updateBasketballLowStats(gameId, round, athleteId, data) {
    return http.put(`games/${gameId}/rounds/${round}/athletes/${athleteId}/basketball`, data);
}

function getBasketballLowStats(gameId, round, athleteId) {
    return http.get(`games/${gameId}/rounds/${round}/athletes/${athleteId}/basketball`);
}

function updateSoccerLowStats(gameId, round, athleteId, data) {
    return http.put(`games/${gameId}/rounds/${round}/athletes/${athleteId}/soccer`, data);
}

function getSoccerLowStats(gameId, round, athleteId) {
    return http.get(`games/${gameId}/rounds/${round}/athletes/${athleteId}/soccer`);
}

export default {
    getGameProfile,
    forfeitLeagueGame,
    forfeitTournamentGame,
    startGame,
    getGameRoster,
    pauseGame,
    resumeGame,
    replaceGameOfficiate,
    getBaseballScoreBoard,
    getBasketballScoreBoard,
    setBasketballScore,
    recordBasketballFoul,
    setBasketballMissShot,
    recordBasketballPenaltyGoal,
    recordBasketballAssist,
    recordBasketballSteal,
    recordBasketballRebnd,
    startNewBasketballQuarter,
    getBasketballAthleteStats,
    endGame,
    getBasketballTeamStats,
    kickoffGame,
    getBasketballLogs,
    getPostGameInfo,
    getSoccerScoreBoard,
    getSoccerTeamStats,
    startNewSoccerHalf,
    recordSoccerFoul,
    recordSoccerPenaltyKick,
    recordSoccerYellowCard,
    recordSoccerRedCard,
    recordSoccerScore,
    recordSoccerMissShot,
    recordSoccerAssist,
    recordSoccerSave,
    recordSoccerTurnOver,
    recordSoccerCorner,
    recordSoccerSteal,
    recordBasketballBlock,
    getSoccerLogs,
    getSoccerAthleteStats,
    recordBasketballTimeout,
    confirmGame,
    undoBasketball,
    getBasketballLastAction,
    undoSoccer,
    getSoccerLastAction,
    removeBasketballLog,
    removeSoccerLog,
    joinStatTracker,
    endSoccerFirstHalf,
    callCoordinator,
    finishCallingCoordinator,
    cancelCallingCoordinator,
    getGameStatRecorders,
    removeStatRecorder,
    generateNewStatTrackerCode,
    getStatTrackerCode,
    endBasketballQuarter,
    changeGameClock,
    deleteGame,
    setScores,
    submitScores,
    getScoresByRound,
    getRounds,
    endLowStatsGame,
    updateBasketballLowStats,
    getBasketballLowStats,
    updateSoccerLowStats,
    getSoccerLowStats,
    getLowSportTeamStats
};