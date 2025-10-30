import React, { useEffect, useState } from 'react';
import { ElTitle, ElSearchBox, ElSwitch, ElButton } from 'components';
import { useLocation, useHistory } from 'react-router-dom';
import { leagueService, authService, athleteService, teamService } from 'services';
import OrganizationTeams from './../Organization/organizationTeams';

const TeamsInLeague = () => {
    const history = useHistory();
    const location = useLocation();
    const currentLoginUser = authService.getCurrentUser();
    const { leagueId, isAdminView } = location.state;
    const [keyword, setKeyword] = useState('');
    const [showFreeTeam, setShowFreeTeam] = useState(false);
    const [teams, setTeams] = useState([]);
    const [queueLoading, setQueueLoading] = useState(false);
    const [isJoinQueue, setIsJoinQueue] = useState(false);

    useEffect(() => athleteIsJoinLeagueQueue(), []);

    useEffect(() => getLeagueTeams(), [leagueId, keyword, showFreeTeam]);

    const getLeagueTeams = async () => {
        const res = await leagueService.getLeagueTeams(leagueId, { teamName: keyword, isOpenPosition: showFreeTeam });
        if (res && res.code === 200) {
            setTeams(res.value);
        }
    };

    const athleteIsJoinLeagueQueue = async () => {
        const res = await athleteService.isJoinLeagueQueue(currentLoginUser.id, leagueId)
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
            const res = await athleteService.joinLeagueQueue(currentLoginUser.id, leagueId);
            if (res && res.code === 200) {
                athleteIsJoinLeagueQueue();
                history.push("/leagueQueue", leagueId);
            }
        }
        setQueueLoading(false);
    };

    const handleAfterRemove = () => {
        getLeagueTeams();
    }


    return (
        <>
            <ElTitle center>Teams in League</ElTitle>
            <ElSearchBox mt={2} mb={2} onChange={setKeyword} />
            <ElSwitch mb={2} on="On" off="Off" isOn={showFreeTeam} text="Show teams with free place" toggle={toggleShowFreeTeam} />
            <OrganizationTeams sx={{ maxHeight: (theme) => `calc(100vh - ${theme.spacing(53)})`, marginBottom: '20px' }}
                teams={teams}
                isAdminView={isAdminView}
                organizationType={'League'}
                organizationId={leagueId}
                onRefresh={handleAfterRemove} />
            {
                !isAdminView && !isJoinQueue && <ElButton loading={queueLoading} onClick={handleClickQueue}>Queue</ElButton>
            }
        </>
    );
};

export default TeamsInLeague;
