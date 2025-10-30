import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { leagueService } from 'services';
import OrganizationFacilities from './../Organization/organizationFacilities';

const LeagueFacilities = () => {
    const location = useLocation();
    const leagueId = location.state.params;
    const [facilities, setFacilities] = useState([]);

    useEffect(() => getLeagueFacilities(), [leagueId]);

    const getLeagueFacilities = async () => {
        const res = await leagueService.getRentedFacilitiesForLeague(leagueId);
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

export default LeagueFacilities;