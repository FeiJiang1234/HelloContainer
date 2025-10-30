import React from 'react';
import { ElBox } from 'components';
import { Idiograph } from 'parts';
import { makeStyles } from '@mui/styles';
import { FormControlLabel, Radio } from '@mui/material';

const useStyles = makeStyles(theme => ({
    itemLabel: {
        display: 'flex',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        height: theme.spacing(7),
        borderRadius: theme.spacing(1),
        backgroundColor: '#F0F2F7',
        '& .MuiFormControlLabel-root': {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginLeft: 0
        }
    }
}));

const OrganizationRegisterTeam = ({ item }) => {
    const classes = useStyles();
    return (
        <ElBox className={classes.itemLabel} mb={1}>
            <FormControlLabel
                value={item.id}
                control={<Radio />}
                label={<Idiograph title={item.title} centerTitle={item.centerTitle} subtitle={item.subtitle} imgurl={item.avatarUrl} />}
                labelPlacement="start"
            />
        </ElBox>
    );
};

export default OrganizationRegisterTeam;
