import React, { useState, useEffect } from 'react';
import { teamService } from 'services';
import { useHistory } from 'react-router-dom';
import { ElButton, ElBox, ElSearchBox } from 'components';
import IdiographRow from 'parts/Commons/idiographRow';
import { useProfileRoute } from 'utils';

const InvitePlayers = () => {
    const history = useHistory();
    const teamId = history.location.state.params;
    const { athleteProfile } = useProfileRoute();
    const [players, setPlayers] = useState([]);
    const [keyword, setKeyword] = useState("");

    useEffect(() => getPlayers(), []);

    const getPlayers = async (userName) => {
        const res = await teamService.getAthleteToBeInvited(teamId, userName);
        if (res && res.code === 200 && res.value) setPlayers(res.value);
    }

    const handleInviteClick = async player => {
        const res = await teamService.invitePlayerJoinTeam(teamId, player.id);
        if (res && res.code == 200) {
            await getPlayers(keyword);
        }
    };

    const handleKeywordChange = (inputKeyword) => {
        setKeyword(inputKeyword);
        getPlayers(inputKeyword);
    }


    return (
        <>
            <ElSearchBox mb={4} onChange={handleKeywordChange} />
            {
                Array.isNullOrEmpty(players) && <ElBox center flex={1}>No Open Players</ElBox>
            }
            {players.map((item) => (
                <IdiographRow key={item.id} to={athleteProfile(item.id)} title={item.title} subtitle={item.subtitle} centerTitle={item.centerTitle} imgurl={item.avatarUrl}>
                    <ElButton small onClick={() => handleInviteClick(item)}>Invite</ElButton>
                </IdiographRow>
            ))}
        </>
    );
};

export default InvitePlayers;
