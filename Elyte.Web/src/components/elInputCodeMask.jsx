import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';

const ElInputCodeMask = React.forwardRef(function TextMaskCustom (props, ref) {
    const { onChange, ...other } = props;
    const [value, setValue] = useState("");

    const handleAccept = v => {
        setValue(v);
        onChange({ target: { name: props.name, value } });
    };

    return (
        <IMaskInput
            {...other}
            mask="000-000-0000"
            unmask={true}
            inputRef={ref}
            onAccept={(v) => handleAccept(v)}
            value={value}
        />
    );
});

ElInputCodeMask.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ElInputCodeMask;