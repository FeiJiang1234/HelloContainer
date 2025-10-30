import React, { useState } from 'react';
import { useFormik } from 'formik';
import { ElButton, ElDialog, ElErrorMessage, ElInput, ElLinkBtn } from 'el/components';
import { gameService } from 'el/api';
import { useAuth, useElToast } from 'el/utils';
import * as Yup from 'yup';

const validates = Yup.object().shape({
    officiateGameCode: Yup.string().required().max(100).label('OfficiateGameCode'),
});

const OfficiateChange = ({ game, afterChange }) => {
    const [code, setCode] = useState('');
    const initValue = {
        officiateGameCode: ''
    };
    const { isLowStats } = game;
    const [loading, setLoading] = useState(false);
    const toast = useElToast();
    const [changeCodeDialogStatus, setChangeCodeDialogStatus] = useState(false);
    const { user } = useAuth();
    const { handleSubmit, errors, touched, setFieldTouched, setFieldValue } = useFormik({
        initialValues: initValue,
        validationSchema: validates,
        onSubmit: values => handleSave(values),
    });

    const handleSave = async (data) => {
        setLoading(true);
        const res: any = await gameService.replaceGameOfficiate(game.id, user.id, data);
        if (res && res.code === 200) {
            toast.success('replace officiate successfully!');
            setChangeCodeDialogStatus(false);
            afterChange(game.id);
        }
        else {
            toast.error(res.Message);
        }
        setLoading(false);
    }

    const formatCode = (text) => {
        if(text.length === 4){
            text = text.replace(/(\d{3})(\d)/, '$1-$2');
        }

        if(text.length === 8){
            text = text.replace(/(\d{3})-(\d{3})(\d)/, '$1-$2-$3');
        }

        return text;
    }

    return (
        <>
           {!isLowStats && <ElLinkBtn my={1} style={{ textAlign: 'center' }} onPress={() => setChangeCodeDialogStatus(true)}>
                Officiate Change Code
            </ElLinkBtn>}
            {
                <ElDialog visible={changeCodeDialogStatus} onClose={() => setChangeCodeDialogStatus(false)}
                    title="Please input the officiate change code "
                    footer={
                        <ElButton onPress={handleSubmit} loading={loading}>Submit</ElButton>
                    }>
                    <>
                        <ElInput
                            name="officiateGameCode"
                            placeholder="Officiate Change Code"
                            onBlur={() => setFieldTouched('officiateGameCode')}
                            onChangeText={(text: string) => {
                                const newText = formatCode(text);
                                setCode(newText);
                                setFieldValue('officiateGameCode', newText);
                            }}
                            value={code}
                            maxLength={20}
                        />
                        <ElErrorMessage error={errors['officiateGameCode']} visible={touched['officiateGameCode']} />
                    </>
                </ElDialog>
            }
        </>
    );
};

export default OfficiateChange;
