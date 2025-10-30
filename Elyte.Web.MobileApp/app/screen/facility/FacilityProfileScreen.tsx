import { athleteService } from 'el/api';
import facilityService from 'el/api/facilityService';
import { ElAddress, ElAvatar, ElBody, ElButton, ElIcon, ElScrollContainer, H3 } from 'el/components';
import { FacilityModel } from 'el/models/facility/facilityModel';
import { ResponseResult } from 'el/models/responseResult';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useGoBack, useImagePicker } from 'el/utils';
import { Box, Divider, Flex, Input, InputLeftAddon, Spacer, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet } from 'react-native';
import colors from 'el/config/colors';
import SelectFacilityUser from './SelectFacilityUser';

export default function FacilityProfileScreen({ navigation, route }) {
    useGoBack();
    const { id, refresh } = route.params;
    const dispatch = useDispatch();
    const [profile, setProfile] = useState<any>({});
    const [halfHourPrice, setHalfHourPrice] = useState(0);
    const [oneHourPrice, setOneHourPrice] = useState(0);
    const [exceedTwoHoursPrice, setExceedTwoHoursPrice] = useState(0);
    const { chooseAvatarAsync, image, setImage, getImageFormData } = useImagePicker();
    const [showSelectUserDialog, setShowSelectUserDialog] = useState(false);

    useEffect(() => {
        getFacilityProfile();
    }, [id]);

    const getFacilityProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<FacilityModel> = await facilityService.getFacility(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setProfile(res.value);
        } else {
            dispatch(ERROR());
        }
    };

    useEffect(() => {
        setHalfHourPrice(profile?.halfHourPrice || 0);
        setOneHourPrice(profile?.oneHourPrice || 0);
        setExceedTwoHoursPrice(profile?.exceedTwoHoursPrice || 0);
    }, [profile]);

    useEffect(() => {
        if (!image.uri) return;

        handleImageSelect();
    }, [image]);

    const handleImageSelect = async () => {
        dispatch(PENDING());
        const res: any = await facilityService.updateFacilityProfilePicture(id, getImageFormData());
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setImage({ uri: '' });
            getFacilityProfile();
        } else {
            dispatch(ERROR());
        }
    }

    const handleSelectUserDialog = () => {
        setShowSelectUserDialog(true);
    }

    return (
        <>
            <ElScrollContainer>
                <Flex direction="row" mt="4" mb="2">
                    <ElAvatar onPress={() => !profile?.isAdminView && chooseAvatarAsync()} uri={profile?.imageUrl} size={80} style={{ marginRight: 8 }} />
                    <Box flex={1}>
                        <H3>{profile?.name}</H3>
                        <ElBody size="sm">Type: {profile?.sportOption}</ElBody>
                        <ElAddress my="1" {...profile} />
                    </Box>
                </Flex>
                <ElBody mb="2">{profile?.details ?? 'No details now'}</ElBody>
                <Divider my="2" />
                <Text mt={2} style={styles.contactInfo}>Contact Information:</Text>
                <Flex mt={1} direction="row">
                    <ElIcon mr={6} xSmall name="phone" />
                    <Text style={styles.contactInfo}>{profile?.contactNumber}</Text>
                </Flex>
                <Flex mt={1} mb={2} direction="row">
                    <ElIcon mr={6} xSmall name="email" />
                    <Text style={styles.contactInfo}>{profile?.contactEmail}</Text>
                </Flex>
                <Divider my="2" />
                <Flex mt={6} mb={2} direction="row">
                    <Text mt={2} mr={2} style={styles.contactInfo}>Cost for 30 minutes</Text>
                    <Spacer />
                    <InputLeftAddon children={"$"} />
                    <Input mr={2} w="25%" style={styles.priceInput} isDisabled={true} defaultValue={halfHourPrice.toString()} />
                </Flex>

                <Flex mb={2} direction="row">
                    <Text mt={2} mr={2} style={styles.contactInfo}>Cost for 1 hour</Text>
                    <Spacer />
                    <InputLeftAddon children={"$"} />
                    <Input mr={2} w="25%" style={styles.priceInput} isDisabled={true} defaultValue={oneHourPrice.toString()} />
                </Flex>

                <Flex mb={2} direction="row">
                    <Text mt={2} mr={2} style={styles.contactInfo}>Cost for 2+ hour</Text>
                    <Spacer />
                    <InputLeftAddon children={"$"} />
                    <Input mr={2} w="25%" style={styles.priceInput} isDisabled={true} defaultValue={exceedTwoHoursPrice.toString()} />
                </Flex>
                {
                    !profile?.isAdminView && profile.paymentIsEnabled &&
                    <ElButton mt={6} onPress={handleSelectUserDialog}>Schedule a time</ElButton>
                }
                {
                    showSelectUserDialog && <SelectFacilityUser facility={profile} onClose={() => setShowSelectUserDialog(false)} />
                }

            </ElScrollContainer>
        </>
    )
}

const styles = StyleSheet.create({
    contactInfo: {
        color: colors.medium,
        fontSize: 15
    },
    priceInput: {
        background: '#F0F2F7;',
        '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 0,
        },
        borderRadius: 10,
        width: 100,
        height: 50,
    },
});


