import React, { useEffect, useState } from 'react';
import { ElBox, ElButton, ElSearchBox } from 'components';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { tournamentService, leagueService } from 'services';
import { useProfileRoute } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';

const GetAllUsersToSelectCoordinator = () => {
    const location = useLocation();
    const id = location.state.params.id;
    const type = location.state.params.type;
    const [userList, setUserList] = useState([]);
    const { athleteProfile } = useProfileRoute();
    const [keyword, setKeyword] = useState('');

    useEffect(() => getUserList(), [id, keyword]);

    const getAllUsers = async (organizationType) => {
        if (organizationType === 'Tournament') {
            return tournamentService.getAllUsersNotTournamentCoordinator(id, keyword);
        }
        if (organizationType === 'League') {
            return leagueService.getAllUsersNotLeagueCoordinator(id, keyword);
        }
    };

    const getUserList = async () => {
        if (!type) { return; }
        const res = await getAllUsers(type)
        if (res && res.code === 200) {
            setUserList(res.value);
        }
    }

    const assignService = async (item) => {
        if (type === 'Tournament') {
            return tournamentService.assignTournamentCoordinator(id, item.id);
        }
        if (type === 'League') {
            return leagueService.assignLeagueCoordinator(id, item.id);
        }
    }

    const handleAssignClick = async (item) => {
        const res = await assignService(item)
        if (res && res.code === 200) {
            getUserList();
        }
    }

    return (
        <Box>
            <ElSearchBox mt={2} mb={2} onChange={setKeyword} />
            {
                Array.isNullOrEmpty(userList) && <ElBox center flex={1}>No Users</ElBox>
            }
            {
                !Array.isNullOrEmpty(userList) && userList.map((item, index) => (
                    <IdiographRow key={item.id + index} to={athleteProfile(item.id)} title={item.title} imgurl={item.avatarUrl} centerTitle={item.centerTitle} subtitle={item.subtitle}>
                        <ElButton small onClick={() => handleAssignClick(item)}>Assign</ElButton>
                    </IdiographRow>
                ))
            }
        </Box>
    );
};

export default GetAllUsersToSelectCoordinator;