import React from 'react';
import { ElButton, ElInput, ElTitle, ElForm, ElAgeInput, ElSelect } from 'components';
import { useForm } from "react-hook-form";
import { teamService } from 'services';
import { useHistory, useLocation } from 'react-router-dom';
import { RegionCascader } from 'pageComponents';
import { GenderTypes } from 'models';

export default function EditTeamProfile () {
    const form = useForm();
    const { register, formState: { errors } } = form;
    const history = useHistory();
    const location = useLocation();
    const teamInfo = location?.state?.params;

    const handleSaveClick = async (data) => {
        const res = await teamService.updateProfile(teamInfo.id, data);
        if (res && res.code === 200) {
            history.push('/teamProfile', { params: teamInfo.id });
        }
    };

    return (
        <ElForm form={form} onSubmit={handleSaveClick}>
            <ElTitle center>Edit Team Profile</ElTitle>
            <ElInput label="Name your Team" errors={errors} inputProps={{ maxLength: 20 }}
                {...register("name", { required: { value: true, message: 'This field is required.' } })}
                defaultValue={teamInfo.name}
            />
            <ElInput label="Add Teams Bio" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }}
                {...register("bio", { required: { value: true, message: 'This field is required.' } })}
                defaultValue={teamInfo.bio}
            />
            <ElSelect label="Gender" options={GenderTypes} errors={errors} defaultValue={teamInfo.gender}
                {...register("gender", { required: 'This field is required.' })}
            />
            <ElAgeInput errors={errors} defaultMaxAge={teamInfo.maxAge} defaultMinAge={teamInfo.minAge} />
            <RegionCascader register={register} errors={errors} defaultCountry={teamInfo.countryCode} defaultState={teamInfo.stateCode} defaultCity={teamInfo.cityCode} />
            <ElButton mt={6} type="submit">Save</ElButton>
        </ElForm>
    );
}
