import React, { useEffect, useState } from 'react';
import { ElTitle, ElBox } from 'components';
import { ChatMessageButton } from 'pageComponents';
import { useHistory } from 'react-router-dom';
import { leagueService } from 'services';
import { useProfileRoute } from 'utils';
import { ChatType } from 'enums';
import IdiographRow from 'parts/Commons/idiographRow';

export default function LeagueQueueList () {
    const history = useHistory();
    const leagueId = history.location.state;
    const [list, setList] = useState([]);
    const { athleteProfile } = useProfileRoute();

    useEffect(() => getLeagueQueueList(), []);

    const getLeagueQueueList = async () => {
        const res = await leagueService.getLeagueQueue(leagueId);
        if (res && res.code === 200 && res.value) {
            setList(res.value);
        }
    };

    return (
        <>
            <ElTitle center>Queue List</ElTitle>
            {Array.isNullOrEmpty(list) && <ElBox center flex={1}>No athletes</ElBox>}
            {
                list.map((item, index) => (
                    <IdiographRow key={item.id + index} to={athleteProfile(item.id)} noDivider title={item.title} subtitle={item.subtitle} centerTitle={item.centerTitle} imgurl={item.avatarUrl} >
                        <ChatMessageButton toUserId={item.id} chatType={ChatType.Personal} />
                    </IdiographRow>
                ))
            }
        </>
    )
}