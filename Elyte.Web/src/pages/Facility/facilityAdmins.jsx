import React, { useState, useEffect } from 'react';
import { facilityService } from 'services';
import { ElConfirm, ElTitle, ElLinkBtn } from 'components';
import { Roster } from 'pageComponents';
import { useLocation, useHistory } from 'react-router-dom';

const FacilityAdmins = () => {
    const location = useLocation();
    const history = useHistory();
    const params = location?.state?.params;
    const [showDeleteAdminConfirmDialog, setShowDeleteAdminConfirmDialog] = useState(false);
    const [members, setMembers] = useState([]);
    const [memberId, setMemberId] = useState(null);

    useEffect(() => getFacilityAdmins(), [params]);

    const getFacilityAdmins = async () => {
        const res = await facilityService.getFacilityAdmins(params.facilityId || '');
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handleRemoveClick = (member) => {
        setShowDeleteAdminConfirmDialog(true);

        setMemberId(member.id);
    };

    const handleRemoveAdmin = async () => {
        const res = await facilityService.cancelFacilityAdmin(params.facilityId, memberId);
        if (res && res.code === 200) {
            getFacilityAdmins();
        }
    };

    const handleAddClick = () => {
        history.push("/getAllUsersToSelectAdmin", { params: { id: params.facilityId, type: 'Facility' } });
    }

    return (
        <>
            <ElTitle>Admin List</ElTitle>
            <ElLinkBtn onClick={handleAddClick}>+ Add an admin</ElLinkBtn>
            <Roster data={members} isOwnerView={params.isOwnerView} emptyDataTitle={"No Admins"} onRemoveClick={handleRemoveClick} />
            <ElConfirm
                title="Are you sure to remove this facility admin?"
                keepMounted
                open={showDeleteAdminConfirmDialog}
                onNoClick={() => setShowDeleteAdminConfirmDialog(false)}
                onOkClick={handleRemoveAdmin}
            />
        </>
    );
};

export default FacilityAdmins;