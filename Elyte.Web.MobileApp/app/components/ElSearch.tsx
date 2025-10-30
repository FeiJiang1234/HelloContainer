import React, { useCallback, useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import ElIcon from './ElIcon';
import ElInput from './ElInput';
import debounce from 'lodash/debounce';

type PropType = {
    keyword?: any;
    onKeywordChange?: any;
    inputAccessoryViewID?: any;
};

const ElSearch: React.FC<PropType> = ({ keyword, onKeywordChange, inputAccessoryViewID }) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (keyword === undefined) return;
        if (keyword !== inputValue) {
            setInputValue(keyword);
        }
    }, [keyword]);

    const onChangeCallback = useCallback(v => onKeywordChange(v), [onKeywordChange]);

    const debounceCallback = useCallback(
        debounce(onChangeCallback, 300, {
            leading: false,
            trailing: true,
        }),
        [onChangeCallback],
    );

    const handleSearchBoxChanged = useCallback(
        v => {
            setInputValue(v);
            debounceCallback(v);
        },
        [debounceCallback],
    );

    const handleClearPress = () => {
        setInputValue('');
        debounceCallback('');
    };

    return (
        <ElInput
            hideLabel
            InputLeftElement={<ElIcon name="magnify" size={8} />}
            InputRightElement={
                inputValue && (
                    <Pressable onPress={handleClearPress}>
                        <ElIcon name="close" size={6} />
                    </Pressable>
                )
            }
            value={inputValue}
            inputAccessoryViewID={inputAccessoryViewID}
            placeholder="Search"
            onChangeText={handleSearchBoxChanged}
        />
    );
};

export default ElSearch;
