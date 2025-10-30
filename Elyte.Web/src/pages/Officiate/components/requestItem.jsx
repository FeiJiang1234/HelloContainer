import React from 'react';
import { ElButton, ElSvgIcon, ElMenuBtn } from 'components';
import { useProfileRoute, useDateTime } from 'utils';
import IdiographRow from 'parts/Commons/idiographRow';
import { leagueService, tournamentService, associationService } from 'services';

const RequestItem = ({ organizationType, organizationId, item, onHandleSuccess }) => {
    const { athleteProfile } = useProfileRoute();
    const { utcToLocalDatetime } = useDateTime();
    const menuItems = [
        { text: 'Decline', onClick: () => handleDeclineClick() },
    ];

    const buildDeclineOfficiateRequestService = () => {
        if (organizationType === "League") {
            return leagueService.declineLeagueOfficiateRequest(organizationId, item.requestId);
        }

        if (organizationType === "Tournament") {
            return tournamentService.declineTournamentOfficiateRequest(organizationId, item.requestId);
        }

        if (organizationType === "Association") {
            return associationService.declineAssociationOfficiateRequest(organizationId, item.requestId);
        }
    }

    const buildAcceptOfficiateRequestService = () => {
        if (organizationType === "League") {
            return leagueService.acceptLeagueOfficiateRequest(organizationId, item.requestId);
        }

        if (organizationType === "Tournament") {
            return tournamentService.acceptTournamentOfficiateRequest(organizationId, item.requestId);
        }

        if (organizationType === "Association") {
            return associationService.acceptAssociationOfficiateRequest(organizationId, item.requestId);
        }
    }

    const handleDeclineClick = async () => {
        const res = await buildDeclineOfficiateRequestService();
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    }

    const handleAcceptClick = async () => {
        const res = await buildAcceptOfficiateRequestService();
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    }

    return <IdiographRow
        title={`${item.firstName} ${item.lastName}`}
        subtitle={`Request Date: ${utcToLocalDatetime(item.requestDate)}`}
        imgurl={item.pictureUrl}
        to={athleteProfile(item.athleteId)}
    >
        <ElButton small onClick={handleAcceptClick}>Accept</ElButton>
        <ElMenuBtn items={menuItems}>
            <ElSvgIcon light small name="options" />
        </ElMenuBtn>
    </IdiographRow>
}


export default RequestItem; 