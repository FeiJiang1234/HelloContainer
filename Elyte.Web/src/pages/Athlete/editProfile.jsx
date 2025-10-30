import React from 'react';
import { Typography } from '@mui/material';
import { ElButton, ElInput, ElTitle, ElDateTimePicker, ElBox } from 'components';
import { useForm } from "react-hook-form";
import { athleteService } from 'services';
import { useHistory, useLocation } from 'react-router-dom';
import { RegionCascader } from 'pageComponents';

export default function EditAthleteProfile () {
    const history = useHistory();
    const { register, handleSubmit, control, trigger, formState: { errors } } = useForm();
    const location = useLocation();
    const athlete = location?.state?.params;
    const LIMITED_AGE = 13 * 365 * 24 * 60 * 60 * 1000;

    const handlerSaveClick = async (data) => {
        data['athleteId'] = athlete.id;
        const res = await athleteService.updateProfile(athlete.id, data);
        if (res && res.code === 200) {
            history.push('/myProfile');
        }
    };

    return (
        <form onSubmit={handleSubmit(handlerSaveClick)} autoComplete="off">
            <ElTitle center>Edit Athlete Profile</ElTitle>
            <ElInput label="First Name" errors={errors} inputProps={{ maxLength: 20 }}
                {...register("firstName", { required: { value: true, message: 'This field is required.' } })}
                defaultValue={athlete.firstName}
            />
            <ElInput label="Last Name" errors={errors} inputProps={{ maxLength: 20 }}
                {...register("lastName", { required: { value: true, message: 'This field is required.' } })}
                defaultValue={athlete.lastName}
            />
            <ElBox mt={1} centerCross>
                <Typography>Phone Number:</Typography>
                <ElButton small fullWidth={false} sx={{ marginLeft: 2 }} onClick={() => history.push('/changePhoneNumber')}>Update</ElButton>
            </ElBox>
            <ElDateTimePicker control={control} name="birthday" label="Birthday" rules={
                {
                    required: { value: true, message: 'This field is required.' },
                    validate: {
                        rule1: v => new Date().getTime() - new Date(v).getTime() >= LIMITED_AGE || 'Birthdate does not meet the requirements'
                    },
                    onBlur: () => trigger('birthday')
                }}
                errors={errors} type="date" defaultValue={athlete.birthday} />
            <RegionCascader register={register} errors={errors} defaultCountry={athlete.countryCode} defaultState={athlete.stateCode} defaultCity={athlete.cityCode} />
            <ElInput label="Bio" errors={errors} rows={4} multiline inputProps={{ maxLength: 200 }}
                {...register("bio", { required: { value: true, message: 'This field is required.' } })}
                defaultValue={athlete.bio}
            />
            <ElButton mt={2} type="submit">Save</ElButton>
        </form>
    );
}
