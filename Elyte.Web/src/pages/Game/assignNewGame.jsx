import React, { useState } from 'react';
import { ElButton, ElSelect } from 'components';
import { useForm } from "react-hook-form";
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelect } from 'utils';

const useStyles = makeStyles(() => ({
    buttonWrapper: {
        display: 'flex',
        gap: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        '& > *': {
            flex: 1,
        }
    }
}));

export default function AssignNewGame ({ rounds, teams, onCancel, onSave }) {
    const classes = useStyles();
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const { getTeamOptions, getGameRoundOptions } = useSelect();
    const [loading, setLoading] = useState(false);

    const handleSaveClick = async (data) => {
        setLoading(true);
        await onSave(data);
        setLoading(false);
    };

    const validateTeam = (value) => {
        const homeTeamId = getValues('homeTeamId');
        if (value === homeTeamId) {
            return 'Please choose different team for this game.';
        }
        return true;
    }

    return (
        <form onSubmit={handleSubmit(handleSaveClick)} autoComplete="off">
            <ElSelect label="Home Team" options={getTeamOptions(teams)} errors={errors}
                {...register("homeTeamId", { required: 'This field is required.' })}
            >
            </ElSelect>

            <ElSelect label="Away Team" options={getTeamOptions(teams)} errors={errors}
                {...register("awayTeamId", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateTeam(v) }
                })}
            >
            </ElSelect>

            <ElSelect label="Round" options={getGameRoundOptions(rounds)} errors={errors}
                {...register("round", { required: 'This field is required.' })}
            >
            </ElSelect>

            <Box className={classes.buttonWrapper}>
                <ElButton media onClick={() => onCancel()}>Cancel</ElButton>
                <ElButton media loading={loading} type="submit" className="green">Save</ElButton>
            </Box>
        </form>
    );
}