import React, { useState } from 'react';
import { ElButton, ElInput, ElSelect, ElTitle, ElAutocomplete } from 'components';
import { useFormValidate, useManagedAssociations } from 'utils';
import { facilityService, authService } from 'services';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { SportTypes, timeZones } from '../../models';
import { useForm } from "react-hook-form";
import { RegionCascader } from 'pageComponents';



const EditFacility = () => {
    const history = useHistory();
    const location = useLocation();
    const { validateEmail } = useFormValidate();
    const user = authService.getCurrentUser();
    const facility = location?.state?.params;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [btnLoadingStatus, setBtnLoadingStatus] = useState(false);
    const { associations } = useManagedAssociations(user.id);

    const handleSaveClick = async (data) => {
        setBtnLoadingStatus(true);
        data["facilityId"] = facility.id;
        const res = await facilityService.updateFacility(facility.id, data);
        if (res && res.code === 200) {
            history.push('/facilityProfile', { params: facility.id });
        }
        setBtnLoadingStatus(false);
    }
    return (
        <form onSubmit={handleSubmit(handleSaveClick)} autoComplete="off">
            <ElTitle center>Edit Facility A</ElTitle>
            <Typography className="category-text">Main Information</Typography>
            <ElInput label="Name" errors={errors} defaultValue={facility?.name} inputProps={{ maxLength: 50 }}
                {...register("name", { required: { value: true, message: 'This field is required.' } })}
            />

            <Typography className="category-text">Sport Facility Type</Typography>
            <ElSelect label="Choose a sport type" errors={errors} options={SportTypes} defaultValue={facility?.sportOption}
                {...register("sportOption", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElAutocomplete label="Association Id (Optional)" name="associationId" freeSolo errors={errors} options={associations} 
            register={register} defaultValue={facility.associationId} renderOption={(props, option) => (<Box component="li" {...props}>{option.label} ({option.name})</Box>)}/>

            <Typography className="category-text">Time/Date Details</Typography>
            <ElSelect label="Choose a Time zone" errors={errors} options={timeZones} defaultValue={facility?.timeZone}
                {...register("timezone", { required: { value: true, message: 'This field is required.' } })}
            />

            <ElInput label="Detail" rows={6} multiline errors={errors} defaultValue={facility?.detail} inputProps={{ maxLength: 250 }}
                {...register("detail", { required: { value: true, message: 'This field is required.' } })}
            />

            <Typography className="category-text">Address</Typography>
            <ElInput label="Street" errors={errors} defaultValue={facility?.street} inputProps={{ maxLength: 150 }}
                {...register("street", { required: { value: true, message: 'This field is required.' } })}
            />

            <RegionCascader register={register} errors={errors} defaultCountry={facility?.countryCode} defaultState={facility?.stateCode} defaultCity={facility?.cityCode} />

            <Typography className="category-text">Contact Details</Typography>
            <ElInput label="Contact Number" errors={errors} defaultValue={facility?.contactNumber} inputProps={{ maxLength: 11 }}
                {...register("contactNumber", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElInput label="Contact Email" errors={errors} defaultValue={facility?.contactEmail}
                {...register("contactEmail", {
                    required: { value: true, message: 'This field is required.' },
                    validate: { rule1: v => validateEmail(v) }
                })}
            />
            <ElButton mt={6} type="submit" loading={btnLoadingStatus}>Save</ElButton>
        </form>
    );
};

export default EditFacility;
