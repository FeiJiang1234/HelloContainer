import React from 'react';
import { ElButton, ElTitle, ElDialog } from 'components';
import { Typography, Box } from '@mui/material';
import * as moment from 'moment';
import OrganizationInfoPayReturn from 'pages/Organization/organizationInfoPayReturn';

export default function RegisterOrganizationCongratulationsDialog ({ open, onClose, organizationId, organizationType }) {

    return (
        <ElDialog open={open} actions={<ElButton onClick={onClose}>Close</ElButton>}>
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
        </ElDialog >
    );
}
