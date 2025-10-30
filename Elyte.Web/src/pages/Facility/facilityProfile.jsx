import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { ElBox, ElButton, ElSvgIcon, ElBody, ElImageUploader, ElAddress, ElAvatar, ElMenuBtn } from 'components';
import { Box, Typography, Divider, Grid, OutlinedInput, InputAdornment } from '@mui/material';
import { useLocation, useHistory } from 'react-router-dom';
import { facilityService, athleteService, authService } from 'services';
import { FollowType } from 'enums';
import { useForm } from "react-hook-form";
import { usePaymentAccounts, validator } from 'utils'
import SelectFacilityUser from './selectFacilityUser';
import { OrganizationType } from 'enums';
import PaymentIcon from 'pages/Organization/paymentIcon';
import OrganizationInfo from 'pages/Organization/organizationInfo';

const useStyles = makeStyles(theme => ({
    contactInfoGrid: {
        flexGrow: 1,
        '& svg': {
            stroke: theme.palette.body.main
        },
        color: theme.palette.body.main,
        fontSize: 15
    },
    priceList: {
        marginTop: theme.spacing(4),
        flexGrow: 1,
        '& svg': {
            stroke: theme.palette.body.main,
            border: '2px solid #FFFFFF',
        },
        color: theme.palette.body.light,
        fontSize: 15,
        fontWeight: 500
    },
    priceItem: {
        display: 'flex',
        alignItems: 'center',
    },
    priceInput: {
        background: '#F0F2F7;',
        '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 0,
        },
        borderRadius: '10px',
        width: 100,
        height: 50,
    },
    btnBox: {
        justifyContent: 'space-around'
    }
}));

export default function FacilityProfile () {
    const currentUser = authService.getCurrentUser();
    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();
    const facilityId = location?.state?.params;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { configPaymentAccount } = usePaymentAccounts();
    const [halfHourPrice, setHalfHourPrice] = useState(0);
    const [oneHourPrice, setOneHourPrice] = useState(0);
    const [exceedTwoHoursPrice, setExceedTwoHoursPrice] = useState(0);
    const [showSelectUserDialog, setShowSelectUserDialog] = useState(false);
    const [facility, setFacility] = useState({});

    useEffect(() => getFacilityProfile(facilityId), [facilityId]);

    useEffect(() => {
        setHalfHourPrice(facility?.halfHourPrice || 0);
        setOneHourPrice(facility?.oneHourPrice || 0);
        setExceedTwoHoursPrice(facility?.exceedTwoHoursPrice || 0);
    }, [facility]);

    const getFacilityProfile = async (id) => {
        const res = await facilityService.getFacility(id);
        if (res && res.code === 200 && res.value) {
            setFacility(res.value);
        }
    }

    const handleImageSelect = async image => {
        let formdata = new FormData();
        formdata.append("facilityId", facilityId);
        formdata.append("file", image.file);
        const res = await facilityService.updateFacilityProfileImage(facilityId, formdata);
        if (res && res.code === 200) {
            getFacilityProfile(facilityId);
        }
    };

    const handleEditTeamClick = () => history.push('/editFacility', { params: facility });
    const handleChangeScheduleClick = () => history.push('/facilityCalendar', { params: { facility: facility, isRentalUser: false } });
    const handleSelectUserDialog = () => setShowSelectUserDialog(true);

    const handleFollowFacility = async () => {
        const res = await athleteService.followOrganization(currentUser.id, facilityId, FollowType.Facility);
        if (res && res.code === 200) {
            getFacilityProfile(facilityId);
        }
    };

    const handleUnfollowFacility = async () => {
        const res = await athleteService.unfollowOrganization(currentUser.id, facilityId);
        if (res && res.code === 200) {
            getFacilityProfile(facilityId);
        }
    };

    const handleSavePriceClick = async (data) => {
        let res = await facilityService.updateFacilityRentalPrice(facilityId, data);
        if (res && res.code === 200) {
            getFacilityProfile(facilityId);
        }
    }

    const menuItems = [
        {
            text: 'Config Stripe Account',
            onClick: () => configPaymentAccount(OrganizationType.Facility, facilityId),
            hide: !facility.isAdminView || facility.paymentIsEnabled
        },
        {
            text: 'Make an admin',
            onClick: () => history.push('/facilityAdmins', { params: { facilityId: facility.id, isOwnerView: facility.isOwnerView } }),
            hide: !facility.isAdminView
        }
    ];

    return (
        <>
            <ElBox center>
                <ElImageUploader crop onImageSelected={handleImageSelect} disabled={!facility.isAdminView}>
                    <ElAvatar src={facility?.imageUrl} large />
                </ElImageUploader>
                <ElBox col flex={1} pl={2} pr={1}>
                    <Typography className="profile-title y-center">
                        {facility?.name}
                        {facility.isAdminView && <PaymentIcon paymentIsEnabled={facility.paymentIsEnabled} />}
                    </Typography>
                    <OrganizationInfo>Type: {facility?.sportOption}</OrganizationInfo>
                    <ElAddress className="profile-address" hideLocationIcon
                        street={facility?.street}
                        country={facility?.country}
                        state={facility?.state}
                        city={facility?.city} />
                    <Box display="flex">
                        {
                            facility?.isAdminView &&
                            <ElButton className="operation-btn" onClick={handleEditTeamClick}>Edit</ElButton>
                        }
                        {
                            !facility?.isFollow && !facility?.isAdminView &&
                            <ElButton className="operation-btn" onClick={handleFollowFacility}>Follow</ElButton>
                        }
                        {
                            facility?.isFollow && !facility?.isAdminView &&
                            <ElButton className="operation-btn" onClick={handleUnfollowFacility}>Unfollow</ElButton>
                        }
                    </Box>
                </ElBox>
                <Box mt={2} alignSelf="flex-start">
                    <ElMenuBtn items={menuItems}>
                        <ElSvgIcon light small name="options" />
                    </ElMenuBtn>
                </Box>
            </ElBox>
            <ElBody mt={2}> {facility?.detail ?? 'No bio now'} </ElBody>
            <Divider className="divider" />
            <Grid className={classes.contactInfoGrid} container spacing={1}>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12}><Typography className="category-text">Contact Information:</Typography></Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={1}><ElSvgIcon xSmall name="phone" /></Grid>
                    <Grid item xs={11}>{facility?.contactNumber}</Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={1}><ElSvgIcon xSmall name="email" /></Grid>
                    <Grid item xs={11}>{facility?.contactEmail}</Grid>
                </Grid>
            </Grid>
            <Divider className="divider" />
            <form className={classes.root} onSubmit={handleSubmit(handleSavePriceClick)} autoComplete="off">
                <Grid className={classes.priceList} container spacing={1}>
                    <Grid className={classes.priceItem} container item xs={12} spacing={2}>
                        <Grid item xs={6}>Cost for 30 minutes</Grid>
                        {facility?.isAdminView && <Grid item xs={1}><ElSvgIcon xSmall name="minus" onClick={() => { setHalfHourPrice(halfHourPrice - 1 <= 0 ? 0 : halfHourPrice - 1); }} /></Grid>}
                        {facility?.isAdminView && <Grid item xs={1}><ElSvgIcon xSmall name="plus" onClick={() => { setHalfHourPrice(halfHourPrice + 1); }} /></Grid>}
                        <Grid item xs={4}>
                            <OutlinedInput className={classes.priceInput} disabled={!facility?.isAdminView}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                error={!!errors} value={halfHourPrice}
                                {...register("halfHourPrice", {
                                    onChange: (e) => setHalfHourPrice(e.target.value),
                                    value: halfHourPrice,
                                    required: { value: true, message: '' },
                                    validate: {
                                        rule1: v => validator.isNonzeroDecimal(v, 2) || ''
                                    }
                                })}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.priceItem} container item xs={12} spacing={2}>
                        <Grid item xs={6}>Cost for 1 hour</Grid>
                        {facility?.isAdminView && <Grid item xs={1}><ElSvgIcon xSmall name="minus" onClick={() => { setOneHourPrice(oneHourPrice - 1 <= 0 ? 0 : oneHourPrice - 1); }} /></Grid>}
                        {facility?.isAdminView && <Grid item xs={1}><ElSvgIcon xSmall name="plus" onClick={() => { setOneHourPrice(oneHourPrice + 1); }} /></Grid>}
                        <Grid item xs={4}>
                            <OutlinedInput className={classes.priceInput} disabled={!facility?.isAdminView} error={!!errors} value={oneHourPrice}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                {...register("oneHourPrice", {
                                    onChange: (e) => setOneHourPrice(e.target.value),
                                    value: oneHourPrice,
                                    required: { value: true, message: '' },
                                    validate: {
                                        rule1: v => validator.isNonzeroDecimal(v, 2) || ''
                                    }
                                })}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.priceItem} container item xs={12} spacing={2}>
                        <Grid item xs={6}>Cost for 2+ hour</Grid>
                        {facility?.isAdminView && <Grid item xs={1}><ElSvgIcon xSmall name="minus" onClick={() => { setExceedTwoHoursPrice(exceedTwoHoursPrice - 1 <= 0 ? 0 : exceedTwoHoursPrice - 1); }} /></Grid>}
                        {facility?.isAdminView && <Grid item xs={1}><ElSvgIcon xSmall name="plus" onClick={() => { setExceedTwoHoursPrice(exceedTwoHoursPrice + 1); }} /></Grid>}
                        <Grid item xs={4}>
                            <OutlinedInput className={classes.priceInput} disabled={!facility?.isAdminView} error={!!errors} value={exceedTwoHoursPrice}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                endAdornment={<InputAdornment position="end">/h</InputAdornment>}
                                {...register("exceedTwoHoursPrice", {
                                    onChange: (e) => setExceedTwoHoursPrice(e.target.value),
                                    value: exceedTwoHoursPrice,
                                    required: { value: true, message: '' },
                                    validate: {
                                        rule1: v => validator.isNonzeroDecimal(v, 2) || ''
                                    }
                                })}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {
                    facility?.isAdminView &&
                    <>
                        <ElBox className={classes.btnBox}>
                            <ElButton type="submit" mt={6}>Save Price</ElButton>
                            <ElButton mt={6} onClick={handleChangeScheduleClick}>Change Schedule</ElButton>
                        </ElBox>
                        <ElButton mt={4} onClick={handleSelectUserDialog}>Schedule a time</ElButton>
                    </>
                }
                {
                    !facility?.isAdminView && facility.paymentIsEnabled &&
                    <ElButton mt={6} onClick={handleSelectUserDialog}>Schedule a time</ElButton>
                }
                {
                    !facility?.isAdminView && !facility.paymentIsEnabled &&
                    <ElBody center mt={4}>The facility was not configured to rent yet</ElBody>
                }
            </form>
            {
                showSelectUserDialog && <SelectFacilityUser facility={facility} onClose={() => setShowSelectUserDialog(false)} />
            }
        </>
    );
}
