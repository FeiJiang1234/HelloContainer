import { useIsFocused } from '@react-navigation/native';
import { tournamentService } from 'el/api';
import { ElBody, ElConfirm, ElIcon, ElIdiograph, ElList, ElMenu } from 'el/components';
import colors from 'el/config/colors';
import { ActionModel } from 'el/models/action/actionModel';
import { useProfileRoute } from 'el/utils';
import { Box, Center, HStack } from 'native-base';
import React, { useState, useEffect } from 'react';

const TournamentAdmins = ({ profile }) => {
    const [showDeleteAdminConfirmDialog, setShowDeleteAdminConfirmDialog] = useState(false);
    const [showDeleteCoordinatorConfirmDialog, setShowDeleteCoordinatorConfirmDialog] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [coordinators, setCoordinators] = useState<any[]>([]);
    const [memberId, setMemberId] = useState(null);
    const [coordinatorId, setCoordinatorId] = useState(null);

    const isOwner = item => item.role === 'Owner';
    const isAdmin = item => item.role === 'Admin';
    const isFocused = useIsFocused();
    const { goToAthleteProfile } = useProfileRoute();

    useEffect(() => {
        if (isFocused) {
            getAdmins();
            getCoordinators();
        }
    }, [isFocused, profile]);

    const getAdmins = async () => {
        const res: any = await tournamentService.getTournamentAdmins(profile?.id);
        if (res && res.code === 200) {
            setMembers(res.value);
        }
    };

    const getCoordinators = async () => {
        const res: any = await tournamentService.getTournamentCoordinators(profile?.id || '');
        if (res && res.code === 200 && res.value) {
            setCoordinators(res.value);
        }
    };

    const handleRemoveClick = member => {
        if (!isAdmin(member)) return;

        setShowDeleteAdminConfirmDialog(true);
        setMemberId(member.id);
    };

    const handleRemoveCoordinatorClick = (member) => {
        setShowDeleteCoordinatorConfirmDialog(true);
        setCoordinatorId(member.id);
    };

    const handleRemoveAdmin = async () => {
        const res: any = await tournamentService.cancelTournamentAdmin(profile.id, memberId);
        setShowDeleteAdminConfirmDialog(false);
        if (res && res.code === 200) {
            getAdmins();
        }
    };

    const handleRemoveCoordinator = async () => {
        const res: any = await tournamentService.cancelTournamentCoordinator(profile.id, coordinatorId);
        setShowDeleteCoordinatorConfirmDialog(false);
        if (res && res.code === 200) {
            getCoordinators();
        }
    };

    const getOptions = (item) => {
        const options: ActionModel[] = [
            {
                label: 'Remove',
                onPress: () => handleRemoveClick(item)
            },
        ];

        return options;
    }

    const getCoordinatorOptions = (item) => {
        const options: ActionModel[] = [
            {
                label: 'Remove',
                onPress: () => handleRemoveCoordinatorClick(item)
            },
        ];
        return options;
    }

    return (
        <Box mt={2}>
            <ElBody>Admins</ElBody>
            <ElList
                data={members}
                renderItem={({ item }) => (
                    <HStack space={5}>
                        <ElIdiograph
                            onPress={() => goToAthleteProfile(item.id)}
                            title={item.title}
                            subtitle={item.subtitle}
                            centerTitle={item.centerTitle}
                            imageUrl={item.avatarUrl}
                        />
                        <Center>
                            <ElIcon name="account" color={isOwner(item) ? colors.primary : '#B0B8CB'} />
                        </Center>
                        {profile.isOwner && !isOwner(item) && (
                            <Center>
                                <ElMenu items={getOptions(item)}></ElMenu>
                            </Center>
                        )}
                    </HStack>
                )}
            />

            <ElBody>Coordinators</ElBody>
            <ElList
                data={coordinators}
                renderItem={({ item }) => (
                    <HStack space={5}>
                        <ElIdiograph
                            onPress={() => goToAthleteProfile(item.id)}
                            title={item.title}
                            subtitle={item.subtitle}
                            centerTitle={item.centerTitle}
                            imageUrl={item.avatarUrl}
                        />
                        {profile.isAdminView &&
                            <Center>
                                <ElMenu items={getCoordinatorOptions(item)}></ElMenu>
                            </Center>
                        }
                    </HStack>
                )}
            />     
            <ElConfirm
                title="Remove tournament admin"
                message="Are you sure to remove this tournament admin?"
                visible={showDeleteAdminConfirmDialog}
                onCancel={() => setShowDeleteAdminConfirmDialog(false)}
                onConfirm={handleRemoveAdmin}
            />
            <ElConfirm
                title="Remove tournament coordinator"
                message="Are you sure to remove this tournament coordinator?"
                visible={showDeleteCoordinatorConfirmDialog}
                onCancel={() => setShowDeleteCoordinatorConfirmDialog(false)}
                onConfirm={handleRemoveCoordinator}
            />
        </Box>
    );
};

export default TournamentAdmins;
