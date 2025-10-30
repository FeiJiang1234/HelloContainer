import React, { useEffect, useState } from 'react';
import { ElSelect } from 'components';
import { dictionaryService } from 'services';

const RegionCascader = ({ register, errors, defaultCountry, defaultState, defaultCity, isRequired = true }) => {
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [countryCode, setCountryCode] = useState(defaultCountry || '');
    const [stateCode, setStateCode] = useState(defaultState || '');
    const [cityCode, setCityCode] = useState(defaultCity || '');

    useEffect(() => {
        getCountries();
        if (!isNaN(parseInt(defaultCountry))) {
            getStates(defaultCountry);
        }

        if (!isNaN(parseInt(defaultState))) {
            getCities(defaultState);
        }
    }, []);

    const getCountries = async () => {
        const res = await dictionaryService.getCountries();
        if (checkResponse(res)) {
            setCountryOptions(isRequired ? res.value : [{ label: 'None', value: '' }, ...res.value]);
        }
    }

    const getStates = async (countryCode) => {
        if (String.isNullOrEmpty(countryCode)) return;
        const res = await dictionaryService.getStates(countryCode);
        if (checkResponse(res)) {
            setStateOptions(isRequired ? res.value : [{ label: 'None', value: '' }, ...res.value]);
        }
    }

    const getCities = async (stateCode) => {
        if (String.isNullOrEmpty(stateCode)) return;
        const res = await dictionaryService.getCities(stateCode);
        if (checkResponse(res)) {
            setCityOptions(isRequired ? res.value : [{ label: 'None', value: '' }, ...res.value]);
        }
    }

    const checkResponse = (res) => {
        return res && res.code === 200 && !Array.isNullOrEmpty(res.value);
    }

    const handleCountryChanged = (e) => {
        setStateOptions([]);
        setCityOptions([]);
        setStateCode('');
        setCityCode('');
        getStates(e.target.value);
        setCountryCode(e.target.value);
    }

    const handleStateChanged = (e) => {
        setCityOptions([]);
        setCityCode('');
        getCities(e.target.value);
        setStateCode(e.target.value);
    }

    const handleCityChanged = (e) => {
        setCityCode(e.target.value);
    }

    return (
        <>
            <ElSelect label="Country" errors={errors} options={countryOptions} value={Array.isNullOrEmpty(countryOptions) ? '' : countryCode}
                {...register("country", {
                    required: { value: isRequired, message: 'This field is required.' },
                    onChange: handleCountryChanged,
                    value: countryCode
                })}
            />
            <ElSelect label="State" errors={errors} options={stateOptions} value={Array.isNullOrEmpty(stateOptions) ? '' : stateCode}
                {...register("state", {
                    required: { value: isRequired, message: 'This field is required.' },
                    onChange: handleStateChanged,
                    value: stateCode
                })}
            />
            <ElSelect label="City" errors={errors} options={cityOptions} value={Array.isNullOrEmpty(cityOptions) ? '' : cityCode}
                {...register("city", {
                    required: { value: isRequired, message: 'This field is required.' },
                    onChange: handleCityChanged,
                    value: cityCode
                })}
            />
        </>
    )
}

export default RegionCascader;