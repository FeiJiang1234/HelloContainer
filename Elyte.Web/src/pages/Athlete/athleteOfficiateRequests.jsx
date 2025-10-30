import React, { useState, useEffect } from 'react';
import { athleteService } from 'services';
import { Box } from '@mui/material';
import { useTheme } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { ElBox } from 'components';
import { useProfileRoute } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';

const AthleteOfficiateRequests = () => {
    const theme = useTheme();
    const history = useHistory();
    const [requests, setRequests] = useState([]);
    const athleteId = history.location.state.params.id;
    const { getProfileUrl } = useProfileRoute();

    useEffect(() => {
        getJoinReqests();
    }, [athleteId]);

    const getJoinReqests = async () => {
        const res = await athleteService.getAthleteOfficiateRequests(athleteId);
        if (res && res.code === 200 && res.value) {
            setRequests(res.value);
        }
    }


    return (
        <Box mt={2}>
            {
                Array.isNullOrEmpty(requests) && <ElBox center flex={1}>No Requests</ElBox>
            }
            {
                requests.map(item =>
                    <IdiographRow key={item.requestId}
                            to={getProfileUrl(item.organizationType, item.organizationId)} 
                            title={item.organizationName} 
                            subtitle={`${item.organizationType}, ${item.address}`} 
                            imgurl={item.pictureUrl}>
                         <Box style={{ color: theme.palette.body.main }}>{item.status}</Box>
                    </IdiographRow>
                )
            }
        </Box>
    );
};

export default AthleteOfficiateRequests;
