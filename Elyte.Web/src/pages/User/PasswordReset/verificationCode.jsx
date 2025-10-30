import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { ElButton, AccountContainer, ElTitle, ElContent, ElLink } from 'components';
import { userService } from 'services';

const VerificationCode = () => {
    const history = useHistory();
    const location = useLocation();
    const params = location.state?.params;
    const [account, setAccount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerifiyClick = async () => {
        setLoading(true);
        const res = await userService.sendVerificationCode(account);
        setLoading(false);
        if (res && res.code === 200) {
            return history.push(`/oneTimePassCode`, { params: { account: account } });
        }
    };

    const encryptionEmail = v => {
        var cbData = v.split('');
        cbData.splice(1, v.indexOf('@') - 2, '****');
        return cbData.join('');
    };

    const encryptionPhone = v => {
        var cbData = v.split('');
        cbData.splice(3, v.length - 7, '****');
        return cbData.join('');
    };

    return (
        <AccountContainer>
            <ElTitle>Verification Code</ElTitle>
            <RadioGroup name="verifyType" value={account} onChange={e => setAccount(e.target.value)}>
                <FormControlLabel value={params?.phoneNumber} control={<Radio color="primary" />}
                    label={<Box p={2}>Get a code texted on {encryptionPhone(params?.phoneNumber ?? '')}</Box>}
                />

                <FormControlLabel value={params?.email} control={<Radio color="primary" />}
                    label={<Box p={2}>Get a code emailed to: {encryptionEmail(params?.email ?? '')}</Box>}
                />
            </RadioGroup>

            <span className="fillRemain"></span>

            <Box mb={5}>
                <ElButton loading={loading} disabled={!account || loading} onClick={handleVerifiyClick}>Continue</ElButton>
                <ElContent mt={1} center>
                    New to Elyte? <ElLink green to="/register">Sign up for free.</ElLink>
                </ElContent>
            </Box>
        </AccountContainer>
    );
};

export default VerificationCode;
