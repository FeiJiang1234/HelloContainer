import React, { useEffect, useState } from 'react';
import { ElLink, ElTabTitle } from 'components';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { leagueService } from 'services';
import OrganizationTeams from './../Organization/organizationTeams';

const LeagueTeams = ({ isAdminView, isLeagueGameStarted }) => {
    const location = useLocation();
    const leagueId = location.state.params;
    const [teams, setTeams] = useState([]);

    useEffect(() => getLeagueTeams(), [leagueId]);

    const getLeagueTeams = async () => {
        const res = await leagueService.getLeagueTeams(leagueId);
        if (res && res.code === 200) {
            setTeams(res.value);
        }
    };

    const handleAfterRemove = () => {
        getLeagueTeams();
    }

    return (
        <>
            {
                !Array.isNullOrEmpty(teams) &&
                <Box mb={2} mt={2} className='flex-sb'>
                    <ElTabTitle>Teams in League</ElTabTitle>
                    <ElLink green to={{ pathname: '/teamsInLeague', state: { leagueId: leagueId, isAdminView: isAdminView, isLeagueGameStarted: isLeagueGameStarted } }}>
                        See All
                    </ElLink>
                </Box>
            }
            <OrganizationTeams teams={teams} isAdminView={isAdminView} organizationType={'League'} organizationId={leagueId} onRefresh={handleAfterRemove} />
        </>
    );
};

export default LeagueTeams;
