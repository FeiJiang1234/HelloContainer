import React, { useState, useEffect } from 'react';
import { teamService } from 'services';
import { useHistory } from 'react-router-dom';
import { ElBox } from 'components';
import RequestItem from './components/requestItem';

const JoinTeamRequests = () => {
    const history = useHistory();
    const [requests, setRequests] = useState([]);
    const teamId = history.location.state.params;

    useEffect(() => getJoinReqests(), []);

    const getJoinReqests = async () => {
        const res = await teamService.getAthleteJoinTeamRequests(teamId, true);
        if (res && res.code === 200 && res.value) setRequests(res.value);
    }

    return (
        <>
            {
                Array.isNullOrEmpty(requests) && <ElBox center flex={1}>No Requests</ElBox>
            }
            {
                requests.map(item => <RequestItem key={item.id} item={item} onHandleSuccess={() => getJoinReqests()} />)
            }
        </>
    );
};

export default JoinTeamRequests;
