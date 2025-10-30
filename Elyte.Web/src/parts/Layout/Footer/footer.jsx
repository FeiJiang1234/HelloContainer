import React from 'react';
import { Toolbar, Box, AppBar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Navs from '../Navs/navs';

const useStyles = makeStyles(theme => ({
    bar: {
        background: theme.bgPrimary,
    },
    navsWidth: {
        width: theme.breakpoints.values.sm
    },
    navsToolbar: {
        justifyContent: 'center'
    }
}));

export default function Footer () {
    const classes = useStyles();
    return (
        <AppBar elevation={0} position="fixed" className={classes.bar} sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar className={classes.navsToolbar}>
                <Box display="flex" justifyContent="space-around" className={classes.navsWidth}>
                    <Navs />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
