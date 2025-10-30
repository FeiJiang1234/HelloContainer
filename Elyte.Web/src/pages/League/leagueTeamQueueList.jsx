import React, { useEffect, useState } from 'react';
import { ElTitle, ElBox } from 'components';
import { useHistory } from 'react-router-dom';
import { leagueService } from 'services';
import { useProfileRoute } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';

export default function LeagueTeamQueueList () {
    const history = useHistory();
    const leagueId = history.location.state;
    const [list, setList] = useState([]);
    const { teamProfile } = useProfileRoute();

    useEffect(() => getLeagueTeamQueueList(), []);

    const getLeagueTeamQueueList = async () => {
        const res = await leagueService.getLeagueTeamQueue(leagueId);
        if (res && res.code === 200 && res.value) {
            setList(res.value);
        }
    };

    return (
        <>
            <ElTitle center>Queue List</ElTitle>
            {
                Array.isNullOrEmpty(list) && <ElBox center flex={1}>No Team</ElBox>
            }
            {
                list.map((item, index) => <IdiographRow key={index} noDivider to={teamProfile(item.id)} title={item.title} centerTitle={item.centerTitle} subtitle={item.subtitle} imgurl={item.avatarUrl} />)
            }
        </>
    )

}