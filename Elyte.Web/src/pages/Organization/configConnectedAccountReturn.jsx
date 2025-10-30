import React from 'react';
import { ElTitle } from 'components';
import OrganizationInfoPayReturn from './organizationInfoPayReturn';

const ConfigConnectedAccountReturn = () => {
    var url = location.search;
    const params = new URLSearchParams(url);
    const organizationId = params.get('organizationId');
    const organizationType = params.get('organizationType');

    return <>
        <ElTitle center>Congratulations!</ElTitle>
        <ElTitle center mb={10}>Your information has been updated! Please wait for Stripe to approve the changes.</ElTitle>
        <OrganizationInfoPayReturn organizationId={organizationId} organizationType={organizationType} />
    </>
};

export default ConfigConnectedAccountReturn;