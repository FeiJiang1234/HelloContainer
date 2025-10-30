import React, { useState, useEffect, useRef } from 'react';
import { ElActionsheet, ElDialog, ElIcon, ElPicker, ElScrollContainer, ElTitle, H3 } from 'el/components';
import CalendarMonthlyView from './components/CalendarMonthlyView';
import { athleteService, leagueService, tournamentService } from 'el/api';
import { useAuth } from 'el/utils';
import calendarService from 'el/api/calendarService';
import { Box, Divider, HStack, Pressable, Row, Text, useDisclose, VStack } from 'native-base';
import colors from 'el/config/colors';
import CalendarWeeklyView from './components/CalendarWeeklyView';
import CalendarDailyView from './components/CalendarDailyView';
import { ActionModel } from 'el/models/action/actionModel';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import routes from 'el/navigation/routes';
import ReminderForm from './components/ReminderForm';
import { OrganizationType } from 'el/enums';

export default function CalendarScreen({ navigation }) {
    const [userClickDate, setUserClickDate] = useState();
    const [calendarType, setCalendarType] = useState('monthly');
    const [calendarViewTypeTitle, setCalendarViewTypeTitle] = useState('Monthly View');

    const currentStartDate = useRef();
    const currentEndDate = useRef();

    const [athleteManagedOrganizations, setAthleteManagedOrganizations] = useState<ActionModel[]>([]);
    const [calendarName, setCalendarName] = useState<string>();
    const [organizationType, setOrganizationType] = useState();
    const [organizationId, setOrganizationId] = useState();
    const [isOrganizationAdminView, setIsOrganizationAdminView] = useState(false);
    const [viewInitData, setViewInitData] = useState([]);
    const { user } = useAuth();
    const [showSpeedDial, setShowSpeedDial] = useState(false);
    const [showReminder, setShowReminder] = useState(false);
    const weeklyViewRef = useRef<any>();
    const dailyViewRef = useRef<any>();
    const { isOpen: isOpenCalendarType, onOpen: onOpenCalendarType, onClose: onCloseCalendarType } = useDisclose();
    const { isOpen, onOpen, onClose } = useDisclose();

    const options: ActionModel[] = [
        {
            label: 'Monthly View',
            onPress: () => setCalendarType('monthly'),
        },
        {
            label: 'Weekly View',
            onPress: () => setCalendarType('weekly'),
        },
        {
            label: 'Day View',
            onPress: () => setCalendarType('daily'),
        },
    ];

    useEffect(() => {
        getAthleteManagedOrganization();
    }, []);

    useEffect(() => {
        switch (calendarType) {
            case 'monthly':
                setCalendarViewTypeTitle('Monthly View');
                break;
            case 'weekly':
                setCalendarViewTypeTitle('Weekly View');
                break;
            case 'daily':
                setCalendarViewTypeTitle('Day View');
                break;
        }
    }, [calendarType]);

    const getAthleteManagedOrganization = async () => {
        let res: any = await athleteService.getAthleteManagedOrganizations(user.id);
        if (res && res.code === 200 && res.value?.length > 0) {
            const options = res.value.map(item => ({
                label: item.name,
                onPress: () =>
                    getOrganizationDailyGameQty(
                        item.organizationType,
                        item.organizationId,
                        item.name,
                    ),
            }));
            setAthleteManagedOrganizations([
                { label: 'personal', onPress: () => handlePersonalView() },
                ...options,
            ]);
        }
    };

    const handleCalendarInit = async (startDate, endDate) => {
        currentStartDate.current = startDate;
        currentEndDate.current = endDate;
        let res: any = await calendarService.getMonthlyViewData(startDate, endDate);
        if (res && res.code === 200 && res.value?.length > 0) {
            setViewInitData(res.value);
        }
    };

    const handleDayClick = (date, isOrganizationAdmin) => {
        if (isOrganizationAdmin) {
            setIsOrganizationAdminView(true);
        }
        setUserClickDate(date.currentDate);
        setCalendarType('daily');
    };

    const getOrganizationDailyGameQty = async (type, id, name) => {
        setOrganizationType(type);
        setOrganizationId(id);
        setIsOrganizationAdminView(true);
        const res: any = await getGamesService(type, id);
        if (res && res.code === 200) {
            setViewInitData(res.value);
            setCalendarName(name);
        }
    };

    const getGamesService = (type, id) => {
        if (type === OrganizationType.League) {
            return leagueService.getLeagueAdminViewGamesData(
                id,
                currentStartDate.current,
                currentEndDate.current,
            );
        }
        if (type === OrganizationType.Tournament) {
            return tournamentService.getTournamentAdminViewGamesData(
                id,
                currentStartDate.current,
                currentEndDate.current,
            );
        }
    };

    const handlePersonalView = () => {
        handleCalendarInit(currentStartDate.current, currentEndDate.current);
        setCalendarName('');
        setIsOrganizationAdminView(false);
    };

    const handleGoCreateEvent = () => {
        navigation.navigate(routes.EventCreate);
        setShowSpeedDial(false);
    };

    const handleCreateReminderClosed = () => {
        setShowReminder(false);
        if (calendarType === 'monthly') {
            handleCalendarInit(currentStartDate.current, currentEndDate.current);
        }

        if (calendarType === 'weekly') {
            weeklyViewRef.current.getItemsDisplayInCalendar();
        }

        if (calendarType === 'daily') {
            dailyViewRef.current.getItemsDisplayInCalendar();
        }
    };

    return (
        <>
            <ElScrollContainer>
                <ElTitle>{calendarName} Calendar</ElTitle>
                <Row justifyContent="space-between" alignItems="center">
                    <Pressable onPress={onOpenCalendarType}>
                        <Text color={colors.secondary}>Admin view</Text>
                    </Pressable>
                    <Row alignItems="center">
                        <Pressable onPress={onOpen}>
                            <HStack>
                                <Text>{calendarViewTypeTitle}</Text>
                                <ElIcon name="chevron-down" color={colors.primary}></ElIcon>
                            </HStack>
                        </Pressable>
                    </Row>
                </Row>
                <Divider my={2} />
                {calendarType === 'monthly' && (
                    <CalendarMonthlyView
                        isOrganizationAdminView={isOrganizationAdminView}
                        initData={viewInitData}
                        onInit={handleCalendarInit}
                        onDayClick={handleDayClick}
                    />
                )}
                {calendarType === 'weekly' && (
                    <CalendarWeeklyView
                        isOrganizationAdminView={isOrganizationAdminView}
                        organizationType={organizationType}
                        organizationId={organizationId}
                        ref={weeklyViewRef}
                    />
                )}
                {calendarType === 'daily' && (
                    <CalendarDailyView
                        date={userClickDate}
                        isOrganizationAdminView={isOrganizationAdminView}
                        organizationType={organizationType}
                        organizationId={organizationId}
                        ref={dailyViewRef}
                    />
                )}
                <Box mb={2}></Box>
            </ElScrollContainer>

            {showSpeedDial && (
                <LinearGradient {...colors.linear} style={styles.fabContainer}>
                    <Pressable style={styles.fabItem} onPress={() => setShowReminder(true)}>
                        <ElIcon name="archive-plus" color={colors.white} size={26} />
                    </Pressable>
                    <Pressable style={styles.fabItem} onPress={handleGoCreateEvent}>
                        <ElIcon name="calendar" color={colors.white} size={26} />
                    </Pressable>
                </LinearGradient>
            )}

            <LinearGradient {...colors.linear} style={styles.fab}>
                <Pressable size={10} alignItems="center" justifyContent="center" onPress={() => setShowSpeedDial(pre => !pre)} >
                    <ElIcon name="plus" color={colors.white} size={26} />
                </Pressable>
            </LinearGradient>

            {!!showReminder && (
                <ElDialog
                    visible={showReminder}
                    onClose={() => setShowReminder(false)}
                    title="Create reminder">
                    <ReminderForm onCreateReminderPopupClosed={handleCreateReminderClosed} />
                </ElDialog>
            )}
            <ElActionsheet isOpen={isOpenCalendarType} onClose={onCloseCalendarType} items={athleteManagedOrganizations} />
            <ElActionsheet isOpen={isOpen} onClose={onClose} items={options} />
        </>
    );
}

const styles = StyleSheet.create({
    fabContainer: {
        width: 55,
        height: 160,
        position: 'absolute',
        bottom: 16,
        right: 16,
        borderRadius: 30,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    fabItem: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    fab: {
        width: 55,
        height: 55,
        position: 'absolute',
        bottom: 16,
        right: 16,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
