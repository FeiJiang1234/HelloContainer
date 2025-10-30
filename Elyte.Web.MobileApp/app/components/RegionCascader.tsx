import dictionaryService from 'el/api/dictionaryService';
import React, { useEffect, useState } from 'react';
import ElErrorMessage from './ElErrorMessage';
import ElSelectEx from './ElSelectEx';

type PropType = {
    setFieldValue: any;
    errors: any;
    touched: any;
    values: any;
};

const RegionCascader: React.FC<PropType> = ({ setFieldValue, errors, touched, values }) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        getCountries();
    }, []);

    useEffect(() => {
        if (!values.country) return;

        setCities([]);
        getStates(values.country);
    }, [values.country]);

    useEffect(() => {
        if (!values.state) return;

        getCities(values.state);
    }, [values.state]);

    const getCountries = async () => {
        const res: any = await dictionaryService.getCountries();
        if (res && res.code === 200) {
            setCountries(res.value);
        }
    };

    const getStates = async countryCode => {
        const res: any = await dictionaryService.getStates(countryCode);
        if (res && res.code === 200) {
            setStates(res.value);
        }
    };

    const getCities = async stateCode => {
        const res: any = await dictionaryService.getCities(stateCode);
        if (res && res.code === 200) {
            setCities(res.value);
        }
    };

    const clearState = () => {
        setFieldValue('state', '');
        setFieldValue('stateName', '');
    };

    const clearCity = () => {
        setFieldValue('city', '');
        setFieldValue('cityName', '');
    };

    return (
        <>
            <ElSelectEx
                items={countries}
                name="country"
                onSelectedItem={item => {
                    setFieldValue('country', item?.value);
                    setFieldValue('countryName', item?.label);
                    clearState();
                    clearCity();
                }}
                defaultValue={values.country}
                placeholder="Country"
            />
            <ElErrorMessage error={errors['country']} visible={touched['country']} />

            <ElSelectEx
                items={states}
                name="state"
                onSelectedItem={item => {
                    setFieldValue('state', item?.value);
                    setFieldValue('stateName', item?.label);
                    clearCity();
                }}
                defaultValue={values.state}
                placeholder="State"
            />
            <ElErrorMessage error={errors['state']} visible={touched['state']} />

            <ElSelectEx
                items={cities}
                name="city"
                onSelectedItem={item => {
                    setFieldValue('city', item?.value);
                    setFieldValue('cityName', item?.label);
                }}
                defaultValue={values.city}
                placeholder="City"
            />
            <ElErrorMessage error={errors['city']} visible={touched['city']} />
        </>
    );
};

export default RegionCascader;
