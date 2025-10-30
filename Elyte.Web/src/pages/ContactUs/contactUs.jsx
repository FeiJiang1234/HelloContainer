import React from 'react';
import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ElButton, ElTitle, AccountContainer, ElContent, ElForm, ElInput } from 'components';
import { userService } from 'services';
import { useForm } from "react-hook-form";
import { validator } from 'utils';


const ContactUs = () => {
    const history = useHistory();
    const form = useForm();
    const { register, formState: { errors } } = form;

    const handleSubmitClick = async data => {
        const res = await userService.addContactUs(data);
        if (res && res.code === 200) {
            window.elyte.success("Submit successfully!");
            history.push('/login');
        }
    };

    return (
        <AccountContainer>
            <ElTitle>Contact Us</ElTitle>
            <ElForm form={form} onSubmit={handleSubmitClick}>
                <ElInput label="Contact Email" errors={errors}
                    {...register("email", {
                        required: 'This field is required.',
                        validate: { rule1: v => validator.isEmail(v) ? null : 'Your email is invalid, please check!' }
                    })}
                />
                <ElInput label="Subject" errors={errors} inputProps={{ maxLength: 100 }}
                    {...register("subject", { required: 'This field is required.' })}
                />
                <ElInput label="Message" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }}
                    {...register("message", { required: 'This field is required.' })}
                />
                <span className="fillRemain"></span>
                <Box mb={5} mt={2}>
                    <ElButton type="submit">Submit</ElButton>
                    <Box mt={2}>
                        <ElContent center>
                            Or you can text to us directly via email:
                            <br />
                            <a style={{ color: '#2283F4', textDecoration: 'none' }} href="mailto:contact@elyte.com">
                                contact@elyte.com
                            </a>
                        </ElContent>
                    </Box>
                </Box>
            </ElForm>
        </AccountContainer>
    );
};

export default ContactUs;
