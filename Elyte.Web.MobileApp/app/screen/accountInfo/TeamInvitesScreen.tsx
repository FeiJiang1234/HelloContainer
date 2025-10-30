import { athleteService } from 'el/api';
import { ElContainer, ElIdiograph, ElFlatList, ElTitle, ElMenu } from 'el/components';
import { ActionModel } from 'el/models/action/actionModel';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast, useGoBack, useProfileRoute } from 'el/utils';
import { Center, HStack } from 'native-base';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const TeamInvitesScreen = ({ route }) => {
    useGoBack();
    const [invites, setInvites] = useState<any[]>([]);
    const { id } = route.params;
    const { goToTeamProfile } = useProfileRoute();
    const dispatch = useDispatch();
    const tosat = useElToast();

    useEffect(() => {
        getInvites();
    }, []);

    const getInvites = async () => {
        dispatch(PENDING());
        const res: any = await athleteService.getTeamInvites(id);
        if (res && res.code === 200 && res.value) {
            setInvites(res.value);
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const getOptions = (item) => {
        const options: ActionModel[] = [
            {
                label: 'Accept',
                onPress: () => approveTeamInvite(item.inviteId),
            },
            {
                label: 'Decline',
                onPress: () => rejectTeamInvite(item.inviteId),
            },
        ];
        return options;
    }

    const approveTeamInvite = async inviteId => {
        dispatch(PENDING());
        const res: any = await athleteService.approveTeamInvite(id, inviteId);
        if (res && res.code === 200) {
            getInvites();
            tosat.success('Approve invite successfully');
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const rejectTeamInvite = async inviteId => {
        dispatch(PENDING());
        const res: any = await athleteService.declineTeamInvite(id, inviteId);
        if (res && res.code === 200) {
            getInvites();
            tosat.success('Decline invite successfully');
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    return (
        <ElContainer mt={2}>
            <ElTitle>Team Invites</ElTitle>
            <ElFlatList
                data={invites}
                listEmptyText="No Invites"
                keyExtractor={(item: any) => item.inviteId.toString()}
                renderItem={({ item }) => (
                    <HStack>
                        <ElIdiograph
                            onPress={() => goToTeamProfile(item.teamId)}
                            flex={1}
                            title={item.title}
                            centerTitle={item.centerTitle}
                            subtitle={item.subtitle}
                            imageUrl={item.avatarUrl}
                        />
                        <Center>
                            <ElMenu items={getOptions(item)}></ElMenu>
                        </Center>
                    </HStack>
                )}
            />
        </ElContainer>
    );
};

export default TeamInvitesScreen;
