import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { ElButton } from 'components';
import { PaymentStatus } from 'enums';
import { useDateTime } from 'utils';
import { TimeCountDown } from 'pageComponents';
import StripeCheckout from 'pages/Organization/stripeCheckout';

const Info = styled(Typography)(() => {
    return {
        flex: 1,
        color: 'body.main',
        fontSize: 14
    };
});

const Container = styled(Box)(({ theme }) => {
    return {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 16,
        border: `1px solid ${theme.palette.primary.main}`,
        padding: 8
    };
});

export default function PaymentCard ({ type, item }) {
    const { utcToLocalDatetime } = useDateTime();
    const [clientSecret, setClientSecret] = useState();

    const processPaymentAndRegister = async () => {
        setClientSecret(item.payUrl);
    }

    return (
        <Container>
            <Info>Team: {item.teamName}</Info>
            <Info>{type}: {item.name}</Info>
            <Info>Amount: ${item.amount}</Info>
            <Info>Status: {item.status}</Info>
            <Info>PaymentTimeLeft: <TimeCountDown leftMilliseconds={item.leftMilliseconds} /></Info>
            <Info>Created: {utcToLocalDatetime(item.createdDate)}</Info>
            <Box sx={{ flex: 1 }}>
                {item.status === PaymentStatus.NewCome && <ElButton onClick={processPaymentAndRegister}>Pay</ElButton>}
            </Box>
            <StripeCheckout clientSecret={clientSecret} type={type} onCancel={() => setClientSecret('')} />
        </Container>
    );
}
