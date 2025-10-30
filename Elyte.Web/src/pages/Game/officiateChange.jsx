import React, { useState } from 'react';
import { ElButton, ElInput, ElDialog, ElLinkBtn, ElInputCodeMask } from 'components';
import { gameService, authService } from 'services';
import { useForm } from "react-hook-form";

const OfficiateChange = ({ game, afterChange }) => {
    const [loading, setLoading] = useState(false);
    const [changeCodeDialogStatus, setChangeCodeDialogStatus] = useState(false);
    const currentUser = authService.getCurrentUser();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { isLowStats } = game;


    const handleSave = async (data) => {
        setLoading(true);
        const res = await gameService.replaceGameOfficiate(game.id, currentUser.id, data);
        if (res && res.code === 200) {
            setChangeCodeDialogStatus(false);
            afterChange(game.id);
        }
        setLoading(false);
    }

    return (
        <>
            {
                !isLowStats && <ElLinkBtn large sx={{ textAlign: 'center' }} onClick={() => setChangeCodeDialogStatus(true)}>
                    Officiate Change Code
                </ElLinkBtn>
            }
            {
                changeCodeDialogStatus &&
                <ElDialog open={changeCodeDialogStatus} onClose={() => setChangeCodeDialogStatus(false)}
                    title="Please input the officiate change code "
                    actions={
                        <ElButton onClick={handleSubmit(handleSave)} loading={loading}>Submit</ElButton>
                    }>
                    <form autoComplete="off" onSubmit={handleSubmit(handleSave)}>
                        <ElInput label="Officiate Change Code"
                            InputProps={{
                                inputComponent: ElInputCodeMask,
                            }}
                            errors={errors}
                            {...register("officiateGameCode", {
                                required: { value: true, message: 'This field is required.' }
                            })}
                        />
                    </form>
                </ElDialog>
            }
        </>
    );
};

export default OfficiateChange;
