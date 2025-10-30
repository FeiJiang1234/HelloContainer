import React from 'react';
import { ElButton, ElSvgIcon, ElMenuBtn } from 'components';
import { useProfileRoute } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';
import { teamService } from 'services';

const RequestItem = ({ item, onHandleSuccess }) => {
    const { athleteProfile } = useProfileRoute();
    const menuItems = [
        { text: 'Decline', onClick: () => handleDeclineClick() },
        { text: 'Block User', onClick: () => handleBlockAthleteClick() }
    ];

    const handleDeclineClick = async () => {
        const res = await teamService.rejectAthleteJoinRequest(item.teamId, item.id);
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    }

    const handleBlockAthleteClick = async () => {
        const res = await teamService.blockAthleteToJoinTeam(item.teamId, item.id, item.athleteId);
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    }

    const handleAcceptClick = async () => {
        const res = await teamService.approveAthleteJoinRequest(item.teamId, item.id);
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    }
    return <IdiographRow
        title={item.name}
        subtitle={item.status}
        imgurl={item.pictureUrl}
        to={athleteProfile(item.athleteId)}
    >
        <ElButton small onClick={handleAcceptClick}>Accept</ElButton>
        <ElMenuBtn items={menuItems}>
            <ElSvgIcon light small name="options" />
        </ElMenuBtn>
    </IdiographRow>
}


export default RequestItem; 