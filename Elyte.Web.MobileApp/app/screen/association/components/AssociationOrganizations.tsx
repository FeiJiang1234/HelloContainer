import { useNavigation } from '@react-navigation/native';
import { associationService } from 'el/api';
import { ElButton, ElIdiograph, ElList } from 'el/components';
import colors from 'el/config/colors';
import { OrganizationType, organizationTypes } from 'el/enums';
import routes from 'el/navigation/routes';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast, useProfileRoute, utils } from 'el/utils';
import { Actionsheet, Box, ChevronDownIcon, ChevronUpIcon, Flex, HStack, Pressable, Text, useDisclose, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';


export default function AssociationOrganizations({ associationId, associationCode, isAdminView }) {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [organizations, setOrganizations] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const toast = useElToast();

    const navigation: any = useNavigation();
    useEffect(() => { getAssociationOrganizations() }, [associationId]);

    const getAssociationOrganizations = async () => {
        dispatch(PENDING());
        const res: any = await associationService.getAssociationOrganizations(associationId);
        if (res && res.code === 200 && res.value && res.value?.length > 0) {
            dispatch(SUCCESS());
            setLeagues(res.value.filter(x => x.organizationType === 'League'));
            setTournaments(res.value.filter(x => x.organizationType === 'Tournament'));
            setFacilities(res.value.filter(x => x.organizationType === 'Facility'));
            setOrganizations(res.value);
        } else {
            dispatch(ERROR());
        }
    };

    const handleCreateOrganization = (type) => {
        onClose();
        const organizationType = organizationTypes.find(x => x.value === type);
        if (organizationType && organizationType.router) {
            navigation.navigate(organizationType.router, { associationId: associationCode, fromAssociation: true });
        }
    }

    const handleSeeMoreClick = (type) => {
        navigation.navigate(routes.AssociationOrganizationList, { id: associationId, type: type });
    }

    return <>
        {utils.isArrayNullOrEmpty(organizations) && <Text>No Organizations</Text>}
        {!utils.isArrayNullOrEmpty(leagues) && <OrganizationList title="Leagues" data={leagues} onSeeMoreClick={() => handleSeeMoreClick(OrganizationType.League)} />}
        {!utils.isArrayNullOrEmpty(tournaments) && <OrganizationList title="Tournaments" data={tournaments} onSeeMoreClick={() => handleSeeMoreClick(OrganizationType.Tournament)} />}
        {!utils.isArrayNullOrEmpty(facilities) && <OrganizationList title="Facilities" data={facilities} onSeeMoreClick={() => handleSeeMoreClick(OrganizationType.Facility)} />}
        {
            isAdminView && <ElButton onPress={onOpen}> + Create</ElButton>
        }
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
                <Actionsheet.Item onPress={() => handleCreateOrganization("league")}>League</Actionsheet.Item>
                <Actionsheet.Item onPress={() => handleCreateOrganization("tournament")}>Tournament</Actionsheet.Item>
            </Actionsheet.Content>
        </Actionsheet>
    </>
}

const OrganizationList = ({ title, data, onSeeMoreClick }) => {
    const { goToProfile } = useProfileRoute();
    const [isShowDetails, setIsShowDetails] = useState(true);

    const handleSeeMoreClick = () => {
        if (onSeeMoreClick) {
            onSeeMoreClick();
        }
    }

    return (
        <>
            <HStack mt={3} mb={3} justifyContent="space-between">
                <Pressable onPress={() => setIsShowDetails(!isShowDetails)}>
                    <HStack>
                        <Text color={colors.medium}>{title} </Text>
                        {
                            isShowDetails ? <ChevronDownIcon /> : <ChevronUpIcon />
                        }
                    </HStack>
                </Pressable>
                <Pressable onPress={handleSeeMoreClick}><Text style={{ color: colors.secondary, }}>See More</Text></Pressable>
            </HStack>
            <VStack space={1}>
                {
                    isShowDetails && !utils.isArrayNullOrEmpty(data) &&
                    <ElList
                        data={data}
                        keyExtractor={item => item.organizationId}
                        renderItem={({ item }) => (
                            <ElIdiograph
                                onPress={() => goToProfile(item.organizationType, item.organizationId)}
                                title={item.name}
                                imageUrl={item.imageUrl}
                                subtitle={item.address}
                                imageSize={48}
                            />
                        )}
                    />
                }
            </VStack>
        </>
    );
};