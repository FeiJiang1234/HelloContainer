import React, { useState } from 'react';
import { ElButton, ElSelect } from 'components';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import { teamService } from 'services';

const useStyles = makeStyles(() => ({
    button: {
        alignItems: 'center',
        margin: 'auto',
        textAlign: 'center',
    },
}));

const PlayerNumberForm = ({ data, onSubmitted }) => {
    const classes = useStyles();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [defaultFormData] = useState(data || {});
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [availablePlayerNumbers, setAvailablePlayerNumbers] = useState([]);

    useEffect(async () => {
        let res = await teamService.getAvailablePlayerNumbers(data.teamId);
        if (res && res.code === 200 && Array.isArray(res.value)) {
            var playNumbers = res.value.map(number => { return { label: number, value: number } });
            setAvailablePlayerNumbers(playNumbers);
        }
    }, [data.id])

    const handleUpdatePlayerNumber = async (formData) => {
        setLoadingStatus(false);
        const res = await teamService.updatePlayerNumber(data.teamId, data.id, formData);
        if (res && res.code === 200) {
            window.elyte.success("Submit successfully!");
            if (onSubmitted) {
                onSubmitted();
            }
        }
        setLoadingStatus(true);
    }

    return (
        <form onSubmit={handleSubmit(handleUpdatePlayerNumber)} autoComplete="off">
            <ElSelect label="Choose #" options={availablePlayerNumbers} errors={errors} defaultValue={defaultFormData?.playerNumber?.toString() || ''}
                {...register("playerNumber", {
                    required: { value: true, message: 'This field is required.' }
                })}
            />
            <Box pt={1} className={classes.button}>
                <ElButton type="submit" loading={loadingStatus}>
                    Confirm
                </ElButton>
            </Box>
        </form>
    );
}

export default PlayerNumberForm;