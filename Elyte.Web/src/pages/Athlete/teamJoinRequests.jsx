import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { ElBox } from 'components';
import IdiographRow from 'parts/Commons/idiographRow';
import { useDateTime, useProfileRoute } from 'utils';
import { athleteService } from 'services';

const TeamJoinRequests = () => {
    const history = useHistory();
    const athleteId = history.location.state;
    const theme = useTheme();
    const { teamProfile } = useProfileRoute();
    const { utcToLocalDatetime } = useDateTime();
    const [joinTeamRequests, setJoinTeamRequests] = useState([]);

    useEffect(() => getJoinTeamRequests(), []);

    const getJoinTeamRequests = async () => {
        const res = await athleteService.getTeamJoinRequests(athleteId);
        if (res && res.code === 200 && res.value) {
            setJoinTeamRequests(res.value);
        }
    }

    return (
        <Box mt={2}>
            {Array.isNullOrEmpty(joinTeamRequests) && <ElBox mt={2} center flex={1}>No Requests</ElBox>}
            {
                !Array.isNullOrEmpty(joinTeamRequests) && joinTeamRequests.map((item) =>
                    <IdiographRow key={item.id}
                        to={teamProfile(item.teamId)}
                        title={item.teamName}
                        subtitle={utcToLocalDatetime(item.subtitle)}
                        centerTitle={item.centerTitle}
                        imgurl={item.avatarUrl}>
                        <Box style={{ color: theme.palette.body.main }}>{item.status}</Box>
                    </IdiographRow>
                )
            }
        </Box>
    );
};

export default TeamJoinRequests;
