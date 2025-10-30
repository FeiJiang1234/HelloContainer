import { leagueService } from 'el/api';
import { ElBody } from 'el/components';
import OrganizationTeams from 'el/screen/organization/components/OrganizationTeams';
import { Box, Row } from 'native-base';
import React, { useEffect, useImperativeHandle, useState } from 'react';

type PropType = {
    leagueId: string;
    isAdminView?: boolean;
    isLeagueGameStarted?: boolean;
};

const LeagueTeams = React.forwardRef<any, PropType>(({ leagueId, isAdminView, isLeagueGameStarted }, ref) => {
    const [teams, setTeams] = useState([]);
    useEffect(() => {
        getLeagueTeams();
    }, [leagueId]);

    const getLeagueTeams = async () => {
        const res: any = await leagueService.getLeagueTeams(leagueId);
        if (res && res.code === 200) {
            setTeams(res.value);
        }
    };

    const handleAfterRemove = () => getLeagueTeams();

    useImperativeHandle(ref, () => ({
        getLeagueTeams: () => getLeagueTeams(),
    }));

    return (
        <Box mt={2}>
            {teams.length !== 0 && (
                <Row justifyContent="space-between" alignItems="center">
                    <ElBody>Teams in League</ElBody>
                </Row>
            )}

            <OrganizationTeams
                teams={teams}
                isAdminView={isAdminView}
                organizationType={'League'}
                organizationId={leagueId}
                onRefresh={handleAfterRemove}
            />
        </Box>
    );
});

export default LeagueTeams;
