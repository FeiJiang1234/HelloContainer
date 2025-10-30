import { IconButton, Typography } from '@mui/material';
import { ElBody, ElBox, ElMenuBtn, ElSvgIcon, ElTitle } from 'components';
import React, { useEffect, useState } from 'react';
import { athleteService } from 'services';
import PaymentCard from './paymentCard';
import PaymentRentCard from './paymentRentCard';

export default function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [type, setType] = useState('League');

    const menuItems = [
        { text: 'League', onClick: () => setType('League') },
        { text: 'Tournament', onClick: () => setType('Tournament') },
        { text: 'Facility', onClick: () => setType('Facility') }
    ];

    useEffect(() => {
        getPaymentHistory();
    }, [type]);

    const getPaymentHistory = async () => {
        const res = await getPaymentService();
        if (res && res.code === 200) setPayments(res.value);
    };

    const getPaymentService = () => {
        if(type === 'Facility') return athleteService.getRentPaymentHistory();
        return athleteService.getPaymentHistory(type);
    }

    return (
        <>
            <ElTitle>Payments</ElTitle>
            <ElBox center>
                <Typography>{type}</Typography>
                <span className="fillRemain"></span>
                <ElMenuBtn items={menuItems}>
                    <IconButton>
                        <ElSvgIcon dark xSmall name="expandMore"></ElSvgIcon>
                    </IconButton>
                </ElMenuBtn>
            </ElBox>

            {payments.map(x => (
                <React.Fragment key={x.id}>
                    { ( type === 'League' || type === 'Tournament') && <PaymentCard type={type} item={x}/> }
                    { type === 'Facility' && <PaymentRentCard type={type} item={x}/> }
                </React.Fragment>
            ))}
            { Array.isNullOrEmpty(payments)  && <ElBody center>no payments</ElBody> }
        </>
    );
}
