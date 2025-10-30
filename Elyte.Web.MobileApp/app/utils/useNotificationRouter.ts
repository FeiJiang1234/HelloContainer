import { NotificationActions, OrganizationType } from 'el/enums';
import useProfileRoute from './useProfileRoute';

const useNotificationRouter = () => {
    const { goToProfile, goToTeamProfile, goToAthleteProfile, goToGameProfile } = useProfileRoute();

    const getProfileRoute = (action, id) => {
        switch (action) {
            case NotificationActions.AtheleteProfile:
                return goToAthleteProfile(id);
            case NotificationActions.FacilityProfile:
                return goToProfile(OrganizationType.Facility, id);
            case NotificationActions.GameLivePage:
                return goToGameProfile(id);
            case NotificationActions.LeagueProfile:
                return goToProfile(OrganizationType.League, id);
            case NotificationActions.TeamProfile:
                return goToTeamProfile(id);
            case NotificationActions.TournamentProfile:
                return goToProfile(OrganizationType.Tournament, id);
            case NotificationActions.AssociationProfile:
                return goToProfile(OrganizationType.Association, id);
            default:
                return null;
        }
    };

    return { getProfileRoute };
};

export default useNotificationRouter;
