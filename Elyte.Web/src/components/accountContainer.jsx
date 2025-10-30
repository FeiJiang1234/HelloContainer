import React from 'react';
import { Container, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { GoBack } from 'parts';
const useStyles = makeStyles(theme => ({
    root: {
        overflow: 'auto',
        height: '100%',
    },
    toolBar: {
        width: '100%',
        minHeight: theme.spacing(4),
        background: theme.bgPrimary,
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        height: `calc(100% - ${theme.spacing(8)})`,
        paddingTop: theme.spacing(4),
        overflowY: 'auto'
    },
}));

function AccountContainer ({ hideGoBack, children }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Toolbar className={classes.toolBar}>
                {
                    !hideGoBack && <GoBack />
                }
            </Toolbar>
            <Container maxWidth="xs" className={classes.container}>
                {children}
            </Container>
        </div>
    );
}

AccountContainer.defaultProps = {
    hideGoBack: false
}

export default AccountContainer;
