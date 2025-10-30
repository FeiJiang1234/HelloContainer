import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { ElTitle, ElBox } from 'components';
import { useProfileRoute } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';
import { associationService } from 'services';
import { useLocation } from 'react-router-dom';

const AssociationOrganizationList = () => {
    const location = useLocation();
    const routerParams = location.state.params;
    const { getProfileUrl } = useProfileRoute();
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => getAssociationOrganizations(), [routerParams]);

    const getAssociationOrganizations = async () => {
        const res = await associationService.getAssociationOrganizations(routerParams?.associationId, routerParams?.type);
        if (res && res.code === 200 && res.value && res.value?.length > 0) {
            setOrganizations(res.value);
        }
    };

    return (
        <Box pb={10}>
            <ElTitle center>{routerParams.type} In Association</ElTitle>
            {Array.isNullOrEmpty(organizations) && <ElBox>No Organizations</ElBox>}
            {
                !Array.isNullOrEmpty(organizations) && organizations.map(item => (
                    <IdiographRow key={item.id} title={item.name} subtitle={item.address} imgurl={item.imageUrl}
                        to={getProfileUrl(item.organizationType, item.organizationId)}
                    />
                ))
            }
        </Box>
    );
};

export default AssociationOrganizationList;
