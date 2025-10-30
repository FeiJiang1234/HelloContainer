import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { ElButton, ElInput, ElTitle, ElSelect, ElImageSelecter, ElAgeInput, ElForm } from 'components';
import { teamService } from 'services';
import { useHistory } from 'react-router-dom';
import { SportTypes } from 'models';
import { useForm } from "react-hook-form";
import { utils } from 'utils';
import { RegionCascader } from 'pageComponents';
import { GenderTypes } from './../../models/genderTypes';



const CreateTeam = () => {
    const history = useHistory();
    const form = useForm();
    const { register, formState: { errors } } = form;
    const [image, setImage] = useState();
    const [errorMessage, setErrorMessage] = useState();

    const handleCreateTeamClick = async (data) => {
        if (!image) {
            return setErrorMessage("Please select profile iamge!");
        }
        const formData = utils.formToFormData(data);
        formData.append('File', image);
        const res = await teamService.createTeam(formData);
        if (res && res.code === 200 && res.value) {
            data['id'] = res.value;
            history.push('/congratulations', { params: { ...data, image: [image] } });
        }
    }

    return (
        <ElForm form={form} onSubmit={handleCreateTeamClick}>
            <ElTitle center>Create Team</ElTitle>
            <Typography className='category-text'>Main information</Typography>
            <ElImageSelecter name="image" label="Choose profile image" errorMessage={errorMessage} onImageSelected={(i) => setImage(i)} />
            <ElInput label="Name your Team" errors={errors} inputProps={{ maxLength: 50 }}
                {...register("name", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElInput label="Add Teams Bio" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }}
                {...register("bio", { required: { value: true, message: 'This field is required.' } })}
            />
            <Typography className='category-text'>Details</Typography>
            <ElSelect label="Choose a sport" options={SportTypes} errors={errors}
                {...register("sportType", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElSelect label="Gender" options={GenderTypes} errors={errors}
                    {...register("gender", { required: 'This field is required.' })}
                />
            <ElAgeInput errors={errors} />
            <RegionCascader register={register} errors={errors} />
            <ElInput label="Zip Code" errors={errors} inputProps={{ maxLength: 11 }}
                {...register("zipcode", {})}
            />
            <ElButton mt={6} type="submit" >Create Team</ElButton>
        </ElForm>
    );
};

export default CreateTeam;
