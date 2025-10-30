import React, { useState } from 'react';
import { ElSvgIcon } from 'components';
import { Container, SpeedDial, SpeedDialIcon } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(10),
        zIndex: 100,
    },
    speedDial: {
        position: 'absolute',
        bottom: 0,
        right: theme.spacing(2),
        '& .MuiSpeedDial-fab': {
            background: theme.bgPrimary,
        },
        '& .MuiSpeedDial-actions': {
            background: theme.bgPrimary,
            borderRadius: '100px 100px 10px 10px',
        },
        '& .MuiSpeedDial-actions.MuiSpeedDial-actionsClosed': {
            background: 'none',
        },
        '& .MuiSpeedDialAction-fab': {
            backgroundColor: 'transparent',
        },
        '& .MuiFab-root': {
            boxShadow: 'none',
        },
    },
}));

export default function PostSpeedDial () {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth="sm" className={classes.root}>
            <SpeedDial
                ariaLabel="SpeedDial"
                className={classes.speedDial}
                icon={<SpeedDialIcon icon={<ElSvgIcon small name="pencil" />} />}
                onClose={handleClose}
                onClick={() => history.push('/createPost')}
                onMouseOver={() => setOpen(true)}
                open={open}>
            </SpeedDial>
        </Container>
    );
}
