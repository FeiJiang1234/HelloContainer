import { useNavigation } from '@react-navigation/native';
import { teamService } from 'el/api';
import { ElIdiograph, ElList, ElMenu } from 'el/components';
import { ActionModel } from 'el/models/action/actionModel';
import routes from 'el/navigation/routes';
import { useProfileRoute } from 'el/utils';
import { Box, Center, HStack, Pressable, Text } from 'native-base';
import React, { useState, useEffect } from 'react';

const TeamJoinedOrganizationList = ({ teamId, sportType, isAdminView }) => {
    const [organizationList, setOrganizationList] = useState([]);
    const navigation: any = useNavigation();
    const { saveCurrentRouteForGoback, goToProfile } = useProfileRoute();

    useEffect(() => {
        getOrangizations();
    }, [teamId]);

    const getOrangizations = async () => {
        const res: any = await teamService.getTeamJoinedOrganizations(teamId);
        if (res && res.code === 200) {
            setOrganizationList(res.value);
        }
    };

    const getOptions = (item) => {
        const options: ActionModel[] = [
            {
                label: 'Team Line Up',
                onPress: () => {
                    saveCurrentRouteForGoback(routes.OrganizationTeamLineUp);
                    navigation.navigate(routes.Organization, {
                        screen: routes.OrganizationTeamLineUp,
                        params: {
                            teamId: teamId,
                            organizationId: item.id,
                            organizationType: item.organizationType,
                            isAdminView: isAdminView,
                            sportType: sportType,
                        },
                    });
                },
            },
        ];
        return options;
    }

    return (
        <Box mt={2}>
            {organizationList.length === 0 && (
                <Text textAlign="center">Not Joined Any Organizations</Text>
            )}
            <ElList
                my={3}
                data={organizationList}
                renderItem={({ item }) => (
                    <HStack space={5}>
                        <ElIdiograph
                            onPress={() => goToProfile(item.organizationType, item.id)}
                            title={item.name}
                            subtitle={`${item.organizationType}, ${item.address}`}
                            imageUrl={item.imageUrl}
                        />
                        <Center>
                            <ElMenu items={getOptions(item)}></ElMenu>
                        </Center>
                    </HStack>
                )}
            />
        </Box>
    );
};

export default TeamJoinedOrganizationList;
