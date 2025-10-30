import { leagueService, tournamentService, associationService, athleteService } from 'el/api';
import { ElBody, ElIdiograph, ElLink, ElScrollContainer, ElTitle, ElIcon, ElConfirm } from 'el/components';
import { OrganizationType } from 'el/enums';
import routes from 'el/navigation/routes';
import { useGoBack, useProfileRoute, useElToast } from 'el/utils';
import { Center, Divider, HStack, Row, Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import OfficiateRequestItem from './components/OfficiateRequestItem';

const OfficiateScreen = ({ navigation, route }) => {
    const toast = useElToast();
    useGoBack();
    const { goToAthleteProfile } = useProfileRoute();

    const { id, isAdminView, type } = route.params;
    const [officiateList, setOfficiateList] = useState<any[]>([]);
    const [officiateRequestList, setOfficiateRequestList] = useState<any[]>([]);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [targetAthleteId, setTargetAthleteId] = useState();

    useEffect(() => {
        initQuery();
    }, [id]);

    const initQuery = () => {
        getOfficiates();
        if (isAdminView) {
            getOfficiateRequests();
        }
    };

    const buildQueryOfficiateService = () => {
        if (type === OrganizationType.League) {
            return leagueService.getLeagueOfficiates(id);
        }
        if (type === OrganizationType.Tournament) {
            return tournamentService.getTournamentOfficiates(id);
        }
        if (type === OrganizationType.Association) {
            return associationService.getAssociationOfficiates(id);
        }
    };

    const buildOfficiateRequestService = () => {
        if (type === OrganizationType.League) {
            return leagueService.getLeagueOfficiateRequests(id, true);
        }
        if (type === OrganizationType.Tournament) {
            return tournamentService.getTournamentOfficiateRequests(id, true);
        }
        if (type === OrganizationType.Association) {
            return associationService.getAssociationOfficiateRequests(id, true);
        }
    };

    const getOfficiateRequests = async () => {
        const res: any = await buildOfficiateRequestService();
        if (res && res.code === 200) {
            setOfficiateRequestList(res.value);
        }
    };

    const getOfficiates = async () => {
        const res: any = await buildQueryOfficiateService();
        if (res && res.code === 200) {
            setOfficiateList(res.value);
        }
    };

    const handleRemoveClick = async () => {
        const res: any = await removeOfficiate(targetAthleteId);
        if (res && res.code === 200) {
            setOfficiateList(officiateList.filter(item => item.athleteId != targetAthleteId));
            setIsShowConfirm(false);
        } else {
            toast.error(res.Message);
        }
    };

    const removeOfficiate = (athleteId) => {
        if (type === OrganizationType.League) {
            return athleteService.removeLeagueOfficiate(athleteId, id);
        }

        if (type === OrganizationType.Tournament) {
            return athleteService.removeTournamentOfficiate(athleteId, id);
        }

        if (type === OrganizationType.Association) {
            return athleteService.removeAssociationOfficiate(athleteId, id);
        }
    }
    const handleOnCancel = () => {
        setIsShowConfirm(false);
    }
    return (
        <ElScrollContainer>
            <ElTitle>Officiate List</ElTitle>
            <ElLink to={routes.BecomeOfficiate} params={{ id, type }} mb={2}>
                + Become an officiate
            </ElLink>
            <Divider />
            {
                isAdminView && officiateRequestList.length !== 0 &&
                <>
                    <Row justifyContent="space-between">
                        <ElBody>Requesting to Join</ElBody>
                    </Row>
                    {officiateRequestList.map(item =>
                        <OfficiateRequestItem
                            key={item.requestId}
                            organizationType={type}
                            organizationId={id}
                            item={item}
                            onHandleSuccess={() => initQuery()}
                        />
                    )}
                </>
            }
            {
                isAdminView && officiateList.length !== 0 &&
                <ElBody mt={2}>Registered Officiates</ElBody>
            }
            {
                officiateList.length === 0 &&
                <ElBody textAlign="center" mt={1}>
                    No Officiates
                </ElBody>
            }
            {
                officiateList.map(item =>
                    <React.Fragment key={item.athleteId}>
                        <HStack>
                            <ElIdiograph
                                onPress={() => goToAthleteProfile(item.athleteId)}
                                my={2}
                                title={item.name}
                                imageUrl={item.pictureUrl}
                                subtitle={item.officiateType === OrganizationType.Association && <Text>({item.officiateType})</Text>} />
                            <Center>
                                <ElIcon name="close" onPress={() => { setIsShowConfirm(true); setTargetAthleteId(item.athleteId) }}></ElIcon>
                            </Center>
                        </HStack>
                        <Divider></Divider>
                    </React.Fragment>
                )
            }
            <ElConfirm
                visible={isShowConfirm}
                message="Are you sure you want to remove this officiate?"
                onCancel={handleOnCancel}
                onConfirm={handleRemoveClick}
            />
        </ElScrollContainer>
    );
};

export default OfficiateScreen;
