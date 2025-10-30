import { athleteService, eventService } from 'el/api';
import { ElAddress, ElBody, ElButton, ElScrollContainer } from 'el/components';
import { EventProfileModel } from 'el/models/event/eventProfileModel';
import { ResponseResult } from 'el/models/responseResult';
import routes from 'el/navigation/routes';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useAuth, useCalendar, useGoBack } from 'el/utils';
import moment from 'moment';
import { VStack, Image, HStack, Text, Stack, Divider, Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import EventDetails from './components/EventDetails';
import Participants from './components/Participants';

export default function EventProfileScreen({ navigation, route }) {
    useGoBack();
    const tabs = ['Participants', 'Event Details'];
    const [tab, setTab] = useState(tabs[0]);
    const { id } = route.params;
    const dispatch = useDispatch();
    const [profile, setProfile] = useState<any>();
    const { user } = useAuth();
    const { createEvent } = useCalendar();
    const [noEvent, setNoEvent] = useState(false);

    useEffect(() => { 
        getEventProfile();
     }, []);

    const getEventProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<EventProfileModel> = await eventService.getEventProfile(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            if(res.value){
                setProfile(res.value);
            }else{
                setNoEvent(true);
            }
        } else {
            dispatch(ERROR());
        }
    };

    const handleRegisterClick = async () => {
        dispatch(PENDING());
        const res: any =  await athleteService.registerToEvent(user.id, profile.eventId);
        if (res && res.code === 200) {
            const calendarData = {
                title: profile.title,
                startDate: new Date(profile.startTime),
                endDate: new Date(profile.endTime),
                location: `${profile.address} ${profile.venue}`,
                alertTime: profile.alertTime 
            };
            const mobileCalendarEventId = await createEvent(profile.teamName ?? 'Elyte Event', calendarData);
            await athleteService.linkCalendarEvent(profile.id, { mobileCalendarEventId });
        } else {
            dispatch(ERROR());
        }

        getEventProfile();
    };

    const handleShareClick = () => {
        navigation.navigate(routes.EventShare, { id });
    };

    return <>
        {
            profile
            && <>
            <ElScrollContainer style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Image style={{ height: 300 }} source={{ uri: profile.imageUrl }} alt='image'></Image>
                <Stack style={{ paddingLeft: 16, paddingRight: 16 }} space={3} direction="column">
                    <HStack space={4} justifyContent={"space-between"}>
                        <VStack justifyContent={"space-between"}>
                            <Text bold fontSize="2xl">{profile.title}</Text>
                            <Text style={{ textAlign: 'left', color: "#B0B8CB" }}>{profile.sportOption}</Text>
                        </VStack>
                        <VStack>
                            <Text bold fontSize="lg" style={{ color: "#808A9E" }}>{moment(profile.startTime).format("MM/DD/YYYY hh:mm")}</Text>
                            <Text bold fontSize="lg" style={{ color: "#808A9E" }}>To</Text>
                            <Text bold fontSize="lg" style={{ color: "#808A9E" }}>{moment(profile.endTime).format("MM/DD/YYYY hh:mm")}</Text>
                        </VStack>
                    </HStack>
                    <ElBody>
                        {profile?.details}
                    </ElBody>
                    <ElAddress state={profile.state} city={profile.city} country={profile.country} ></ElAddress>
                    <Divider></Divider>
                    <HStack space={4} justifyContent={"space-between"} paddingLeft={5} paddingRight={5}>
                        <ElButton
                            onPress={() => setTab('Participants')}
                            variant={"Participants" !== tab ? 'disabled' : 'contained'}
                            size="sm">
                            Participants
                        </ElButton>
                        <ElButton
                            onPress={() => setTab('Event Details')}
                            variant={"Event Details" !== tab ? 'disabled' : 'contained'}
                            size="sm">
                            Event Details
                        </ElButton>
                    </HStack>
                    <Box mb={2}>
                        {tab === 'Participants' && <Participants profile={profile} />}
                        {tab === 'Event Details' && <EventDetails />}
                    </Box>
                  <Box mb={2}>
                    {!profile.isRegistered && <ElButton onPress={() => handleRegisterClick()}>Register to the event</ElButton>}
                    {profile.isCreator && <ElButton onPress={() => handleShareClick()}>Share</ElButton>}
                  </Box>
                </Stack>
            </ElScrollContainer >
            </>
        }
        {
            noEvent && <ElBody style={{ textAlign: 'center', marginTop: 16 }}>Cannot find event</ElBody>
        }
    </>
}
