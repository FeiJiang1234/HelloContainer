import { useState, useEffect } from 'react';
import { eventService } from 'el/api';
import { ElAddress, ElBody, ElButton, ElScrollContainer, ElTitle, H3 } from 'el/components';
import routes from 'el/navigation/routes';
import { useGoBack } from 'el/utils';
import { Box, Text, Image, HStack, VStack } from 'native-base';
import { ResponseResult } from 'el/models/responseResult';
import { EventProfileModel } from 'el/models/event/eventProfileModel';
import moment from 'moment';

export default function EventCreateSuccessScreen({ navigation, route }) {
    useGoBack({ backTo: routes.CalendarScreen });
    const { id, isEdit } = route.params;
    const [profile, setProfile] = useState<any>({});

    useEffect(() => {
        getEventProfile();
    }, []);

    const getEventProfile = async () => {
        const res: ResponseResult<EventProfileModel> = await eventService.getEventProfile(id);
        if (res && res.code === 200) {
            setProfile(res.value);
        }
    };

    return (
        <ElScrollContainer>
            <ElTitle>CONGRATULATIONS!</ElTitle>
            <VStack space={3} alignItems="center" mb={1}>
                <ElBody textAlign="center">
                    {!!isEdit ? " You have updated event successfully!" : " You have successfully created a new event!"}
                </ElBody>
                <Image style={{ width: "100%", height: 200 }} source={{ uri: profile.imageUrl }} alt='image'></Image>
                <H3>{profile.title}</H3>
                <ElBody textAlign="center">
                    {profile?.details}
                </ElBody>
                <HStack space={3} justifyContent="center">
                    <Text fontSize="xl" style={{ width: "43%", textAlign: 'center', color: "#808A9E" }}>{moment(profile.startTime).format("MM/DD/YYYY HH:mm:ss")}</Text>
                    <Text fontSize="2xl" style={{ textAlign: 'center', color: "#808A9E" }}>To</Text>
                    <Text fontSize="xl" style={{ width: "43%", textAlign: 'center', color: "#808A9E" }}>{moment(profile.endTime).format("MM/DD/YYYY HH:mm:ss")}</Text>
                </HStack>
                <ElAddress state={profile.state} city={profile.city} country={profile.country} ></ElAddress>
                <Text style={{ textAlign: 'center', color: "#17C476" }}> *Added to the Team&apos;s calendar</Text>
                <HStack space={4} justifyContent="center" >
                    <Box flex={1} >
                        <ElButton variant="outlined" fontSize={14}  onPress={() => navigation.navigate(routes.EventProfile, { id: id })}> Back to profile </ElButton>
                    </Box>
                    <Box flex={1} >
                        <ElButton fontSize={14}  onPress={() => navigation.navigate(routes.EventShare, { id: id })}>Share </ElButton>
                    </Box>
                </HStack>
            </VStack>
        </ElScrollContainer >
    );
}
