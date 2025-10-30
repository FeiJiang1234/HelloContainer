import { teamService } from 'el/api';
import { ElScrollContainer, ElTitle } from 'el/components';
import { useGoBack } from 'el/utils';
import React, { useEffect, useState } from 'react';
import RequestItem from './components/RequestItem';

export default function JoinTeamRequestScreen({ route }) {
    useGoBack();
    const { id } = route.params;
    const [requestingMembers, setRequestingMembers] = useState<any[]>([]);

    useEffect(() => {
        getJoinReqests();
    }, []);

    const getJoinReqests = async () => {
        const res: any = await teamService.getAthleteJoinTeamRequests(id, true);
        if (res && res.code === 200 && res.value) setRequestingMembers(res.value);
    };

    return (
        <ElScrollContainer mt={1}>
            <ElTitle>Team Join Requests</ElTitle>
            {requestingMembers.length !== 0 && (
                <>
                    {requestingMembers.map(member => (
                        <RequestItem
                            key={member.id}
                            item={member}
                            onHandleSuccess={() => getJoinReqests()}
                        />
                    ))}
                </>
            )}
        </ElScrollContainer>
    );
}
