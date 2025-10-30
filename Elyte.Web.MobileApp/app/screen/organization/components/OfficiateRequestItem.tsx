import { associationService, leagueService, tournamentService } from 'el/api';
import { ElIdiograph, ElMenu, ElSwipeable } from 'el/components';
import { OrganizationType } from 'el/enums';
import { ActionModel } from 'el/models/action/actionModel';
import { useDateTime, useProfileRoute } from 'el/utils';
import { Center, HStack } from 'native-base';
import React from 'react';

const OfficiateRequestItem = ({ organizationType, organizationId, item, onHandleSuccess }) => {
    const { utcToLocalDatetime } = useDateTime();
    const { goToAthleteProfile } = useProfileRoute();

    const options: ActionModel[] = [
        { label: 'Accept', onPress: () => handleAcceptClick() },
        { label: 'Decline', onPress: () => handleDeclineClick() },
    ];

    const handleDeclineClick = async () => {
        const res: any = await buildDeclineOfficiateRequestService();
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    };

    const handleAcceptClick = async () => {
        const res: any = await buildAcceptOfficiateRequestService();
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    };

    const buildDeclineOfficiateRequestService = () => {
        if (organizationType === OrganizationType.League) {
            return leagueService.declineLeagueOfficiateRequest(organizationId, item.requestId);
        }

        if (organizationType === OrganizationType.Tournament) {
            return tournamentService.declineTournamentOfficiateRequest(organizationId, item.requestId);
        }

        if (organizationType === OrganizationType.Association) {
            return associationService.declineAssociationOfficiateRequest(organizationId, item.requestId);
        }
    };

    const buildAcceptOfficiateRequestService = () => {
        if (organizationType === OrganizationType.League) {
            return leagueService.acceptLeagueOfficiateRequest(organizationId, item.requestId);
        }

        if (organizationType === OrganizationType.Tournament) {
            return tournamentService.acceptTournamentOfficiateRequest(organizationId, item.requestId);
        }

        if (organizationType === OrganizationType.Association) {
            return associationService.acceptAssociationOfficiateRequest(organizationId, item.requestId);
        }
    };

    return (
        <HStack space={5}>
            <ElIdiograph
                onPress={() => goToAthleteProfile(item.athleteId)}
                my={2}
                title={`${item.firstName} ${item.lastName}`}
                subtitle={`Request Date: ${utcToLocalDatetime(item.requestDate)}`}
                imageUrl={item.pictureUrl}
            />
            <Center>
                <ElMenu items={options} />
            </Center>
        </HStack>
    );
};

export default OfficiateRequestItem;
