import { ResponseResult } from 'el/models/responseResult';
import { TournamentModel } from 'el/models/tournament/tournamentModel';
import { utils } from 'el/utils';
import http from './httpService';

function createTournament(data, file) {
    const formData = utils.formToFormData(data, {});
    formData.append('File', file);
    return http.post(`tournaments`, formData);
}

function getTournament(tournamentId) {
    return http.get<null, ResponseResult<TournamentModel>>(`tournaments/${tournamentId}/profile`);
}

function editTournament(tournamentId, data) {
    return http.put(`tournaments/${tournamentId}/profile`, data);
}

function getAllUsersNotTournamentAdmin(tournamentId, userName) {
    return http.get(`athletes/tournaments/${tournamentId}/not-admin?userName=${userName || ''}`);
}

function getTournamentAdmins(tournamentId) {
    return http.get(`tournaments/${tournamentId}/admins`);
}

function getTournamentCoordinators(tournamentId) {
    return http.get(`tournaments/${tournamentId}/coordinators`);
}

function assignTournamentAdmin(tournamentId, athleteId) {
    return http.post(`tournaments/${tournamentId}/athletes/${athleteId}/admin`);
}

function cancelTournamentAdmin(tournamentId, athleteId) {
    return http.delete(`tournaments/${tournamentId}/athletes/${athleteId}/admin`);
}

function cancelTournamentCoordinator (tournamentId, athleteId) {
    return http.delete(`tournaments/${tournamentId}/athletes/${athleteId}/coordinator`);
}

function getContactUs(tournamentId) {
    return http.get(`tournaments/${tournamentId}/contacts`);
}

function getAllUsersNotTournamentCoordinator(tournamentId, userName) {
    return http.get(`athletes/tournaments/${tournamentId}/not-coordinator?userName=${userName || ''}`);
}

function assignTournamentCoordinator(tournamentId, athleteId) {
    return http.post(`tournaments/${tournamentId}/athletes/${athleteId}/coordinator`);
}

function getTournamentAdminViewGamesData(tournamentId, startDate, endDate) {
    return http.get(`tournaments/${tournamentId}/games/game-quantity/${startDate}/${endDate}`);
}

function getTournamentGamesByDate(tournamentId, gameDate) {
    return http.get(`tournaments/${tournamentId}/games?gameDate=${gameDate}`);
}

function getTournamentOfficiates(tournamentId) {
    return http.get(`tournaments/${tournamentId}/officiates`);
}

function getTournamentOfficiateRequests(tournamentId, isShowAll = false) {
    return http.get(`tournaments/${tournamentId}/officiate-requests?isShowAll=${!!isShowAll}`);
}

function acceptTournamentOfficiateRequest(tournamentId, requestId) {
    return http.put(`tournaments/${tournamentId}/officiate-request/${requestId}/acception`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function updateTournamentProfilePicture(tournamentId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tournamentId', tournamentId);
    return http.put(`tournaments/${tournamentId}/profile-picture`, formData);
}

function declineTournamentOfficiateRequest(tournamentId, requestId) {
    return http.put(`tournaments/${tournamentId}/officiate-request/${requestId}/rejection`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function deleteTournament(tournamentId) {
    return http.delete(`tournaments/${tournamentId}`);
}

function getCanRegisterTo(tournamentId) {
    return http.get(`tournaments/${tournamentId}/can-register-to`);
}

function getRegisterTournamentPayment(tournamentId) {
    return http.get(`tournaments/${tournamentId}/team-register-payment`);
}

function getTournamentTeams(tournamentId, queryParams = {}) {
    var params = utils.toQueryParams(queryParams);
    return http.get(`tournaments/${tournamentId}/teams?${params}`);
}

function checkTournamentAllowTeamCount(tournamentId) {
    return http.get(`tournaments/${tournamentId}/allow-team-count/check`);
}

function getTeamByTeamAdmin(tournamentId) {
    return http.get(`tournaments/${tournamentId}/team-by-team-admin`);
}

function getTournamentTeamQueue(tournamentId) {
    return http.get(`tournaments/${tournamentId}/team-queue`);
}

function addTeamToQueue(tournamentId, teamId) {
    return http.post(`tournaments/${tournamentId}/team-queue/${teamId}`);
}

function getBracketRounds(tournamentId) {
    return http.get(`tournaments/${tournamentId}/bracket-rounds`);
}

function getRentedFacilitiesForTournament(tournamentId) {
    return http.get(`tournaments/${tournamentId}/facilities`);
}

function getBracketByRound(tournamentId, round) {
    return http.get(`tournaments/${tournamentId}/bracket?round=${round}`);
}

function assignGame(tournamentId, data) {
    return http.post(`tournaments/${tournamentId}/game-assign`, data);
}

function autoAssignGameTeam(tournamentId) {
    return http.put(`tournaments/${tournamentId}/auto-assign`);
}

function getTournamentFreeOfficiates(tournamentId, gameId, gameStartTime, gameEndTime) {
    return http.get(`tournaments/${tournamentId}/games/${gameId}/officiates?gameStartTime=${gameStartTime}&gameEndTime=${gameEndTime}`);
}

function getAvailableFacilitiesForTournamentGame(tournamentId, gameStartTime, gameEndTime) {
    return http.get(`tournaments/${tournamentId}/facilities/available-facilities?gameStartTime=${gameStartTime}&gameEndTime=${gameEndTime}`);
}

function getTournamentUneditedGames(tournamentId) {
    return http.get(`tournaments/${tournamentId}/unedited-games`);
}

function editTournamentGameInfo(tournamentId, data) {
    return http.put(`tournaments/${tournamentId}/game-info`, data);
}

function getTournamentGameHistories(tournamentId, keyword) {
    return http.get(`tournaments/${tournamentId}/game-histories?keyword=${keyword}`);
}

function removeTeamFromTournament(tournamentId, teamId) {
    return http.delete(`tournaments/${tournamentId}/teams/${teamId}/remove`);
}

function complainTournament(tournamentId, data) {
    return http.post(`tournaments/${tournamentId}/complaint`, data)
}

function postponeGame (tournamentId, gameId) {
    return http.put(`tournaments/${tournamentId}/games/${gameId}/postpone`);
}

export default {
    createTournament,
    getTournament,
    editTournament,
    getAllUsersNotTournamentAdmin,
    assignTournamentAdmin,
    getContactUs,
    getAllUsersNotTournamentCoordinator,
    assignTournamentCoordinator,
    getTournamentAdminViewGamesData,
    updateTournamentProfilePicture,
    getTournamentGamesByDate,
    getTournamentOfficiates,
    getTournamentOfficiateRequests,
    acceptTournamentOfficiateRequest,
    deleteTournament,
    declineTournamentOfficiateRequest,
    getCanRegisterTo,
    getRegisterTournamentPayment,
    getTournamentTeams,
    checkTournamentAllowTeamCount,
    getTeamByTeamAdmin,
    getTournamentTeamQueue,
    addTeamToQueue,
    getTournamentAdmins,
    cancelTournamentAdmin,
    getBracketRounds,
    getBracketByRound,
    assignGame,
    autoAssignGameTeam,
    getTournamentFreeOfficiates,
    getAvailableFacilitiesForTournamentGame,
    getTournamentUneditedGames,
    editTournamentGameInfo,
    getRentedFacilitiesForTournament,
    getTournamentGameHistories,
    removeTeamFromTournament,
    complainTournament,
    postponeGame,
    getTournamentCoordinators,
    cancelTournamentCoordinator
};
