import React, { useState } from 'react';
import { ElTabs } from 'components';
import TeamProfileRoster from './teamProfileRoster';
import TeamJoinedOrganizationList from './teamJoinedOrganizationList';
import TeamJoinedGames from './teamJoinedGames';
import TeamStats from './teamStats';
import ProfileMedias from './profileMedias';


export default function TeamProfileTab ({ team }) {
    const tabs = ['Roster', 'Organizations', 'Games', 'Stats', 'Media'];
    const [tab, setTab] = useState(tabs[0]);

    return (
        <>
            <ElTabs tabs={tabs} tab={tab} onTabChange={setTab}></ElTabs>
            {tab === 'Roster' && <TeamProfileRoster team={team} />}
            {tab === 'Organizations' && <TeamJoinedOrganizationList teamId={team.id} isAdminView={team.isAdminView} sportType={team.sportType} />}
            {tab === 'Games' && <TeamJoinedGames teamId={team.id} />}
            {tab === 'Stats' && <TeamStats team={team} />}
            {tab === 'Media' && <ProfileMedias teamId={team.id} isAdminView={team.isAdminView} />}
        </>
    );
}
