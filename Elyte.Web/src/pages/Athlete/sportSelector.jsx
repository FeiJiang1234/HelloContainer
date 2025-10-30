import React, { useState } from 'react';
import { ElButton, ElDialog } from 'components';
import { Typography, Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const SportSelector = ({ sports, defaultValue, isUpdateSport, onConfirmed, onClosed }) => {
    const [value, setValue] = useState(isUpdateSport ? defaultValue : "");

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleConfirmClick = () => {
        if (onConfirmed) {
            onConfirmed(value);
        }
    }


    return (
        <ElDialog open={true} title="Select Profile Sport" onClose={onClosed} contentStyle={{ overflow: 'auto' }}
            actions={<ElButton onClick={handleConfirmClick}>Confirm</ElButton>}
        >
            {
                isUpdateSport &&
                <Typography sx={{ fontSize: 15, color: '#B0B8CB', fontWeight: 400 }}>Stats will display based on the sport selected below. You can choose which sport is your default for your profile.</Typography>
            }

            <Grid container mt={1}>
                <Grid item xs={10}>Sport Selection</Grid>
                <Grid item xs={2}>{isUpdateSport ? 'Default' : ''}</Grid>
                <RadioGroup row sx={{ width: '100%', marginTop: 1 }} value={value} onChange={handleChange} >
                    {
                        !Array.isNullOrEmpty(sports) && sports.map(sport => <SportOption key={sport?.name} name={sport?.name} level={sport?.level} />)
                    }
                </RadioGroup>
            </Grid>
        </ElDialog>
    );
}

const SportOption = ({ name, level }) => {
    return (
        <>
            <Grid item xs={9} sx={{ height: 50, background: '#F0F2F7', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 2, marginBottom: 2 }}>
                <Typography sx={{ color: '#1F345D', fontSize: 15 }}>{name || ''}</Typography>
                <Typography sx={{ color: '#17C476', fontSize: 10 }}>Level: {level || 1}</Typography>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2} sx={{ height: 50, background: '#F0F2F7', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <FormControlLabel sx={{ margin: 0 }} value={name || ''} control={<Radio />} />
            </Grid>
        </>
    );
}

export default SportSelector;