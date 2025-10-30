import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { ElButton } from 'components';
import { OrganizationType, PaymentStatus } from 'enums';
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

export default function PaymentRentCard ({ type, item }) {
    const { utcToLocalDatetime, utcToLocalDate } = useDateTime();
    const [clientSecret, setClientSecret] = useState();

    return (
        <Container>
            <Info>{type}: {item.name}</Info>
            {item.rentFor && <Info>RentFor: {item.rentFor}</Info>}
            <Info>RentDate: {utcToLocalDate(item.rentalDate)}</Info>
            <Info>RentTimeRanges: {item.rentalTimeRanges}</Info>
            <Info>Amount: ${item.amount}</Info>
            <Info>Status: {item.status}</Info>
            {item.leftMilliseconds && <Info>PaymentTimeLeft: <TimeCountDown leftMilliseconds={item.leftMilliseconds} /></Info>}
            <Info>Created: {utcToLocalDatetime(item.createdDate)}</Info>
            <Box sx={{ flex: 1 }}>
                {item.status === PaymentStatus.NewCome && <ElButton onClick={() => setClientSecret(item.payUrl)}>Pay</ElButton>}
            </Box>
            <StripeCheckout clientSecret={clientSecret} type={OrganizationType.Facility} onCancel={() => setClientSecret('')} />
        </Container>
    );
}
