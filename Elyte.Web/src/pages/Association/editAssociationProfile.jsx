import React from 'react';
import { ElInput, ElTitle, ElButton } from 'components';
import { useForm } from "react-hook-form";
import { Typography } from '@mui/material';
import { useFormValidate, validator } from 'utils';
import { associationService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import { RegionCascader } from 'pageComponents';

export default function EditAssociationProfile () {
    const history = useHistory();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const location = useLocation();
    const association = location?.state?.params;
    const { validateDigital, validateEmail } = useFormValidate();

    const handleSaveClick = async (data) => {
        data["associationId"] = association.id;
        const res = await associationService.updateAssociationProfile(association.id, data);
        if (res && res.code === 200) {
            history.push('/associationProfile', { params: association.id });
        }
    };

    return (
        <form onSubmit={handleSubmit(handleSaveClick)} autoComplete="off">
            <ElTitle center>Edit Association Profile</ElTitle>

            <Typography className="category-text">Main information</Typography>
            <ElInput label="Association Name" errors={errors} inputProps={{ maxLength: 50 }} defaultValue={association.name}
                {...register("name", { required: 'This field is required.' })}
            />

            <ElInput label="Details" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} defaultValue={association.details}
                {...register("details", { required: 'This field is required.' })}
            />
            <RegionCascader register={register} errors={errors} defaultCountry={association.countryCode} defaultState={association.stateCode} defaultCity={association.cityCode} />
            {
                association.isOfficial &&
                <>
                    <Typography className="category-text">Payment Details</Typography>
                    <ElInput label="Price to Register ($)" errors={errors} inputProps={{ maxLength: 10 }} defaultValue={association.registerPrice}
                        {...register("registerPrice", {
                            required: 'This field is required.',
                            validate: {
                                rule1: v => validator.isNonzeroDecimal(v, 2) || 'Please enter correct price!'
                            }
                        })}
                    />
                    <ElInput label="Payment Account" errors={errors} inputProps={{ maxLength: 100 }} defaultValue={association.paymentAccount}
                        {...register("paymentAccount", { required: 'This field is required.' })}
                    />
                </>
            }

            <Typography className="category-text">Contact Details</Typography>
            <ElInput label="Association Contact Number" errors={errors} inputProps={{ maxLength: 15 }} defaultValue={association.phoneNumber}
                {...register("contactNumber", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateDigital(v) }
                })}
            />

            <ElInput label="Association Contact Email" errors={errors} defaultValue={association.email}
                {...register("contactEmail", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateEmail(v) }
                })}
            />

            <ElButton mt={6} type="submit" >Save</ElButton>
        </form>
    );
}
