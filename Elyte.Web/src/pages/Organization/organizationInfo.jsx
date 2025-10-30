import { Typography } from '@mui/material';
import { styled } from '@mui/system';

const OrganizationInfo = styled(Typography)(({ theme }) => {
    return {
        fontSize: '12px',
        color: theme.palette.body.main,
        justifyContent: 'initial',
    };
});

export default OrganizationInfo;
