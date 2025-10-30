import React, { useState } from 'react';
import { ElDialog, ElButton, ElInput, ElInputCodeMask } from 'components';
import { useForm } from 'react-hook-form';
import { gameService } from 'services';
import { useGameRoute } from 'utils';

function GameStatRecorder ({ isOpen, gameId, gameSportType, onclose }) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { goScoreBoard } = useGameRoute();

    const handleSave = async (data) => {
        setLoading(true);
        const res = await gameService.joinStatTracker(gameId, { statTrackerCode: data.statTrackerCode });
        if (res && res.code === 200) {
            goScoreBoard(gameId, gameSportType);
        }
        setLoading(false);
    }

    const handleEnterCodeDialogClose = () => {
        if (onclose)
            onclose(false)
    }

    return (
        <>
            <ElDialog open={isOpen} onClose={handleEnterCodeDialogClose}
                title="Enter the Stat Tracker Code"
                subTitle="If the code is valid you will be taken to the stat tracking module" subgreen
                actions={
                    <ElButton loading={loading} onClick={handleSubmit(handleSave)}>Submit</ElButton>
                }>
                <form autoComplete="off" onSubmit={handleSubmit(handleSave)}>
                    <ElInput label="Enter the code here"
                        name="statTrackerCode"
                        InputProps={{
                            inputComponent: ElInputCodeMask,
                        }}
                        errors={errors}
                        {...register("statTrackerCode", {
                            required: 'This field is required.'
                        })}
                    />
                </form>
            </ElDialog>
        </>
    );
}

export default GameStatRecorder;
