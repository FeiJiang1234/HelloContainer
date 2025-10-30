import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ElButton, ElErrorMessage, ElSelectEx } from 'el/components';
import { useSelect } from 'el/utils';
import { Box, Divider, Row } from 'native-base';

const validationSchema = Yup.object().shape({
    homeTeamId: Yup.string().required().label('Home Team'),
    awayTeamId: Yup.string().required().label('Away Team'),
    round: Yup.string().required().label('Round'),
});

export default function AssignNewGame({ rounds, teams, onCancel, onSave }) {
    const [loading, setLoading] = useState(false);
    const { getTeamOptions, getGameRoundOptions } = useSelect();
    const initValue = {
        homeTeamId: '',
        awayTeamId: '',
        round: '',
    };

    const handleSaveClick = async data => {
        setLoading(true);
        await onSave(data);
        setLoading(false);
    };

    return (
        <Formik
            initialValues={initValue}
            validationSchema={validationSchema}
            onSubmit={values => handleSaveClick(values)}>
            {({ handleSubmit, errors, setFieldValue, values,isSubmitting }) => (
                <>
                    <ElSelectEx
                        items={getTeamOptions(teams.filter(x => x.id !== values.awayTeamId))}
                        name="homeTeamId"
                        onValueChange={value => setFieldValue('homeTeamId', value)}
                        placeholder="Home Team"
                    />
                    <ElErrorMessage error={errors['homeTeamId']} visible={true} />

                    <ElSelectEx
                        items={getTeamOptions(teams.filter(x => x.id !== values.homeTeamId))}
                        name="awayTeamId"
                        onValueChange={value => setFieldValue('awayTeamId', value)}
                        placeholder="Away Team"
                    />
                    <ElErrorMessage error={errors['awayTeamId']} visible={true} />

                    <ElSelectEx
                        items={getGameRoundOptions(rounds)}
                        name="round"
                        onValueChange={value => setFieldValue('round', value)}
                        placeholder="Round"
                    />
                    <ElErrorMessage error={errors['round']} visible={true} />
                    <Divider mb={2} />
                    <Row>
                        <Box flex={1} mr={1}>
                            <ElButton onPress={onCancel}>Cancel</ElButton>
                        </Box>
                        <Box flex={1} mr={1}>
                            <ElButton variant="secondary" onPress={handleSubmit} loading={loading} disabled={isSubmitting}>
                                Save
                            </ElButton>
                        </Box>
                    </Row>
                </>
            )}
        </Formik>
    );
}
