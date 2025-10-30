import React from 'react';
import { Typography, Box } from '@mui/material';
import { ElTitle } from 'components';
import { useLocation } from 'react-router-dom';
import OrganizationInfoPayReturn from 'pages/Organization/organizationInfoPayReturn';
import * as moment from 'moment';

const PaySuccess = () => {
    const location = useLocation();
    var url = location.search;
    const params = new URLSearchParams(url);
    const organizationId = params.get('organizationId');
    const organizationType = params.get('organizationType');
    const connectedAccount = params.get('connectedAccount');

    return (
        <>
            <ElTitle center>Congratulations</ElTitle>
            <ElTitle center sub>Your payment has been made</ElTitle>
            <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <OrganizationInfoPayReturn organizationId={organizationId} organizationType={organizationType} />
                <Box style={{ display: "flex", justifyItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <Typography sx={{ color: '#17C476', fontWeight: 500, fontSize: 15 }}>Confirmation #: </Typography>
                    <Typography sx={{ color: '#1F345D', fontWeight: 500, fontSize: 15 }}>{organizationId}</Typography>
                </Box>
                <Box style={{ display: "flex", gap: 10 }}>
                    <Typography sx={{ color: '#17C476', fontWeight: 500, fontSize: 15 }}>Date of Payment: </Typography>
                    <Typography sx={{ color: '#1F345D', fontWeight: 500, fontSize: 15 }}>{moment(new Date()).format("MM/DD/YYYY")}</Typography>
                </Box>
                <Typography sx={{ color: '#1F345D', fontWeight: 500, fontSize: 15 }}>A confirmation email has been sent to you</Typography>
            </Box>
        </>
    );
};

export default PaySuccess;