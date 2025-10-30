import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { AccountContainer, ElTitle } from 'components';
import { termService } from 'services';
import { utils } from 'utils';

const TermsOfPrivacyPolicy = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        const isPreview = utils.getLocationQueryString("isPreview");
        getTerm(isPreview)
    }, []);

    const getTerm = async (isPreview) => {
        const res = await termService.getTerm("PrivacyPolicyTerm", isPreview);
        if (res && res.code === 200) {
            setContent(res.value?.content);
        }
    }

    return (
        <AccountContainer>
            <ElTitle>Terms of Service</ElTitle>
            <Box mb={1} sx={{ height: 'inherit', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: content }} />
        </AccountContainer>
    );
};

export default TermsOfPrivacyPolicy;
