import React from 'react';
import { Box, Grid } from '@mui/material';
import { ElSvgIcon, ElContent, ElSvgImage } from 'components';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    line: {
        height: theme.spacing(2),
        borderBottom: '1px solid #182848',
        margin: `${theme.spacing(1)} 0 0`,
    },
    center: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    width: {
        width: 'inherit',
    },
}));

const ThirdPartyLogin = () => {
    const classes = useStyles();
    return (
        <Box mb={4} mt={4} className={classes.width}>
            <Grid container>
                <Grid item xs>
                    <div className={classes.line}></div>
                </Grid>
                <Grid item xs={3}>
                    <ElContent center disabled>
                        or
                    </ElContent>
                </Grid>
                <Grid item xs>
                    <div className={classes.line}></div>
                </Grid>
            </Grid>
            <ElContent mt={1} center disabled>
                Sign in with your Google or Facebook
            </ElContent>
            <Box mb={4} mt={4}>
                <Grid container>
                    <Grid item xs></Grid>
                    <Grid item xs={6} className={classes.center}>
                        <ElSvgImage name="google" />
                        <ElSvgIcon large name="facebook" />
                    </Grid>
                    <Grid item xs></Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ThirdPartyLogin;
