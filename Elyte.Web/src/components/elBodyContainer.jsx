import React from 'react';
import { Container, useMediaQuery } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';

const useStyles = makeStyles(() => ({
    container: ({ isDesktop }) => {
        const headerHeight = isDesktop ? '64px' : '56px';
        const footerHeight = isDesktop ? '64px' : '56px';
        const layoutMarginTopOffset = '10px';
        return {
            height: `calc(100vh - ${headerHeight} - ${footerHeight} - ${layoutMarginTopOffset})`,
            display: 'flex',
            flexDirection: 'column',
        };
    }
}));

export default function ElBodyContainer ({ children }) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const classes = useStyles({ isDesktop });

    return (
        <Container className={classes.container}>
            {children}
        </Container>
    );
}