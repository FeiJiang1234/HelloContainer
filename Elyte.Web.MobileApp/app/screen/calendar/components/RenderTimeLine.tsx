import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Box, Divider, Text, useDisclose, Pressable } from 'native-base';
import { StyleSheet } from 'react-native';
import colors from 'el/config/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { ElActionsheet, ElDialog } from 'el/components';
import calendarService from 'el/api/calendarService';
import { athleteService, eventService, gameService } from 'el/api';
import { useNavigation } from '@react-navigation/native';
import routes from 'el/navigation/routes';
import { useCalendar, useProfileRoute } from 'el/utils';
import ReminderForm from './ReminderForm';

const timeRows = [
    { time: '12am' },
    { time: '1am' },
    { time: '2am' },
    { time: '3am' },
    { time: '4am' },
    { time: '5am' },
    { time: '6am' },
    { time: '7am' },
    { time: '8am' },
    { time: '9am' },
    { time: '10am' },
    { time: '11am' },
    { time: 'Noon' },
    { time: '1pm' },
    { time: '2pm' },
    { time: '3pm' },
    { time: '4pm' },
    { time: '5pm' },
    { time: '6pm' },
    { time: '7pm' },
    { time: '8pm' },
    { time: '9pm' },
    { time: '10pm' },
    { time: '11pm' },
];

type PropType = {
    initData: any;
    onReload?: any;
    onEditGame?: any;
    onCreateGame?: any;
};

const RenderTimeLine: React.FC<PropType> = ({ initData, onReload, onEditGame, onCreateGame }) => {
    const [scheduleList, setScheduleList] = useState<any[]>([]);
    const [timeHight, setTimeHight] = useState<number>(0);
    const [timeWidth, setTimeWidth] = useState<number>(0);
    const navigation: any = useNavigation();
    const { goToGameProfile, goToGamePost } = useProfileRoute();
    const [reminderData, setReminderData] = useState<any>();
    const { deleteEvent } = useCalendar();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [currentEvent, setCurrentEvent] = useState<any>();
    const [options, setOption] = useState<any>([]);

    useEffect(() => {
        buildScheduleList();
    }, [initData, timeHight, timeWidth]);

    useEffect(() => {
        if (currentEvent) {
            setOption([
                {
                    label: 'View',
                    onPress: () => handleMenuViewClick(currentEvent),
                    isHide: !!(currentEvent.type === 'game' && !currentEvent.title),
                },
                {
                    label: 'Edit',
                    onPress: () => handleMenuEditClick(currentEvent),
                    isHide: !(currentEvent.isAdmin && !currentEvent.gameStatus),
                },
                {
                    label: 'Delete',
                    onPress: () => handleMenuDeleteClick(currentEvent),
                    isHide: !currentEvent.isAdmin || currentEvent.type === 'game',
                    confirmMessage: `Are you sure to delete this ${currentEvent.type}`,
                },
                {
                    label: 'Exit',
                    onPress: () => handleMenuExitClick(currentEvent),
                    isHide: currentEvent.isAdmin || currentEvent.type === 'game',
                    confirmMessage: `Are you sure to exit this ${currentEvent.type}`,
                },
            ]);
        }
    }, [currentEvent]);

    const buildScheduleList = () => {
        if (!timeHight || !timeWidth) {
            return;
        }

        let sortedData = initData.filter(x => x.startTime && x.endTime);

        for (let i = 0; i < sortedData.length; i++) {
            let overlapSchedules = buildOverlapSchedules(sortedData);
            calculateScheduleSizeAndLocation(sortedData, overlapSchedules);

        }

        setScheduleList(sortedData);
    };

    const buildOverlapSchedules = sortedData => {
        let overlapSchedules = new Array();
        let minTime = '';
        let maxTime = '';
        let notDraw = sortedData.filter(x => !x.isDraw);

        for (let index = 0; index < notDraw.length; index++) {
            const element = notDraw[index];

            if (index === 0) {
                minTime = element.startTime;
                maxTime = element.endTime;
                overlapSchedules.push(element);
                continue;
            }

            if (isInDuringDateTime(element.startTime, minTime, maxTime) || isInDuringDateTime(element.endTime, minTime, maxTime)) {
                overlapSchedules.push(element);
                if (moment(element.startTime).isBefore(minTime)) {
                    minTime = element.startTime;
                }
                if (moment(element.endTime).isAfter(maxTime)) {
                    maxTime = element.endTime;
                }
            }
        }

        return overlapSchedules;
    };

    const calculateScheduleSizeAndLocation = (sortedData, overlapSchedules) => {
        const xOffset = 45;
        const dayMinutes = 1440;

        let baseWidth = Math.round((timeWidth - xOffset) / overlapSchedules.length);
        for (let index = 0; index < overlapSchedules.length; index++) {
            const element = overlapSchedules[index];

            let originData = sortedData.find(x => x.id === element.id);
            if (originData) {
                let height = ((toMinutes(originData.endTime) - toMinutes(originData.startTime)) / dayMinutes) * timeHight;

                let locationX = index > 0 ? index * baseWidth + index : index * baseWidth;
                originData['location'] = {
                    x: locationX + xOffset,
                    y: (toMinutes(originData.startTime) / dayMinutes) * timeHight,
                };
                originData['size'] = { width: baseWidth, height: height - 3 };
                originData['isDraw'] = true;
            }
        }
    };

    const toMinutes = time => {
        if (!time) return 0;
        let d = moment(time);
        return d.hours() * 60 + d.minutes();
    };

    const isInDuringDateTime = (currentTime, startTime, endTime) => {
        return (moment(currentTime).isBefore(endTime) && moment(currentTime).isSameOrAfter(startTime));
    };

    const onLayout = event => {
        const { height, width } = event.nativeEvent.layout;
        setTimeHight(height);
        setTimeWidth(width);
    };

    const handleMenuExitClick = async item => {
        if (!item) return;
        const service =
            item.type === 'reminder'
                ? athleteService.deleteCalendarReminder(item.id)
                : eventService.exitEvent(item.eventId);
        const res: any = await service;
        if (res && res.code === 200 && res.value) {
            await deleteEvent(item.mobileCalendarEventId);
            if (onReload) {
                onReload();
            }
        }
    };

    const handleMenuDeleteClick = async item => {
        if (!item) return;
        const service =
            item.type === 'reminder'
                ? athleteService.deleteCalendarReminder(item.id)
                : eventService.deleteEvent(item.id);
        const res: any = await service;
        if (res && res.code === 200 && res.value) {
            await deleteEvent(item.mobileCalendarEventId);
            if (onReload) {
                onReload();
            }
        }
    };

    const handleMenuEditClick = async item => {
        if (item?.type === 'reminder') {
            const result: any = await calendarService.getReminderDetailById(item.id);
            if (result && result.code === 200 && result.value) {
                setReminderData({
                    isEdit: true,
                    ...result.value,
                    time: moment(`${result.value.date} ${result.value.time}`).format(
                        'MM/DD/YYYY HH:mm',
                    ),
                    mobileCalendarEventId: item.mobileCalendarEventId
                });
            }
            return;
        }

        if (item?.type === 'event') {
            navigation.navigate(routes.EventEdit, { id: item.id });
        }

        if (item?.type === 'game') {
            onEditGame && onEditGame(item);
        }
    };

    const handleMenuViewClick = async item => {
        if (item?.type === 'event') {
            navigation.navigate(routes.EventProfile, { id: item.id });
            return;
        }

        if (item?.type === 'reminder') {
            const result: any = await calendarService.getReminderDetailById(item.id);
            if (result && result.code === 200 && result.value) {
                setReminderData({
                    isEdit: false,
                    ...result.value,
                    time: moment(`${result.value.date} ${result.value.time}`).format(
                        'MM/DD/YYYY HH:mm',
                    ),
                });
            }
            return;
        }

        if (item?.type === 'game') {
            await redirectToGame(item);
        }
    };

    const handleCreateReminderClosed = () => {
        setReminderData(null);
        if (onReload) {
            onReload();
        }
    };

    const handleTimeLineClick = (item) => {
        if(item?.type === 'game' && !item.isAdmin){
            redirectToGame(item);
        }else{
            setCurrentEvent(item);
            onOpen && onOpen();
        }
    }

    async function redirectToGame(item) {
        const res: any = await gameService.getGameProfile(item.id);
        if (res && res.code === 200) {
            if (res.value.gameStatus == 'Confirmed') {
                goToGamePost(res.value.id, res.value.gameSportType);
            } else {
                goToGameProfile(res.value.id);
            }
        }
    }

    return (
        <Box onLayout={onLayout} position="relative">
            {timeRows.map(item => (
                <React.Fragment key={item.time}>
                    <Pressable onPress={() => onCreateGame && onCreateGame()}>
                        <Box my={4}>{item.time}</Box>
                    </Pressable>
                    <Divider />
                </React.Fragment>
            ))}
            {scheduleList.map(item => {
                return (
                    <LinearGradient
                        key={item.id}
                        {...(item?.type === 'event' ? colors.linearBlue : colors.linear)}
                        style={[
                            styles.schedule,
                            {
                                width: item?.size?.width,
                                height: item?.size?.height,
                                top: item?.location?.y,
                                left: item?.location?.x,
                                minHeight: 18
                            },
                        ]}>
                        <Pressable size={"100%"} onPress={() => { handleTimeLineClick(item) }}>
                            <Text color={colors.white} fontSize={12} lineHeight={12} mt={1}>
                                {item.title ?? 'Game TBD'}
                            </Text>
                            {item.address && (
                                <Text color={colors.white} fontSize={12}>
                                    {item.address}
                                </Text>
                            )}
                        </Pressable>
                    </LinearGradient>
                );
            })}
            {!!reminderData && (
                <ElDialog
                    visible={!!reminderData}
                    onClose={() => setReminderData(null)}
                    title={reminderData.isEdit ? 'Edit Reminder' : 'Reminder Detail'}>
                    <ReminderForm
                        initData={reminderData}
                        onCreateReminderPopupClosed={handleCreateReminderClosed}
                    />
                </ElDialog>
            )}
            <ElActionsheet isOpen={isOpen} onClose={onClose} items={options} />
        </Box>
    );
};

const styles = StyleSheet.create({
    schedule: {
        display: 'flex',
        position: 'absolute',
        paddingLeft: 2,
    },
});

export default RenderTimeLine;
