import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElSvgIcon } from 'components';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
            stroke: theme.palette.body.main,
            marginRight: theme.spacing(1),
        },
    },
    flag: {
        width: theme.spacing(2.3),
        height: theme.spacing(1.5),
        marginLeft: theme.spacing(1),
    },
}));

export default function ElAddress ({ street, country, state, city, hideLocationIcon, ...rest }) {
    const { className, ...other } = rest;
    const classes = useStyles();
    return <Box className={[classes.root, className].join(" ")} {...other}>
        {!hideLocationIcon && <ElSvgIcon xSmall light name="location" />}
        {street ? `${street}, ` : ''} {city ?? 'city'}, {state ?? 'state'}, {country ?? 'country'}
        <img className={classes.flag} src="images/us.png" />
    </Box>;
}

