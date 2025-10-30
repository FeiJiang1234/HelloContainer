import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ElButton, ElDialog } from 'components';
import { leagueService, tournamentService, facilityService, userService } from 'services';
import { OrganizationType } from 'enums';

const StripeCheckout = ({ clientSecret, type, onCancel }) => {
    if (!clientSecret) return null;
    const [organizationId, setOrganizationId] = useState();
    const [stripePromise, setStripePromise] = useState();

    useEffect(() => {
        getStripePublishableKey();
    }, []);


    useEffect(() => {
        getOrganizationInfoByPayment();
    }, [type]);

    const getStripePublishableKey = async () => {
        const res = await userService.getStripePublishableKey();
        if (res && res.code == 200) {
            setStripePromise(loadStripe(res.value));
        }
    }

    const getOrganizationInfoByPayment = async () => {
        const res = await getOrganizationService();
        if (res && res.code == 200) {
            setOrganizationId(res.value.organizationId);
        }
    }

    const getOrganizationService = () => {
        if (type == OrganizationType.League) return leagueService.GetLeagueInfoByPayment(clientSecret);
        if (type == OrganizationType.Tournament) return tournamentService.GetTournamentInfoByPayment(clientSecret);
        if (type == OrganizationType.Facility) return facilityService.GetFacilityInfoByPayment(clientSecret);
    }

    return (
        <ElDialog open={true} onClose={() => onCancel && onCancel()} title="Checkout">
            {stripePromise && <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
                <CheckoutForm type={type} organizationId={organizationId} clientSecret={clientSecret} />
            </Elements>
            }
        </ElDialog>
    );
};

const CheckoutForm = ({ type, organizationId, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/paySuccess?organizationId=${organizationId}&organizationType=${type}&connectedAccount=${clientSecret}`,
            },
        });
        setLoading(false);
        if (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <ElButton mt={2} disabled={!stripe} type='submit' loading={loading}>Submit</ElButton>
        </form>
    );
};

export default StripeCheckout;
