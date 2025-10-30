import http from './httpService';
import { utils } from 'utils';

function createLeague (formData) {
    return http.post(`leagues`, formData);
}

function getLeague (leagueId) {
    return http.get(`leagues/${leagueId}/profile`);
}

function getLeagueTeams (leagueId, queryParams) {
    var params = utils.toQueryParams(queryParams);
    return http.get(`leagues/${leagueId}/teams?${params}`);
}

function searchLeaguesByName (name) {
    return http.get(`leagues?leaguename=${name}`);
}

function becomeToOfficialLeague (leagueId, data) {
    return http.put(`leagues/${leagueId}/become-official-league`, data);
}

function updateLeagueProfile (leagueId, formdata) {
    return http.put(`leagues/${leagueId}/profile`, formdata);
}

function updateLeagueProfilePicture (leagueId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('leagueId', leagueId);
    return http.put(`leagues/${leagueId}/profile-picture`, formData);
}

function getContactUs (leagueId) {
    return http.get(`leagues/${leagueId}/contacts`);
}

function getLeagueQueue (leagueId) {
    return http.get(`leagues/${leagueId}/queue`);
}

function getLeagueOfficiateRequests (leagueId, isShowAll) {
    return http.get(`leagues/${leagueId}/officiate-requests?isShowAll=${!!isShowAll}`);
}

function declineLeagueOfficiateRequest (leagueId, requestId) {
    return http.put(`leagues/${leagueId}/officiate-request/${requestId}/rejection`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function acceptLeagueOfficiateRequest (leagueId, requestId) {
    return http.put(`leagues/${leagueId}/officiate-request/${requestId}/acception`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function getLeagueOfficiates (leagueId) {
    return http.get(`leagues/${leagueId}/officiates`);
}

function getLeagueFreeOfficiates (leagueId, gameId, gameStartTime, gameEndTime) {
    return http.get(`leagues/${leagueId}/games/${gameId}/officiates?gameStartTime=${gameStartTime}&gameEndTime=${gameEndTime}`);
}

function autoAssignSeasonGameTeam (leagueId) {
    return http.put(`leagues/${leagueId}/auto-assign-season`);
}

function autoAssignPlayoffsGameTeam (leagueId) {
    return http.put(`leagues/${leagueId}/auto-assign-playoff`);
}

function getBracketRounds (leagueId, isPlayoffs) {
    return http.get(`leagues/${leagueId}/bracket-rounds?isPlayoffs=${isPlayoffs}`);
}

function getBracketByRound (leagueId, round, isPlayoffs) {
    return http.get(`leagues/${leagueId}/bracket?round=${round}&isPlayoffs=${isPlayoffs}`);
}

function getLeagueGamesByDate (leagueId, gameDate) {
    return http.get(`leagues/${leagueId}/games?gameDate=${gameDate}`);
}

function getLeagueAllGames (leagueId) {
    return http.get(`leagues/${leagueId}/all-games`);
}

function getRentedFacilitiesForLeague (leagueId) {
    return http.get(`leagues/${leagueId}/facilities`);
}

function editLeagueGameInfo (leagueId, data) {
    return http.put(`leagues/${leagueId}/game-info`, data);
}

function getLeagueGameHistories (leagueId, keyword) {
    return http.get(`leagues/${leagueId}/game-histories?keyword=${keyword}`);
}

function getAllUsersNotLeagueAdmin (leagueId, userName) {
    return http.get(`athletes/leagues/${leagueId}/not-admin?userName=${userName || ''}`);
}

function getLeagueAdmins (leagueId) {
    return http.get(`leagues/${leagueId}/admins`);
}

function getLeagueCoordinators (leagueId) {
    return http.get(`leagues/${leagueId}/coordinators`);
}

function assignLeagueAdmin (leagueId, athleteId) {
    return http.post(`leagues/${leagueId}/athletes/${athleteId}/admin`);
}

function cancelLeagueAdmin (leagueId, athleteId) {
    return http.delete(`leagues/${leagueId}/athletes/${athleteId}/admin`);
}

function cancelLeagueCoordinator (leagueId, athleteId) {
    return http.delete(`leagues/${leagueId}/athletes/${athleteId}/coordinator`);
}

function getAllUsersNotLeagueCoordinator (leagueId, userName) {
    return http.get(`athletes/leagues/${leagueId}/not-coordinator?userName=${userName || ''}`);
}

function assignLeagueCoordinator (leagueId, athleteId) {
    return http.post(`leagues/${leagueId}/athletes/${athleteId}/coordinator`);
}

function getLeagueFiles (leagueId) {
    return http.get(`leagues/${leagueId}/files`);
}

function deleteLeagueFile (leagueId, fileId) {
    return http.delete(`leagues/${leagueId}/files/${fileId}`);
}

function addLeagueFiles (leagueId, formData) {
    return http.post(`leagues/${leagueId}/files`, formData);
}

function getConnectedAccountUrl (leagueId) {
    return http.post(`leagues/stripe-account/link?leagueid=${leagueId}`);
}

function getLeagueUneditedGames (leagueId) {
    return http.get(`leagues/${leagueId}/unedited-games`);
}

function deleteLeague (leagueId) {
    return http.delete(`leagues/${leagueId}`);
}

function getLeagueAdminViewGamesData (leagueId, startDate, endDate) {
    return http.get(`leagues/${leagueId}/games/game-quantity/${startDate}/${endDate}`);
}

function getCanRegisterTo (leagueId) {
    return http.get(`leagues/${leagueId}/can-register-to`);
}

function getAvailableFacilitiesForLeagueGame (leagueId, gameStartTime, gameEndTime) {
    return http.get(`leagues/${leagueId}/facilities/available-facilities?gameStartTime=${gameStartTime}&gameEndTime=${gameEndTime}`);
}

function assignGame (leagueId, data) {
    return http.post(`leagues/${leagueId}/game-assign`, data);
}

function removeTeamFromLeague (leagueId, teamId) {
    return http.delete(`leagues/${leagueId}/teams/${teamId}/remove`);
}

function checkLeagueAllowTeamCount (leagueId) {
    return http.get(`leagues/${leagueId}/allow-team-count/check`)
}

function addTeamToQueue (leagueId, teamId) {
    return http.post(`leagues/${leagueId}/team-queue/${teamId}`)
}

function getLeagueTeamQueue (leagueId) {
    return http.get(`leagues/${leagueId}/team-queue`);
}

function getRegisterLeaguePayment (leagueId) {
    return http.get(`leagues/${leagueId}/team-register-payment`);
}

function getTeamByTeamAdmin (leagueId) {
    return http.get(`leagues/${leagueId}/team-by-team-admin`);
}

function GetLeagueInfoByPayment (paymentUrl) {
    return http.get(`leagues/leagueInfo?paymentUrl=${paymentUrl}`);
}

function postponeGame (leagueId, gameId) {
    return http.put(`leagues/${leagueId}/games/${gameId}/postpone`);
}

export default {
    createLeague,
    getLeague,
    getLeagueTeams,
    searchLeaguesByName,
    becomeToOfficialLeague,
    updateLeagueProfile,
    updateLeagueProfilePicture,
    getContactUs,
    getLeagueQueue,
    getLeagueOfficiateRequests,
    declineLeagueOfficiateRequest,
    acceptLeagueOfficiateRequest,
    getLeagueOfficiates,
    getLeagueFreeOfficiates,
    getBracketRounds,
    getBracketByRound,
    getLeagueGamesByDate,
    getLeagueAllGames,
    getRentedFacilitiesForLeague,
    editLeagueGameInfo,
    getLeagueGameHistories,
    getAllUsersNotLeagueAdmin,
    assignLeagueAdmin,
    getAllUsersNotLeagueCoordinator,
    assignLeagueCoordinator,
    getLeagueFiles,
    deleteLeagueFile,
    addLeagueFiles,
    getConnectedAccountUrl,
    getLeagueUneditedGames,
    deleteLeague,
    getLeagueAdminViewGamesData,
    getCanRegisterTo,
    getAvailableFacilitiesForLeagueGame,
    getLeagueAdmins,
    cancelLeagueAdmin,
    assignGame,
    removeTeamFromLeague,
    checkLeagueAllowTeamCount,
    addTeamToQueue,
    getLeagueTeamQueue,
    autoAssignSeasonGameTeam,
    getRegisterLeaguePayment,
    autoAssignPlayoffsGameTeam,
    getTeamByTeamAdmin,
    GetLeagueInfoByPayment,
    postponeGame,
    getLeagueCoordinators,
    cancelLeagueCoordinator
};