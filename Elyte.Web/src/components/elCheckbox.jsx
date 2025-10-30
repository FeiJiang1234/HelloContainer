import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

function ElCheckbox ({ onChange, label, ...rest }) {
    return (
        <FormControlLabel
            sx={{ display: 'flex', alignItems: 'flex-start', '& .MuiFormControlLabel-label': { pt: 1 } }}
            control={<Checkbox onChange={onChange} />}
            label={label}
            {...rest}
        />
    );
}

export default ElCheckbox;
