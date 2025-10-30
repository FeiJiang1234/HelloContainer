import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ElSvgIcon } from 'components';

const routes = [
    { name: 'home', path: '/' },
    { name: 'calendar', path: '/calendar' },
    { name: 'achievement', path: '/achievement' },
    { name: 'organizations', path: '/organizationIndex' },
    { name: 'teams', path: '/teamIndex' },
];

export default function Navs () {
    const history = useHistory();
    let location = useLocation();
    return (
        <>
            {routes.map(r => <ElSvgIcon key={r.name} active={location.pathname === r.path} hover small name={r.name} onClick={() => history.push(r.path)} />)}
        </>
    );
}
