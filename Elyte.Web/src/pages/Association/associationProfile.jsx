import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider, Badge } from '@mui/material';
import { ElBox, ElBody, ElSvgIcon, ElButton, ElMenuBtn, ElAvatar, ElTabs, ElImageUploader, NoScrollBox, ElDialog, ElAddress, ELCopyButton } from 'components';
import { useLocation, useHistory } from 'react-router-dom';
import { associationService } from 'services';
import AssociationOrganizations from './associationOrganizations';
import { BecomeOfficialDialog } from 'pageComponents';
import OrganizationContactUs from '../Organization/organizationContactUs';
import AssociationFile from './associationFile';
import AssociationAdmins from './associationAdmins';
import OurOfficiates from 'pages/Organization/ourOfficiates';


const AssociationProfile = () => {
    const history = useHistory();
    const location = useLocation();
    const [associationProfile, setAssociationProfile] = useState({});
    const associationId = location.state.params;
    const { isAdminView, isOfficial } = associationProfile;
    const [showBecomeOfficailDialog, setShowBecomeOfficailDialog] = useState(false);
    const [showAssociationId, setShowAssociationId] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const menuItems = [
        {
            text: 'Request Official Id',
            onClick: () => history.push('/becomeOfficial', { params: { organizationName: associationProfile.name } }),
            hide: !isAdminView || isOfficial
        },
        {
            text: 'Become Official',
            onClick: () => setShowBecomeOfficailDialog(true),
            hide: !isAdminView || isOfficial
        },
        {
            text: 'Make an Admin',
            onClick: () => history.push("/getAllUsersToSelectAdmin", { params: { id: associationProfile.id, type: 'Association' } }),
            hide: !associationProfile.isOwner
        },
        {
            text: 'Delete',
            onClick: () => setShowDeleteDialog(true),
            hide: !associationProfile.isOwner
        }
    ];

    useEffect(() => getAssociationProfile(), [associationId]);

    const getAssociationProfile = async () => {
        const res = await associationService.getAssociationProfile(associationId);
        if (res && res.code === 200) setAssociationProfile(res.value);
    }

    const handleEditProfileClick = () => {
        history.push('/editAssociationProfile', { params: associationProfile });
    }

    const handleImageSelect = async image => {
        const res = await associationService.updateAssociationProfilePicture(associationId, image.file);
        if (res && res.code === 200) getAssociationProfile();
    };

    const handleBecomeClick = async (data) => {
        const res = await associationService.becomeToOfficialAssociation(associationId, data);
        if (res && res.code === 200) {
            setShowBecomeOfficailDialog(false);
            getAssociationProfile();
        }
    }

    const handleViewIdClick = () => {
        setShowAssociationId(true)
    }

    const handleYesToDeleteClick = async () => {
        const res = await associationService.deleteAssociation(associationId);
        if (res && res.code === 200) {
            setShowDeleteDialog(false);
            history.push('/');
        }
    }

    return (
        <NoScrollBox>
            <ElBox>
                <ElImageUploader crop onImageSelected={handleImageSelect} disabled={!isAdminView}>
                    <ElAvatar src={associationProfile?.imageUrl} large />
                </ElImageUploader>
                <ElBox col flex={1} pl={2} pr={1}>
                    <Badge anchorOrigin={{ vertical: 'top', horizontal: 'right', }} invisible={!isOfficial} badgeContent={"OFFICIAL"} color="primary">
                        <Typography className="profile-title">{associationProfile.name}</Typography>
                    </Badge>
                    <ElAddress className="profile-address" country={associationProfile?.country} state={associationProfile?.state} city={associationProfile?.city} />
                    {isAdminView && <Typography mt={1} sx={{ color: '#808A9E' }} onClick={handleViewIdClick}>View ID</Typography>}
                    <Box mt={1} className='flex-sb'>
                        {
                            isAdminView && <ElButton className="operation-btn" onClick={handleEditProfileClick}>Edit</ElButton>
                        }
                    </Box>
                </ElBox>
                <Box mt={2} alignSelf="flex-start">
                    <ElMenuBtn items={menuItems}>
                        <ElSvgIcon light small name="options" />
                    </ElMenuBtn>
                </Box>
            </ElBox>

            <ElBody mt={2} mb={2}>
                {associationProfile.details ?? 'No details now'}
            </ElBody>
            <OurOfficiates id={associationId} type='Association' isAdminView={isAdminView} />
            <Divider className='mt-16 mb-16' />
            <ProfileTab profile={associationProfile}></ProfileTab>
            <BecomeOfficialDialog open={showBecomeOfficailDialog} onClose={() => setShowBecomeOfficailDialog(false)} onBecomeClick={handleBecomeClick} />
            <ElDialog open={showAssociationId} title="Association Id" onClose={() => setShowAssociationId(false)}>
                <Typography sx={{ textAlign: 'center', fontSize: 15, color: '#B0B8CB' }}>
                    {associationProfile.id} <ELCopyButton content={associationProfile.id}></ELCopyButton>
                </Typography>
            </ElDialog>
            <ElDialog open={showDeleteDialog}
                title="Are you sure you want to delete the current association?"
                actions={
                    <>
                        <ElButton onClick={handleYesToDeleteClick}>Yes</ElButton>
                        <ElButton onClick={() => setShowDeleteDialog(false)}>No</ElButton>
                    </>
                }>
            </ElDialog>
        </NoScrollBox>
    );
};

export default AssociationProfile;

const ProfileTab = ({ profile }) => {
    const tabs = ['Organizations', 'Documentation', 'Contact Us', 'Admins'];
    const [tab, setTab] = useState(tabs[0]);

    const handleTabChange = (e) => setTab(e);

    return (
        <>
            <ElTabs tabs={tabs} tab={tab} onTabChange={handleTabChange}></ElTabs>
            {tab === 'Organizations' && <AssociationOrganizations associationId={profile.id} associationCode={profile.code} isAdminView={profile.isAdminView} />}
            {tab === 'Admins' && <AssociationAdmins profile={profile} />}
            {tab === 'Documentation' && <AssociationFile associationId={profile.id} />}
            {tab === 'Contact Us' && <OrganizationContactUs organizationId={profile.id} organizationType='Association' />}
        </>
    );
}