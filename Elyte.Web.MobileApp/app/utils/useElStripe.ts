import { useStripe } from '@stripe/stripe-react-native';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export default function useElStripe() {
    const [clientSecret, setClientSecret] = useState('');
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const registerSuccessMessage = "Your registration was successful!";

    useEffect(() => {
        if(!clientSecret) return;

        initPayment();
    }, [clientSecret]);

    const initPayment = async () => {
        await initPaymentSheet({
            merchantDisplayName: 'ELYTE LLC',
            paymentIntentClientSecret: clientSecret,
        });
    };

    const presentPayment = async (onSuccess, onFailed, successMessage = registerSuccessMessage) => {
        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message, [
                { text: 'OK', onPress: () => onFailed && onFailed() },
            ]);
        } else {
            Alert.alert('Success', successMessage, [
                { text: 'OK', onPress: () => onSuccess && onSuccess() },
            ]);
        }
    };

    const presentPaymentDirect = async (secret, onSuccess, onFailed, successMessage = registerSuccessMessage) => {
        await initPaymentSheet({
            merchantDisplayName: 'ELYTE LLC',
            paymentIntentClientSecret: secret,
        });

        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message, [
                { text: 'OK', onPress: () => onFailed && onFailed() },
            ]);
        } else {
            Alert.alert('Success', successMessage, [
                { text: 'OK', onPress: () => onSuccess && onSuccess() },
            ]);
        }
    };

    return { clientSecret, setClientSecret, initPayment, presentPayment, presentPaymentDirect };
}
