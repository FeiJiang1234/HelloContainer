import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#F0F2F7',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        height: theme.spacing(7),
        color: '#1F345D',
        fontSize: 18,
        fontWeight: 500,
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        position: 'relative'
    },
    icon: {
        stroke: '#1F345D',
        strokeWidth: 2,
        height: theme.spacing(3),
        width: theme.spacing(3),
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
    },
}));

function ElOptionButton ({ iconName, children, loading, ...rest }) {
    const classes = useStyles();
    let allClass = [classes.root, 'hand'];
    if (rest.className) {
        allClass.push(rest.className);
    }

    return (
        <Box className={allClass.join(" ")} {...rest}>
            <svg className={['el-svg-icon', classes.icon].join(" ")}>
                <use xlinkHref={`/svgs/sprite.svg#${iconName}`}></use>
            </svg>
            {children}

            {loading && <CircularProgress size={24} sx={{ position: 'absolute', right: 8 }} />}
        </Box>
    );
}

export default ElOptionButton;