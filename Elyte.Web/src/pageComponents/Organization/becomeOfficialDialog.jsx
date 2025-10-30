import React, { useState } from 'react';
import { ElButton, ElInput, ElDialog, ElSelect, ElAutocomplete } from 'components';
import { useForm } from "react-hook-form";
import { validator, useOfficialIds } from 'utils';
import { authService } from 'services';

export default function BecomeOfficialDialog ({ open, onClose, onBecomeClick, paymentAccounts }) {
    const user = authService.getCurrentUser();
    const { officialIds } = useOfficialIds(user.id);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const handleBecomeSubmit = async data => {
        setLoading(true);
        await onBecomeClick(data);
        setLoading(false);
    }

    return (
        <ElDialog open={open} onClose={onClose} title="Become Official"
            actions={
                <>
                    <ElButton onClick={onClose}>Cancel</ElButton>
                    <ElButton onClick={handleSubmit(handleBecomeSubmit)} loading={loading}>Become</ElButton>
                </>
            }>
            <form autoComplete="off" onSubmit={handleSubmit(handleBecomeSubmit)}>
                <ElAutocomplete label="Official Id" name="officialId" freeSolo errors={errors} options={officialIds} register={register} rules={{ required: 'Please enter your official id.' }} />
                <ElInput label="Price to Register ($)" multiline errors={errors} inputProps={{ maxLength: 8 }}
                    {...register("registerPrice", {
                        required: 'This field is required.',
                        validate: { rule1: v => validator.isNonzeroDecimal(v, 2) || 'Please enter correct price!' }
                    })}
                />
                {
                    !Array.isNullOrEmpty(paymentAccounts) &&
                    <ElSelect label="Choose a Payment Account" options={[{ value: '', label: 'None' }, ...paymentAccounts]}
                        {...register("paymentAccount")}
                    />
                }
            </form>
        </ElDialog>
    );
}
