import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/system';

const TabTitle = styled(Typography)(({ theme }) => {
    return {
        color: theme.palette.body.light,
        fontSize: '15px',
    };
});

function ElTabTitle({ children, ...rest }) {
    return <TabTitle {...rest}>{children}</TabTitle>;
}

export default ElTabTitle;
