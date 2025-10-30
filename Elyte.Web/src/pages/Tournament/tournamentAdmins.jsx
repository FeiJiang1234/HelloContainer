import React, { useState, useEffect } from 'react';
import { tournamentService } from 'services';
import { ElConfirm, ElTabTitle } from 'components';
import { Roster } from 'pageComponents';

const TournamentAdmins = ({ profile }) => {
    const [showDeleteAdminConfirmDialog, setShowDeleteAdminConfirmDialog] = useState(false);
    const [showDeleteCoordinatorConfirmDialog, setShowDeleteCoordinatorConfirmDialog] = useState(false);
    const [members, setMembers] = useState([]);
    const [coordinators, setCoordinators] = useState([]);
    const [memberId, setMemberId] = useState(null);
    const [coordinatorId, setCoordinatorId] = useState(null);

    useEffect(() => {
        getTournamentAdmins();
        getTournamentCoordinators();
    }, [profile]);

    const getTournamentAdmins = async () => {
        const res = await tournamentService.getTournamentAdmins(profile?.id || '');
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const getTournamentCoordinators = async () => {
        const res = await tournamentService.getTournamentCoordinators(profile?.id || '');
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
        const res = await tournamentService.cancelTournamentAdmin(profile.id, memberId);
        if (res && res.code === 200) {
            getTournamentAdmins();
        }
    };

    
    const handleRemoveCoordinator = async () => {
        const res = await tournamentService.cancelTournamentCoordinator(profile.id, coordinatorId);
        if (res && res.code === 200) {
            getTournamentCoordinators();
        }
    };

    return (
        <>
            <ElTabTitle>Admins</ElTabTitle>
            <Roster data={members} isOwnerView={profile.isOwner} isAdminView={profile.isAdminView} emptyDataTitle={"No Admins"} onRemoveClick={handleRemoveClick} />
            
            <ElTabTitle>Coordinators</ElTabTitle>
            <Roster data={coordinators} isOwnerView={profile.isOwner} isAdminView={profile.isAdminView} emptyDataTitle={"No Coordinators"} onRemoveClick={handleRemoveCoordinatorClick} />

            <ElConfirm
                title="Are you sure to remove this tournament admin?"
                keepMounted
                open={showDeleteAdminConfirmDialog}
                onNoClick={() => setShowDeleteAdminConfirmDialog(false)}
                onOkClick={handleRemoveAdmin}
            />
            <ElConfirm
                title="Are you sure to remove this tournament coordinator?"
                open={showDeleteCoordinatorConfirmDialog}
                onNoClick={() => setShowDeleteCoordinatorConfirmDialog(false)}
                onOkClick={handleRemoveCoordinator}
            />
        </>
    );
};

export default TournamentAdmins;