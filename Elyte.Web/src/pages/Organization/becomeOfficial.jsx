import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ElInput, ElTitle, ElButton } from 'components';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useFormValidate } from 'utils';
import { organizationService, authService } from 'services';
import { organizationTypes } from '../../models';

export default function BecomeOfficial () {
    const history = useHistory();
    const location = useLocation();
    const routerParams = location.state?.params;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const currentUser = authService.getCurrentUser();
    const [btnLoadingStatus, setBtnLoadingStatus] = useState(false);
    const { validateEmail, validateDigital } = useFormValidate();

    const handleSubmitClick = async (formData) => {
        setBtnLoadingStatus(true);
        const res = await organizationService.createOfficialRequest(currentUser.id, formData);
        setBtnLoadingStatus(false);
        if (res && res.code === 200) {
            if (!routerParams?.isCreate) {
                return history.goBack();
            }

            const organizationType = organizationTypes.find(x => x.value === routerParams.organizationType);
            if (!organizationType || !organizationType.router) {
                return history.push('/');
            }

            history.push(organizationType.router, { params: routerParams });
        }
    }

    return (
        <form onSubmit={handleSubmit(handleSubmitClick)} autoComplete="off">
            <ElTitle center>Become Official</ElTitle>
            <Box className="category-text">
                {"We are excited for you to join the many different official organizations that participate in the \"company name\" network. Before we do that, we need to gather some basic info, have you agree to some terms, and we will have someone reach out to you to help get it all set up. Becoming Official means that you will now be able to accept payments, you will be contractually obligated to uphold stat tracking rules, and you will be able to offer your players more incentive to participate in your organization."}
            </Box>
            <ElInput name="name" label="Your Name" inputProps={{ maxLength: 50 }} errors={errors}
                {...register("name", { required: { value: true, message: 'This field is required.' } })}
            />

            <ElInput name="email" label="Email" inputProps={{ maxLength: 200 }} errors={errors}
                {...register("email", {
                    required: { value: true, message: 'This field is required.' },
                    validate: { rule1: v => validateEmail(v) }
                })}
            />

            <ElInput name="phoneNumber" label="Phone Number" inputProps={{ maxLength: 11 }} errors={errors}
                {...register("phoneNumber", {
                    required: { value: true, message: 'This field is required.' },
                    validate: { rule1: v => validateDigital(v) }
                })}
            />

            <ElInput name="organizationName" label="Organization Name" inputProps={{ maxLength: 50 }} errors={errors} defaultValue={routerParams.organizationName}
                {...register("organizationName", {
                    required: { value: true, message: 'This field is required.' }
                })}
            />

            <ElInput name="organizationOwner" label="Organization Owner" disabled defaultValue={`${currentUser.firstName} ${currentUser.lastName}`} />

            <Box pt={3} sx={{ alignItems: 'center', margin: 'auto', textAlign: 'center' }}>
                <ElButton type="submit" loading={btnLoadingStatus}>Submit the Detail</ElButton>
            </Box>

            <Box className="category-text">
                We will reach out to you as soon as possible to help walk you through the rest of the process. Some items to have prepared would be, banking details to set up the payments processing piece of the application, and your certificates establishing you as an official entity.
            </Box>
        </form>
    );
}
