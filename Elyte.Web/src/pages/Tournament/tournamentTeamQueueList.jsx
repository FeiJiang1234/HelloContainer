import React, { useEffect, useState } from 'react';
import { ElTitle, ElBox } from 'components';
import { useHistory } from 'react-router-dom';
import { tournamentService } from 'services';
import IdiographRow from 'parts/Commons/idiographRow';
import { useProfileRoute } from 'utils';

export default function TournamentTeamQueueList () {
    const history = useHistory();
    const tournamentId = history.location.state;
    const [list, setList] = useState([]);
    const { teamProfile } = useProfileRoute();

    useEffect(() => getTournamentTeamQueueList(), []);

    const getTournamentTeamQueueList = async () => {
        const res = await tournamentService.getTournamentTeamQueue(tournamentId);
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