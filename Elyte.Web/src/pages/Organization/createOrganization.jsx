import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ElInput, ElSelect, ElTitle, ElImageSelecter, ElButton, ElBody, ElCheckbox, ElAutocomplete } from 'components';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { organizationTypes } from '../../models';
import { authService } from 'services';
import { useManagedAssociations } from 'utils';

export default function CreateOrganization () {
    const history = useHistory();
    const user = authService.getCurrentUser();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isBecomeOfficial, setIsBecomeOfficial] = useState(false);
    const [isHideBecomeOfficial, setIsHideBecomeOfficial] = useState(false);
    const [isHideAssociationId, setIsHideAssociationId] = useState(true);
    const [image, setImage] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [currentOrgType, setCurrentOrgType] = useState('');
    const { associations } = useManagedAssociations(user.id);

    useEffect(() => {
        if (!currentOrgType || currentOrgType === "association") {
            setIsHideBecomeOfficial(false);
            return setIsHideAssociationId(true);
        }

        if (currentOrgType === "facility") {
            setIsHideAssociationId(false);
            return setIsHideBecomeOfficial(true);
        }

        setIsHideBecomeOfficial(false);
        setIsHideAssociationId(false);
    }, [currentOrgType]);

    const handleCreateClick = (formData) => {
        if (!image) return setErrorMessage("Please select profile image!");

        if (isBecomeOfficial) {
            return history.push('/becomeOfficial', { params: { isCreate: true, image: image, ...formData } });
        }

        const organizationType = organizationTypes.find(x => x.value === formData.organizationType);
        if (organizationType && organizationType.router) {
            history.push(organizationType.router, { params: { image: image, ...formData } });
        }
    }

    return (
        <form onSubmit={handleSubmit(handleCreateClick)} autoComplete="off">
            <ElTitle center>Create Organization</ElTitle>
            <Typography className="category-text">Main Information</Typography>
            <ElImageSelecter label="Choose profile image" errorMessage={errorMessage} onImageSelected={(i) => { setImage(i) }} defaultValue={image} />
            <ElInput label="Name Your Organization" inputProps={{ maxLength: 50 }} errors={errors}
                {...register("organizationName", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElInput label="Organization Bio" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }}
                {...register("organizationBio", { required: { value: true, message: 'This field is required.' } })}
            />
            <ElSelect label="Organization type" options={organizationTypes} errors={errors} value={currentOrgType}
                {...register("organizationType", { required: { message: 'This field is required.' } })}
                onChange={(e) => setCurrentOrgType(e.target.value)}
            />
            {
                !isHideAssociationId &&
                <ElAutocomplete label="Association Id (Optional)" name="associationId" freeSolo errors={errors} options={associations} 
                register={register} renderOption={(props, option) => (<Box component="li" {...props}>{option.label} ({option.name})</Box>)}/>
            }
            {
                !isHideBecomeOfficial &&
                <ElCheckbox onChange={() => setIsBecomeOfficial(!isBecomeOfficial)}
                    label={
                        <>
                            <Typography className="checkbox-label">Become Official</Typography>
                            <ElBody>When you become official you will have the ability to take payments and stats tracked would be considered {'"'}official{'"'}.</ElBody>
                        </>
                    }
                />
            }

            <Box pt={3} sx={{ alignItems: 'center', margin: 'auto', textAlign: 'center' }}>
                <ElButton type="submit">Create Organization</ElButton>
            </Box>
        </form>
    );
}
