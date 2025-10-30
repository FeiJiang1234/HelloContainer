import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import BlockIcon from '@mui/icons-material/Block';
import { useTheme } from '@mui/styles';

const PaymentIcon = ({ paymentIsEnabled }) => {
    const theme = useTheme();
    return (
        <>
            {paymentIsEnabled && <DoneIcon titleAccess="Payment Account Complete" sx={{ color: theme.palette.secondary.minor }} />}
            {!paymentIsEnabled && <BlockIcon titleAccess="Payment Account Restricted" sx={{ color: theme.palette.error.main }} />}
        </>
    );
};

export default PaymentIcon;
