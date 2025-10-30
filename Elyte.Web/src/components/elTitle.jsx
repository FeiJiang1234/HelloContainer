import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import withElStyle from './withElStyle';

const useStyles = makeStyles(theme => ({
    root: {
        fontWeight: '600!important',
        fontSize: '20px!important',
        height: theme.spacing(6),
        lineHeight: theme.spacing(6) + 'px',
        color: '#000000',
    },
    center: {
        textAlign: 'center',
    },
    large: {
        fontWeight: '600!important',
        fontSize: '25px!important',
    },
    sub: {
        fontWeight: '500!important',
        fontSize: '16px!important',
    },
}));

function ElTitle ({ children, large, sub, center, ...rest }) {
    const classes = useStyles();
    let allClasses = [classes.root, rest.className];
    if (large) {
        allClasses.push(classes.large);
    }
    if (sub) { 
        allClasses.push(classes.sub);
    }
    if (center) {
        allClasses.push(classes.center);
    }
    return (
        <Typography className={allClasses.join(" ")}>
            {children}
        </Typography>
    );
}

ElTitle.defaultProps = {
    center: true
};

export default withElStyle(ElTitle);
