import React, { useState, useCallback } from 'react';
import { ElSvgIcon } from 'components';
import { Box, InputBase } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import debounce from "lodash/debounce";
import { useEffect } from 'react';

const useStyles = makeStyles(theme => {
    return {
        searchBox: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '&>svg': {
                margin: theme.spacing(0, 2),
            },
        },
        searchContent: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            background: '#F0F2F7',
            padding: theme.spacing(1),
            borderRadius: '8px',
            color: theme.palette.body.light,
            '& .MuiInputBase-root': {
                flex: '1',
                '& input': {
                    textIndent: '1em',
                },
            },
            '& svg': {
                stroke: theme.palette.body.light,
            },
        },
        filterBtnActived: {
            stroke: '#17C476'
        },
    };
});

export default function ElSearchBox ({ value, isShowFilter, filterDefaultStatus, onChange, onFilterButtonClick, placeholder, ...rest }) {
    const { className, ...other } = rest;
    const classes = useStyles();
    const [hasValue, setHasValue] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [filterStatus, setFilterStatus] = useState(filterDefaultStatus);

    useEffect(() => setFilterStatus(filterDefaultStatus), [filterDefaultStatus]);

    useEffect(() => {
        if (value === undefined) return;
        if (value != inputValue) {
            setInputValue(value);
        }
    }, [value]);

    const onChangeCallback = useCallback(v => {
        if (onChange) {
            onChange(v);
        }
    }, [onChange]);

    const debounceCallback = useCallback(
        debounce(onChangeCallback, 500, {
            leading: false,
            trailing: true
        }),
        [onChangeCallback]
    );

    const handleSearchBoxChanged = useCallback(
        e => {
            setInputValue(e.target.value);
            debounceCallback(e.target.value);
        },
        [debounceCallback]
    );

    const handleInputBlur = (e) => {
        setHasValue(e.target.value.length > 0);
    }

    const handleClearBtnClick = () => {
        setInputValue('');
        debounceCallback("");
    }

    const handleFilterClick = () => {
        setFilterStatus(!filterStatus);
        if (onFilterButtonClick) {
            onFilterButtonClick();
        }
    }

    return (
        <Box className={[classes.searchBox, className].join(" ")} {...other}>
            <Box className={classes.searchContent}>
                <ElSvgIcon small name="search" />
                <InputBase placeholder={placeholder || "Search"} value={inputValue} onChange={handleSearchBoxChanged} onFocus={() => setHasValue(true)} onBlur={handleInputBlur} />
                {hasValue && <CloseIcon sx={{ color: (theme) => theme.palette.grey[500] }} onClick={handleClearBtnClick} />}
            </Box>
            {isShowFilter && <ElSvgIcon small dark name="port" className={["svgPort", filterStatus ? classes.filterBtnActived : ''].join(" ")} onClick={handleFilterClick} />}
        </Box>
    );
}
