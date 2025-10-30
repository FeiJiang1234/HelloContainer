import React, { useState } from 'react';
import { Box, FormHelperText } from '@mui/material';
import { ElButton, AccountContainer, ElTitle, ElLink, ElInput, ElSelect, ElCheckbox, ElBody, ElDateTimePicker, ElInputCodeMask } from 'components';
import { userService } from 'services';
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useFormValidate, validator, aes } from 'utils';
import { RegionCascader } from 'pageComponents';
import { SportType } from 'enums';

const sexes = [
    { value: 'male', label: 'male' },
    { value: 'female', label: 'female' },
];
const sportTypes = Object.keys(SportType).map(typeName => { return { label: typeName, value: SportType[typeName] } });

const LIMITED_AGE = 13 * 365 * 24 * 60 * 60 * 1000;

const Register = () => {
    const history = useHistory();
    const { register, handleSubmit, getValues, control, trigger, formState: { errors }, setValue } = useForm();
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [registerError, setRegisterError] = useState("");
    const [btnLoadingStatus, setBtnLoadingStatus] = useState(false);
    const [showBlankCode, setShowBlankCode] = useState(false);
    const { validateEmail } = useFormValidate();

    const handlerRegisterClick = async (data) => {
        setRegisterError("");
        setBtnLoadingStatus(true);
        data.password = aes.encrypt(data.password);
        data.confirmationPassword = aes.encrypt(data.confirmationPassword);
        const res = await userService.register(data);
        setBtnLoadingStatus(false);
        if (res && res.code === 200) {
            return history.push('/welcome');
        }
        if (res && res.Code === 400) {
            return setRegisterError(res.Message);
        }
        setRegisterError("Oh Sorry! We seem to be having some issues. Please try again.");
    }

    const handleBlankCode = () => {
        setShowBlankCode(!showBlankCode);
        setValue('blankAccountCode', '');
    }

    return (
        <AccountContainer>
            <ElTitle>Account Registration</ElTitle>
            <form onSubmit={handleSubmit(handlerRegisterClick)} autoComplete="off">
                <ElInput label="First Name" errors={errors} inputProps={{ maxLength: 20 }}
                    {...register("firstName", { required: { value: true, message: 'This field is required.' } })}
                />
                <ElInput label="Last Name" errors={errors} inputProps={{ maxLength: 20 }}
                    {...register("lastName", { required: { value: true, message: 'This field is required.' } })}
                />
                <ElInput label="Email Address" errors={errors} inputProps={{ maxLength: 200 }}
                    {...register("email", {
                        required: { message: 'This field is required.' },
                        validate: { rule1: v => validateEmail(v) },
                        onBlur: () => trigger('email')
                    })}
                />
                <ElInput label="Phone Number" errors={errors} inputProps={{ maxLength: 11 }}
                    {...register("phoneNumber", { required: { value: true, message: 'This field is required.' } })}
                />
                <ElSelect label="Choose your gender" options={sexes} errors={errors}
                    {...register("gender", { required: { value: true, message: 'Please choose your gender.' } })}
                />
                <ElSelect label="Preferred Sport" options={sportTypes} errors={errors}
                    {...register("sportType", { required: { value: true, message: 'Please choose your sport.' } })}
                />
                <ElDateTimePicker control={control} name="birthday" label="Birthday" errors={errors} type="date" rules={{
                    required: { value: true, message: 'This field is required.' },
                    validate: { rule1: v => new Date().getTime() - new Date(v).getTime() >= LIMITED_AGE || 'Birthdate does not meet the requirements' },
                    onBlur: () => trigger('birthday')
                }} />
                <RegionCascader register={register} errors={errors} />
                <ElInput label="Password" type="password" errors={errors}
                    {...register("password", {
                        required: { message: 'Please enter your password.' },
                        validate: { rule1: v => validator.isStrongPassword(v) || 'Password length betweent 8 and 18, include alphanumeric and start with letter!' },
                        onBlur: () => trigger('password')
                    })}
                />
                <ElInput label="Confirm Password" type="password" errors={errors}
                    {...register("confirmationPassword", {
                        required: { value: true, message: 'Please enter your password again.' },
                        validate: { rule1: v => v === getValues("password") || 'The two passwords you entered did not match!' },
                        onBlur: () => trigger('confirmationPassword')
                    })}
                />
                <ElCheckbox onChange={() => setAgreeTerms(!agreeTerms)}
                    label={
                        <ElBody>By creating an account you agree to <br />our <ElLink green to="/termsOfRegister">Terms of Service</ElLink> and{' '}
                            <ElLink green to="/termsOfPrivacyPolicy">Privacy Policy</ElLink>
                        </ElBody>
                    }
                />
                {
                    registerError &&
                    <Box pl={2} mb={1}>
                        <FormHelperText error>{registerError}</FormHelperText>
                    </Box>
                }
                <ElButton type="submit" mt={5} loading={btnLoadingStatus} disabled={!agreeTerms}>Create an account</ElButton>
                <ElCheckbox onChange={() => handleBlankCode()} label={<ElBody>Have a blank account code?</ElBody>} />
                {
                    showBlankCode &&
                    <ElInput label="Blank Account Code" errors={errors} InputProps={{ inputComponent: ElInputCodeMask }}   {...register("blankAccountCode")} />
                }
            </form>
        </AccountContainer >
    );
};

export default Register;
