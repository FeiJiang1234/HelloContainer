import http from './httpService';

function getGameProfile(gameId) {
    return http.get(`games/${gameId}`);
}

function getBasketballScoreBoard(gameId) {
    return http.get(`games/${gameId}/basketball/score-board`);
}

function getSoccerScoreBoard(gameId) {
    return http.get(`games/${gameId}/soccer/score-board`);
}

function startGame(gameId) {
    return http.put(`games/${gameId}/start`);
}

function kickoffGame(gameId) {
    return http.put(`games/${gameId}/kick-off`);
}

function pauseGame(gameId, timeLeft) {
    return http.put(`games/${gameId}/pause`, { timeLeft: timeLeft });
}

function resumeGame(gameId) {
    return http.put(`games/${gameId}/resume`);
}

function undoBasketball(gameId) {
    return http.put(`games/${gameId}/basketball/undo`);
}

function recordBasketballAssist(gameId, data) {
    return http.post(`games/${gameId}/basketball/assist`, data);
}

function recordBasketballSteal(gameId, data) {
    return http.post(`games/${gameId}/basketball/steal`, data);
}

function recordBasketballRebnd(gameId, data) {
    return http.post(`games/${gameId}/basketball/rebnd`, data);
}

function recordBasketballBlock(gameId, data) {
    return http.post(`games/${gameId}/basketball/block`, data);
}

function recordBasketballTimeout(gameId, teamId, timeLeft) {
    return http.post(`games/${gameId}/basketball/teams/${teamId}/timeout`, { timeLeft: timeLeft });
}

function setBasketballScore(gameId, data) {
    return http.post(`games/${gameId}/basketball/score`, data);
}

function setBasketballMissShot(gameId, data) {
    return http.post(`games/${gameId}/basketball/miss-shot`, data);
}

function startNewBasketballQuarter(gameId) {
    return http.put(`games/${gameId}/basketball/start-quarter`);
}

function endBasketballQuarter(gameId) {
    return http.put(`games/${gameId}/basketball/end-quarter`);
}

function endGame(gameId) {
    return http.put(`games/${gameId}/end`);
}

function recordBasketballFoul(gameId, data) {
    return http.post(`games/${gameId}/basketball/foul`, data);
}

function recordBasketballPenaltyGoal(gameId, data) {
    return http.post(`games/${gameId}/basketball/penalty-goal`, data);
}

function getBasketballLogs(gameId) {
    return http.get(`games/${gameId}/basketball/logs`);
}

function removeBasketballLog(gameId, logId) {
    return http.delete(`games/${gameId}/basketball/logs/${logId}/remove`);
}

function getPostGameInfo(gameId) {
    return http.get(`games/${gameId}/post-info`);
}

function confirmGame(gameId, isConfirmedResult) {
    return http.put(`games/${gameId}/confirm`, { gameId, isConfirmedResult });
}

function getBasketballTeamStats(gameId, teamId, isLowStats) {
    return http.get(`games/${gameId}/basketball/teams/${teamId}/stats?isLowStats=${isLowStats}`);
}

function getLowSportTeamStats (gameId, teamId) {
    return http.get(`games/${gameId}/lowsport/teams/${teamId}/stats`);
}

function getGameRoster(gameId) {
    return http.get(`games/${gameId}/roster`);
}

function getGameStatRecorders(gameId) {
    return http.get(`games/${gameId}/stat-recorder`);
}

function getStatTrackerCode(gameId) {
    return http.get(`games/${gameId}/stat-recorder-code`);
}

function removeStatRecorder(gameId, statRecorderId) {
    return http.delete(`games/${gameId}/stat-recorders/${statRecorderId}`);
}

function generateNewStatTrackerCode(gameId) {
    return http.put(`games/${gameId}/stat-recorder-code`);
}

function joinStatTracker(gameId, data) {
    return http.post(`games/${gameId}/stat-trackers`, data);
}

function forfeitLeagueGame(gameId, teamId, leagueId) {
    return http.put(`games/${gameId}/leagues/${leagueId}/teams/${teamId}/forfeit`);
}

function forfeitTournamentGame(gameId, teamId, tournamentId) {
    return http.put(`games/${gameId}/tournaments/${tournamentId}/teams/${teamId}/forfeit`);
}

function getBasketballAthleteStats(gameId, athleteId, isLowStats) {
    return http.get(`games/${gameId}/basketball/athletes/${athleteId}/stats?isLowStats=${isLowStats}`);
}

function endSoccerFirstHalf(gameId) {
    return http.put(`games/${gameId}/end-first-half`);
}

function startNewSoccerHalf(gameId) {
    return http.put(`games/${gameId}/soccer/start-half`);
}

function undoSoccer(gameId) {
    return http.put(`games/${gameId}/soccer/undo`);
}

function recordSoccerAssist(gameId, data) {
    return http.post(`games/${gameId}/soccer/assist`, data);
}

function recordSoccerSave(gameId, data) {
    return http.post(`games/${gameId}/soccer/save`, data);
}

function recordSoccerTurnOver(gameId, data) {
    return http.post(`games/${gameId}/soccer/turn-over`, data);
}

function recordSoccerCorner(gameId, data) {
    return http.post(`games/${gameId}/soccer/corner`, data);
}

function recordSoccerSteal(gameId, data) {
    return http.post(`games/${gameId}/soccer/steal`, data);
}

function recordSoccerScore(gameId, data) {
    return http.post(`games/${gameId}/soccer/score`, data);
}

function recordSoccerMissShot(gameId, data) {
    return http.post(`games/${gameId}/soccer/miss-shot`, data);
}

function recordSoccerFoul(gameId, data) {
    return http.post(`games/${gameId}/soccer/foul`, data);
}

function recordSoccerPenaltyKick(gameId, data) {
    return http.post(`games/${gameId}/soccer/penalty-kick`, data);
}

function recordSoccerYellowCard(gameId, data) {
    return http.post(`games/${gameId}/soccer/yellow-card`, data);
}

function recordSoccerRedCard(gameId, data) {
    return http.post(`games/${gameId}/soccer/red-card`, data);
}

function getSoccerTeamStats(gameId, teamId, isLowStats) {
    return http.get(`games/${gameId}/soccer/teams/${teamId}/stats?isLowStats=${isLowStats}`);
}

function getSoccerAthleteStats(gameId, athleteId, isLowStats) {
    return http.get(`games/${gameId}/soccer/athletes/${athleteId}/stats?isLowStats=${isLowStats}`);
}

function getSoccerLogs(gameId) {
    return http.get(`games/${gameId}/soccer/logs`);
}

function removeSoccerLog(gameId, logId) {
    return http.delete(`games/${gameId}/soccer/logs/${logId}/remove`);
}

function callCoordinator(gameId) {
    return http.post(`games/${gameId}/call-coordinator`);
}

function finishCallingCoordinator(gameId, recordId) {
    return http.put(`games/${gameId}/recordsOfCallingCoordinator/${recordId}/finish-calling-coordinator`);
}

function cancelCallingCoordinator(gameId, recordId) {
    return http.put(`games/${gameId}/recordsOfCallingCoordinator/${recordId}/cancel-calling-coordinator`);
}

function changeGameClock(gameId, clock) {
    return http.put(`games/${gameId}/clock`, { clock });
}

function deleteGame(gameId) {
    return http.delete(`games/${gameId}`);
}

function replaceGameOfficiate(gameId, athleteId, data) {
    return http.post(`games/${gameId}/athletes/${athleteId}/replace-officiate`, data);
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
    getBasketballScoreBoard,
    getSoccerScoreBoard,
    startGame,
    pauseGame,
    resumeGame,
    recordBasketballAssist,
    recordBasketballSteal,
    recordBasketballRebnd,
    recordBasketballBlock,
    recordBasketballTimeout,
    setBasketballScore,
    setBasketballMissShot,
    kickoffGame,
    undoBasketball,
    startNewBasketballQuarter,
    endBasketballQuarter,
    endGame,
    recordBasketballFoul,
    recordBasketballPenaltyGoal,
    getBasketballLogs,
    removeBasketballLog,
    getPostGameInfo,
    confirmGame,
    getBasketballTeamStats,
    getGameRoster,
    getGameStatRecorders,
    getStatTrackerCode,
    removeStatRecorder,
    generateNewStatTrackerCode,
    joinStatTracker,
    forfeitLeagueGame,
    forfeitTournamentGame,
    endSoccerFirstHalf,
    getBasketballAthleteStats,
    startNewSoccerHalf,
    undoSoccer,
    recordSoccerAssist,
    recordSoccerSave,
    recordSoccerTurnOver,
    recordSoccerCorner,
    recordSoccerSteal,
    recordSoccerScore,
    recordSoccerMissShot,
    recordSoccerFoul,
    recordSoccerPenaltyKick,
    recordSoccerYellowCard,
    recordSoccerRedCard,
    getSoccerTeamStats,
    getSoccerAthleteStats,
    getSoccerLogs,
    removeSoccerLog,
    callCoordinator,
    finishCallingCoordinator,
    cancelCallingCoordinator,
    changeGameClock,
    deleteGame,
    replaceGameOfficiate,
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
