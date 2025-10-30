import { leagueService, tournamentService } from 'el/api';
import associationService from 'el/api/associationService';
import { ElBody, ElIcon } from 'el/components';
import { Box, Divider, Row } from 'native-base';
import React, { useEffect, useState } from 'react';

const OrganizationContactUs = ({ organizationId, organizationType }) => {
    const [leagueContactUs, setLeagueContactUs] = useState<any>({});
    useEffect(() => {
        getContacts();
    }, []);

    const getContacts = async () => {
        const res: any = await getContactService();
        if (res && res.code === 200) setLeagueContactUs(res.value[0]);
    };

    const getContactService = () => {
        if (organizationType === 'League') return leagueService.getContactUs(organizationId);
        if (organizationType === 'Tournament')
            return tournamentService.getContactUs(organizationId);
        if (organizationType === 'Association')
            return associationService.getContactUs(organizationId);
    };

    return (
        <Box mt={2}>
            <ElBody>Phone (Owner)</ElBody>
            <Row mt={1}>
                <ElIcon name="phone-outline" />
                <ElBody>{leagueContactUs.phoneNumber}</ElBody>
            </Row>
            <Divider my={2} />
            <ElBody>Email (Owner)</ElBody>
            <Row mt={1}>
                <ElIcon name="email-outline" />
                <ElBody>{leagueContactUs.email}</ElBody>
            </Row>
        </Box>
    );
};

export default OrganizationContactUs;
