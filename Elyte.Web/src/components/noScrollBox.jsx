import React from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import { Box, useMediaQuery } from '@mui/material';

const useStyles = makeStyles(theme => ({
    root: ({ isDesktop }) => {
        const headerHeight = isDesktop ? '64px' : '56px';
        const footerHeight = isDesktop ? '64px' : '56px';
        const paddingBottom = theme.spacing(6);
        return {
            height: `calc(100vh - ${headerHeight} - ${footerHeight} - ${paddingBottom})`,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        };
    }
}));

function NoScrollBox ({ children }) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const classes = useStyles({ isDesktop });
    return <Box className={classes.root}>{children}</Box>;
}

export default NoScrollBox;
