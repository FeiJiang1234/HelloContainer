import http from './httpService';

function createTeam (data) {
    return http.post(`teams`, data);
}

function getAthleteActiveTeams (athleteId, name) {
    return http.get(`athletes/${athleteId}/active-teams?name=${name || ''}`);
}

function getTeamProfile (teamId) {
    return http.get(`teams/${teamId}/profile`);
}

function athleteRequestToJoinTeam (athleteId, teamId) {
    return http.post(`athletes/${athleteId}/teams/${teamId}/join-request`, {
        athleteId: athleteId,
        teamId: teamId,
    });
}

function approveAthleteJoinRequest (teamId, requestId) {
    return http.put(`teams/${teamId}/athlete-join-requests/${requestId}/approvement`, {
        teamId: teamId,
        requestId: requestId,
    });
}

function rejectAthleteJoinRequest (teamId, requestId) {
    return http.put(`teams/${teamId}/athlete-join-requests/${requestId}/rejection`, {
        teamId: teamId,
        requestId: requestId,
    });
}

function getAthleteJoinTeamRequests (teamId, isShowAll) {
    return http.get(`teams/${teamId}/athlete-join-requests?isShowAll=${!!isShowAll}`);
}

function getTeamRoster (teamId, includeAdmin, organizationId) {
    return http.get(`/teams/${teamId}/roster?includeAdmin=${includeAdmin}&organizationId=${organizationId || ''}`);
}

function getLeagueTeamRoster (teamId, leagueId, gameId) {
    return http.get(`/teams/${teamId}/leagues/${leagueId}/roster?gameId=${gameId || ''}`);
}

function getTournamentTeamRoster (teamId, tournamentId, gameId) {
    return http.get(`/teams/${teamId}/tournaments/${tournamentId}/roster?gameId=${gameId || ''}`);
}

function getTeamPlayersByOrganizationId (teamId, organizationId, organizationType) {
    return http.get(`/teams/${teamId}/wait-to-assign-players/organizaton/${organizationType}/${organizationId}`);
}

function updateProfile (teamId, data) {
    return http.put(`teams/${teamId}/profile`, data);
}

function searchTeam (sportType, value) {
    return http.get(`teams?teamName=${value}&sportType=${sportType}`);
}

function updateTeamProfilePicture (teamId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('teamId', teamId);
    return http.put(`teams/${teamId}/logo`, formData);
}

function invitePlayerJoinTeam (teamId, athleteId) {
    return http.post(`teams/${teamId}/athletes/${athleteId}/invite`, {
        teamId: teamId,
        athleteId: athleteId,
    });
}

function removeParticipant (teamId, athleteId) {
    return http.delete(`teams/${teamId}/athletes/${athleteId}/player`);
}

function getAthleteToBeInvited (teamId, userName) {
    return http.get(`teams/${teamId}/athlete-to-be-invited?userName=${userName || ''}`);
}

function blockAthleteToJoinTeam (teamId, requestId, athleteId) {
    return http.post(`teams/${teamId}/athlete-join-requests/${requestId}/athletes/${athleteId}/block`);
}

function teamJoinLeague (teamId, leagueId) {
    return http.post(`teams/${teamId}/leagues/${leagueId}/join-request`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function teamJoinTournament (teamId, tournamentId) {
    return http.post(`teams/${teamId}/tournaments/${tournamentId}/join-request`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function getTeamJoinedOrganizations (teamId) {
    return http.get(`teams/${teamId}/organizations`);
}

function assignAthleteToTournament (teamId, tournamentId, athleteId) {
    return http.post(`teams/${teamId}/tournaments/${tournamentId}/athletes/${athleteId}`);
}

function removeAthleteFromTournament (teamId, tournamentId, athleteId) {
    return http.delete(`teams/${teamId}/tournaments/${tournamentId}/athletes/${athleteId}`);
}

function assignAthleteToLeague (teamId, leagueId, athleteId) {
    return http.post(`teams/${teamId}/leagues/${leagueId}/athletes/${athleteId}`);
}

function removeAthleteFromLeague (teamId, leagueId, athleteId) {
    return http.delete(`teams/${teamId}/leagues/${leagueId}/athletes/${athleteId}`);
}

function getTeamJoinedGames (teamId) {
    return http.get(`teams/${teamId}/games`);
}

function getTeamGameRoster (teamId, gameId) {
    return http.get(`teams/${teamId}/game/${gameId}/roster`);
}

function assignPlayerToGameAsStarter (teamId, gameId, athleteId) {
    return http.put(`teams/${teamId}/player/${athleteId}/game/${gameId}/assign-as-starter`);
}

function assignPlayerToGameAsSubstituter (teamId, gameId, athleteId) {
    return http.put(`teams/${teamId}/player/${athleteId}/game/${gameId}/assign-as-substituter`);
}

function cancelPlayerToJoinGame (teamId, gameId, athleteId) {
    return http.put(`teams/${teamId}/player/${athleteId}/game/${gameId}/cancel`);
}

function registerToLeague (teamId, leagueId, data) {
    return http.post(`teams/${teamId}/leagues/${leagueId}/register`, data);
}

function registerToTournament (teamId, tournamentId, data) {
    return http.post(`teams/${teamId}/tournaments/${tournamentId}/register`, data);
}

function getAllTeamMembersNotTeamAdmin (teamId, userName) {
    return http.get(`athletes/teams/${teamId}/not-admin?userName=${userName || ''}`);
}

function assignTeamAdmin (teamId, athleteId) {
    return http.post(`teams/${teamId}/athletes/${athleteId}/admin`);
}

function cancelTeamAdmin (teamId, athleteId) {
    return http.delete(`teams/${teamId}/athletes/${athleteId}/admin`);
}

function changeGamePlayer (teamId, gameId, data) {
    return http.put(`teams/${teamId}/game/${gameId}/change-player`, data);
}

function changeGamePlayers (teamId, gameId, data) {
    return http.put(`teams/${teamId}/game/${gameId}/change-players`, data);
}

function getTeamRegisterLeaguePayment (teamId) {
    return http.get(`teams/${teamId}/team-register-league-payment`);
}

function cancelPayForRegisterToLeague (teamId, data) {
    return http.put(`teams/${teamId}/league/cancel-register`, data);
}

function cancelPayForRegisterToTournament (teamId, data) {
    return http.put(`teams/${teamId}/tournament/cancel-register`, data);
}

function getStatsRange (teamId, rangeType, sportType, isOfficial) {
    return http.get(`teams/${teamId}/stats-range?rangeType=${rangeType}&sportType=${sportType}&isOfficial=${isOfficial}`);
}

function getBasketballStatsByRange (teamId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(`teams/${teamId}/basketball/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`);
}

function getSoccerStatsByRange (teamId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(`teams/${teamId}/soccer/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`);
}

function getLowSportStatsByRange (teamId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(`teams/${teamId}/lowsport/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`);
}

function addLeagueBlankAccount (teamId, leagueId, data) {
    return http.post(`teams/${teamId}/leagues/${leagueId}/blank-accounts`, data);
}

function addTournamentBlankAccount (teamId, tournamentId, data) {
    return http.post(`teams/${teamId}/tournaments/${tournamentId}/blank-accounts`, data);
}

function createBlankAthleteToLeagueTeam (teamId, leagueId, data) {
    return http.post(`teams/${teamId}/leagues/${leagueId}/league-team-blank-accounts`, data);
}

function createBlankAthleteToTournamentTeam (teamId, tournamentId, data) {
    return http.post(`teams/${teamId}/tournaments/${tournamentId}/tournament-team-blank-accounts`, data);
}

function deleteTeam (teamId) {
    return http.delete(`teams/${teamId}`);
}

function getAvailablePlayerNumbers (teamId) {
    return http.get(`teams/${teamId}/player-numbers`);
}

function updatePlayerNumber (teamId, athleteId, data) {
    return http.put(`teams/${teamId}/athletes/${athleteId}/player-number`, data);
}

function getMediaList (teamId) {
    return http.get(`teams/${teamId}/medias`);
}

function addMedia (teamId, formData) {
    return http.post(`teams/${teamId}/medias`, formData);
}

function deleteMedia (teamId, mediaId) {
    return http.delete(`teams/${teamId}/medias/${mediaId}`);
}

function updateLeagueLineup (teamId, leagueId, data) {
    data.teamId = teamId;
    data.leagueId = leagueId;
    return http.put(`teams/${teamId}/leagues/${leagueId}/lineup`, data);
}

function updateTournamentLineup (teamId, tournamentId, data) {
    data.teamId = teamId;
    data.tournamentId = tournamentId;
    return http.put(`teams/${teamId}/tournaments/${tournamentId}/lineup`, data);
}

function updateGameLineup (teamId, gameId, data) {
    data.teamId = teamId;
    data.gameId = gameId;
    return http.put(`teams/${teamId}/games/${gameId}/lineup`, data);
}

function isTeamPlayer (teamId) {
    return http.get(`teams/${teamId}/myself-is-team-player`);
}

export default {
    createTeam,
    athleteRequestToJoinTeam,
    getAthleteJoinTeamRequests,
    approveAthleteJoinRequest,
    rejectAthleteJoinRequest,
    getTeamRoster,
    getTeamProfile,
    updateProfile,
    searchTeam,
    updateTeamProfilePicture,
    invitePlayerJoinTeam,
    removeParticipant,
    getAthleteToBeInvited,
    getAthleteActiveTeams,
    blockAthleteToJoinTeam,
    teamJoinLeague,
    teamJoinTournament,
    getTeamJoinedOrganizations,
    assignAthleteToTournament,
    removeAthleteFromTournament,
    assignAthleteToLeague,
    removeAthleteFromLeague,
    getTeamPlayersByOrganizationId,
    getLeagueTeamRoster,
    getTournamentTeamRoster,
    getTeamJoinedGames,
    getTeamGameRoster,
    assignPlayerToGameAsStarter,
    assignPlayerToGameAsSubstituter,
    cancelPlayerToJoinGame,
    registerToLeague,
    registerToTournament,
    getAllTeamMembersNotTeamAdmin,
    assignTeamAdmin,
    getTeamRegisterLeaguePayment,
    cancelPayForRegisterToLeague,
    cancelPayForRegisterToTournament,
    getStatsRange,
    getBasketballStatsByRange,
    getSoccerStatsByRange,
    getLowSportStatsByRange,
    cancelTeamAdmin,
    addLeagueBlankAccount,
    addTournamentBlankAccount,
    changeGamePlayer,
    createBlankAthleteToLeagueTeam,
    createBlankAthleteToTournamentTeam,
    deleteTeam,
    getAvailablePlayerNumbers,
    updatePlayerNumber,
    getMediaList,
    addMedia,
    deleteMedia,
    updateLeagueLineup,
    updateGameLineup,
    changeGamePlayers,
    updateTournamentLineup,
    isTeamPlayer
};
