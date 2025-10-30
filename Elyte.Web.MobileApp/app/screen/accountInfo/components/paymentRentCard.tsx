import { ElBody, ElButton } from "el/components";
import colors from "el/config/colors";
import { PaymentStatus } from "el/enums";
import { useDateTime, useElStripe } from "el/utils";
import { Box } from "native-base";
import React from "react";
import { StyleSheet, Text } from 'react-native';
import TimeCountDown from "./timeCountDown";


const styles = StyleSheet.create({
    box: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 16,
        borderWidth: 0.5,
        padding: 8,
    },
    elBody: {
        color: colors.dark,
    },
});

export default function PaymentRentCard({ type, item, onPaySuccess }) {
    const { utcToLocalDatetime, utcToLocalDate } = useDateTime();
    const { presentPaymentDirect } = useElStripe();

    return (
        <Box style={styles.box} rounded="lg" borderColor="coolGray.100" backgroundColor="gray.100" >
            <ElBody style={styles.elBody}>{type}: {item.name}</ElBody>
            <ElBody style={styles.elBody}>RentFor:{item.rentFor && <Text>{item.rentFor}</Text>}</ElBody>
            <ElBody style={styles.elBody}>RentDate: {utcToLocalDate(item.rentalDate)}</ElBody>
            <ElBody style={styles.elBody}>RentTimeRanges: {item.rentalTimeRanges}</ElBody>
            <ElBody style={styles.elBody}>Amount: ${item.amount}</ElBody>
            <ElBody style={styles.elBody}>Status: {item.status}</ElBody>
            <ElBody style={styles.elBody}>PaymentTimeLeft: {item.leftMilliseconds && <TimeCountDown leftMilliseconds={item.leftMilliseconds} />}</ElBody>
            <ElBody style={styles.elBody}>Created: {utcToLocalDatetime(item.createdDate)}</ElBody>
            <Box>
                {item.status === PaymentStatus.NewCome && <ElButton onPress={() => presentPaymentDirect(item.payUrl, onPaySuccess, null)}>Pay</ElButton>}
            </Box>
        </Box >
    );
}
