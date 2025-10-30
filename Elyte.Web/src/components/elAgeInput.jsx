import React from 'react';
import { Typography, Grid } from '@mui/material';
import { ElInput } from 'components';
import { validator } from 'utils';
import { useFormContext } from "react-hook-form";

export default function ElAgeInput ({ errors, defaultMinAge, defaultMaxAge }) {
    const { getValues, register } = useFormContext();
    return (
        <Grid container>
            <Grid item xs={5}>
                <ElInput label="Minimum Age" errors={errors} inputProps={{ maxLength: 2 }} defaultValue={defaultMinAge}
                    {...register("minAge", {
                        required: { value: true, message: 'This field is required.' },
                        validate: {
                            rule1: v => validator.isPositiveInteger(v) || 'The minimum age is invalid',
                            rule2: v => v > 0 || 'The minimum age must greater than 0',
                        }
                    })}
                />
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography>To</Typography>
            </Grid>
            <Grid item xs={5}>
                <ElInput label="Maximum Age" errors={errors} inputProps={{ maxLength: 2 }} defaultValue={defaultMaxAge}
                    {...register("maxAge", {
                        required: { value: true, message: 'This field is required.' },
                        validate: {
                            rule1: v => validator.isPositiveInteger(v) || 'The maximum age is invalid',
                            rule2: v => v > 0 || 'The maximum age must greater than 0',
                            rule3: v => getValues('minAge') < v || 'The maximum age less than minimum age'
                        }
                    })}
                />
            </Grid>
        </Grid>
    )
}
