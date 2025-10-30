import React, { useState, useEffect } from 'react';
import { teamService } from 'services';
import { Roster } from 'pageComponents';
import { useLocation } from 'react-router-dom';

const TeamPlayersInOrganization = () => {
    const [members, setMembers] = useState([]);
    const location = useLocation();
    const routerParams = location?.state?.params;
    useEffect(() => {
        if (routerParams) {
            getTeamMembers();
        }
    }, [routerParams]);

    const getTeamMembers = async () => {
        let res = null
        if (routerParams.organizationType === "League") {
            res = await teamService.getLeagueTeamRoster(routerParams?.teamId, routerParams.organizationId);
        }

        if (routerParams.organizationType === "Tournament") {
            res = await teamService.getTournamentTeamRoster(routerParams?.teamId, routerParams.organizationId);
        }

        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handleRemoveMember = async (item) => {
        let res = null
        if (routerParams.organizationType === "League") {
            res = await teamService.removeAthleteFromLeague(routerParams?.teamId, routerParams.organizationId, item.id);
        }

        if (routerParams.organizationType === "Tournament") {
            res = await teamService.removeAthleteFromTournament(routerParams?.teamId, routerParams.organizationId, item.id);
        }

        if (res && res.code === 200) {
            getTeamMembers();
        }
    };


    return (<Roster isAdminView={routerParams.isAdminView} isOwnerView={routerParams.isOwnerView} data={members} emptyDataTitle={"No Members"} onRemoveClick={handleRemoveMember} />);
};

export default TeamPlayersInOrganization;