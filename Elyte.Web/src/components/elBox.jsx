import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    col: {
        flexDirection: 'column',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerMain: {
        justifyContent: 'center',
    },
    centerCross: {
        alignItems: 'center',
    },
}));

function ElBox ({ children, col, center, centerMain, centerCross, ...rest }) {
    const classes = useStyles();
    return (
        <Box display="flex" className={`${col ? classes.col : ''}${center ? classes.center : ''}${centerMain ? classes.centerMain : ''}${centerCross ? classes.centerCross : ''}`}
            {...rest}>
            {children}
        </Box>
    );
}

export default ElBox;
