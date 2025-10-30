import React, { useState } from 'react';
import { ElDialog, ElInput, ElButton } from 'components';
import { teamService } from 'services';
import { useForm } from 'react-hook-form';

export default function BlankAccountCreate ({ isCreatePlayer, teamId, organizationId, organizationType, onCancel, onSuccess }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const handleCreatePlayer = async (data) => {
        setLoading(true);
        const res = await handleCreatePlayerService(data);
        if (res && res.code === 200) {
            reset();
            onSuccess();
        }
        setLoading(false);
    }

    const handleCreatePlayerService = (data) => {
        if (organizationType == 'League')
            return teamService.addLeagueBlankAccount(teamId, organizationId, { ...data });

        if (organizationType == 'Tournament')
            return teamService.addTournamentBlankAccount(teamId, organizationId, { ...data });
    }

    return (
        <ElDialog open={isCreatePlayer} onClose={onCancel} 
            title="Create Player" 
            subTitle="Create a blank account for one of your team mates that doesnt have an ELYTE account"
            actions={
                <ElButton loading={loading} onClick={handleSubmit(handleCreatePlayer)}>Create Player</ElButton>
            }>
            <form autoComplete="off" onSubmit={handleSubmit(handleCreatePlayer)}>
                <ElInput label="Name" errors={errors} inputProps={{ maxLength: 50 }}
                    {...register("name", {
                        required: 'This field is required.'
                    })}
                />
            </form>
        </ElDialog>
    );
}