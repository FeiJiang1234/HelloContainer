import { useIsFocused } from '@react-navigation/native';
import { associationService } from 'el/api';
import { ElConfirm, ElIcon, ElIdiograph, ElList, ElMenu } from 'el/components';
import colors from 'el/config/colors';
import { ActionModel } from 'el/models/action/actionModel';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast, useGoBack, useProfileRoute } from 'el/utils';
import { Box, Center } from 'native-base';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const AssociationAdmins = ({ profile }) => {
    useGoBack();

    const dispatch = useDispatch();
    const toast = useElToast();
    const isFocused = useIsFocused();
    const [showDeleteAdminConfirmDialog, setShowDeleteAdminConfirmDialog] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [memberId, setMemberId] = useState(null);
    const isOwner = item => item.role === 'Owner';
    const isAdmin = item => item.role === 'Admin';
    const { goToAthleteProfile } = useProfileRoute();

    useEffect(() => {
        if (isFocused) {
            getTeamMembers();
        }
    }, [isFocused, profile]);

    const getTeamMembers = async () => {
        dispatch(PENDING());
        const res: any = await associationService.getAssociationAdmin(profile?.id);
        if (res && res.code === 200) {
            setMembers(res.value);
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR())
        }
    };

    const handleRemoveClick = member => {
        if (!isAdmin(member)) return;

        setShowDeleteAdminConfirmDialog(true);
        setMemberId(member.id);
    };

    const handleRemoveAdmin = async () => {
        dispatch(PENDING());
        const res: any = await associationService.cancelAssociationAdmin(profile.id, memberId);
        setShowDeleteAdminConfirmDialog(false);
        if (res && res.code === 200) {
            getTeamMembers();
            dispatch(SUCCESS());
        } else {
            toast.error(res.Message);
            dispatch(ERROR())
        }
    };

    const getOptions = (item) => {
        const options: ActionModel[] = [
            {
                label: 'Remove',
                onPress: () => handleRemoveClick(item),
            },
        ];
        return options;
    }

    return (
        <Box mt={2}>
            <ElList
                data={members}
                renderItem={({ item }) => (
                    <>
                        <ElIdiograph
                            onPress={() => goToAthleteProfile(item.adminId)}
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
                    </>
                )}
            />
            <ElConfirm
                title="Remove association admin"
                message="Are you sure to remove this association admin?"
                visible={showDeleteAdminConfirmDialog}
                onCancel={() => setShowDeleteAdminConfirmDialog(false)}
                onConfirm={handleRemoveAdmin}
            />
        </Box>
    );
};

export default AssociationAdmins;
