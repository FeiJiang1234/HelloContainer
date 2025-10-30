import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import withElStyle from './withElStyle';

const useStyles = makeStyles(() => ({
    root: {
        color: '#000000',
        fontWeight: 400,
        fontSize: 15,
    },
    center: {
        textAlign: 'center',
    },
    disabled: {
        color: '#CCCCCC',
    },
    bold: {
        fontWeight: 'bold',
    },
}));

function ElContent ({ children, disabled, bold, center }) {
    const classes = useStyles();
    return (
        <Typography
            className={`
        ${classes.root} 
        ${disabled && classes.disabled} 
        ${center && classes.center} 
        ${bold && classes.bold}`}>
            {children}
        </Typography>
    );
}

export default withElStyle(ElContent);
