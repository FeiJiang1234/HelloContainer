import React, { useState, useEffect, useRef } from 'react';
import { ElBox, ElSvgIcon, ElMenu } from 'components';
import { Box, MenuItem } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { teamService } from 'services';
import IdiographRow from 'parts/Commons/idiographRow';
import { useProfileRoute } from 'utils';

const TeamJoinedOrganizationList = ({ teamId, sportType, isAdminView }) => {
    const [organizationList, setOrganizationList] = useState([]);

    useEffect(() => getOrangizations(), [teamId]);

    const getOrangizations = async () => {
        const res = await teamService.getTeamJoinedOrganizations(teamId);
        if (res && res.code === 200) {
            setOrganizationList(res.value);
        }
    }

    return (
        <Box mt={2}>
            {
                Array.isNullOrEmpty(organizationList) && <ElBox center>Not Joined Any Organizations</ElBox>
            }
            {
                !Array.isNullOrEmpty(organizationList) &&
                organizationList.map((item) => <OrganizationItem teamId={teamId} key={item.id} item={item} isAdminView={isAdminView} sportType={sportType} />)
            }
        </Box >
    );
};

export default TeamJoinedOrganizationList;


const OrganizationItem = ({ teamId, sportType, item, isAdminView }) => {
    const menuRef = useRef();
    const history = useHistory();
    const { getProfileUrl } = useProfileRoute();

    const handleShowMenuClick = (e) => {
        e.stopPropagation();
        menuRef.current.open(e.currentTarget);
    };

    const handleViewPlayers = async (e) => {
        menuRef.current.close();
        e.stopPropagation();
        history.push("/organizationTeamLineUp", { teamId: teamId, organizationId: item.id, organizationType: item.organizationType, isAdminView: isAdminView, sportType: sportType });
    }

    return (
        <>
            <IdiographRow key={item.statTrackerId}
                to={getProfileUrl(item.organizationType, item.id)}
                title={item.name}
                subtitle={`${item.organizationType}, ${item.address}`}
                imgurl={item.imageUrl}>
                <Box alignSelf="flex-start">
                    <ElSvgIcon light small name="options" onClick={handleShowMenuClick} />
                </Box>
                <ElMenu ref={menuRef}>
                    <MenuItem onClick={handleViewPlayers}>View Players</MenuItem>
                </ElMenu>
            </IdiographRow>
        </>
    )
}