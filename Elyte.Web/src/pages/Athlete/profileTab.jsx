import React, { useState } from 'react';
import { ElTabs } from 'components';
import ProfileFriends from './profileFriends';
import ProfileTeam from './profileTeam';
import ProfileStats from './profileStats';
import AthleteJoinedGames from './athleteJoinedGames';
import ProfileMedias from './profileMedias';

export default function ProfileTab ({ user, sportType, onFoldUp, viewedAthleteId }) {
    const tabs = ['Fans', 'Teams', 'Games', 'Stats', 'Media'];
    const [tab, setTab] = useState(tabs[0]);

    const handleFoldUp = (e) => {
        if (onFoldUp) {
            onFoldUp(e);
        }
    }

    return (
        <>
            <ElTabs tabs={tabs} tab={tab} onTabChange={setTab}></ElTabs>
            {tab === 'Fans' && <ProfileFriends user={user} onFoldUp={handleFoldUp} viewedAthleteId={viewedAthleteId} />}
            {tab === 'Teams' && <ProfileTeam user={user} sportType={sportType} />}
            {tab === 'Games' && <AthleteJoinedGames athleteId={user.id} />}
            {tab === 'Stats' && <ProfileStats user={user} sportType={sportType} />}
            {tab === 'Media' && <ProfileMedias userId={user.id} isSelf={user.isSelf} />}
        </>
    );
}
