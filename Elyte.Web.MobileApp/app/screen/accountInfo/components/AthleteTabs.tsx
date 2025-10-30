import { Box } from 'native-base';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { ElButton } from 'el/components';
import AthleteJoinedGames from './AthleteJoinedGames';
import ProfileFriends from './ProfileFriends';
import ProfileMedias from './ProfileMedias';
import ProfileStats from './ProfileStats';
import ProfileTeam from './ProfileTeam';
import _ from 'lodash';

export default function AthleteTabs({ id, sportType, profile }) {
    const tabs = ['Fans', 'Teams', 'Games', 'Stats', 'Media'];
    const [tab, setTab] = useState(tabs[0]);

    return (
        <>
            <FlatList
                data={tabs}
                keyExtractor={p => p}
                ItemSeparatorComponent={() => <Box w={2} />}
                renderItem={({ item }) => (
                    <ElButton
                        onPress={() => setTab(item)}
                        variant={item !== tab ? 'disabled' : 'contained'}
                        size="sm">
                        {item}
                    </ElButton>
                )}
                horizontal={true}
            />
            <Box mb={2}>
                {tab === 'Fans' && <ProfileFriends userId={id} viewedAthleteId={profile?.id} />}
                {tab === 'Teams' && <ProfileTeam profile={profile} sportType={sportType} />}
                {tab === 'Games' && <AthleteJoinedGames id={id} />}
                {tab === 'Stats' && (
                    <ProfileStats
                        athleteId={profile?.id}
                        sportType={sportType}
                        pictureUrl={profile?.pictureUrl}
                        firstName={profile?.firstName}
                        lastName={profile?.lastName}
                        state={profile?.state}
                        city={profile?.city}
                    />
                )}
                {tab === 'Media' && <ProfileMedias userId={profile?.id} isSelf={profile?.isSelf} />}
            </Box>
        </>
    );
}
