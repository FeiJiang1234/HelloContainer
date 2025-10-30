import { useIsFocused } from '@react-navigation/native';
import { teamService } from 'el/api';
import { ElBody, ElConfirm, ElIcon, ElIdiograph, ElLink, ElMenu } from 'el/components';
import colors from 'el/config/colors';
import { ActionModel } from 'el/models/action/actionModel';
import routes from 'el/navigation/routes';
import { useAuth, useProfileRoute } from 'el/utils';
import { Box, Center, Divider, Flex, Row, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import AssignPlayerNumber from './AssignPlayerNumber';
import RequestItem from './RequestItem';

export default function TeamRoster({ team }) {
    const { user } = useAuth();
    const [members, setMembers] = useState<any[]>([]);
    const [requestingMembers, setRequestingMembers] = useState<any[]>([]);
    const { goToAthleteProfile } = useProfileRoute();
    const [showDeleteMemberConfirmDialog, setShowDeleteMemberConfirmDialog] = useState(false);
    const [showDeleteAdminConfirmDialog, setShowDeleteAdminConfirmDialog] = useState(false);
    const [editMember, setEditMember] = useState<any>({});
    const [showPlayerNumberDialog, setShowPlayerNumberDialog] = useState(false);
    const isOwner = item => item.role === 'Owner';
    const isAdmin = item => item.role === 'Admin';
    const isPlayer = item => item.role === 'Player';
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            initTabList();
        }
    }, [isFocused, team]);

    const initTabList = () => {
        if (team?.id) {
            getTeamMembers();
            if (team?.isAdminView) {
                getJoinReqests();
            }
        }
    };

    const getOptions = member => {
        const options: ActionModel[] = [
            {
                label: 'Assign Player Number',
                onPress: () => {
                    setEditMember({ ...member, teamId: team.id });
                    setShowPlayerNumberDialog(true);
                },
            }
        ];

        if (!isOwner(member)) {
            options.push({ label: 'Remove', onPress: () => handleRemoveClick(member) });
        }

        return options;
    };

    const getJoinReqests = async () => {
        const res: any = await teamService.getAthleteJoinTeamRequests(team?.id);
        if (res && res.code === 200 && res.value) setRequestingMembers(res.value);
    };

    const getTeamMembers = async () => {
        const res: any = await teamService.getTeamRoster(team?.id, true);
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handleRemoveClick = member => {
        if (isAdmin(member)) {
            setShowDeleteAdminConfirmDialog(true);
        }

        if (isPlayer(member)) {
            setShowDeleteMemberConfirmDialog(true);
        }

        setEditMember(member);
    };

    const handleRemoveMember = async () => {
        const res: any = await teamService.removeParticipant(team.id, editMember.id);
        setShowDeleteMemberConfirmDialog(false);
        if (res && res.code === 200) {
            getTeamMembers();
        }
    };

    const handleRemoveAdmin = async () => {
        const res: any = await teamService.cancelTeamAdmin(team.id, editMember.id);
        setShowDeleteAdminConfirmDialog(false);
        if (res && res.code === 200) {
            getTeamMembers();
        }
    };

    return (
        <Box mt={1}>
            {team?.isAdminView && <ElBody>On Team</ElBody>}
            {members.map(member => (
                <Box key={member.id}>
                    <Row space={5} alignItems="center" justifyContent="space-between">
                        <ElIdiograph
                            onPress={() => goToAthleteProfile(member.id)}
                            title={
                                <Flex direction="row">
                                    <Text>{member.title}</Text>
                                    {isOwner(member) && (
                                        <ElIcon name="account" color={colors.primary} />
                                    )}
                                    {isAdmin(member) && (
                                        <ElIcon name="account" color="#B0B8CB" />
                                    )}
                                </Flex>
                            }
                            centerTitle={member.centerTitle}
                            subtitle={member.subtitle}
                            imageUrl={member.avatarUrl}
                            my={2}
                        />
                        <Text>{member.playerNumber && `#${member.playerNumber}`}</Text>
                        {
                            (team.isOwner || member.id == user.id) &&
                            <Center>
                                <ElMenu items={getOptions(member)} />
                            </Center>
                        }
                    </Row>
                    <Divider />
                </Box>
            ))}
            {requestingMembers.length !== 0 && (
                <>
                    <Flex direction="row" justify="space-between" align="center" mt={2}>
                        <ElBody>Requesting to Join</ElBody>
                        <ElLink to={routes.JoinTeamRequest} params={{ id: team?.id }}>
                            View All
                        </ElLink>
                    </Flex>
                    {requestingMembers.map(member => (
                        <RequestItem key={member.id} item={member} onHandleSuccess={initTabList} />
                    ))}
                </>
            )}
            <ElConfirm
                title="Remove team member"
                message="Are you sure you want to remove this team member?"
                visible={showDeleteMemberConfirmDialog}
                onCancel={() => setShowDeleteMemberConfirmDialog(false)}
                onConfirm={handleRemoveMember}
            />
            <ElConfirm
                title="Remove team admin"
                message="Are you sure you want to remove this team admin?"
                visible={showDeleteAdminConfirmDialog}
                onCancel={() => setShowDeleteAdminConfirmDialog(false)}
                onConfirm={handleRemoveAdmin}
            />

            {showPlayerNumberDialog && (
                <AssignPlayerNumber
                    visible={showPlayerNumberDialog}
                    setVisible={setShowPlayerNumberDialog}
                    member={editMember}
                    onSuccess={getTeamMembers}
                />
            )}
        </Box>
    );
}
