import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { teamService } from 'services';
import { ElConfirm, ElLinkBtn, ElDialog } from 'components';
import { Roster } from 'pageComponents';
import RequestItem from './components/requestItem';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/system';
import PlayerNumberForm from './components/playerNumberForm'
import { authService } from 'services';

const Label = styled(Typography)(() => { return { color: '#B0B8CB', fontSize: 15, fontWeight: 500 }; });

const TeamProfileRoster = ({ team }) => {
    const user = authService.getCurrentUser();
    const history = useHistory();
    const [showDeleteMemberConfirmDialog, setShowDeleteMemberConfirmDialog] = useState(false);
    const [showDeleteAdminConfirmDialog, setShowDeleteAdminConfirmDialog] = useState(false);
    const [showPlayerNumberDialog, setShowPlayerNumberDialog] = useState(false);
    const [members, setMembers] = useState([]);
    const [memberId, setMemberId] = useState(null);
    const [requestingMembers, setRequestingMembers] = useState([]);
    const [editData, setEditData] = useState({});

    useEffect(() => initTabList(), [team]);

    const initTabList = () => {
        if (team?.id) {
            getTeamMembers();
            if (team.isAdminView) {
                getJoinReqests();
            }
        }
    }

    const getJoinReqests = async () => {
        const res = await teamService.getAthleteJoinTeamRequests(team?.id);
        if (res && res.code === 200 && res.value) setRequestingMembers(res.value);
    }

    const getTeamMembers = async () => {
        const res = await teamService.getTeamRoster(team.id, true);
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handleRemoveClick = (member) => {
        if (member.role === "Admin") {
            setShowDeleteAdminConfirmDialog(true);
        }

        if (member.role === "Player") {
            setShowDeleteMemberConfirmDialog(true);
        }

        setMemberId(member.id);
    };

    const handleRemoveMember = async () => {
        const res = await teamService.removeParticipant(team.id, memberId);
        if (res && res.code === 200) {
            getTeamMembers();
        }
    };

    const handleRemoveAdmin = async () => {
        const res = await teamService.cancelTeamAdmin(team.id, memberId);
        if (res && res.code === 200) {
            getTeamMembers();
        }
    };

    const handleViewAllClick = () => {
        history.push('/athleteJoinTeamRequest', { params: team.id });
    }

    const handlePlayerNumberClick = (member) => {
        if (team.isAdminView || member.id === user.id) {
            setEditData({ ...member, teamId: team.id });
            setShowPlayerNumberDialog(true);
        }
    }

    const handlePlayerNumberSubmitted = () => {
        setShowPlayerNumberDialog(false);
        initTabList();
    }

    return (
        <Box mt={1} className='scroll-container'>
            {
                team.isAdminView && <Label>On Team</Label>
            }
            <Roster data={members} isOwnerView={team.isOwner} isAdminView={team.isAdminView} isShowPlayerNumber={true} emptyDataTitle={"No Members"} onRemoveClick={handleRemoveClick} onPlayerNumberClick={handlePlayerNumberClick} />
            {
                team.isAdminView && !Array.isNullOrEmpty(requestingMembers) &&
                <>
                    <Box sx={{ display: 'flex' }}>
                        <Label>Requesting to Join</Label>
                        <span className="fillRemain"></span>
                        <ElLinkBtn onClick={handleViewAllClick}>View All</ElLinkBtn>
                    </Box>
                    {
                        !Array.isNullOrEmpty(requestingMembers) && requestingMembers.map(item => <RequestItem key={item.id} item={item} onHandleSuccess={() => initTabList()} />)
                    }
                </>
            }
            <ElConfirm
                title="Are you sure you want to remove this team member?"
                keepMounted
                open={showDeleteMemberConfirmDialog}
                onNoClick={() => setShowDeleteMemberConfirmDialog(false)}
                onOkClick={handleRemoveMember}
            />
            <ElConfirm
                title="Are you sure you want to remove this team admin?"
                keepMounted
                open={showDeleteAdminConfirmDialog}
                onNoClick={() => setShowDeleteAdminConfirmDialog(false)}
                onOkClick={handleRemoveAdmin}
            />
            <ElDialog open={showPlayerNumberDialog} title="Select Your Player Number" subTitle="This is the number you will be recognized with during a game" onClose={() => setShowPlayerNumberDialog(false)}>
                <PlayerNumberForm data={editData} onSubmitted={handlePlayerNumberSubmitted} />
            </ElDialog>
        </Box>
    );
};

export default TeamProfileRoster;