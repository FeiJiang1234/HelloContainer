import { tournamentService } from "el/api";
import { ElBody } from "el/components";
import { OrganizationType } from "el/enums";
import OrganizationFacilities from "el/screen/organization/components/OrganizationFacilities";
import { Row } from "native-base";
import React, { useEffect, useState } from "react";

type PropType = {
    tournamentId: string;
    isAdminView?: boolean;
    isTournamentGameStarted?: boolean;
};

const TournamentFacilities = React.forwardRef<any, PropType>(({ tournamentId, isAdminView, isTournamentGameStarted }, ref) => {
    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        getTournamentFacilities();
    }, [tournamentId]);

    const getTournamentFacilities = async () => {
        const res: any = await tournamentService.getRentedFacilitiesForTournament(tournamentId);
        if (res && res.code === 200) {
            setFacilities(res.value);
        }
    }

    return (
        <>
            {facilities.length !== 0 && (
                <Row justifyContent="space-between" alignItems="center">
                    <ElBody>Facilities in Tournament</ElBody>
                </Row>
            )}
            <OrganizationFacilities
                facilities={facilities}
                isAdminView={isAdminView}
                organizationType={OrganizationType.Tournament}
                organizationId={tournamentId}
            />
        </>
    );
});

export default TournamentFacilities;