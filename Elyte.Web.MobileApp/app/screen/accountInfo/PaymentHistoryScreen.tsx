import React, { useEffect, useState } from 'react';
import { useGoBack, utils } from 'el/utils';
import { ElActionsheet, ElBody, ElIcon, ElScrollContainer, ElTitle } from 'el/components';
import { Box, Flex, Text, useDisclose } from 'native-base';
import { ActionModel } from 'el/models/action/actionModel';
import { OrganizationType } from 'el/enums';
import colors from 'el/config/colors';
import { athleteService } from 'el/api';
import PaymentCard from './components/paymentCard';
import PaymentRentCard from './components/paymentRentCard';
import { Pressable } from 'react-native';

export default function PaymentHistoryScreen() {
    useGoBack();
    const [payments, setPayments] = useState<any>([]);
    const [type, setType] = useState(OrganizationType.League);
    const { isOpen, onOpen, onClose } = useDisclose();

    const menuItems: ActionModel[] = [
        { label: OrganizationType.League, onPress: () => setType(OrganizationType.League) },
        { label: OrganizationType.Tournament, onPress: () => setType(OrganizationType.Tournament) },
        { label: OrganizationType.Facility, onPress: () => setType(OrganizationType.Facility) },
    ];

    useEffect(() => {
        getPaymentHistory();
    }, [type]);

    const getPaymentHistory = async () => {
        const res: any = await getPaymentService();
        if (res && res.code === 200) setPayments(res.value);
    };

    const getPaymentService = () => {
        if (type === OrganizationType.Facility) return athleteService.getRentPaymentHistory();
        return athleteService.getPaymentHistory(type);
    }

    return (
        <ElScrollContainer>
            <ElTitle>Payments</ElTitle>
            <Pressable onPress={onOpen}>
                <Box>
                    <Flex direction="row" justifyContent="space-between" mb="2">
                        <Text color={colors.medium}>{type}</Text>
                        <ElIcon name="chevron-down" />
                    </Flex>
                </Box>
            </Pressable>
            {payments.map(x => (
                <React.Fragment key={x.id}>
                    {(type === OrganizationType.League || type === OrganizationType.Tournament) && <PaymentCard type={type} item={x} onSuccess={getPaymentHistory} />}
                    {type === OrganizationType.Facility && <PaymentRentCard type={type} item={x} onPaySuccess={() => getPaymentHistory()} />}
                </React.Fragment>
            ))}

            {utils.isArrayNullOrEmpty(payments) && <ElBody center>no payments</ElBody>}
            <ElActionsheet isOpen={isOpen} onClose={onClose} items={menuItems} />
        </ElScrollContainer>
    )

}
