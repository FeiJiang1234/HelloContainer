import { ResponseResult } from 'el/models/responseResult';
import { TeamModel } from 'el/models/team/teamModel';
import { utils } from 'el/utils';
import http from './httpService';

function createTeam(data, file) {
    const formData = utils.formToFormData(data, {});
    formData.append('File', file);
    return http.post(`teams`, formData);
}

function searchTeam(sportType, value) {
    return http.get(`teams?teamName=${value}&sportType=${sportType}`);
}

function getAthleteActiveTeams(athleteId, name = '') {
    return http.get(`athletes/${athleteId}/active-teams?name=${name}`);
}

function getTeamProfile(teamId) {
    return http.get<null, ResponseResult<TeamModel>>(`teams/${teamId}/profile`);
}

function getStatsRange(teamId, rangeType, sportType, isOfficial) {
    return http.get(
        `teams/${teamId}/stats-range?rangeType=${rangeType}&sportType=${sportType}&isOfficial=${isOfficial}`,
    );
}

function getBasketballStatsByRange(teamId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(
        `teams/${teamId}/basketball/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`,
    );
}

function getSoccerStatsByRange(teamId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(
        `teams/${teamId}/soccer/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`,
    );
}

function getLowSportStatsByRange (teamId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(`teams/${teamId}/lowsport/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`);
}

function athleteRequestToJoinTeam(athleteId, teamId) {
    return http.post(`athletes/${athleteId}/teams/${teamId}/join-request`, {
        athleteId: athleteId,
        teamId: teamId,
    });
}

function getAthleteJoinTeamRequests(teamId, isShowAll = false) {
    return http.get(`teams/${teamId}/athlete-join-requests?isShowAll=${!!isShowAll}`);
}

function getTeamRoster(teamId, includeAdmin, organizationId = undefined) {
    return http.get(
        `/teams/${teamId}/roster?includeAdmin=${includeAdmin}&organizationId=${organizationId || ''
        }`,
    );
}

function rejectAthleteJoinRequest(teamId, requestId) {
    return http.put(`teams/${teamId}/athlete-join-requests/${requestId}/rejection`, {
        teamId: teamId,
        requestId: requestId,
    });
}

function blockAthleteToJoinTeam(teamId, requestId, athleteId) {
    return http.post(`teams/${teamId}/athlete-join-requests/${requestId}/athletes/${athleteId}/block`);
}

function approveAthleteJoinRequest(teamId, requestId) {
    return http.put(`teams/${teamId}/athlete-join-requests/${requestId}/approvement`, {
        teamId: teamId,
        requestId: requestId,
    });
}

function registerToLeague(teamId, leagueId, data) {
    return http.post(`teams/${teamId}/leagues/${leagueId}/register`, data);
}

function registerToTournament(teamId, tournamentId, data) {
    return http.post(`teams/${teamId}/tournaments/${tournamentId}/register`, data);
}

function addLeagueBlankAccount(teamId, leagueId, data) {
    return http.post(`teams/${teamId}/leagues/${leagueId}/blank-accounts`, data);
}

function addTournamentBlankAccount(teamId, tournamentId, data) {
    return http.post(`teams/${teamId}/tournaments/${tournamentId}/blank-accounts`, data);
}

function getTeamGameRoster(teamId, gameId) {
    return http.get(`teams/${teamId}/game/${gameId}/roster`);
}

function getTeamPlayersByOrganizationId(teamId, organizationId, organizationType) {
    return http.get(`/teams/${teamId}/wait-to-assign-players/organizaton/${organizationType}/${organizationId}`);
}

function updateLeagueLineup(teamId, leagueId, data) {
    data.teamId = teamId;
    data.leagueId = leagueId;
    return http.put(`teams/${teamId}/leagues/${leagueId}/lineup`, data);
}

function updateTournamentLineup(teamId, tournamentId, data) {
    data.teamId = teamId;
    data.tournamentId = tournamentId;
    return http.put(`teams/${teamId}/tournaments/${tournamentId}/lineup`, data);
}

function updateGameLineup(teamId, gameId, data) {
    data.teamId = teamId;
    data.gameId = gameId;
    return http.put(`teams/${teamId}/games/${gameId}/lineup`, data);
}

function getLeagueTeamRoster(teamId, leagueId, gameId) {
    return http.get(`/teams/${teamId}/leagues/${leagueId}/roster?gameId=${gameId || ''}`);
}

function getTournamentTeamRoster(teamId, tournamentId, gameId) {
    return http.get(`/teams/${teamId}/tournaments/${tournamentId}/roster?gameId=${gameId || ''}`);
}

function createBlankAthleteToLeagueTeam(teamId, leagueId, data) {
    return http.post(`teams/${teamId}/leagues/${leagueId}/league-team-blank-accounts`, data);
}

function createBlankAthleteToTournamentTeam(teamId, tournamentId, data) {
    return http.post(`teams/${teamId}/tournaments/${tournamentId}/tournament-team-blank-accounts`, data);
}

function changeGamePlayers(teamId, gameId, data) {
    return http.put(`teams/${teamId}/game/${gameId}/change-players`, data);
}

function getAllTeamMembersNotTeamAdmin(teamId, userName) {
    return http.get(`athletes/teams/${teamId}/not-admin?userName=${userName || ''}`);
}

function assignTeamAdmin(teamId, athleteId) {
    return http.post(`teams/${teamId}/athletes/${athleteId}/admin`);
}

function removeParticipant(teamId, athleteId) {
    return http.delete(`teams/${teamId}/athletes/${athleteId}/player`);
}

function cancelTeamAdmin(teamId, athleteId) {
    return http.delete(`teams/${teamId}/athletes/${athleteId}/admin`);
}

function getAvailablePlayerNumbers(teamId) {
    return http.get(`teams/${teamId}/player-numbers`);
}

function updatePlayerNumber(teamId, athleteId, data) {
    return http.put(`teams/${teamId}/athletes/${athleteId}/player-number`, data);
}

function getAthleteToBeInvited(teamId, userName) {
    return http.get(`teams/${teamId}/athlete-to-be-invited?userName=${userName || ''}`);
}

function invitePlayerJoinTeam(teamId, athleteId) {
    return http.post(`teams/${teamId}/athletes/${athleteId}/invite`, {
        teamId: teamId,
        athleteId: athleteId,
    });
}

function getTeamJoinedOrganizations(teamId) {
    return http.get(`teams/${teamId}/organizations`);
}

function getTeamJoinedGames(teamId) {
    return http.get(`teams/${teamId}/games`);
}

function updateProfile(teamId, data) {
    return http.put(`teams/${teamId}/profile`, data);
}

function updateTeamProfilePicture(teamId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('teamId', teamId);
    return http.put(`teams/${teamId}/logo`, formData);
}

function deleteTeam(teamId) {
    return http.delete(`teams/${teamId}`);
}

function getMediaList(teamId) {
    return http.get(`teams/${teamId}/medias`);
}

function addMedia(teamId, formData) {
    return http.post(`teams/${teamId}/medias`, formData);
}

function deleteMedia(teamId, mediaId) {
    return http.delete(`teams/${teamId}/medias/${mediaId}`);
}

function complainTeam(teamId, data) {
    return http.post(`teams/${teamId}/complaint`, data);
}

function isTeamPlayer (teamId) {
    return http.get(`teams/${teamId}/myself-is-team-player`);
}

export default {
    createTeam,
    searchTeam,
    getAthleteActiveTeams,
    getTeamProfile,
    getStatsRange,
    getBasketballStatsByRange,
    getSoccerStatsByRange,
    athleteRequestToJoinTeam,
    getAthleteJoinTeamRequests,
    getTeamRoster,
    rejectAthleteJoinRequest,
    blockAthleteToJoinTeam,
    approveAthleteJoinRequest,
    registerToLeague,
    registerToTournament,
    addLeagueBlankAccount,
    addTournamentBlankAccount,
    getTeamGameRoster,
    getTeamPlayersByOrganizationId,
    updateLeagueLineup,
    updateTournamentLineup,
    getLeagueTeamRoster,
    getTournamentTeamRoster,
    createBlankAthleteToLeagueTeam,
    createBlankAthleteToTournamentTeam,
    updateGameLineup,
    changeGamePlayers,
    getAllTeamMembersNotTeamAdmin,
    assignTeamAdmin,
    removeParticipant,
    cancelTeamAdmin,
    getAvailablePlayerNumbers,
    updatePlayerNumber,
    getAthleteToBeInvited,
    invitePlayerJoinTeam,
    getTeamJoinedOrganizations,
    getTeamJoinedGames,
    updateProfile,
    updateTeamProfilePicture,
    deleteTeam,
    getMediaList,
    addMedia,
    deleteMedia,
    complainTeam,
    isTeamPlayer,
    getLowSportStatsByRange
};
