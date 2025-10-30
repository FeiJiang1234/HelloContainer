import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { tournamentService } from 'services';
import OrganizationFacilities from './../Organization/organizationFacilities';

const TournamentFacilities = () => {
    const location = useLocation();
    const tournamentId = location.state.params;
    const [facilities, setFacilities] = useState([]);

    useEffect(() => getLeagueFacilities(), [tournamentId]);

    const getLeagueFacilities = async () => {
        const res = await tournamentService.getRentedFacilitiesForTournament(tournamentId);
        if (res && res.code === 200) {
            setFacilities(res.value);
        }
    }

    return (
        <>
            <OrganizationFacilities facilities={facilities} />
        </>
    );
};

export default TournamentFacilities;