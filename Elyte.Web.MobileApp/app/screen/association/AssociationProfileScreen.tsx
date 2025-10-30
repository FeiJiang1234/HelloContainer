import React, { useEffect, useState } from 'react';
import { useElToast, useGoBack, useImagePicker } from 'el/utils';
import { ElAvatar, ElBody, ElButton, ElLink, ElScrollContainer, H3, ElAddress, ElDialog, ElIcon, ElMenu, ElConfirm } from 'el/components';
import { Box, Divider, FlatList, Flex, HStack, Pressable, Row, Text } from 'native-base';
import colors from 'el/config/colors';
import { OrganizationType } from 'el/enums';
import { useDispatch } from 'react-redux';
import routes from 'el/navigation/routes';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import associationService from 'el/api/associationService';
import { ResponseResult } from 'el/models/responseResult';
import { AssociationProfileModel } from 'el/models/association/associationProfileModel';
import * as Clipboard from 'expo-clipboard';
import OfficiatesSvg from 'el/svgs/officiatesSvg';
import AssociationOrganizations from './components/AssociationOrganizations';
import AssociationAdmins from './components/AssociationAdmins';

import { ActionModel } from 'el/models/action/actionModel';
import OrganizationContactUs from '../organization/OrganizationContactUs';

export default function AssociationProfileScreen({ navigation, route }) {
    useGoBack({ backTo: routes.OrganizationList });
    const tabs = ['Organizations', 'Contact Us', 'Admins'];
    const [tab, setTab] = useState(tabs[0]);
    const dispatch = useDispatch();
    const { id, refresh } = route.params;
    const [profile, setProfile] = useState<any>({});
    const { isAdminView, isOfficial, isOwner } = profile;
    const [showAssociationIdDialog, setShowAssociationIdDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { chooseAvatarAsync, image, setImage, getImageFormData } = useImagePicker();
    const toast = useElToast();

    const options: ActionModel[] = [
        {
            label: 'Make a Admin',
            onPress: () => {
                navigation.navigate(routes.GetAllUsersToSelectAdmin, { id: id, type: 'Association' });
            },
            isHide: !isOwner,
        },
        {
            label: 'Delete',
            onPress: () => { setShowDeleteDialog(true) },
            isHide: !isOwner,
        },
    ];

    useEffect(() => {
        getAssociationProfile();
    }, [id]);

    useEffect(() => {
        if (!refresh) return;

        navigation.setParams({
            refresh: false,
        });

        getAssociationProfile();
    }, [refresh]);

    useEffect(() => {
        if (!image.uri) return;

        handleImageSelect();
    }, [image]);

    const getAssociationProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<AssociationProfileModel> = await associationService.getAssociationProfile(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setProfile(res.value);
        } else {
            dispatch(ERROR());
        }
    };

    const handleImageSelect = async () => {
        dispatch(PENDING());
        const res: any = await associationService.updateAssociationProfilePicture(id, getImageFormData());
        if (res && res.code === 200) {
            setImage({ uri: '' });
            await getAssociationProfile();
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const handleViewIdClick = () => {
        setShowAssociationIdDialog(true);
    }

    const handleCopyAssociationId = async (id) => {
        await Clipboard.setStringAsync(id);
        toast.success('Copy successfully');
    }

    const handleYesToDeleteClick = async () => {
        const res: any = await associationService.deleteAssociation(id);
        if (res && res.code === 200) {
            setShowDeleteDialog(false);
            toast.success('Delete association successfully.')
            navigation.navigate(routes.OrganizationList);
        } else {
            toast.error(res.Message);
        }
    }

    return (
        <>
            <ElScrollContainer>
                <HStack mt="4" mb="2" space={2}>
                    <ElAvatar onPress={() => profile?.isAdminView && chooseAvatarAsync()} uri={profile?.imageUrl} size={80} />
                    <Box flex={1}>
                        <H3>{profile?.name}</H3>
                        <ElAddress my="1" {...profile}></ElAddress>
                        {
                            isAdminView &&
                            <Pressable width="120" onPress={handleViewIdClick}>
                                <Text color={colors.primary}>Press to View ID</Text>
                            </Pressable>
                        }
                        {
                            profile?.isAdminView &&
                            <Box>
                                <ElButton style={{ marginTop: 8 }} size="sm" onPress={() => navigation.navigate(routes.EditAssociationProfile, { id: id })}>Edit</ElButton>
                            </Box>
                        }
                    </Box>
                    <Box>
                        <ElMenu items={options} />
                    </Box>
                </HStack>
                <ElBody mb="2">{profile?.details ?? 'No details now'}</ElBody>
                <Row alignItems="center">
                    <OfficiatesSvg width="25" height="26" />
                    <ElLink
                        to={routes.Officiate}
                        params={{ id, isAdminView, type: OrganizationType.Association }}
                        ml={2}>
                        <Text color={colors.primary}>Our Officiates</Text>
                    </ElLink>
                </Row>
                <Divider my="2" />
                <FlatList
                    data={tabs}
                    keyExtractor={p => p}
                    ItemSeparatorComponent={() => <Box w={2} />}
                    renderItem={({ item }) =>
                        <ElButton
                            onPress={() => setTab(item)}
                            variant={item !== tab ? 'disabled' : 'contained'}
                            size="sm">
                            {item}
                        </ElButton>
                    }
                    horizontal={true}
                />
                <Box mb={2}>
                    {tab === 'Organizations' && <AssociationOrganizations associationId={profile?.id} associationCode={profile?.code} isAdminView={profile?.isAdminView} />}
                    {tab === 'Admins' && <AssociationAdmins profile={profile} />}
                    {tab === 'Contact Us' && (
                        <OrganizationContactUs
                            organizationId={profile.id}
                            organizationType={OrganizationType.Association}
                        />
                    )}
                </Box>
            </ElScrollContainer>
            {
                showAssociationIdDialog &&
                <ElDialog
                    visible={true}
                    onClose={() => setShowAssociationIdDialog(false)}
                    title="Association Id">
                    <Flex direction="row" alignItems="center">
                        <ElBody style={{ textAlign: 'center' }}>{profile.id}</ElBody>
                        <Pressable onPress={() => handleCopyAssociationId(profile.id)}>
                            <ElIcon name="content-copy" ml={1} />
                        </Pressable>
                    </Flex>
                </ElDialog>
            }
            <ElConfirm
                visible={showDeleteDialog}
                title="Delete association"
                message="Are you sure you want to delete the current association?"
                onConfirm={handleYesToDeleteClick}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </>
    )
}
