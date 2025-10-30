import React, { useState, useEffect } from 'react';
import { associationService } from 'services';
import { ElConfirm } from 'components';
import { Roster } from 'pageComponents';

const AssociationAdmins = ({ profile }) => {
    const [showDeleteAdminConfirmDialog, setShowDeleteAdminConfirmDialog] = useState(false);
    const [members, setMembers] = useState([]);
    const [memberId, setMemberId] = useState(null);

    useEffect(() => getAssociationAdmins(), [profile]);

    const getAssociationAdmins = async () => {
        const res = await associationService.getAssociationAdmin(profile?.id || '');
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handleRemoveClick = (member) => {
        if (member.role === "Admin") {
            setShowDeleteAdminConfirmDialog(true);
        }

        setMemberId(member.id);
    };

    const handleRemoveAdmin = async () => {
        const res = await associationService.cancelAssociationAdmin(profile.id, memberId);
        if (res && res.code === 200) {
            getAssociationAdmins();
        }
    };

    return (
        <>
            <Roster data={members} isOwnerView={profile.isOwner} isAdminView={profile.isAdminView} emptyDataTitle={"No Admins"} onRemoveClick={handleRemoveClick} />
            <ElConfirm
                title="Are you sure to remove this association admin?"
                keepMounted
                open={showDeleteAdminConfirmDialog}
                onNoClick={() => setShowDeleteAdminConfirmDialog(false)}
                onOkClick={handleRemoveAdmin}
            />
        </>
    );
};

export default AssociationAdmins;