import React, { useState } from 'react';
import ElDialog from './ElDialog';
import { Formik } from 'formik';
import H3 from './Typography/H3';
import * as Yup from 'yup';
import ElTextarea from './ElTextarea';
import ElErrorMessage from './ElErrorMessage';
import ElButton from './ElButton';

const validationSchema = Yup.object().shape({
    complainedText: Yup.string().required().max(500).label('Description'),
});

export default function ElReportDialog({ isVisible, onSave, onCancel }) {
    const [loading, setLoading] = useState<boolean>(false);

    const handleReport = async values => {
        setLoading(true);
        await onSave(values);
        setLoading(false);
    };

    return (
        <ElDialog
            onClose={onCancel}
            visible={isVisible}
            header={<H3 style={{ textAlign: 'center' }}>Report</H3>}>
            <Formik
                initialValues={{ complainedText: '' }}
                validationSchema={validationSchema}
                onSubmit={values => handleReport(values)}>
                {({ handleChange, handleSubmit, errors, touched, isSubmitting }) => (
                    <>
                        <ElTextarea
                            name="complainedText"
                            onChangeText={handleChange('complainedText')}
                            placeholder="Description"
                        />
                        <ElErrorMessage
                            error={errors['complainedText']}
                            visible={touched['complainedText']}
                        />
                        <ElButton onPress={handleSubmit} loading={loading} disabled={isSubmitting}>
                            Save
                        </ElButton>
                    </>
                )}
            </Formik>
        </ElDialog>
    );
}
