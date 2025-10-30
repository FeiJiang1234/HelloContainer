import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElSvgIcon } from 'components';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        width: theme.breakpoints.values.sm,
        textAlign: 'left',
    }
}));

export default function GoBack () {
    const history = useHistory();
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <ElSvgIcon xSmall name="goBackArrow" onClick={() => history.goBack()}></ElSvgIcon>
        </Box>
    );
}
