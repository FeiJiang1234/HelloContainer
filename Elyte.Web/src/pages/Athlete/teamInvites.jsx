import React, { useState, useEffect } from 'react';
import { athleteService } from 'services';
import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ElButton, ElBox } from 'components';
import { useProfileRoute } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';

const teamInvites = () => {
    const history = useHistory();
    const [invites, setInvites] = useState([]);
    const athleteId = history.location.state;
    const { teamProfile } = useProfileRoute();

    useEffect(() => getInvites(), []);

    const getInvites = async () => {
        const res = await athleteService.getTeamInvites(athleteId);
        if (res && res.code === 200 && res.value) {
            setInvites(res.value);
        }
    }

    return (
        <Box mt={2}>
            {Array.isNullOrEmpty(invites) && <ElBox mt={2} center flex={1}>No Team Invites</ElBox>}
            {
                invites.length > 0 && invites.map((item) => (
                    <IdiographRow key={item.inviteId}
                        to={teamProfile(item.teamId)}
                        title={item.title}
                        centerTitle={item.centerTitle}
                        subtitle={item.subtitle}
                        imgurl={item.avatarUrl}>
                        <ButtonBox athleteId={athleteId} item={item} onClick={() => getInvites()} />
                    </IdiographRow>
                ))
            }
        </Box>
    );
};

const ButtonBox = ({ athleteId, item, onClick }) => {
    const acceptTeamInvite = async (inviteId) => {
        const res = await athleteService.approveTeamInvite(athleteId, inviteId);
        if (res && res.code === 200 && onClick) {
            onClick();
        }
    };

    const declineTeamInvite = async (inviteId) => {
        const res = await athleteService.declineTeamInvite(athleteId, inviteId);
        if (res && res.code === 200 && onClick) {
            onClick();
        }
    };

    return (
        <>
            <ElButton small onClick={() => acceptTeamInvite(item.inviteId)}>Accept</ElButton>
            <ElButton small onClick={() => declineTeamInvite(item.inviteId)}>Decline</ElButton>
        </>
    );
}

export default teamInvites;
