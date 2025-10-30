import http from './httpService';
import { utils } from 'utils';

function createTournament (formData) {
    return http.post(`tournaments`, formData);
}

function getTournament (tournamentId) {
    return http.get(`tournaments/${tournamentId}/profile`);
}

function getTournamentTeams (tournamentId, queryParams) {
    var params = utils.toQueryParams(queryParams);
    return http.get(`tournaments/${tournamentId}/teams?${params}`);
}

function updateTournamentProfile (tournamentId, formdata) {
    return http.put(`tournaments/${tournamentId}/profile`, formdata);
}

function becomeToOfficialTournament (tournamentId, data) {
    return http.put(`tournaments/${tournamentId}/become-official-tournament`, data);
}

function updateTournamentProfilePicture (tournamentId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tournamentId', tournamentId);
    return http.put(`tournaments/${tournamentId}/profile-picture`, formData);
}

function getTournamentQueue (tournamentId) {
    return http.get(`tournaments/${tournamentId}/queue`);
}

function autoAssignGameTeam (tournamentId) {
    return http.put(`tournaments/${tournamentId}/auto-assign`);
}

function getBracketRounds (tournamentId) {
    return http.get(`tournaments/${tournamentId}/bracket-rounds`);
}

function getBracketByRound (tournamentId, round) {
    return http.get(`tournaments/${tournamentId}/bracket?round=${round}`);
}

function getTournamentOfficiateRequests (tournamentId, isShowAll) {
    return http.get(`tournaments/${tournamentId}/officiate-requests?isShowAll=${!!isShowAll}`);
}

function acceptTournamentOfficiateRequest (tournamentId, requestId) {
    return http.put(`tournaments/${tournamentId}/officiate-request/${requestId}/acception`, {});
}

function declineTournamentOfficiateRequest (tournamentId, requestId) {
    return http.put(`tournaments/${tournamentId}/officiate-request/${requestId}/rejection`, {});
}

function getTournamentOfficiates (tournamentId) {
    return http.get(`tournaments/${tournamentId}/officiates`);
}

function getTournamentFreeOfficiates (tournamentId, gameId, gameStartTime, gameEndTime) {
    return http.get(`tournaments/${tournamentId}/games/${gameId}/officiates?gameStartTime=${gameStartTime}&gameEndTime=${gameEndTime}`);
}

function getTournamentGamesByDate (tournamentId, gameDate) {
    return http.get(`tournaments/${tournamentId}/games?gameDate=${gameDate}`);
}

function getRentedFacilitiesForTournament (tournamentId) {
    return http.get(`tournaments/${tournamentId}/facilities`);
}

function getTournamentAllGames (tournamentId) {
    return http.get(`tournaments/${tournamentId}/all-games`);
}

function editTournamentGameInfo (tournamentId, data) {
    return http.put(`tournaments/${tournamentId}/game-info`, data);
}

function getTournamentGameHistories (tournamentId, keyword) {
    return http.get(`tournaments/${tournamentId}/game-histories?keyword=${keyword}`);
}

function getTournamentAdmins (tournamentId) {
    return http.get(`tournaments/${tournamentId}/admins`);
}

function getTournamentCoordinators (tournamentId) {
    return http.get(`tournaments/${tournamentId}/coordinators`);
}

function assignTournamentAdmin (tournamentId, athleteId) {
    return http.post(`tournaments/${tournamentId}/athletes/${athleteId}/admin`);
}

function cancelTournamentAdmin (tournamentId, athleteId) {
    return http.delete(`tournaments/${tournamentId}/athletes/${athleteId}/admin`);
}

function cancelTournamentCoordinator (tournamentId, athleteId) {
    return http.delete(`tournaments/${tournamentId}/athletes/${athleteId}/coordinator`);
}

function getAllUsersNotTournamentAdmin (tournamentId, userName) {
    return http.get(`athletes/tournaments/${tournamentId}/not-admin?userName=${userName || ''}`);
}

function getAllUsersNotTournamentCoordinator (tournamentId, userName) {
    return http.get(`athletes/tournaments/${tournamentId}/not-coordinator?userName=${userName || ''}`);
}

function assignTournamentCoordinator (tournamentId, athleteId) {
    return http.post(`tournaments/${tournamentId}/athletes/${athleteId}/coordinator`);
}

function getTournamentFiles (tournamentId) {
    return http.get(`tournaments/${tournamentId}/files`);
}

function deleteTournamentFile (tournamentId, fileId) {
    return http.delete(`tournaments/${tournamentId}/files/${fileId}`);
}

function addTournamentFiles (tournamentId, formData) {
    return http.post(`tournaments/${tournamentId}/files`, formData);
}

function deleteTournament (tournamentId) {
    return http.delete(`tournaments/${tournamentId}`);
}

function getContactUs (tournamentId) {
    return http.get(`tournaments/${tournamentId}/contacts`);
}
function getTournamentAdminViewGamesData (tournamentId, startDate, endDate) {
    return http.get(`tournaments/${tournamentId}/games/game-quantity/${startDate}/${endDate}`);
}

function getConnectedAccountUrl (tournamentId) {
    return http.post(`tournaments/stripe-account/link?tournamentId=${tournamentId}`);
}

function getAvailableFacilitiesForTournamentGame (tournamentId, gameStartTime, gameEndTime) {
    return http.get(`tournaments/${tournamentId}/facilities/available-facilities?gameStartTime=${gameStartTime}&gameEndTime=${gameEndTime}`);
}

function getCanRegisterTo (tournamentId) {
    return http.get(`tournaments/${tournamentId}/can-register-to`);
}

function assignGame (tournamentId, data) {
    return http.post(`tournaments/${tournamentId}/game-assign`, data);
}

function removeTeamFromTournament (tournamentId, teamId) {
    return http.delete(`tournaments/${tournamentId}/teams/${teamId}/remove`);
}

function searchTournamentsByName (name) {
    return http.get(`tournaments?tournamentname=${name}`);
}

function getTournamentUneditedGames (tournamentId) {
    return http.get(`tournaments/${tournamentId}/unedited-games`);
}

function checkTournamentAllowTeamCount (tournamentId) {
    return http.get(`tournaments/${tournamentId}/allow-team-count/check`)
}

function addTeamToQueue (tournamentId, teamId) {
    return http.post(`tournaments/${tournamentId}/team-queue/${teamId}`)
}

function getTournamentTeamQueue (tournamentId) {
    return http.get(`tournaments/${tournamentId}/team-queue`);
}

function getRegisterTournamentPayment (tournamentId) {
    return http.get(`tournaments/${tournamentId}/team-register-payment`);
}

function getTeamByTeamAdmin (tournamentId) {
    return http.get(`tournaments/${tournamentId}/team-by-team-admin`);
}

function GetTournamentInfoByPayment (paymentUrl) {
    return http.get(`tournaments/tournamentInfo?paymentUrl=${paymentUrl}`);
}

function postponeGame (tournamentId, gameId) {
    return http.put(`tournaments/${tournamentId}/games/${gameId}/postpone`);
}

export default {
    createTournament,
    getTournament,
    updateTournamentProfile,
    becomeToOfficialTournament,
    updateTournamentProfilePicture,
    getTournamentTeams,
    getTournamentQueue,
    autoAssignGameTeam,
    getBracketRounds,
    getBracketByRound,
    getTournamentOfficiateRequests,
    acceptTournamentOfficiateRequest,
    declineTournamentOfficiateRequest,
    getTournamentOfficiates,
    getTournamentFreeOfficiates,
    getTournamentGamesByDate,
    getRentedFacilitiesForTournament,
    getTournamentAllGames,
    editTournamentGameInfo,
    getTournamentGameHistories,
    assignTournamentAdmin,
    getAllUsersNotTournamentAdmin,
    getAllUsersNotTournamentCoordinator,
    assignTournamentCoordinator,
    getTournamentFiles,
    deleteTournamentFile,
    addTournamentFiles,
    deleteTournament,
    getContactUs,
    getConnectedAccountUrl,
    getTournamentAdminViewGamesData,
    getAvailableFacilitiesForTournamentGame,
    getCanRegisterTo,
    getTournamentAdmins,
    cancelTournamentAdmin,
    removeTeamFromTournament,
    searchTournamentsByName,
    assignGame,
    getTournamentUneditedGames,
    checkTournamentAllowTeamCount,
    addTeamToQueue,
    getTournamentTeamQueue,
    getRegisterTournamentPayment,
    getTeamByTeamAdmin,
    GetTournamentInfoByPayment,
    postponeGame,
    getTournamentCoordinators,
    cancelTournamentCoordinator
};