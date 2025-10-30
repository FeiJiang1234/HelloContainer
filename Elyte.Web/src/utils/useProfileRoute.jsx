export default function useProfileRoute () {
    const teamProfile = id => ({ pathname: '/teamProfile', state: { params: id } });
    const leagueProfile = id => ({ pathname: '/leagueProfile', state: { params: id } });
    const tournamentProfile = id => ({ pathname: '/tournamentProfile', state: { params: id } });
    const facilityProfile = id => ({ pathname: '/facilityProfile', state: { params: id } });
    const athleteProfile = id => ({ pathname: '/myProfile', state: { params: id } });
    const eventProfile = id => ({ pathname: '/eventProfile', state: { params: id } });
    const associationProfile = id => ({ pathname: '/associationProfile', state: { params: id } });

    const getProfileUrl = (type, id) => {
        switch (type) {
            case "League":
                return leagueProfile(id);
            case "Tournament":
                return tournamentProfile(id);
            case "Association":
                return associationProfile(id);
            case "Facility":
                return facilityProfile(id);
        }
    };

    return {
        teamProfile,
        leagueProfile,
        tournamentProfile,
        facilityProfile,
        athleteProfile,
        eventProfile,
        associationProfile,
        getProfileUrl
    };
}
