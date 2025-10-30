import { NotificationAction } from 'enums';
const useNotificationRouter = () => {
    const getProfileRoute = (action, id) => {
        switch (action) {
            case NotificationAction.AtheleteProfile:
                return { pathname: '/myProfile', state: { params: id } };
            case NotificationAction.FacilityProfile:
                return { pathname: '/facilityProfile', state: { params: id } };
            case NotificationAction.GameLivePage:
                return { pathname: '/gameProfile', state: { params: { id: id } } };
            case NotificationAction.LeagueProfile:
                return { pathname: '/leagueProfile', state: { params: id } };
            case NotificationAction.TeamProfile:
                return { pathname: '/teamProfile', state: { params: id } };
            case NotificationAction.TournamentProfile:
                return { pathname: '/tournamentProfile', state: { params: id } };
            case NotificationAction.AssociationProfile:
                return { pathname: '/associationProfile', state: { params: id } };
            default:
                return null;
        }
    };

    return { getProfileRoute };
}

export default useNotificationRouter;