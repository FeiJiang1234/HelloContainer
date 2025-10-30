import React, { useEffect, useState } from 'react';
import { Typography, Grid, Divider, Checkbox, MenuItem, ListItemText, Box } from '@mui/material';
import { styled } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { ElButton, ElLink, ElInput, ElTitle, ElSelect, ElImageSelecter, ElCheckbox, ElBody, ElDialog, ElBox, ElAvatar, ElAutocomplete } from 'components';
import { utils, validator, useOfficialIds, useFormValidate, usePaymentAccounts, useManagedAssociations } from 'utils';
import { facilityService, authService } from 'services';
import { useHistory, useLocation } from 'react-router-dom';
import { SportTypes, timeZones, weeks, timeRanges } from 'models';
import { useForm } from "react-hook-form";
import CongratulationIndex from './../Organization/congratulationIndex';
import { RegionCascader } from 'pageComponents';
import { OrganizationType } from 'enums';

const SubCheckbox = styled(Checkbox)(() => {
    return {
        '&.MuiCheckbox-root': {
            color: 'white'
        },
        '&.Mui-checked': {
            color: '#17C476'
        }
    };
});

const useStyles = makeStyles(theme => ({
    interval: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 15,
        color: theme.palette.body.main,
    }
}));


const CreateFacility = () => {
    const history = useHistory();
    const location = useLocation();
    const routerParams = location.state?.params;
    const classes = useStyles();
    const user = authService.getCurrentUser();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { officialIds } = useOfficialIds(user.id);
    const { validateDigital, validateEmail } = useFormValidate();
    const { paymentAccounts, getPaymentAccounts, configPaymentAccount } = usePaymentAccounts();
    const [image, setImage] = useState();
    const [facilityData, setFacilityData] = useState({});
    const [showCongratulationsDialog, setShowCongratulationsDialog] = useState(false);
    const [url, setUrl] = useState();
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [isChoosePaymentAccount, setIsChoosePaymentAccount] = useState(false);
    const [workDays, setWorkDays] = useState([]);
    const { associations } = useManagedAssociations(user.id);

    useEffect(() => getPaymentAccounts(), []);

    useEffect(() => {
        if (facilityData?.image) {
            utils.readFile(facilityData.image).then(d => setUrl(d));
        }
    }, [facilityData]);

    const handleCreateClick = async (data) => {
        const formData = utils.formToFormData(data, ['image']);
        formData.append('associationId', routerParams?.associationId || null);
        formData.append('File', image || routerParams?.image);
        const res = await facilityService.createFacility(formData);
        if (res && res.code === 200) {
            setFacilityData({ id: res.value, image: image || routerParams?.image, ...data });
            setShowCongratulationsDialog(true);
        }
    }

    const handleWorkDaysChanged = (event) => setWorkDays(event.target.value);
    const handleGoToProfile = () => history.push('/facilityProfile', { params: facilityData.id });

    const handleConfigurePaymentAccount = () => {
        history.push('/facilityProfile', { params: facilityData.id });
        configPaymentAccount(OrganizationType.Facility, facilityData.id);
    }

    return (
        <form onSubmit={handleSubmit(handleCreateClick)} autoComplete="off">
            <ElTitle center>Create A Facility</ElTitle>
            <Typography className="category-text">Main Information</Typography>
            <ElImageSelecter name="image" label="Choose profile image" defaultValue={routerParams?.image} onImageSelected={(i) => setImage(i)} />
            <ElInput label="Name" errors={errors} inputProps={{ maxLength: 50 }} defaultValue={routerParams?.organizationName}
                {...register("name", { required: 'This field is required.' })}
            />
            <ElAutocomplete label="Association Id (Optional)" name="associationId" freeSolo errors={errors} options={associations} register={register}
                defaultValue={routerParams.associationId} disabled={routerParams.fromAssociation} renderOption={(props, option) => (<Box component="li" {...props}>{option.label} ({option.name})</Box>)} />
            <ElSelect label="Official Id" options={officialIds} errors={errors}
                {...register("officialId", { required: 'This field is required.' })}
            />
            <Typography className="category-text">Sport Facility Type</Typography>
            <ElSelect label="Choose a sport type" errors={errors} options={SportTypes}
                {...register("sportOption", { required: 'This field is required.' })}
            />
            <Typography className="category-text">Time/Date Details</Typography>
            <ElSelect label="Choose a Time zone" errors={errors} options={timeZones}
                {...register("timezone", { required: 'This field is required.' })}
            />
            <Typography className="category-text">Working Days</Typography>
            <ElSelect label="Set facilit's work days" multiple value={workDays} renderValue={(selected) => selected.join(',')} errors={errors}
                {...register("workDays", { required: 'This field is required.', onChange: handleWorkDaysChanged })}
            >
                {weeks.map((name) => (
                    <MenuItem key={name} value={name}>
                        <SubCheckbox checked={workDays.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </ElSelect>
            <Typography className="category-text">Working Time</Typography>
            <Box flexGrow={1}>
                <Grid container spacing={1}>
                    <Grid item xs={5}>
                        <ElSelect label="Start time" errors={errors} options={timeRanges}
                            {...register("workStartTime", { required: 'This field is required.' })}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.interval}>To</Grid>
                    <Grid item xs={5}>
                        <ElSelect label="End time" errors={errors} options={timeRanges}
                            {...register("workEndTime", { required: 'This field is required.' })}
                        />
                    </Grid>
                </Grid>
            </Box>
            <ElInput label="Detail" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} defaultValue={routerParams?.organizationBio}
                {...register("detail", {
                    required: 'This field is required.'
                })}
            />
            <Typography className="category-text">Address</Typography>
            <RegionCascader register={register} errors={errors} />
            <ElInput label="Street" errors={errors} inputProps={{ maxLength: 150 }}
                {...register("street", { required: 'This field is required.' })}
            />
            <Typography className="category-text">Payment Details</Typography>
            <ElInput label="Price for half an hour($)" errors={errors} inputProps={{ maxLength: 6 }}
                {...register("halfHourPrice", {
                    required: 'This field is required.',
                    validate: { rule1: v => validator.isNonzeroDecimal(v, 2) || 'Please enter correct price!' }
                })}
            />
            <ElInput label="Price for an hour($)" errors={errors} inputProps={{ maxLength: 6 }}
                {...register("oneHourPrice", {
                    required: 'This field is required.',
                    validate: { rule1: v => validator.isNonzeroDecimal(v, 2) || 'Please enter correct price!' }
                })}
            />
            <ElInput label="Price for 2+ hours($)" errors={errors} inputProps={{ maxLength: 6 }}
                {...register("exceedTwoHoursPrice", {
                    required: 'This field is required.',
                    validate: { rule1: v => validator.isNonzeroDecimal(v, 2) || 'Please enter correct price!' }
                })}
            />
            {
                !Array.isNullOrEmpty(paymentAccounts) &&
                <ElSelect label="Choose a Payment Account" options={[{ value: '', label: 'None' }, ...paymentAccounts]}
                    {...register("paymentAccount", { onChange: e => setIsChoosePaymentAccount(e.target.value != '') })}
                />
            }
            <Typography className="category-text">Contact Details</Typography>
            <ElInput label="Contact Number" errors={errors} inputProps={{ maxLength: 11 }}
                {...register("contactNumber", {
                    required: 'This field is required.'
                })}
            />
            <ElInput label="Contact Email" errors={errors} inputProps={{ maxLength: 150 }}
                {...register("contactEmail", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateEmail(v) }
                })}
            />
            <Typography className="category-text">Number Of Facility To Create</Typography>
            <ElInput label="Number of facility to create" errors={errors} inputProps={{ maxLength: 3 }}
                {...register("createQuantity", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateDigital(v) }
                })}
            />
            <Divider className="divider" />
            <ElCheckbox onChange={() => setBtnDisabled(!btnDisabled)}
                label={
                    <>
                        <Typography className="checkbox-label">Facility/Field Terms and Conditions</Typography>
                        <ElBody>You agree to Elyte{'\'s'} <ElLink green to="/termOfFacility">terms and conditions</ElLink> for Facilities/Fields</ElBody>
                    </>} />
            <ElButton mt={6} disabled={btnDisabled} type="submit">Create Facility</ElButton>
            <ElDialog open={showCongratulationsDialog} title="Congratulations"
                actions={<>
                    <ElButton onClick={handleGoToProfile}>Go to Profile</ElButton>
                    {
                        !isChoosePaymentAccount &&
                        <ElButton onClick={handleConfigurePaymentAccount}>Configure Account</ElButton>
                    }
                </>}>
                <Typography sx={{ textAlign: 'center', fontSize: 15, color: '#B0B8CB' }}>
                    You have successfully created {facilityData.createQuantity > 0 ? facilityData.createQuantity : 'a'} new {facilityData.createQuantity > 0 ? 'facilities' : 'facility'}
                </Typography>
                <ElBox center mb={2} sx={{ display: 'flex', flexDirection: 'row' }}>
                    <ElAvatar src={url} />
                    <Typography ml={1} sx={{ fontSize: 20, fontWeight: 700, color: '#1F345D' }}>{facilityData.name}</Typography>
                </ElBox>
                <CongratulationIndex title={"Sport"} content={facilityData.sportOption} />
                <CongratulationIndex title={"Start"} content={facilityData.workStartTime} />
                <CongratulationIndex title={"End"} content={facilityData.workEndTime} />
                <CongratulationIndex title={"Work Days"} content={facilityData.workDays?.join(", ")} />
                <CongratulationIndex title={"Details"} content={facilityData.detail} />
            </ElDialog>
        </form>
    );
};

export default CreateFacility;
