import React, { useState, useEffect } from 'react';
import { leagueService, tournamentService, associationService } from 'services';
import { ElBox, ElTitle } from 'components';
import RequestItem from './components/requestItem';
import { useLocation } from 'react-router-dom';
const OfficiateRequests = () => {
    const location = useLocation();
    const routerParams = location.state.params;
    const [officiateRequestList, setOfficiateRequestList] = useState([]);

    useEffect(() => getOfficiateRequests(), []);

    const buildOfficiateRequestService = () => {
        if (routerParams.type === "League") {
            return leagueService.getLeagueOfficiateRequests(routerParams.id, true);
        }

        if (routerParams.type === "Tournament") {
            return tournamentService.getTournamentOfficiateRequests(routerParams.id, true);
        }

        if (routerParams.type === "Association") {
            return associationService.getAssociationOfficiateRequests(routerParams.id, true);
        }
    }

    const getOfficiateRequests = async () => {
        const res = await buildOfficiateRequestService();
        if (res && res.code === 200) {
            setOfficiateRequestList(res.value);
        }
    }

    return (
        <>
            <ElTitle center>Officiate Requests</ElTitle>
            {
                Array.isNullOrEmpty(officiateRequestList) && <ElBox center flex={1}>No Officiate Requests</ElBox>
            }
            {
                officiateRequestList.map(item => <RequestItem key={item.requestId} organizationType={routerParams.type} organizationId={routerParams.id} item={item} onHandleSuccess={() => getOfficiateRequests()} />)
            }
        </>
    );
};


export default OfficiateRequests;
