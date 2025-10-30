import React from 'react';
import { Text } from 'native-base';
import ElErrorMessage from './ElErrorMessage';
import ElInput from './ElInput';

type PropType = {
    setFieldTouched: any;
    errors: any;
    touched: any;
    handleChange: any;
    defaultValues?: any;
};

const ElAgeRange: React.FC<PropType> = ({ setFieldTouched, errors, touched, handleChange, defaultValues }) => {
    return (
        <>
            <ElInput
                name="minAge"
                placeholder="Minimum Age"
                keyboardType="numeric"
                onBlur={() => setFieldTouched('minAge')}
                onChangeText={handleChange('minAge')}
                defaultValue={defaultValues?.minAge?.toString()}
                maxLength={2}
            />
            <ElErrorMessage error={errors['minAge']} visible={touched['minAge']} />
            <Text textAlign="center" my={1}>
                To
            </Text>
            <ElInput
                name="Maximum Age"
                placeholder="Max Age"
                keyboardType="numeric"
                onBlur={() => setFieldTouched('maxAge')}
                onChangeText={handleChange('maxAge')}
                defaultValue={defaultValues?.maxAge?.toString()}
                maxLength={2}
            />
            <ElErrorMessage error={errors['maxAge']} visible={touched['maxAge']} />
        </>
    );
};

export default ElAgeRange;
