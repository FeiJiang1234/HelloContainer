import http from './httpService';
import { FollowType } from 'enums';

function getAthleteById (athleteId) {
    return http.get(`athletes/${athleteId}`);
}

function getAthletes (name) {
    return http.get(`athletes?userName=${name || ''}`);
}

function updateProfile (athleteId, data) {
    return http.put(`athletes/${athleteId}/profile`, data);
}

function openToJoinTeam (sportType, athleteId) {
    return http.put(`athletes/${athleteId}/open-to-join-team`, { sportType, athleteId }, { hideGlobalLoading: true });
}

function closeToJoinTeam (sportType, athleteId) {
    return http.put(`athletes/${athleteId}/close-to-join-team`, { sportType, athleteId }, { hideGlobalLoading: true });
}

function updateProfilePicture (athleteId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('athleteId', athleteId);
    return http.put(`athletes/${athleteId}/profile-picture`, formData);
}

function followUser (athleteId, befollowedId) {
    return http.post(`athletes/${athleteId}/follow/${befollowedId}`, {
        athleteId: athleteId,
        befollowedId: befollowedId,
        followType: FollowType.Athlete,
    });
}

function followOrganization (athleteId, befollowedId, followType) {
    return http.post(`athletes/${athleteId}/follow/${befollowedId}`, {
        athleteId: athleteId,
        befollowedId: befollowedId,
        followType: followType,
    });
}

function unfollowUser (athleteId, befollowedId) {
    return http.delete(`athletes/${athleteId}/follow/${befollowedId}`);
}

function unfollowOrganization (athleteId, befollowedId) {
    return http.delete(`athletes/${athleteId}/follow-organization/${befollowedId}`);
}

function getFollowing (athleteId, name) {
    return http.get(`athletes/${athleteId}/following?name=${name}`);
}

function leaveTeam (athleteId, teamId) {
    return http.delete(`athletes/${athleteId}/teams/${teamId}`);
}

function getTeamInvites (athleteId) {
    return http.get(`athletes/${athleteId}/team-invites`);
}

function createCalendarReminder (data) {
    return http.post(`athletes/calendar/reminder`, data)
}

function registerToEvent (athleteId, eventId) {
    return http.post(`athletes/${athleteId}/events/${eventId}/registeration`, {
        athleteId: athleteId,
        eventId: eventId
    });
}

function deleteCalendarReminder (reminderId) {
    return http.delete(`athletes/calendar/${reminderId}`);
}

function updateCalendarReminder (reminderId, data) {
    return http.put(`athletes/calendar/${reminderId}`, data);
}

function approveTeamInvite (athleteId, inviteId) {
    return http.put(`athletes/${athleteId}/team-invites/${inviteId}/acceptance`, {
        athleteId: athleteId,
        inviteId: inviteId,
    });
}

function declineTeamInvite (athleteId, inviteId) {
    return http.put(`athletes/${athleteId}/team-invites/${inviteId}/decline`, {
        athleteId: athleteId,
        inviteId: inviteId,
    });
}

function getTeamJoinRequests (athleteId) {
    return http.get(`athletes/${athleteId}/team-join-request/list`);
}

function joinLeagueQueue (athleteId, leagueId) {
    return http.post(`athletes/${athleteId}/leagues/${leagueId}/queue`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function isJoinLeagueQueue (athleteId, leagueId) {
    return http.get(`athletes/${athleteId}/leagues/${leagueId}/is-Join-league-queue`);
}

function joinTournamentQueue (athleteId, tournamentId) {
    return http.post(`athletes/${athleteId}/tournaments/${tournamentId}/queue`, {}, { headers: { 'Content-Type': 'application/json' } });
}

function isJoinTournamentQueue (athleteId, tournamentId) {
    return http.get(`athletes/${athleteId}/tournaments/${tournamentId}/is-Join-tournament-queue`);
}

function getAthleteOfficiateRequests (athleteId) {
    return http.get(`athletes/${athleteId}/officiate-requests`);
}

function getAthleteManagedAssociations (athleteId) {
    return http.get(`athletes/${athleteId}/managedAssociations`);
}

function getAthleteManagedTournaments (athleteId, sportType) {
    return http.get(`athletes/${athleteId}/managedTournaments?sportType=${sportType}`);
}

function getAthleteManagedLeagues (athleteId, sportType) {
    return http.get(`athletes/${athleteId}/managedLeagues?sportType=${sportType}`);
}

function getAtlteteForOfficiateRegistration (athleteId) {
    return http.get(`athletes/${athleteId}/officiate-registration`);
}

function requestToBecomeTournamentOfficiate (athleteId, tournamentId) {
    return http.post(`athletes/${athleteId}/tournaments/${tournamentId}/request-to-become-tournament-officiate`, {
        athleteId: athleteId,
        tournamentId: tournamentId,
    });
}

function requestToBecomeLeagueOfficiate (athleteId, leagueId) {
    return http.post(`athletes/${athleteId}/leagues/${leagueId}/request-to-become-league-officiate`, {
        athleteId: athleteId,
        leagueId: leagueId,
    });
}

function getAthleteManagedTeams (athleteId, type, organizationId, sportType) {
    return http.get(`athletes/${athleteId}/${organizationId}/managed-teams?sportType=${sportType}&type=${type}`);
}

function getBasketballStats (athleteId, isOfficial) {
    return http.get(`athletes/${athleteId}/basketball/stats?isOfficial=${isOfficial}`);
}

function requestToBecomeAssociationOfficiate (athleteId, associationId) {
    return http.post(`athletes/${athleteId}/associations/${associationId}/request-to-become-association-officiate`, {});
}

function updateBasketballStats (athleteId, statsId, data) {
    return http.put(`athletes/${athleteId}/basketball/stats/${statsId}`, data);
}

function getSoccerStats (athleteId, isOfficial) {
    return http.get(`athletes/${athleteId}/soccer/stats?isOfficial=${isOfficial}`);
}

function updateSoccerStats (athleteId, statsId, data) {
    return http.put(`athletes/${athleteId}/soccer/stats/${statsId}`, data);
}

function getLowSportStats (athleteId, isOfficial, sportType) {
    return http.get(`athletes/${athleteId}/lowsport/stats?isOfficial=${isOfficial}&sportType=${sportType}`);
}

function blockAthlete (athleteId, targetAthleteId) {
    return http.delete(`athletes/${athleteId}/follow/${targetAthleteId}/block`);
}

function unblockAthlete (athleteId, targetAthleteId) {
    return http.delete(`athletes/${athleteId}/blackList/${targetAthleteId}/unblock`);
}

function getStatsRange (athleteId, rangeType, sportType, isOfficial) {
    return http.get(`athletes/${athleteId}/stats-range?rangeType=${rangeType}&sportType=${sportType}&isOfficial=${isOfficial}`);
}

function getAthleteManagedOrganizations (athleteId) {
    return http.get(`athletes/${athleteId}/managedOrganizations`);
}

function getBasketballStatsByRange (athleteId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(`athletes/${athleteId}/basketball/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`);
}

function getSoccerStatsByRange (athleteId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(`athletes/${athleteId}/soccer/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`);
}

function getLowSportStatsByRange (athleteId, rangeType, min, max, statType, isOfficial, dividedParts, sportType) {
    return http.get(`athletes/${athleteId}/lowsport/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}&sportType=${sportType}`);
}

function getBasketballShotMaps (athleteId, rangeType, min, max, isOfficial) {
    return http.get(`athletes/${athleteId}/basketball-shot-maps?rangeType=${rangeType}&min=${min}&max=${max}&isOfficial=${isOfficial}`);
}

function getSoccerShotMaps (athleteId, rangeType, min, max, isOfficial) {
    return http.get(`athletes/${athleteId}/soccer-shot-maps?rangeType=${rangeType}&min=${min}&max=${max}&isOfficial=${isOfficial}`);
}

function getPaymentAccounts () {
    return http.get(`athletes/payment-accounts`);
}

function getPaymentHistory (type) {
    return http.get(`athletes/payment-history?type=${type}`);
}

function getRentPaymentHistory () {
    return http.get(`athletes/rent-payment-history`);
}

function getAthleteActiveOrgnizations (athleteId) {
    return http.get(`athletes/${athleteId}/activeOrganizations`)
}

function getTodayEventReminders (athleteId) {
    return http.get(`athletes/${athleteId}/today-event-reminder`, { hideGlobalLoading: true })
}

function getAthleteJoinedGames (athleteId) {
    return http.get(`athletes/${athleteId}/games`);
}

function getMediaList (athleteId) {
    return http.get(`athletes/${athleteId}/medias`);
}

function addMedia (athleteId, formData) {
    return http.post(`athletes/${athleteId}/medias`, formData);
}

function deleteMedia (athleteId, mediaId) {
    return http.delete(`athletes/${athleteId}/medias/${mediaId}`);
}

function getAthleteDefaultOrganizations (condition) {
    return http.post(`athletes/defaultOrganizations`, condition)
}

function getAthleteDefaultTeams (condition) {
    return http.post(`athletes/defaultTeams`, condition);
}


function getAthleteSports (athleteId) {
    return http.get(`athletes/${athleteId}/sports`)
}

function setAthleteDefaultSport (athleteId, sport) {
    return http.put(`athletes/${athleteId}/default-sport`, { SportType: sport })
}

function removeTournamentOfficiate (athleteId, tournamentId) {
    return http.delete(`athletes/${athleteId}/tournaments/${tournamentId}/delete-tournament-officiate`);
}

function removeLeagueOfficiate (athleteId, leagueId) {
    return http.delete(`athletes/${athleteId}/leagues/${leagueId}/delete-league-officiate`);
}

function removeAssociationOfficiate (athleteId, associationId) {
    return http.delete(`athletes/${athleteId}/associations/${associationId}/delete-association-officiate`);
}

export default {
    getAthleteById,
    updateProfile,
    updateProfilePicture,
    followUser,
    unfollowUser,
    openToJoinTeam,
    closeToJoinTeam,
    leaveTeam,
    getTeamInvites,
    createCalendarReminder,
    registerToEvent,
    deleteCalendarReminder,
    updateCalendarReminder,
    approveTeamInvite,
    declineTeamInvite,
    followOrganization,
    unfollowOrganization,
    getTeamJoinRequests,
    joinLeagueQueue,
    isJoinLeagueQueue,
    joinTournamentQueue,
    isJoinTournamentQueue,
    getAthleteManagedAssociations,
    getAthleteManagedTournaments,
    getAthleteManagedLeagues,
    getAthleteOfficiateRequests,
    getAtlteteForOfficiateRegistration,
    requestToBecomeTournamentOfficiate,
    requestToBecomeLeagueOfficiate,
    getAthleteManagedTeams,
    getBasketballStats,
    requestToBecomeAssociationOfficiate,
    updateBasketballStats,
    getSoccerStats,
    updateSoccerStats,
    getFollowing,
    blockAthlete,
    getAthleteManagedOrganizations,
    getStatsRange,
    getBasketballShotMaps,
    getSoccerShotMaps,
    getPaymentAccounts,
    unblockAthlete,
    getPaymentHistory,
    getRentPaymentHistory,
    getAthleteActiveOrgnizations,
    getTodayEventReminders,
    getAthleteJoinedGames,
    getAthletes,
    getMediaList,
    addMedia,
    getAthleteDefaultOrganizations,
    getAthleteDefaultTeams,
    getBasketballStatsByRange,
    getSoccerStatsByRange,
    deleteMedia,
    getAthleteSports,
    setAthleteDefaultSport,
    removeTournamentOfficiate,
    removeLeagueOfficiate,
    removeAssociationOfficiate,
    getLowSportStatsByRange,
    getLowSportStats
};
