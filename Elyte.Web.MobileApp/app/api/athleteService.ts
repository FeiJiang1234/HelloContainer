import { FollowType } from 'el/enums';
import { AthleteModel } from '../models/athlete/athleteModel';
import { StatsModel } from '../models/athlete/statsModel';
import { ResponseResult } from '../models/responseResult';
import http from './httpService';

function getAthleteById(athleteId) {
    return http.get<null, ResponseResult<AthleteModel>>(`athletes/${athleteId}`);
}

function updateProfile(athleteId, data) {
    return http.put(`athletes/${athleteId}/profile`, data);
}

function getBasketballStats(athleteId, isOfficial) {
    return http.get<null, ResponseResult<StatsModel[]>>(
        `athletes/${athleteId}/basketball/stats?isOfficial=${isOfficial}`,
    );
}

function getSoccerStats(athleteId, isOfficial) {
    return http.get<null, ResponseResult<StatsModel[]>>(
        `athletes/${athleteId}/soccer/stats?isOfficial=${isOfficial}`,
    );
}

function updateBasketballStats(athleteId, statsId, data) {
    return http.put(`athletes/${athleteId}/basketball/stats/${statsId}`, data);
}

function getLowSportStats (athleteId, isOfficial, sportType) {
    return http.get<null, ResponseResult<StatsModel[]>>(
        `athletes/${athleteId}/lowsport/stats?isOfficial=${isOfficial}&sportType=${sportType}`);
}

function updateSoccerStats(athleteId, statsId, data) {
    return http.put(`athletes/${athleteId}/soccer/stats/${statsId}`, data);
}

function updateProfilePicture(athleteId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('athleteId', athleteId);
    return http.put(`athletes/${athleteId}/profile-picture`, formData);
}

function getAthleteDefaultTeams(condition) {
    return http.post(`athletes/defaultTeams`, condition);
}

function openToJoinTeam(sportType, athleteId) {
    return http.put(`athletes/${athleteId}/open-to-join-team`, { sportType, athleteId });
}

function closeToJoinTeam(sportType, athleteId) {
    return http.put(`athletes/${athleteId}/close-to-join-team`, { sportType, athleteId });
}

function getStatsRange(athleteId, rangeType, sportType, isOfficial) {
    return http.get(
        `athletes/${athleteId}/stats-range?rangeType=${rangeType}&sportType=${sportType}&isOfficial=${isOfficial}`,
    );
}

function getBasketballShotMaps(athleteId, rangeType, min, max, isOfficial) {
    return http.get(`athletes/${athleteId}/basketball-shot-maps?rangeType=${rangeType}&min=${min}&max=${max}&isOfficial=${isOfficial}`);
}

function getSoccerShotMaps(athleteId, rangeType, min, max, isOfficial) {
    return http.get(`athletes/${athleteId}/soccer-shot-maps?rangeType=${rangeType}&min=${min}&max=${max}&isOfficial=${isOfficial}`);
}

function getBasketballStatsByRange(athleteId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(`athletes/${athleteId}/basketball/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`);
}

function getSoccerStatsByRange(athleteId, rangeType, min, max, statType, isOfficial, dividedParts) {
    return http.get(`athletes/${athleteId}/soccer/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}`);
}

function getLowSportStatsByRange (athleteId, rangeType, min, max, statType, isOfficial, dividedParts, sportType) {
    return http.get(`athletes/${athleteId}/lowsport/stats-by-range?rangeType=${rangeType}&min=${min}&max=${max}&statType=${statType}&isOfficial=${isOfficial}&dividedParts=${dividedParts}&sportType=${sportType}`);
}

function getAthleteDefaultOrganizations(condition) {
    return http.post(`athletes/defaultOrganizations`, condition)
}

function getAthleteActiveOrgnizations(athleteId) {
    return http.get(`athletes/${athleteId}/activeOrganizations`)
}

function getAthleteManagedTeams(athleteId, type, organizationId, sportType) {
    return http.get(`athletes/${athleteId}/${organizationId}/managed-teams?sportType=${sportType}&type=${type}`);
}

function getAtlteteForOfficiateRegistration(athleteId) {
    return http.get(`athletes/${athleteId}/officiate-registration`);
}

function requestToBecomeLeagueOfficiate(athleteId, leagueId) {
    return http.post(`athletes/${athleteId}/leagues/${leagueId}/request-to-become-league-officiate`, {
        athleteId: athleteId,
        leagueId: leagueId,
    });
}

function requestToBecomeTournamentOfficiate(athleteId, tournamentId) {
    return http.post(`athletes/${athleteId}/tournaments/${tournamentId}/request-to-become-tournament-officiate`, {
        athleteId: athleteId,
        tournamentId: tournamentId,
    });
}

function requestToBecomeAssociationOfficiate(athleteId, associationId) {
    return http.post(`athletes/${athleteId}/associations/${associationId}/request-to-become-association-officiate`, {});
}

function registerPushNotificationToken(athleteId, token, device) {
    return http.post(`mobile/athletes/${athleteId}/register-push-notification-token`, {
        athleteId: athleteId,
        token: token,
        device: device
    });
}

function getTeamInvites(athleteId) {
    return http.get(`athletes/${athleteId}/team-invites`);
}

function approveTeamInvite(athleteId, inviteId) {
    return http.put(`athletes/${athleteId}/team-invites/${inviteId}/acceptance`, {
        athleteId: athleteId,
        inviteId: inviteId,
    });
}

function declineTeamInvite(athleteId, inviteId) {
    return http.put(`athletes/${athleteId}/team-invites/${inviteId}/decline`, {
        athleteId: athleteId,
        inviteId: inviteId,
    });
}

function leaveTeam(athleteId, teamId) {
    return http.delete(`athletes/${athleteId}/teams/${teamId}`);
}

function getAthleteJoinedGames(athleteId) {
    return http.get(`athletes/${athleteId}/games`);
}

function followUser(athleteId, befollowedId) {
    return http.post(`athletes/${athleteId}/follow/${befollowedId}`, {
        athleteId: athleteId,
        befollowedId: befollowedId,
        followType: FollowType.Athlete,
    });
}

function unfollowUser(athleteId, befollowedId) {
    return http.delete(`athletes/${athleteId}/follow/${befollowedId}`);
}

function getFollowing(athleteId, name) {
    return http.get(`athletes/${athleteId}/following?name=${name}`);
}

function blockAthlete(athleteId, targetAthleteId) {
    return http.delete(`athletes/${athleteId}/follow/${targetAthleteId}/block`);
}

function unblockAthlete(athleteId, targetAthleteId) {
    return http.delete(`athletes/${athleteId}/blackList/${targetAthleteId}/unblock`);
}

function getTeamJoinRequests(athleteId) {
    return http.get(`athletes/${athleteId}/team-join-request/list`);
}

function getAthleteOfficiateRequests(athleteId) {
    return http.get(`athletes/${athleteId}/officiate-requests`);
}

function getAthleteManagedOrganizations(athleteId) {
    return http.get(`athletes/${athleteId}/managedOrganizations`);
}

function createCalendarReminder(data) {
    return http.post(`athletes/calendar/reminder`, data)
}

function updateCalendarReminder(reminderId, data) {
    return http.put(`athletes/calendar/${reminderId}`, data);
}

function linkCalendarReminder(reminderId, data) {
    return http.put(`mobile/athletes/calendar/reminders/${reminderId}/link`, data);
}

function linkCalendarEvent(postId, data) {
    return http.put(`mobile/athletes/calendar/events/${postId}/link`, data);
}

function deleteCalendarReminder(reminderId) {
    return http.delete(`athletes/calendar/${reminderId}`);
}

function getAthleteSports(athleteId) {
    return http.get(`athletes/${athleteId}/sports`)
}

function setAthleteDefaultSport(athleteId, sport) {
    return http.put(`athletes/${athleteId}/default-sport`, { SportType: sport })
}

function registerToEvent(athleteId, eventId) {
    return http.post(`athletes/${athleteId}/events/${eventId}/registeration`, {
        athleteId: athleteId,
        eventId: eventId
    });
}

function getRentPaymentHistory() {
    return http.get(`athletes/rent-payment-history`);
}

function getPaymentHistory(type) {
    return http.get(`athletes/payment-history?type=${type}`);
}

function getMediaList(athleteId) {
    return http.get(`athletes/${athleteId}/medias`);
}

function addMedia(athleteId, formData) {
    return http.post(`athletes/${athleteId}/medias`, formData);
}

function deleteMedia(athleteId, mediaId) {
    return http.delete(`athletes/${athleteId}/medias/${mediaId}`);
}

function getAthleteManagedAssociations(athleteId) {
    return http.get(`athletes/${athleteId}/managedAssociations`);
}

function getAthletes(name) {
    return http.get(`athletes?userName=${name || ''}`);
}

function removeTournamentOfficiate(athleteId, tournamentId) {
    return http.delete(`athletes/${athleteId}/tournaments/${tournamentId}/delete-tournament-officiate`);
}

function removeLeagueOfficiate(athleteId, leagueId) {
    return http.delete(`athletes/${athleteId}/leagues/${leagueId}/delete-league-officiate`);
}

function removeAssociationOfficiate(athleteId, associationId) {
    return http.delete(`athletes/${athleteId}/associations/${associationId}/delete-association-officiate`);
}

function getAthleteManagedTournaments(athleteId, sportType) {
    return http.get(`athletes/${athleteId}/managedTournaments?sportType=${sportType}`);
}

function getAthleteManagedLeagues(athleteId, sportType) {
    return http.get(`athletes/${athleteId}/managedLeagues?sportType=${sportType}`);
}

function complain(athleteId, data) {
    return http.post(`athletes/${athleteId}/complaint`, data);
}

function deleteAccount(athleteId, passCode) {
    return http.delete(`athletes/${athleteId}/${passCode}`);
}

export default {
    getAthleteById,
    updateProfile,
    getBasketballStats,
    getSoccerStats,
    updateBasketballStats,
    updateSoccerStats,
    updateProfilePicture,
    getAthleteDefaultTeams,
    openToJoinTeam,
    closeToJoinTeam,
    getStatsRange,
    getBasketballShotMaps,
    getSoccerShotMaps,
    getBasketballStatsByRange,
    getSoccerStatsByRange,
    getAthleteDefaultOrganizations,
    getAthleteActiveOrgnizations,
    getAthleteManagedTeams,
    getAtlteteForOfficiateRegistration,
    requestToBecomeLeagueOfficiate,
    requestToBecomeTournamentOfficiate,
    registerPushNotificationToken,
    getTeamInvites,
    approveTeamInvite,
    declineTeamInvite,
    leaveTeam,
    getAthleteJoinedGames,
    followUser,
    unfollowUser,
    getFollowing,
    blockAthlete,
    unblockAthlete,
    getTeamJoinRequests,
    getAthleteOfficiateRequests,
    getAthleteManagedOrganizations,
    createCalendarReminder,
    updateCalendarReminder,
    deleteCalendarReminder,
    getAthleteSports,
    setAthleteDefaultSport,
    requestToBecomeAssociationOfficiate,
    getRentPaymentHistory,
    getPaymentHistory,
    registerToEvent,
    getMediaList,
    addMedia,
    deleteMedia,
    linkCalendarReminder,
    getAthleteManagedAssociations,
    linkCalendarEvent,
    getAthletes,
    removeTournamentOfficiate,
    removeLeagueOfficiate,
    removeAssociationOfficiate,
    getAthleteManagedTournaments,
    getAthleteManagedLeagues,
    complain,
    deleteAccount,
    getLowSportStatsByRange,
    getLowSportStats
};
