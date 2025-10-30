import React from 'react';
import WelcomeLayout from './welcomeLayout';

const data = [
    {
        image: 'welcome-organization-1',
        title: 'get set up',
        subTitle: 'Step 1. Set up your account',
        content:
            'Your personal account will make it easier to set up your organizations and will be a place to show how much you do.',
    },
    {
        image: 'welcome-organization-2',
        title: 'start creating',
        subTitle: 'Step 2. Create an Organization',
        content:
            'Use our simplistic forms to set up Leagues, Tournaments, or your Association.',
    },
    {
        image: 'welcome-organization-3',
        title: 'become official',
        subTitle: 'Step 3. Use the sign up to get your official ID',
        content:
            'When setting up an organization you have the option to be Official or Unofficial. Official stats matter, Unofficial is for fun.',
    },
    {
        image: 'welcome-organization-4',
        title: 'get organized',
        subTitle: 'Step 4. Use tools to manage your organization',
        content:
            'Use the calendar scheduler, facility pages,  officiate managment tools, messaging, and stat tracking modules to seamlessly manage your organization.',
    },
    {
        image: 'welcome-organization-5',
        title: 'give feedback',
        subTitle: 'Step 5. Tell us what we can do better to make your life easier!',
        content:
            'Email us: support@elyte.app\nMessage user: Support Elyte',
    },
];

const WelcomeOrganization = () => {
    return (
        <WelcomeLayout data={data}></WelcomeLayout>
    );
};

export default WelcomeOrganization;
