import React, { useEffect, useState } from 'react';
import { ElTitle, ElBox } from 'components';
import { ChatMessageButton } from 'pageComponents';
import { useHistory } from 'react-router-dom';
import { tournamentService } from 'services';
import IdiographRow from 'parts/Commons/idiographRow';
import { useProfileRoute } from 'utils';
import { ChatType } from 'enums';

export default function TournamentQueueList () {
    const history = useHistory();
    const tournamentId = history.location.state;
    const [list, setList] = useState([]);
    const { athleteProfile } = useProfileRoute();

    useEffect(() => getTournamentQueueList(), []);

    const getTournamentQueueList = async () => {
        const res = await tournamentService.getTournamentQueue(tournamentId);
        if (res && res.code === 200 && res.value) {
            setList(res.value);
        }
    };

    return (
        <>
            <ElTitle center>Queue List</ElTitle>
            {Array.isNullOrEmpty(list) && <ElBox center flex={1}>No athlete</ElBox>}
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