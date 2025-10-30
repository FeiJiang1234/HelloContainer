import React from 'react';
import { Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        width: '100%',
        minHeight: theme.spacing(4),
        zIndex: 100,
        background: theme.bgPrimary,
    },
}));

export default function HeaderBar () {
    const classes = useStyles();
    return <Toolbar className={classes.root}></Toolbar>;
}
