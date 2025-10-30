import React from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { ElButton, ElTitle, ElBody } from 'components';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex !important',
        flexDirection: 'column',
        height: '100%',
        padding: 0,
        paddingBottom: theme.spacing(2),
    },

    container: {
        position: 'relative',
        flex: 1,
        marginBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },

    image: {
        flex: 1,
        backgroundImage: `url(/images/404.png)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        borderRadius: '0px 0px 20px 20px',

        '& .title': {
            position: 'absolute',
            bottom: theme.spacing(3),
            width: '100%',
            '& p': {
                color: '#fff',
            },
        },
    }
}));

const NotFoundPage = () => {
    const history = useHistory();
    const classes = useStyles();

    const goHome = () => history.push('/');

    return (
        <Container maxWidth="xs" className={classes.root}>
            <Box className={`${classes.container} ${classes.image}`}>
                <Box className={classes.image}></Box>
                <Box className="title" textAlign="center">
                    <ElTitle large>404</ElTitle>
                    <ElTitle large>Page Not Found</ElTitle>
                    <ElTitle sub>We can’t seem to find the page you are looking for...</ElTitle>
                </Box>
            </Box>

            <Box pl={2} pr={2} textAlign="center">
                <ElBody>Email us: support@elyte.app</ElBody>
                <ElBody>Message user: Support Elyte</ElBody>
                <ElButton fullWidth={false} sx={{ mt: 2, mb: 3, width: '150px' }} onClick={goHome}>Home</ElButton>
            </Box>
        </Container>
    );
};

export default NotFoundPage;
