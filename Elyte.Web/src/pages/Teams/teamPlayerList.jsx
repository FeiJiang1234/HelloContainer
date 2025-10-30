import React, { useState, useEffect } from 'react';
import { Box, Divider } from '@mui/material';
import { ElBox, ElButton } from 'components';
import { useLocation } from 'react-router-dom';
import { teamService } from 'services';
import { Idiograph } from 'parts';
import { useProfileRoute } from 'utils';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
}));

const TeamPlayerList = () => {
    const classes = useStyles();
    const [members, setMembers] = useState([]);
    const location = useLocation();
    const routerParams = location?.state?.params;
    const { athleteProfile } = useProfileRoute();

    useEffect(() => {
        getTeamMembers();
    }, [routerParams]);

    const getTeamMembers = async () => {
        if (!routerParams?.teamId) {
            return;
        }

        const res = await teamService.getTeamPlayersByOrganizationId(routerParams.teamId, routerParams.organizationId, routerParams.organizationType);
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    return (
        <Box mt={2}>
            {
                Array.isNullOrEmpty(members) &&
                <ElBox mt={2} center flex={1}>No Team Players</ElBox>
            }
            {
                !Array.isNullOrEmpty(members) && members.map((item) => (
                    <Box key={item.id} >
                        <Box className={classes.wrapper}>
                            {
                                item.isBlankAccount &&
                                <Idiograph title={item.title} to={null} centerTitle={`ID: ${item.blankAccountCode}`} imgurl={item.avatarUrl} />
                            }
                            {
                                !item.isBlankAccount &&
                                <Idiograph to={athleteProfile(item.id)} title={item.title} centerTitle={item.centerTitle} subtitle={item.subtitle} imgurl={item.avatarUrl} />
                            }
                            <Box mt={1}>
                                {
                                    !item.isJoinOrganization &&
                                    <AssignButton athleteId={item.id} teamId={routerParams.teamId}
                                        organizationType={routerParams.organizationType}
                                        organizationId={routerParams.organizationId}
                                        onAssignSuccess={getTeamMembers}
                                    />
                                }
                                {item.isJoinOrganization && <ElBox>Joined</ElBox>}
                            </Box>
                        </Box>

                        <Divider className='mt-16 mb-16' />
                    </Box>
                ))
            }
        </Box>
    );
};

const AssignButton = ({ athleteId, teamId, organizationType, organizationId, onAssignSuccess }) => {
    const handleAssignClick = async () => {
        let res = null
        if (organizationType === "League") {
            res = await teamService.assignAthleteToLeague(teamId, organizationId, athleteId);
        }

        if (organizationType === "Tournament") {
            res = await teamService.assignAthleteToTournament(teamId, organizationId, athleteId);
        }

        if (res && res.code === 200 && onAssignSuccess) {
            onAssignSuccess();
        }
    }
    return (<ElButton small name="close" onClick={handleAssignClick}>Assign</ElButton>);
}

export default TeamPlayerList;