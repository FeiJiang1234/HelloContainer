import React, { useEffect, useState } from 'react';
import { ElBox, ElButton, ElSvgIcon, ElBody, ElImageUploader, ElAddress, ElAvatar, ElMenuBtn, ElDialog } from 'components';
import { Box, Typography, Divider } from '@mui/material';
import { useLocation, useHistory } from 'react-router-dom';
import { teamService, authService, athleteService } from 'services';
import TeamProfileTab from './teamProfileTab';
import { FollowType } from 'enums';
import { ChatMessageButton, LevelBar } from 'pageComponents';
import { ChatType } from 'enums';
import { styled } from '@mui/system';

const Container = styled(Box)(({ theme }) => { return { display: 'flex', gap: theme.spacing(1) }; });
const ItemInfo = styled(Typography)(({ theme }) => { return { fontSize: '12px', color: theme.palette.body.main, justifyContent: 'initial' }; });

export default function TeamProfile () {
    const history = useHistory();
    const currentUser = authService.getCurrentUser();
    const location = useLocation();
    const [profile, setProfile] = useState({});
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const teamId = location?.state?.params;
    const menuItems = [
        { text: 'Invite Players', onClick: () => history.push('/invitePlayersJoinTeam', { params: profile.id }) },
        { text: 'Make an Admin', onClick: () => history.push("/getAllUsersToSelectAdmin", { params: { id: profile.id, type: 'Team' } }), hide: !profile.isOwner },
        { text: 'Delete', onClick: () => setShowDeleteDialog(true), hide: !profile.isOwner }
    ];

    useEffect(() => getMyTeamProfile(), []);

    const getMyTeamProfile = async () => {
        const res = await teamService.getTeamProfile(teamId);
        if (res && res.code === 200) setProfile(res.value);
    }

    const handleImageSelect = async (image) => {
        const res = await teamService.updateTeamProfilePicture(teamId, image.file);
        if (res && res.code === 200) getMyTeamProfile();
    }

    const handleJoinTeamClick = async team => {
        const res = await teamService.athleteRequestToJoinTeam(currentUser.id, team.id);
        if (res && res.code === 200) getMyTeamProfile();
    };

    const handleEditTeamClick = () => history.push('/editTeamProfile', { params: profile });

    const handleFollowClick = async () => {
        const res = await athleteService.followOrganization(currentUser.id, profile.id, FollowType.Team);
        if (res && res.code === 200) getMyTeamProfile();
    };

    const handleUnfollowClick = async () => {
        const res = await athleteService.unfollowOrganization(currentUser.id, profile.id);
        if (res && res.code === 200) getMyTeamProfile();
    };

    const handleYesToDeleteClick = async () => {
        const res = await teamService.deleteTeam(teamId);
        if (res && res.code === 200) {
            setShowDeleteDialog(false);
            history.push('/');
        }
    }

    return (
        <>
            <ElBox center>
                <ElImageUploader crop onImageSelected={handleImageSelect} disabled={!profile.isAdminView}>
                    <ElAvatar src={profile.imageUrl} large />
                </ElImageUploader>
                <ElBox col flex={1} pl={2} pr={1}>
                    <Typography className="profile-title">{profile.name}</Typography>
                    <ItemInfo>Sport: {profile.sportType}</ItemInfo>
                    <ItemInfo>Age Range: {profile.minAge} - {profile.maxAge}</ItemInfo>
                    <ElAddress className="profile-address" hideLocationIcon country={profile?.country} state={profile?.state} city={profile?.city} />
                    <Container>
                        {
                            profile.isAdminView &&
                            <ElButton className="operation-btn" onClick={handleEditTeamClick}>Edit</ElButton>
                        }
                        {
                            !profile.isFollow && !profile.isAdminView &&
                            <ElButton className="operation-btn" onClick={handleFollowClick}>Follow</ElButton>
                        }
                        {
                            profile.isFollow && !profile.isAdminView &&
                            <ElButton className="operation-btn" onClick={handleUnfollowClick}>Unfollow</ElButton>
                        }
                        {
                            profile.isJoin === false && !profile.isAdminView &&
                            <ElButton className="operation-btn" onClick={() => handleJoinTeamClick(profile)}>Join team</ElButton>
                        }
                        {
                            profile.isJoin === null && !profile.isAdminView && <ElButton className="operation-btn">Requesting</ElButton>
                        }
                        {
                            (profile.isJoin || profile.isOwner) && <ChatMessageButton toUserId={teamId} chatType={ChatType.Team} />
                        }
                    </Container>
                </ElBox>
                {
                    profile.isAdminView &&
                    <Box alignSelf="flex-start">
                        <ElMenuBtn items={menuItems}>
                            <ElSvgIcon light small name="options" />
                        </ElMenuBtn>
                    </Box>
                }
            </ElBox>
            <LevelBar mt={2} level={profile.level} currentExperience={profile.currentExperience} nextLevelExperience={profile.nextLevelExperience} />
            <ElBody mt={2}>{profile.bio ?? 'No bio now'} </ElBody>
            <Divider className="mt-16" />
            <TeamProfileTab team={profile} />
            <ElDialog open={showDeleteDialog}
                title="Are you sure you want to delete the current team?"
                actions={
                    <>
                        <ElButton onClick={handleYesToDeleteClick}>Yes</ElButton>
                        <ElButton onClick={() => setShowDeleteDialog(false)}>No</ElButton>
                    </>
                }>
            </ElDialog>
        </>
    );
}
