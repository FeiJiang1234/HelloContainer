import React from 'react';
import { ElButton } from 'components';
import { Tabs as MuTabs, Tab as MuTab } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiTabs-indicator': {
            display: 'none',
        },
        '& .MuiTab-root': {
            minWidth: 0,
            padding: 0,
            marginRight: theme.spacing(1),
        },
    }
}));

const ElTabs = ({ tabs, tab, onTabChange }) => {
    const classes = useStyles();
    const handleChange = (event, value) => onTabChange(value);
    return (
        <MuTabs variant="scrollable" className={classes.root} value={tab} onChange={handleChange}>
            {tabs.map(x => (
                <MuTab disableRipple={true} value={x} key={x}
                    icon={
                        <ElButton disabled={x != tab} small component="a">
                            {x}
                        </ElButton>
                    }
                />
            ))}
        </MuTabs>
    );
}

export default ElTabs;