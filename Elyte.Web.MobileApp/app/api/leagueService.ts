import { LeagueModel } from 'el/models/league/leagueModel';
import { ResponseResult } from 'el/models/responseResult';
import { utils } from 'el/utils';
import http from './httpService';

function createLeague(data, file) {
    const formData = utils.formToFormData(data, {});
    formData.append('File', file);
    return http.post(`leagues`, formData);
}

function getLeague(leagueId) {
    return http.get<null, ResponseResult<LeagueModel>>(`leagues/${leagueId}/profile`);
}

function getCanRegisterTo(leagueId) {
    return http.get(`leagues/${leagueId}/can-register-to`);
}

function getRegisterLeaguePayment(leagueId) {
    return http.get(`leagues/${leagueId}/team-register-payment`);
}

function checkLeagueAllowTeamCount(leagueId) {
    return http.get(`leagues/${leagueId}/allow-team-count/check`);
}

function addTeamToQueue(leagueId, teamId) {
    return http.post(`leagues/${leagueId}/team-queue/${teamId}`);
}

function getLeagueTeams(leagueId, queryParams = {}) {
    var params = utils.toQueryParams(queryParams);
    return http.get(`leagues/${leagueId}/teams?${params}`);
}

function removeTeamFromLeague(leagueId, teamId) {
    return http.delete(`leagues/${leagueId}/teams/${teamId}/remove`);
}

function getLeagueOfficiates(leagueId) {
    return http.get(`leagues/${leagueId}/officiates`);
}

function getLeagueOfficiateRequests(leagueId, isShowAll = false) {
    return http.get(`leagues/${leagueId}/officiate-requests?isShowAll=${!!isShowAll}`);
}

function declineLeagueOfficiateRequest(leagueId, requestId) {
    return http.put(`leagues/${leagueId}/officiate-request/${requestId}/rejection`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function acceptLeagueOfficiateRequest(leagueId, requestId) {
    return http.put(`leagues/${leagueId}/officiate-request/${requestId}/acception`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function autoAssignPlayoffsGameTeam(leagueId) {
    return http.put(`leagues/${leagueId}/auto-assign-playoff`);
}

function autoAssignSeasonGameTeam(leagueId) {
    return http.put(`leagues/${leagueId}/auto-assign-season`);
}

function getBracketRounds(leagueId, isPlayoffs) {
    return http.get(`leagues/${leagueId}/bracket-rounds?isPlayoffs=${isPlayoffs}`);
}

function getBracketByRound(leagueId, round, isPlayoffs) {
    return http.get(`leagues/${leagueId}/bracket?round=${round}&isPlayoffs=${isPlayoffs}`);
}

function getLeagueFreeOfficiates(leagueId, gameId, gameStartTime, gameEndTime) {
    return http.get(`leagues/${leagueId}/games/${gameId}/officiates?gameStartTime=${gameStartTime}&gameEndTime=${gameEndTime}`);
}

function getAvailableFacilitiesForLeagueGame(leagueId, gameStartTime, gameEndTime) {
    return http.get(`leagues/${leagueId}/facilities/available-facilities?gameStartTime=${gameStartTime}&gameEndTime=${gameEndTime}`);
}

function getLeagueUneditedGames(leagueId) {
    return http.get(`leagues/${leagueId}/unedited-games`);
}

function editLeagueGameInfo(leagueId, data) {
    return http.put(`leagues/${leagueId}/game-info`, data);
}

function getLeagueGameHistories(leagueId, keyword) {
    return http.get(`leagues/${leagueId}/game-histories?keyword=${keyword}`);
}

function assignGame(leagueId, data) {
    return http.post(`leagues/${leagueId}/game-assign`, data);
}

function getTeamByTeamAdmin(leagueId) {
    return http.get(`leagues/${leagueId}/team-by-team-admin`);
}

function getAllUsersNotLeagueAdmin(leagueId, userName) {
    return http.get(`athletes/leagues/${leagueId}/not-admin?userName=${userName || ''}`);
}

function assignLeagueAdmin(leagueId, athleteId) {
    return http.post(`leagues/${leagueId}/athletes/${athleteId}/admin`);
}

function getLeagueTeamQueue(leagueId) {
    return http.get(`leagues/${leagueId}/team-queue`);
}

function getContactUs(leagueId) {
    return http.get(`leagues/${leagueId}/contacts`);
}

function getLeagueAdmins(leagueId) {
    return http.get(`leagues/${leagueId}/admins`);
}

function getLeagueCoordinators (leagueId) {
    return http.get(`leagues/${leagueId}/coordinators`);
}

function cancelLeagueAdmin(leagueId, athleteId) {
    return http.delete(`leagues/${leagueId}/athletes/${athleteId}/admin`);
}

function cancelLeagueCoordinator (leagueId, athleteId) {
    return http.delete(`leagues/${leagueId}/athletes/${athleteId}/coordinator`);
}

function updateLeagueProfile(leagueId, formdata) {
    return http.put(`leagues/${leagueId}/profile`, formdata);
}

function getAllUsersNotLeagueCoordinator(leagueId, userName) {
    return http.get(`athletes/leagues/${leagueId}/not-coordinator?userName=${userName || ''}`);
}

function assignLeagueCoordinator(leagueId, athleteId) {
    return http.post(`leagues/${leagueId}/athletes/${athleteId}/coordinator`);
}

function deleteLeague(leagueId) {
    return http.delete(`leagues/${leagueId}`);
}

function getLeagueAdminViewGamesData(leagueId, startDate, endDate) {
    return http.get(`leagues/${leagueId}/games/game-quantity/${startDate}/${endDate}`);
}

function getLeagueGamesByDate(leagueId, gameDate) {
    return http.get(`leagues/${leagueId}/games?gameDate=${gameDate}`);
}

function updateLeagueProfilePicture(leagueId, file) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('leagueId', leagueId);
    return http.put(`leagues/${leagueId}/profile-picture`, formData);
}

function getRentedFacilitiesForLeague(leagueId) {
    return http.get(`leagues/${leagueId}/facilities`);
}

function complainLeague(leagueId, data) {
    return http.post(`leagues/${leagueId}/complaint`, data)
}

function postponeGame (leagueId, gameId) {
    return http.put(`leagues/${leagueId}/games/${gameId}/postpone`);
}

export default {
    createLeague,
    getLeague,
    getCanRegisterTo,
    getRegisterLeaguePayment,
    checkLeagueAllowTeamCount,
    addTeamToQueue,
    getLeagueTeams,
    removeTeamFromLeague,
    getLeagueOfficiates,
    getLeagueOfficiateRequests,
    declineLeagueOfficiateRequest,
    acceptLeagueOfficiateRequest,
    autoAssignPlayoffsGameTeam,
    autoAssignSeasonGameTeam,
    getBracketRounds,
    getBracketByRound,
    getLeagueFreeOfficiates,
    getAvailableFacilitiesForLeagueGame,
    getLeagueUneditedGames,
    editLeagueGameInfo,
    getLeagueGameHistories,
    assignGame,
    getTeamByTeamAdmin,
    getAllUsersNotLeagueAdmin,
    assignLeagueAdmin,
    getLeagueTeamQueue,
    getContactUs,
    getLeagueAdmins,
    cancelLeagueAdmin,
    updateLeagueProfile,
    getAllUsersNotLeagueCoordinator,
    assignLeagueCoordinator,
    deleteLeague,
    getLeagueAdminViewGamesData,
    getLeagueGamesByDate,
    updateLeagueProfilePicture,
    getRentedFacilitiesForLeague,
    complainLeague,
    postponeGame,
    getLeagueCoordinators,
    cancelLeagueCoordinator
};
