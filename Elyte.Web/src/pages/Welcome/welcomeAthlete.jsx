import React from 'react';
import WelcomeLayout from './welcomeLayout';

const data = [
    {
        image: 'welcome-athlete-1',
        title: 'get set up',
        subTitle: 'Step 1. Set up your account',
        content:
            'Get all your account information correct. This will help ensure you can find teams and places to play.',
    },
    {
        image: 'welcome-athlete-2',
        title: 'team up',
        subTitle: 'Step 2. Create or join a team',
        content:
            'You can search for a local team to join or create one yourself by going to the Teams Tab.',
    },
    {
        image: 'welcome-athlete-3',
        title: 'go play',
        subTitle: 'Step 3. Find a League or Tournament (organizations)',
        content:
            'Use the Organizations tab to locate places to play that are relevant to you. You can also create your own!',
    },
    {
        image: 'welcome-athlete-4',
        title: 'be legendary',
        subTitle: 'Step 4. Level up and show your skills to the World',
        content:
            'ELYTE is your window to the world. Level up by playing in Official Organizations and share your stats and growth across the platform!',
    }
];

const WelcomeAthlete = () => {
    return (
        <WelcomeLayout data={data}></WelcomeLayout>
    );
};

export default WelcomeAthlete;
