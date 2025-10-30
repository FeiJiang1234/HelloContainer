import React from 'react';
import { Typography } from '@mui/material';
import { ElTitle, ElButton } from 'components';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    title: {
        color: '#FF0000'
    }
}));

const PayCancel = () => {
    const history = useHistory();
    const classes = useStyles();

    return (
        <>
            <ElTitle className={classes.title} center>Payment Failed</ElTitle>
            <ElTitle center sub>Something went wrong</ElTitle>
            <Typography mt={4} sx={{ color: '#1F345D', fontWeight: 500, fontSize: 18, textAlign: 'center' }}>We are sorry, we were unable to process your payment</Typography>
            <Typography mt={4} sx={{ color: '#1F345D', fontWeight: 500, fontSize: 18, textAlign: 'center' }}>Your card was not charged and we ask that you try again</Typography>
            <ElButton mt={12} onClick={() => history.push("/paymentHistory")}>Try Again</ElButton>
        </>
    );
};

export default PayCancel;