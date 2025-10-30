import React from 'react';
import { Box, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElSvgIcon, ElBox } from 'components';

const useStyles = makeStyles(theme => ({
    outside: {
        height: '100%',
        padding: 0,
    },
    container: {
        height: '100%',
        background: theme.bgPrimary,
    },
    content: {
        height: '100%',
        backgroundImage: `url("/bg.png")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: theme.spacing(54),
        backgroundPosition: theme.spacing(11, -5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    linkContent: {
        '& a': {
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: '500',
            textDecoration: 'none',
        },
    },
    svgBox: {
        '& svg': {
            width: theme.spacing(19),
            height: theme.spacing(5),
        },
    },
}));

const Startup = () => {
    const classes = useStyles();
    return (
        <Container maxWidth="xs" className={classes.outside}>
            <Box className={classes.container}>
                <Box className={classes.content}>
                    <ElBox col center flex={1}>
                        <ElSvgIcon name="logo" xLarge className={classes.logo} />
                        <Box mt={4} className={classes.svgBox}>
                            <ElSvgIcon name="appName" />
                        </Box>
                    </ElBox>
                    <Box mb={12} className={classes.linkContent}>
                        <a href="/">Start</a>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Startup;
