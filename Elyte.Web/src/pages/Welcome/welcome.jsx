import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { ElButton } from 'components';
import WelcomeOrganization from './welcomeOrganization';
import WelcomeAthlete from './welcomeAthlete';
import WelcomeLayout from './welcomeLayout';

const data = [
    {
        image: 'welcome',
        title: 'welcome to elyte!',
        subTitle: 'Which are you?',
        content:
            'There are multiple ways to interact with the platform.',
    }
];

const Welcome = () => {
    const [type, setType] = useState(null);

    if (type === 'Organization') return <WelcomeOrganization />
    if (type === 'Athlete') return <WelcomeAthlete />

    return (
        <WelcomeLayout data={data}>
            <Grid container>
                <Grid xs={6} item>
                    <ElButton mr={1} onClick={() => setType('Organization')}>Organization</ElButton>
                </Grid>
                <Grid xs={6} item>
                    <ElButton ml={1} onClick={() => setType('Athlete')}>Athlete</ElButton>
                </Grid>
            </Grid>
        </WelcomeLayout>
    );
};

export default Welcome;
