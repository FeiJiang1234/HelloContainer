import { tournamentService } from 'el/api';
import { ElBody } from 'el/components';
import OrganizationTeams from 'el/screen/organization/components/OrganizationTeams';
import { Box, Row } from 'native-base';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { OrganizationType } from 'el/enums';
import { useElToast } from 'el/utils';

type PropType = {
    tournamentId: string;
    isAdminView?: boolean;
    isTournamentGameStarted?: boolean;
};

const TournamentTeams = React.forwardRef<any, PropType>(({ tournamentId, isAdminView, isTournamentGameStarted }, ref) => {
    const [teams, setTeams] = useState([]);
    const toast = useElToast();
    
    useEffect(() => {
        getTournamentTeams();
    }, [tournamentId]);

    const getTournamentTeams = async () => {
        const res: any = await tournamentService.getTournamentTeams(tournamentId);
        if (res && res.code === 200) {
            setTeams(res.value);
        }else{
            toast.error(res.Message);
        }
    };

    const handleAfterRemove = () => getTournamentTeams();

    useImperativeHandle(ref, () => ({
        getTournamentTeams: () => getTournamentTeams(),
    }));

    return (
        <Box mt={2}>
            {teams.length !== 0 && (
                <Row justifyContent="space-between" alignItems="center">
                    <ElBody>Teams in Tournament</ElBody>
                </Row>
            )}

            <OrganizationTeams
                teams={teams}
                isAdminView={isAdminView}
                organizationType={OrganizationType.Tournament}
                organizationId={tournamentId}
                onRefresh={handleAfterRemove}
            />
        </Box>
    );
});

export default TournamentTeams;