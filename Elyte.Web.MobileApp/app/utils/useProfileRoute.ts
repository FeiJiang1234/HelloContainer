import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import routes from 'el/navigation/routes';
import { APPEND_ROUTE } from 'el/store/slices/routeSlice';
import useAuth from './useAuth';

export default function useProfileRoute() {
    const navigation: any = useNavigation();
    const { name, params } = useRoute<any>();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const goToProfile = (type, id) => {
        if (type === 'League') {
            saveCurrentRouteForGoback(routes.LeagueProfile);
            navigation.navigate(routes.Organization, {
                screen: routes.LeagueProfile,
                params: { id: id },
                initial: false,
            });
        }
        if (type === 'Tournament') {
            saveCurrentRouteForGoback(routes.TournamentProfile);
            navigation.navigate(routes.Organization, {
                screen: routes.TournamentProfile,
                params: { id: id },
                initial: false,
            });
        }
        if (type === 'Association') {
            saveCurrentRouteForGoback(routes.AssociationProfile);
            navigation.navigate(routes.Organization, {
                screen: routes.AssociationProfile,
                params: { id: id },
                initial: false,
            });
        }
        if (type === 'Facility') {
            saveCurrentRouteForGoback(routes.FacilityProfile);
            navigation.navigate(routes.Organization, {
                screen: routes.FacilityProfile,
                params: { id: id },
                initial: false,
            });
        }
    };

    const getTab = () => {
        const parent = navigation.getParent();
        const tabState = parent.getState();
        const currentTab = tabState.routes[tabState.index];
        return currentTab.name;
    };

    const saveCurrentRouteForGoback = toScreen => {
        dispatch(
            APPEND_ROUTE({
                route: getTab(),
                param: {
                    screen: name,
                    params: params,
                },
                toScreen: toScreen,
            }),
        );
    };

    const goToAthleteProfile = id => {
        if (id === user.id) {
            saveCurrentRouteForGoback(routes.MyProfile);
            navigation.navigate(routes.MyProfile);
        } else {
            saveCurrentRouteForGoback(routes.AthleteProfile);
            navigation.navigate(routes.Team, {
                screen: routes.AthleteProfile,
                params: { id: id },
                initial: false,
            });
        }
    };

    const goToTeamProfile = id => {
        saveCurrentRouteForGoback(routes.TeamProfile);
        navigation.navigate(routes.Team, {
            screen: routes.TeamProfile,
            params: { id: id },
            initial: false,
        });
    };

    const goToEventProfile = id => {
        saveCurrentRouteForGoback(routes.EventProfile);
        navigation.navigate(routes.Calendar, {
            screen: routes.EventProfile,
            params: { id: id },
            initial: false,
        });
    };

    const goToGameProfile = id => {
        saveCurrentRouteForGoback(routes.GameProfile);
        navigation.navigate(routes.Organization, {
            screen: routes.GameProfile,
            params: { id: id },
            initial: false,
        });
    };

    const goToGamePost = (id, sportType) => {
        saveCurrentRouteForGoback(routes.GamePost);
        navigation.navigate(routes.Organization, {
            screen: routes.GamePost,
            params: { gameId: id, gameSportType: sportType },
            initial: false,
        });
    };

    return {
        goToProfile,
        goToAthleteProfile,
        goToTeamProfile,
        goToEventProfile,
        saveCurrentRouteForGoback,
        goToGameProfile,
        goToGamePost
    };
}
