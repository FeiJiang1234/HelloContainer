import { leagueService } from "el/api";
import { ElBody } from "el/components";
import { OrganizationType } from "el/enums";
import OrganizationFacilities from "el/screen/organization/components/OrganizationFacilities";
import { Row } from "native-base";
import React, { useEffect, useState } from "react";

type PropType = {
    leagueId: string;
    isAdminView?: boolean;
    isLeagueGameStarted?: boolean;
};

const LeagueFacilities = React.forwardRef<any, PropType>(({ leagueId, isAdminView, isLeagueGameStarted }, ref) => {
    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        getLeagueFacilities();
    }, [leagueId]);

    const getLeagueFacilities = async () => {
        const res: any = await leagueService.getRentedFacilitiesForLeague(leagueId);
        if (res && res.code === 200) {
            setFacilities(res.value);
        }
    }

    return (
        <>
            {facilities.length !== 0 && (
                <Row justifyContent="space-between" alignItems="center">
                    <ElBody>Facilities in League</ElBody>
                </Row>
            )}
            <OrganizationFacilities
                facilities={facilities}
                isAdminView={isAdminView}
                organizationType={OrganizationType.League}
                organizationId={leagueId}
            />
        </>
    );
});

export default LeagueFacilities;