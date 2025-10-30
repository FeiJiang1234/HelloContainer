import { ElBody, ElButton } from 'el/components';
import colors from 'el/config/colors';
import { useDateTime, useElStripe } from 'el/utils';
import { Box } from 'native-base';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import TimeCountDown from './timeCountDown';
import { PaymentStatus } from 'el/enums';

const styles = StyleSheet.create({
    box: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 16,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.medium,
        padding: 8,
    },
    elBody: {
        color: colors.dark,
    },
});

export default function PaymentCard({ type, item, onSuccess }) {
    const { utcToLocalDatetime } = useDateTime();
    const { setClientSecret, presentPayment} = useElStripe();
    
    useEffect(() => {
        setClientSecret(item.payUrl);
    }, []);

    const openPaymentSheet = async () => {
        await presentPayment(() => onSuccess && onSuccess(), null);
    };

    return (
        <Box style={styles.box}>
            <ElBody style={styles.elBody}>Team: {item.teamName}</ElBody>
            <ElBody style={styles.elBody}>
                {type}: {item.name}
            </ElBody>
            <ElBody style={styles.elBody}>Amount: ${item.amount}</ElBody>
            <ElBody style={styles.elBody}>Status: {item.status}</ElBody>
            <ElBody>
                PaymentTimeLeft: <TimeCountDown leftMilliseconds={item.leftMilliseconds} />
            </ElBody>
            <ElBody style={styles.elBody}>Created: {utcToLocalDatetime(item.createdDate)}</ElBody>
            {item.status === PaymentStatus.NewCome && <ElButton onPress={openPaymentSheet}>Pay</ElButton>}
        </Box>
    );
}
