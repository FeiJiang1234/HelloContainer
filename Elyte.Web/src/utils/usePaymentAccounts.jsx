import React, { useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import BlockIcon from '@mui/icons-material/Block';
import { useTheme } from '@mui/styles';
import { athleteService, leagueService, tournamentService, facilityService } from 'services';
import { OrganizationType } from 'enums';

export default function usePaymentAccounts () {
    const [paymentAccounts, setAccounts] = useState([]);
    const theme = useTheme();

    const setPaymentAccounts = (accounts) => {
        var items = accounts.map(x => ({ 
            label: x.accountId, 
            value: x.accountId, 
            enabled: x.enabled,
            disabled: x.enabled !== undefined && !x.enabled,
            icon: x.enabled !== undefined && 
                (x.enabled ? 
                <DoneIcon className='payment-account-icon' titleAccess='Complete' sx={{ color: theme.palette.secondary.minor }} /> : 
                <BlockIcon className='payment-account-icon' titleAccess='Restricted' sx={{ color: theme.palette.error.main }}/>)
        }));
        setAccounts(items);
    };

    const getPaymentAccounts = async () => {
        const res = await athleteService.getPaymentAccounts();
        if (res && res.code === 200) setPaymentAccounts(res.value);
    }
    
    const configPaymentAccount = async (type, id) => {
        const res = await getConfigPaymentAccountService(type, id);
        if (res && res.code === 200) window.location.href = res.value;
    }

    const getConfigPaymentAccountService = async (type, id) => {
        if(type === OrganizationType.League) return leagueService.getConnectedAccountUrl(id);
        if(type === OrganizationType.Tournament) return tournamentService.getConnectedAccountUrl(id);
        if(type === OrganizationType.Facility) return facilityService.getConnectedAccountUrl(id);
    }

    return { paymentAccounts, setPaymentAccounts, getPaymentAccounts, configPaymentAccount };
}
