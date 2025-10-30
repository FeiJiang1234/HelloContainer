import React, { useState } from 'react';
import { Box, FormHelperText } from '@mui/material';
import { ElButton, ElInput, ElTitle } from 'components';
import { userService } from 'services';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { validator, aes } from 'utils';


export default function ChangePassword () {
    const history = useHistory();
    const { register, handleSubmit, getValues, trigger, formState: { errors } } = useForm();
    const [changePasswordError, setchangePasswordError] = useState("");
    const [loadingStatus, setLoadingStatus] = useState(false);

    const handlerChangePassword = async (data) => {
        setLoadingStatus(true);
        data.oldPassword = aes.encrypt(data.oldPassword).toString();
        data.newPassword = aes.encrypt(data.newPassword).toString();
        data.confirmationNewPassword = aes.encrypt(data.confirmationNewPassword).toString();
        const res = await userService.updatePassword(data);
        setLoadingStatus(false);

        if (res && res.code === 200) {
            return history.goBack();
        }

        if (res && res.Code === 400) {
            return setchangePasswordError(res.Message);
        }

        setchangePasswordError("Change password unsuccessfully, please try again later.");
    }

    return (
        <form onSubmit={handleSubmit(handlerChangePassword)} autoComplete="off">
            <ElTitle center>Change Your Password</ElTitle>
            <ElInput label="Old Password" type="password" errors={errors}
                {...register("oldPassword", {
                    required: { message: 'Please enter your password.' },
                    validate: { rule1: v => validator.isStrongPassword(v) || 'Password length betweent 8 and 18, include alphanumeric and start with letter!' },
                    onBlur: () => trigger('oldPassword')
                })}
            />
            <ElInput label="New Password" type="password" errors={errors}
                {...register("newPassword", {
                    required: { message: 'Please enter your password.' },
                    validate: { rule1: v => validator.isStrongPassword(v) || 'Password length betweent 8 and 18, include alphanumeric and start with letter!' },
                    onBlur: () => trigger('newPassword')
                })}
            />
            <ElInput label="Confirm New Password" type="password" errors={errors}
                {...register("confirmationNewPassword", {
                    required: { message: 'Please enter your password again.' },
                    validate: { rule1: v => v === getValues("newPassword") || 'The two passwords you entered did not match!' },
                    onBlur: () => trigger('confirmationNewPassword')
                })}
            />

            {
                changePasswordError &&
                <Box pl={2}>
                    <FormHelperText error>{changePasswordError}</FormHelperText>
                </Box>
            }

            <Box pt={2} sx={{ alignItems: 'center', margin: 'auto', textAlign: 'center' }}>
                <ElButton type="submit" loading={loadingStatus}>Save</ElButton>
            </Box>
        </form>
    );
}
