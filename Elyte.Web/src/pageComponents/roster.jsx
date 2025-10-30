import React, { useState, useEffect } from 'react';
import { Box, Divider } from '@mui/material';
import { ElBox, ElSvgIcon, ElButton } from 'components';
import { styled } from '@mui/system';
import { useProfileRoute } from 'utils';
import { Person } from '@mui/icons-material';
import { Idiograph } from 'parts';

const IconContainer = styled(Box)(() => { return { position: 'relative', top: '20%', fontWeight: '500', fontSize: '18px' }; });
const AthleteItemContainer = styled(Box)(() => { return { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }; });
const AdminIcon = styled(Person)(() => { return { color: '#B0B8CB' }; });
const OwnerIcon = styled(Person)(() => { return { color: 'linear-gradient(179.61deg, #1F345D 16.55%, #080E1B 184.09%)' }; });

const Roster = ({ data, isOwnerView, isAdminView, isShowPlayerNumber, emptyDataTitle, onRemoveClick, onPlayerNumberClick }) => {
    const [members, setMembers] = useState(data);

    useEffect(() => setMembers(data), [data])

    const handleRemoveClick = (member) => {
        if (onRemoveClick) {
            onRemoveClick(member);
        }
    }

    const isShowRemoveButton = (member) => {
        if (!isOwnerView && !isAdminView) {
            return false;
        }
        if (isOwnerView) {
            return member.role !== "Owner";
        }

        if (isAdminView) {
            return member.role !== "Owner" && member.role !== "Admin";
        }
    };

    const handlePlayerNumberClick = (member) => {
        if (onPlayerNumberClick) {
            onPlayerNumberClick(member);
        }
    }

    return (
        <Box mt={1} pb={2}>
            {Array.isNullOrEmpty(members) && emptyDataTitle && <ElBox mt={2} center flex={1}>{emptyDataTitle}</ElBox>}
            {
                !Array.isNullOrEmpty(members) && members.map((member) => (
                    <Box key={member.id}>
                        <AthleteItem item={member} isShowPlayerNumber={isShowPlayerNumber} onClose={() => handleRemoveClick(member)} isShowRemoveButton={isShowRemoveButton(member)} onPlayerNumberClick={() => handlePlayerNumberClick(member)} />
                        <Divider className='mt-16 mb-16' />
                    </Box>
                ))
            }
        </Box>
    );
};

const AthleteItem = ({ item, onClose, isShowRemoveButton, isShowPlayerNumber = false, onPlayerNumberClick }) => {
    const { athleteProfile } = useProfileRoute();

    const handleRemoveAthleteClick = () => {
        if (onClose) {
            onClose();
        }
    }

    const handlePlayerNumberClick = () => {
        if (onPlayerNumberClick) {
            onPlayerNumberClick();
        }
    }

    return (
        <AthleteItemContainer mt={1} mb={1}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {
                    item.isBlankAccount &&
                    <Idiograph to={null} centerTitle={`ID: ${item.blankAccountCode}`} title={item.title} imgurl={item.avatarUrl} />
                }
                {
                    !item.isBlankAccount &&
                    <Idiograph to={athleteProfile(item.id)} title={item.title} imgurl={item.avatarUrl} centerTitle={item.centerTitle} subtitle={item.subtitle} />
                }
                <IconContainer>
                    {item.role === 'Admin' && <AdminIcon />}
                    {item.role === 'Owner' && <OwnerIcon />}
                </IconContainer>
            </Box>
            <Box mr={1} sx={{ width: '100px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                {isShowPlayerNumber && <ElButton sx={{ width: 50 }} onClick={handlePlayerNumberClick} small >{`#${item.playerNumber ?? ""}`}</ElButton>}
                <span className="fillRemain"></span>
                {isShowRemoveButton && <ElSvgIcon light xSmall name="close" onClick={handleRemoveAthleteClick} />}
            </Box>
        </AthleteItemContainer >
    )
}

export default Roster;