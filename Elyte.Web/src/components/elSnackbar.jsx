import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles(() => ({
    alertLocation: {
        marginBottom: 80,
    }
}));
export default function ElSnackbar ({ severity, ...rest }) {
    const classes = useStyles();
    const [openSnackbar, setOpenSnackbar] = React.useState(true);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };
    return (
        <Snackbar className={[classes.alertLocation, rest.className].join(" ")}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={openSnackbar}
            autoHideDuration={2000}
            onClose={handleClose}
            {...rest}>
            <Alert elevation={6} variant="filled" severity={severity} onClose={handleClose}>
                {rest.children}
            </Alert >
        </Snackbar>
    );
}
