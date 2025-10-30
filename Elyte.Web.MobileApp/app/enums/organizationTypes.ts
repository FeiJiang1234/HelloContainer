import routes from 'el/navigation/routes';

export const OrganizationType = {
    League: 'League',
    Tournament: 'Tournament',
    Facility: 'Facility',
    Association: 'Association',
};

export const organizationTypes = [
    { value: 'association', label: 'Association', router: routes.AssociationCreate },
    { value: 'league', label: 'League', router: routes.LeagueCreate },
    { value: 'tournament', label: 'Tournament', router: routes.TournamentCreate },
    { value: 'facility', label: 'Facility', router: routes.FacilityCreate },
];
