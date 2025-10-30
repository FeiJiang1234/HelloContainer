import React, { useEffect, useState } from 'react';
import { ElBox, ElButton, ElSearchBox } from 'components';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { tournamentService, leagueService, teamService, associationService, facilityService } from 'services';
import { useProfileRoute } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';

const GetAllUsersToSelectAdmin = () => {
    const location = useLocation();
    const id = location.state.params.id;
    const type = location.state.params.type;
    const [userList, setUserList] = useState([]);
    const { athleteProfile } = useProfileRoute();
    const [keyword, setKeyword] = useState('');

    useEffect(() => getUserList(), [keyword, id]);

    const getAllUsers = async (organizationType) => {
        if (organizationType === 'Team') {
            return teamService.getAllTeamMembersNotTeamAdmin(id, keyword);
        }

        if (organizationType === 'Tournament') {
            return tournamentService.getAllUsersNotTournamentAdmin(id, keyword);
        }

        if (organizationType === 'League') {
            return leagueService.getAllUsersNotLeagueAdmin(id, keyword);
        }

        if (organizationType === 'Association') {
            return associationService.getAllUsersNotAssociationAdmin(id, keyword);
        }

        if (organizationType === 'Facility') {
            return facilityService.getAllUsersNotFacilityAdmin(id, keyword);
        }
    };

    const getUserList = async () => {
        if (!type) { return; }
        const res = await getAllUsers(type)
        if (res && res.code === 200) {
            setUserList(res.value);
        }
    }

    const AssignService = async (item) => {
        if (type === 'Team') {
            return teamService.assignTeamAdmin(id, item.id);
        }
        if (type === 'Tournament') {
            return tournamentService.assignTournamentAdmin(id, item.id);
        }
        if (type === 'League') {
            return leagueService.assignLeagueAdmin(id, item.id);
        }
        if (type === 'Association') {
            return associationService.assignAssociationAdmin(id, item.id);
        }
        if (type === 'Facility') {
            return facilityService.assignFacilityAdmin(id, item.id);
        }
    }

    const handleAssignClick = async (item) => {
        const res = await AssignService(item)
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

export default GetAllUsersToSelectAdmin;
