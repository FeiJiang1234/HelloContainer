import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import { ElButton, ElDialog, ElScrollContainer, ElTitle } from 'el/components';
import { Box, Divider, Flex, Spacer, Text, Row } from 'native-base';
import { useAuth, useElStripe, useElToast, utils } from 'el/utils';
import CalendarWeeksTab from '../calendar/components/CalendarWeeksTab';
import { TimeSlotsStatus } from 'el/enums/timeSlotStatus';
import colors from 'el/config/colors';
import facilityService from 'el/api/facilityService';

const timelineRanges = [
    { timeSlot: "00:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "00:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "01:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "01:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "02:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "02:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "03:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "03:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "04:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "04:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "05:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "05:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "06:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "06:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "07:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "07:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "08:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "08:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "09:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "09:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "10:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "10:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "11:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "11:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "12:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "12:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "13:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "13:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "14:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "14:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "15:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "15:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "16:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "16:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "17:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "17:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "18:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "18:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "19:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "19:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "20:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "20:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "21:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "21:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "22:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "22:30", status: TimeSlotsStatus.Closed },
    { timeSlot: "23:00", status: TimeSlotsStatus.Closed },
    { timeSlot: "23:30", status: TimeSlotsStatus.Closed },
];

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.linear,
        width: 44,
        flex: 1,
        minWidth: 44,
        marginRight: 2,
        marginLeft: 2,
    },
    timelineContainer: {
        position: 'relative',
        width: '100%',
        height: 2750
    },
    timeRow: {
        display: 'flex',
        flexDirection: 'row',
        height: 50,
        alignItems: 'center'
    },
    timestapWrraper: {
        width: '13%',
        color: '#B0B8CB',
        fontSize: 12,
        fontWeight: '500',
    },
    timeRowCoverage: {
        height: 50,
        width: '87%',
        maxWidth: '90%'
    },
    reserved: {
        backgroundColor: '#808A9E'
    },
    closed: {
        backgroundColor: '#E95B5B',
    },
    selected: {
        backgroundColor: '#2599FB',
    },
    free: {
        backgroundColor: '#17C476',
    },
    timeRowContentFont: {
        marginLeft: 6,
        color: '#FFFFFF',
        fontWeight: '400',
        fontSize: 15,
        top: '25%'
    },
    backdrop: {
        color: '#fff',
    }
});

export default function FacilityCalendar({ navigation, route }) {
    const paramFacility = route.params?.facility;
    const userInfo = route.params?.user;
    const isRentalUser = route.params?.isRentalUser;

    const { presentPaymentDirect } = useElStripe();
    const [facility, setFacility] = useState<any>({});
    const [timelines, setTimelines] = useState(_.cloneDeep(timelineRanges));
    const [totalRentalAmount, setTotalRentalAmount] = useState(0);
    const [confirmationContent, setConfirmationContent] = useState<any>();
    const { user } = useAuth();
    const [closedBlockDialog, setClosedBlockDialog] = useState(false);
    const [freeBlockDialog, setFreeBlockDialog] = useState(false);
    const [timeBlock, setTimeBlock] = useState(false);
    const [adminRentalDialogStatus, setAdminRentalDialogStatus] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const toast = useElToast();

    useEffect(() => {
        getFacilityDailyInfo(paramFacility.id, selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        buildTimeSlotState();
    }, [facility]);

    useEffect(() => {
        calculateRentalPrice();
    }, [timelines]);

    const calculateRentalPrice = () => {
        const selectTimeRanges: any = !utils.isArrayNullOrEmpty(timelines) && timelines.filter((x) => x.status === TimeSlotsStatus.Selected);
        let currentRentalAmount;
        switch (selectTimeRanges.length) {
            case 1:
                currentRentalAmount = facility.halfHourPrice;
                break;
            case 2:
                currentRentalAmount = facility.oneHourPrice;
                break;
            case 3:
                currentRentalAmount = facility.oneHourPrice + facility.halfHourPrice;
                break;
            default:
                if (!(selectTimeRanges.length % 2)) {
                    currentRentalAmount = selectTimeRanges.length / 2 * facility.exceedTwoHoursPrice;
                }
                else {
                    currentRentalAmount = ((selectTimeRanges.length - 1) / 2) * facility.exceedTwoHoursPrice + facility.halfHourPrice;
                }
                break;
        }
        setTotalRentalAmount(currentRentalAmount);
    }

    const getFacilityDailyInfo = async (facilityId, currentWeekDay) => {
        const res: any = await facilityService.getFacilityCalendar(facilityId, moment(currentWeekDay).format("YYYY-MM-DD"));
        if (res.code === 200 && res.value) {
            setFacility(res.value);
        }
    }

    const buildTimeSlotState = () => {
        const workStartTime = convertTimeRangeToTime(facility.workStartTime);
        const workEndTime = convertTimeRangeToTime(facility.workEndTime);
        for (var index = 0; index < timelineRanges.length; index++) {
            const time = convertTimeRangeToTime(timelineRanges[index].timeSlot);
            const isWorkTime = moment(time).isBetween(workStartTime, workEndTime, 'minute', '[)');
            timelineRanges[index].status = isWorkTime ? TimeSlotsStatus.Free : TimeSlotsStatus.Closed;
        }

        if (!utils.isArrayNullOrEmpty(facility.closedTimeRanges)) {
            for (index = 0; index < facility.closedTimeRanges.length; index++) {
                const e = facility.closedTimeRanges[index];
                const i = timelineRanges.findIndex((x) => { return x.timeSlot === e; });
                if (i === -1) continue;
                timelineRanges[i].status = TimeSlotsStatus.Closed;
            }
        }

        if (!utils.isArrayNullOrEmpty(facility.freeTimeRanges)) {
            for (index = 0; index < facility.freeTimeRanges.length; index++) {
                const e = facility.freeTimeRanges[index];
                const i = timelineRanges.findIndex((x) => { return x.timeSlot === e; });
                if (i === -1) continue;
                timelineRanges[i].status = TimeSlotsStatus.Free;
            }
        }

        if (!utils.isArrayNullOrEmpty(facility.rentedTimeRanges)) {
            facility.rentedTimeRanges.forEach(time => {
                const i = timelineRanges.findIndex((x) => { return x.timeSlot === time; });
                timelineRanges[i].status = TimeSlotsStatus.Reserved;
            });
        }

        const availableTimeSlots = timelineRanges.filter(x => x.status !== TimeSlotsStatus.Closed);
        if (!utils.isArrayNullOrEmpty(availableTimeSlots)) {
            availableTimeSlots.forEach(x => {
                const isExpired = moment(convertTimeRangeToTime(x.timeSlot)).isBefore(new Date(), 'minute');
                if (isExpired) {
                    x.status = TimeSlotsStatus.Expired;
                }
            });
        }

        setTimelines(_.cloneDeep(timelineRanges));
    }

    const convertTimeRangeToTime = (timeRange) => {
        if (!timeRange || !timeRange.includes(":")) return null;
        const hour = timeRange.split(':')[0];
        const minute = timeRange.split(':')[1];
        return moment(selectedDate).set({ 'hour': hour, 'minute': minute, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss");
    }

    const buildCoverageContent = (item) => {
        switch (item.status) {
            case TimeSlotsStatus.Reserved:
                return { style: styles.reserved, content: 'Reserved' };
            case TimeSlotsStatus.Expired:
                return { style: styles.reserved, content: 'Expired' };
            case TimeSlotsStatus.Free:
                return { style: styles.free, content: 'Free place' };
            case TimeSlotsStatus.Selected:
                return { style: styles.selected, content: 'You will rent this time range' };
            default:
                return { style: styles.closed, content: 'Closed hours' };
        }
    }

    const handleSelectCoverageContent = (item) => {
        if (moment(selectedDate).isBefore(new Date(), 'day')) return;
        if (paramFacility.isAdminView && !isRentalUser && item.status === TimeSlotsStatus.Closed) {
            setTimeBlock(item);
            setClosedBlockDialog(true);
            return;
        }
        if (paramFacility.isAdminView && !isRentalUser && item.status === TimeSlotsStatus.Free) {
            setTimeBlock(item);
            setFreeBlockDialog(true);
            return;
        }
        if (isRentalUser && (item.status === TimeSlotsStatus.Free || item.status == TimeSlotsStatus.Selected)) {
            let tmpTimelines = _.cloneDeep(timelines);
            const index = timelines.findIndex((x) => { return x.timeSlot === item.timeSlot; });
            if (index != -1) {
                tmpTimelines[index].status = tmpTimelines[index].status === TimeSlotsStatus.Selected ? TimeSlotsStatus.Free : TimeSlotsStatus.Selected;
                setTimelines(tmpTimelines);
            }
        }
    }

    const handleGoPaymentClick = async () => {
        const rentalDuration = calculateRentalDuration();
        setConfirmationContent(`Your reservation is for ${rentalDuration}H total, and will cost $${totalRentalAmount}.`);
    }

    const calculateRentalDuration = () => {
        const selectTimeRanges: any = Array.isArray(timelines) && timelines.filter((x) => x.status === TimeSlotsStatus.Selected);
        let rentalDuration;
        if (selectTimeRanges.length === 1) {
            rentalDuration = 0.5;
        } else if (selectTimeRanges.length % 2) {
            rentalDuration = (selectTimeRanges.length - 1) / 2 + 0.5;
        } else {
            rentalDuration = selectTimeRanges.length / 2;
        }

        return rentalDuration;
    }

    const handleRentClick = () => {
        setAdminRentalDialogStatus(true);
    }

    const handleAdminRentClick = async () => {
        if (!timelines || !Array.isArray(timelines)) return;
        const selectTimeRanges = timelines.filter((x) => x.status === TimeSlotsStatus.Selected);
        const data = {
            rentalDate: moment(selectedDate).format("YYYY-MM-DD"),
            rentalTimeRanges: selectTimeRanges.map(x => x.timeSlot),
            userId: userInfo.facilityUser,
            userType: userInfo.organizationType
        };

        const res: any = await facilityService.rentFacilityByAdmin(paramFacility.id, data);
        if (res && res.code === 200) {
            handleRentSuccess();
        }
    }

    const handleRentSuccess = () => {
        getFacilityDailyInfo(paramFacility.id, selectedDate);
        setAdminRentalDialogStatus(false);
        toast.success('rent successfully!');
    }

    const handlePaymentClick = async () => {
        setConfirmationContent("");
        if (!timelines || !Array.isArray(timelines)) return;
        const selectTimeRanges = timelines.filter((x) => x.status === TimeSlotsStatus.Selected);
        const data = {
            rentalDate: moment(selectedDate).format("YYYY-MM-DD"),
            rentalTimeRanges: selectTimeRanges.map(x => x.timeSlot),
            totalAmount: totalRentalAmount,
            RenterId: user.id,
            UserId: userInfo.facilityUser,
            UserType: userInfo.organizationType
        };

        const res: any = await facilityService.rentFacility(paramFacility.id, data);
        if (res && res.code === 200) {
            setTotalRentalAmount(0);
            var paymentUrl = res.value.payUrl.PaymentUrl;
            await presentPaymentDirect(paymentUrl, handleRentSuccess, () => { getFacilityDailyInfo(paramFacility.id, selectedDate); }, "Your reservation was successful!");
        }
    }

    return (
        <ElScrollContainer>
            <ElTitle>{paramFacility?.name}</ElTitle>
            {
                (!paramFacility.isAdminView || isRentalUser) &&
                <>
                    <Text mt={2} >Rental Price:</Text>
                    <Flex mb={2} direction="row">
                        <Text mr={2} >Cost for 30 minutes:</Text>
                        <Spacer />
                        <Text mr={2} w="25%">{paramFacility?.halfHourPrice + '$'}</Text>
                    </Flex>
                    <Flex mb={2} direction="row">
                        <Text mr={2} >Cost for 1 hour:</Text>
                        <Spacer />
                        <Text mr={2} w="25%">{paramFacility?.oneHourPrice + '$'}</Text>
                    </Flex>

                    <Flex mb={2} direction="row">
                        <Text mr={2}>Cost for 2+ hour:</Text>
                        <Spacer />
                        <Text mr={2} w="25%">{paramFacility?.exceedTwoHoursPrice + '$'}</Text>
                    </Flex>
                </>
            }

            <Box mt={3}>
                <CalendarWeeksTab onDayTabClick={setSelectedDate} />
            </Box>

            <Box pt={2} pb={6} backgroundColor="yellow">
                {
                    timelines.map((item, itemIndex) => {
                        const coverageContent = buildCoverageContent(item);
                        return <React.Fragment key={'timeline-scale-' + itemIndex}>
                            <Pressable onPress={() => { handleSelectCoverageContent(item) }}>
                                <Box style={styles.timeRow} >
                                    <Text style={styles.timestapWrraper}>{item.timeSlot}</Text>
                                    <Box style={{ ...styles.timeRowCoverage, ...coverageContent?.style }}>
                                        <Text style={styles?.timeRowContentFont}>
                                            {coverageContent?.content}
                                        </Text>
                                    </Box>
                                </Box>
                            </Pressable>
                            <Divider />
                        </React.Fragment>
                    })
                }
                {
                    !paramFacility.isAdminView && isRentalUser &&
                    <ElButton style={{ marginTop: 24 }} disabled={totalRentalAmount === 0} onPress={handleGoPaymentClick}>Go to payment (${totalRentalAmount})</ElButton>
                }
                {
                    paramFacility.isAdminView && isRentalUser &&
                    <ElButton style={{ marginTop: 24 }} disabled={totalRentalAmount === 0} onPress={handleRentClick}>Rent ({calculateRentalDuration()}H)</ElButton>
                }
            </Box>
            <ElDialog visible={!!confirmationContent} title="Rental Confirmation"
                footer={
                    <Row>
                        <Box flex={1} mr={1}>
                            <ElButton onPress={() => setConfirmationContent("")}>
                                Cancel
                            </ElButton>
                        </Box>
                        <Box flex={1} ml={1}>
                            <ElButton onPress={handlePaymentClick}>
                                Payment
                            </ElButton>
                        </Box>
                    </Row>
                }>
                <Text>
                    {confirmationContent}
                </Text>
            </ElDialog>

            <ElDialog visible={adminRentalDialogStatus} title="Rental Confirmation"
                footer={
                    <Row>
                        <Box flex={1} mr={1}>
                            <ElButton onPress={() => setAdminRentalDialogStatus(false)}>
                                Cancel
                            </ElButton>
                        </Box>
                        <Box flex={1} ml={1}>
                            <ElButton onPress={handleAdminRentClick}>
                                Rent
                            </ElButton>
                        </Box>
                    </Row>
                }>
                You are this facility{'\''}s admin, are you going to rent {calculateRentalDuration()}H from this facility?
            </ElDialog>
        </ElScrollContainer>
    );
}