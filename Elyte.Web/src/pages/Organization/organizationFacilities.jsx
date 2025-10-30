import React from 'react';
import { styled } from '@mui/system';
import { Box, Typography } from '@mui/material';
import { ElBox } from 'components';
import { Idiograph } from 'parts';
import { useProfileRoute } from 'utils';


const ExpiredText = styled(Typography)(({ theme }) => {
    return {
        color: '#808A9E',
        fontSize: 10,
        marginLeft: theme.spacing(0.5)
    };
});

const OrganizationFacilities = ({ facilities }) => {
    const { facilityProfile } = useProfileRoute();
    return (
        <Box pb={10}>
            {Array.isNullOrEmpty(facilities) && <ElBox mt={2} center>No Facilities</ElBox>}
            {
                !Array.isNullOrEmpty(facilities) && facilities.map(item =>
                    <Idiograph key={item.id} mt={1} mb={1} to={facilityProfile(item.id)}
                        title={<>{item.name}{item.isExpired && <ExpiredText dangerouslySetInnerHTML={{ __html: '(Expired)' }} />}</>}
                        subtitle={item.address}
                        imgurl={item.imageUrl} />
                )
            }
        </Box>
    );
};

export default OrganizationFacilities;