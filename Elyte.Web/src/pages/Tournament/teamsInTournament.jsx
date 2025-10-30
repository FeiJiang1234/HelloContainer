import React, { useEffect, useState } from 'react';
import { ElTitle, ElSearchBox, ElSwitch, ElButton } from 'components';
import { useLocation, useHistory } from 'react-router-dom';
import { tournamentService, teamService, athleteService, authService } from 'services';
import OrganizationTeams from '../Organization/organizationTeams';

const TeamsInTournament = () => {
    const history = useHistory();
    const location = useLocation();
    const { tournamentId, isAdminView } = location.state;
    const [keyword, setKeyword] = useState('');
    const [showFreeTeam, setShowFreeTeam] = useState(false);
    const [teams, setTeams] = useState([]);
    const [queueLoading, setQueueLoading] = useState(false);
    const currentLoginUser = authService.getCurrentUser();
    const [isJoinQueue, setIsJoinQueue] = useState(false);

    useEffect(() => athleteIsJoinTournamentQueue(), []);

    useEffect(() => getTournamentTeams(), [tournamentId, keyword, showFreeTeam]);

    const getTournamentTeams = async () => {
        const res = await tournamentService.getTournamentTeams(tournamentId, { teamName: keyword, isOpenPosition: showFreeTeam });
        if (res && res.code === 200) {
            setTeams(res.value);
        }
    };

    const athleteIsJoinTournamentQueue = async () => {
        const res = await athleteService.isJoinTournamentQueue(currentLoginUser.id, tournamentId)
        if (res && res.code === 200 && res.value) {
            setIsJoinQueue(true);
        }
    }

    const toggleShowFreeTeam = () => {
        setShowFreeTeam(!showFreeTeam);
    };

    const handleClickQueue = async () => {
        setQueueLoading(true);
        const teamResult = await teamService.getAthleteActiveTeams(currentLoginUser.id);
        const isFreePlayer = teamResult.value.length === 0;
        if (isFreePlayer) {
            const res = await athleteService.joinTournamentQueue(currentLoginUser.id, tournamentId);
            if (res && res.code === 200) {
                athleteIsJoinTournamentQueue();
                history.push("/tournamentQueue", tournamentId);
            }
        }
        setQueueLoading(false);
    };

    const handleAfterRemove = () => {
        getTournamentTeams();
    }

    return (
        <>
            <ElTitle center>Teams in Tournament</ElTitle>
            <ElSearchBox mt={2} mb={2} onChange={setKeyword} />
            <ElSwitch mb={2} on="On" off="Off" isOn={showFreeTeam} text="Show teams with free place" toggle={toggleShowFreeTeam} />
            <OrganizationTeams sx={{ maxHeight: (theme) => `calc(100vh - ${theme.spacing(53)})`, height: (theme) => `calc(100vh - ${theme.spacing(53)})`, marginBottom: '20px' }}
                teams={teams}
                isAdminView={isAdminView}
                organizationType={'Tournament'}
                organizationId={tournamentId}
                onRefresh={handleAfterRemove} />
            {
                !isAdminView && !isJoinQueue && <ElButton loading={queueLoading} onClick={handleClickQueue}>Queue</ElButton>
            }
        </>
    );
};

export default TeamsInTournament;
