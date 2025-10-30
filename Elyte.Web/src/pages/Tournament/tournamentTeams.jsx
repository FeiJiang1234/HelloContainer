import React, { useEffect, useState } from 'react';
import { ElLink, ElTabTitle } from 'components';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { tournamentService } from 'services';
import OrganizationTeams from '../Organization/organizationTeams';

const TournamentTeams = ({ isAdminView, isTournamentGameStarted }) => {
    const location = useLocation();
    const tournamentId = location.state.params;
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        getTournamentTeams();
    }, [tournamentId]);

    const getTournamentTeams = async () => {
        const res = await tournamentService.getTournamentTeams(tournamentId);
        if (res && res.code === 200) {
            setTeams(res.value);
        }
    };

    const handleAfterRemove = () => {
        getTournamentTeams();
    }

    return (
        <>
            {
                !Array.isNullOrEmpty(teams) &&
                <Box mb={2} mt={2} className='flex-sb'>
                    <ElTabTitle>Teams in Tournament</ElTabTitle>
                    <ElLink green to={{ pathname: '/teamsInTournament', state: { tournamentId: tournamentId, isAdminView: isAdminView, isTournamentGameStarted: isTournamentGameStarted } }}>
                        See All
                    </ElLink>
                </Box>
            }
            <OrganizationTeams teams={teams} isAdminView={isAdminView} organizationType={'Tournament'} organizationId={tournamentId} onRefresh={handleAfterRemove} />
        </>
    );
};

export default TournamentTeams;
