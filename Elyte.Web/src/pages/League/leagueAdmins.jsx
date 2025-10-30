import React, { useState, useEffect } from 'react';
import { leagueService } from 'services';
import { ElConfirm, ElTabTitle } from 'components';
import { Roster } from 'pageComponents';

const LeagueAdmins = ({ profile }) => {
    const [showDeleteAdminConfirmDialog, setShowDeleteAdminConfirmDialog] = useState(false);
    const [showDeleteCoordinatorConfirmDialog, setShowDeleteCoordinatorConfirmDialog] = useState(false);
    const [members, setMembers] = useState([]);
    const [coordinators, setCoordinators] = useState([]);
    const [memberId, setMemberId] = useState(null);
    const [coordinatorId, setCoordinatorId] = useState(null);

    useEffect(() => {
        getLeagueAdmins();
        getLeagueCoordinators();
    }, [profile]);

    const getLeagueAdmins = async () => {
        const res = await leagueService.getLeagueAdmins(profile?.id || '');
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const getLeagueCoordinators = async () => {
        const res = await leagueService.getLeagueCoordinators(profile?.id || '');
        if (res && res.code === 200 && res.value) {
            setCoordinators(res.value);
        }
    };

    const handleRemoveClick = (member) => {
        if (member.role === "Admin") {
            setShowDeleteAdminConfirmDialog(true);
        }

        setMemberId(member.id);
    };

    
    const handleRemoveCoordinatorClick = (member) => {
        setShowDeleteCoordinatorConfirmDialog(true);
        setCoordinatorId(member.id);
    };

    const handleRemoveAdmin = async () => {
        const res = await leagueService.cancelLeagueAdmin(profile.id, memberId);
        if (res && res.code === 200) {
            getLeagueAdmins();
        }
    };

    const handleRemoveCoordinator = async () => {
        const res = await leagueService.cancelLeagueCoordinator(profile.id, coordinatorId);
        if (res && res.code === 200) {
            getLeagueCoordinators();
        }
    };

    return (
        <>
            <ElTabTitle>Admins</ElTabTitle>
            <Roster data={members} isOwnerView={profile.isOwner} isAdminView={profile.isAdminView} emptyDataTitle={"No Admins"} onRemoveClick={handleRemoveClick} />
            
            <ElTabTitle>Coordinators</ElTabTitle>
            <Roster data={coordinators} isOwnerView={profile.isOwner} isAdminView={profile.isAdminView} emptyDataTitle={"No Coordinators"} onRemoveClick={handleRemoveCoordinatorClick} />
            
            <ElConfirm
                title="Are you sure to remove this league admin?"
                keepMounted
                open={showDeleteAdminConfirmDialog}
                onNoClick={() => setShowDeleteAdminConfirmDialog(false)}
                onOkClick={handleRemoveAdmin}
            />
            <ElConfirm
                title="Are you sure to remove this league coordinator?"
                open={showDeleteCoordinatorConfirmDialog}
                onNoClick={() => setShowDeleteCoordinatorConfirmDialog(false)}
                onOkClick={handleRemoveCoordinator}
            />
        </>
    );
};

export default LeagueAdmins;