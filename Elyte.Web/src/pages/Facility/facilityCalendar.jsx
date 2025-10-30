import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Grid, CircularProgress, Backdrop } from '@mui/material';
import { ElTitle, ElButton, ElDialog } from 'components';
import { makeStyles } from '@mui/styles';
import * as moment from 'moment';
import _ from 'lodash';
import { OrganizationType, TimeSlotsStatus } from 'enums';
import { facilityService, authService } from 'services';
import { useLocation } from 'react-router-dom';
import WorkingDaysSetting from './component/workingDaysSetting';
import CalendarWeeksTab from './../../pageComponents/calendarWeeksTab';
import StripeCheckout from 'pages/Organization/stripeCheckout';

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

const useStyles = makeStyles(theme => ({
    button: {
        background: theme.bgPrimary,
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
        height: 50,
        alignItems: 'center'
    },
    timestapWrraper: {
        width: 70,
        color: theme.palette.body.light,
        fontSize: 12,
        fontWeight: 500,
    },
    timeRowCoverage: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        height: 50,
        width: 500,
        maxWidth: theme.breakpoints.values.sm - theme.spacing(10),
    },
    reserved: {
        background: theme.palette.body.main,
        pointerEvents: 'none'
    },
    closed: {
        background: '#E95B5B',
        pointerEvents: 'none'
    },
    selected: {
        background: 'linear-gradient(180deg, #2599FB 6.84%, #006BC5 100%)',
    },
    free: {
        background: '#17C476',
    },
    timeRowContentFont: {
        marginLeft: 6,
        color: '#FFFFFF',
        weight: 500,
        size: 15,
        top: '50%'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

export default function FacilityCalendar () {
    const location = useLocation();
    const paramFacility = location.state?.params?.facility;
    const userInfo = location.state?.params?.user;
    const isRentalUser = location.state?.params?.isRentalUser;
    const classes = useStyles();
    const [currentSelectDay, setCurrentSelectDay] = useState(new Date());
    const [facility, setFacility] = useState({});
    const [timelines, setTimelines] = useState(_.cloneDeep(timelineRanges));
    const [btnLoadingStatus, setBtnLoadingStatus] = useState(false);
    const [totalRentalAmount, setTotalRentalAmount] = useState(0);
    const [confirmationContent, setConfirmationContent] = useState();
    const currentUser = authService.getCurrentUser();
    const [closedBlockDialog, setClosedBlockDialog] = useState(false);
    const [freeBlockDialog, setFreeBlockDialog] = useState(false);
    const [timeBlock, setTimeBlock] = useState(false);
    const [adminRentalDialogStatus, setAdminRentalDialogStatus] = useState(false);
    const [clientSecret, setClientSecret] = useState();

    useEffect(() => getFacilityDailyInfo(paramFacility.id, currentSelectDay), [currentSelectDay]);

    useEffect(() => buildTimeSlotState(), [facility]);

    useEffect(() => calculateRentalPrice(), [timelines]);

    const getFacilityDailyInfo = async (facilityId, currentWeekDay) => {
        const res = await facilityService.getFacilityCalendar(facilityId, moment(currentWeekDay).format("YYYY-MM-DD"));
        if (res.code === 200 && res.value) {
            setFacility(res.value);
        }
    }

    const convertTimeRangeToTime = (timeRange) => {
        if (!timeRange || !timeRange.includes(":")) return null;
        const hour = timeRange.split(':')[0];
        const minute = timeRange.split(':')[1];
        return moment(currentSelectDay).set({ 'hour': hour, 'minute': minute, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss");
    }

    const calculateRentalPrice = () => {
        const selectTimeRanges = !Array.isNullOrEmpty(timelines) && timelines.filter((x) => x.status === TimeSlotsStatus.Selected);
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

    const calculateRentalDuration = () => {
        const selectTimeRanges = Array.isArray(timelines) && timelines.filter((x) => x.status === TimeSlotsStatus.Selected);
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

    const buildCoverageContent = (item) => {
        switch (item.status) {
            case TimeSlotsStatus.Reserved:
                return { class: classes.reserved, content: 'Reserved' };
            case TimeSlotsStatus.Expired:
                return { class: classes.reserved, content: 'Expired' };
            case TimeSlotsStatus.Free:
                return { class: classes.free, content: 'Free place' };
            case TimeSlotsStatus.Selected:
                return { class: classes.selected, content: 'You will rent this time range' };
            default:
                return { class: classes.closed, content: 'Closed hours' };
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

        if (!Array.isNullOrEmpty(facility.closedTimeRanges)) {
            for (index = 0; index < facility.closedTimeRanges.length; index++) {
                const e = facility.closedTimeRanges[index];
                const i = timelineRanges.findIndex((x) => { return x.timeSlot === e; });
                if (i === -1) continue;
                timelineRanges[i].status = TimeSlotsStatus.Closed;
            }
        }

        if (!Array.isNullOrEmpty(facility.freeTimeRanges)) {
            for (index = 0; index < facility.freeTimeRanges.length; index++) {
                const e = facility.freeTimeRanges[index];
                const i = timelineRanges.findIndex((x) => { return x.timeSlot === e; });
                if (i === -1) continue;
                timelineRanges[i].status = TimeSlotsStatus.Free;
            }
        }

        if (!Array.isNullOrEmpty(facility.rentedTimeRanges)) {
            facility.rentedTimeRanges.forEach(time => {
                const i = timelineRanges.findIndex((x) => { return x.timeSlot === time; });
                timelineRanges[i].status = TimeSlotsStatus.Reserved;
            });
        }

        const availableTimeSlots = timelineRanges.filter(x => x.status !== TimeSlotsStatus.Closed);
        if (!Array.isNullOrEmpty(availableTimeSlots)) {
            availableTimeSlots.forEach(x => {
                const isExpired = moment(convertTimeRangeToTime(x.timeSlot)).isBefore(new Date(), 'minute');
                if (isExpired) {
                    x.status = TimeSlotsStatus.Expired;
                }
            });
        }

        setTimelines(_.cloneDeep(timelineRanges));
    }

    const handleSelectCoverageContent = (item) => {
        if (moment(currentSelectDay).isBefore(new Date(), 'day')) return;
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

    const handlePaymentClick = async () => {
        setBtnLoadingStatus(true);
        setConfirmationContent("");
        const selectTimeRanges = Array.isArray(timelines) && timelines.filter((x) => x.status === TimeSlotsStatus.Selected);

        const data = {
            rentalDate: moment(currentSelectDay).format("YYYY-MM-DD"),
            rentalTimeRanges: selectTimeRanges.map(x => x.timeSlot),
            totalAmount: totalRentalAmount,
            RenterId: currentUser.id,
            UserId: userInfo.facilityUser,
            UserType: userInfo.organizationType
        };

        const res = await facilityService.rentFacility(paramFacility.id, data);
        if (res && res.code === 200) {
            setTotalRentalAmount(0);
            var transactionId = res.value.payUrl.TransactionId;
            var paymentUrl = res.value.payUrl.PaymentUrl;
            sessionStorage.setItem('transactionId', transactionId);
            setClientSecret(paymentUrl);
        }

        setBtnLoadingStatus(false);
    }

    const handleCloseHour = async () => {
        const data = {
            date: moment(currentSelectDay).format("YYYY-MM-DD"),
            timeRange: timeBlock.timeSlot,
        };
        const res = await facilityService.closeFacilityTimeBlock(paramFacility.id, data);
        if (res && res.code === 200) {
            getFacilityDailyInfo(paramFacility.id, currentSelectDay);
            setFreeBlockDialog(false);
        }
    }

    const handleOpenHour = async () => {
        const data = {
            date: moment(currentSelectDay).format("YYYY-MM-DD"),
            timeRange: timeBlock.timeSlot,
        };
        const res = await facilityService.openFacilityTimeBlock(paramFacility.id, data);
        if (res && res.code === 200) {
            getFacilityDailyInfo(paramFacility.id, currentSelectDay);
            setClosedBlockDialog(false);
        }
    }

    const handleRentClick = () => {
        setAdminRentalDialogStatus(true);
    }

    const handleAdminRentClick = async () => {
        const selectTimeRanges = Array.isArray(timelines) && timelines.filter((x) => x.status === TimeSlotsStatus.Selected);
        const data = {
            rentalDate: moment(currentSelectDay).format("YYYY-MM-DD"),
            rentalTimeRanges: selectTimeRanges.map(x => x.timeSlot),
            userId: userInfo.facilityUser,
            userType: userInfo.organizationType
        };

        const res = await facilityService.rentFacilityByAdmin(paramFacility.id, data);
        if (res && res.code === 200) {
            getFacilityDailyInfo(paramFacility.id, currentSelectDay);
            setAdminRentalDialogStatus(false);
            window.elyte.success('rent successfully!');
        }
    }

    const handleCancelCheckout = async () => {
        setClientSecret('');
        getFacilityDailyInfo(paramFacility.id, currentSelectDay);
    }

    return (
        <>
            <StripeCheckout clientSecret={clientSecret} type={OrganizationType.Facility} onCancel={handleCancelCheckout} />
            <ElTitle center>{facility?.name}</ElTitle>
            {
                (!paramFacility.isAdminView || isRentalUser) &&
                <>
                    <Typography className="category-text">Rental Price:</Typography>
                    <Grid container spacing={1} >
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={4}>30 minutes:</Grid>
                            <Grid item xs={6}>{facility?.halfHourPrice} $ </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={4}>1 hour:</Grid>
                            <Grid item xs={6}>{facility?.oneHourPrice} $ </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={4}>2+ hours:</Grid>
                            <Grid item xs={6}>{facility?.exceedTwoHoursPrice} $ </Grid>
                        </Grid>
                    </Grid>
                </>
            }
            {
                paramFacility.isAdminView && !isRentalUser &&
                <WorkingDaysSetting defaultFacilityId={paramFacility?.id} defaultWorkDays={paramFacility?.workDays} defaultWorkStartTime={paramFacility?.workStartTime}
                    defaultWorkEndTime={paramFacility?.workEndTime}
                    onSaveSuccess={() => { getFacilityDailyInfo(paramFacility.id, currentSelectDay); }} />
            }

            <Box mt={3}>
                <CalendarWeeksTab onDayTabClick={(day) => setCurrentSelectDay(day)} />
            </Box>

            <Box className={classes.timelineContainer} pt={2}>
                {
                    timelines.map((item, itemIndex) => {
                        const coverageContent = buildCoverageContent(item);
                        return <React.Fragment key={'timeline-scale-' + itemIndex}>
                            <Box className={classes.timeRow} onClick={() => { handleSelectCoverageContent(item) }}>
                                <Box className={classes.timestapWrraper}>{item.timeSlot}</Box>
                                <Box className={[classes.timeRowCoverage, coverageContent?.class].join(" ")}>
                                    <Typography className={classes?.timeRowContentFont}>
                                        {coverageContent?.content}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider />
                        </React.Fragment>
                    })
                }
                {
                    !paramFacility.isAdminView && isRentalUser &&
                    <ElButton mt={6} disabled={totalRentalAmount === 0} onClick={handleGoPaymentClick}>Go to payment (${totalRentalAmount})</ElButton>
                }
                {
                    paramFacility.isAdminView && isRentalUser &&
                    <ElButton mt={6} disabled={totalRentalAmount === 0} onClick={handleRentClick}>Rent ({calculateRentalDuration()}H)</ElButton>
                }
            </Box>
            <ElDialog open={!!confirmationContent} title="Rental Confirmation"
                actions={
                    <>
                        <ElButton onClick={() => setConfirmationContent("")}>Cancel</ElButton>
                        <ElButton onClick={handlePaymentClick}>Payment</ElButton>
                    </>
                }>
                {confirmationContent}
            </ElDialog>

            <ElDialog open={adminRentalDialogStatus} title="Rental Confirmation"
                actions={
                    <>
                        <ElButton onClick={() => setAdminRentalDialogStatus(false)}>Cancel</ElButton>
                        <ElButton onClick={handleAdminRentClick}>Rent</ElButton>
                    </>
                }>
                You are this facility{'\''}s admin, are you going to rent {calculateRentalDuration()}H from this facility?
            </ElDialog>

            <ElDialog open={closedBlockDialog} title="Manage block" onClose={() => setClosedBlockDialog(false)}
                actions={<ElButton onClick={handleOpenHour}>Open hour</ElButton>}>
            </ElDialog>
            <ElDialog open={freeBlockDialog} title="Manage block" onClose={() => setFreeBlockDialog(false)}
                actions={<ElButton onClick={handleCloseHour}>Close hour</ElButton>}>
            </ElDialog>

            {
                <Backdrop className={classes.backdrop} open={btnLoadingStatus} >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
        </>
    );
}