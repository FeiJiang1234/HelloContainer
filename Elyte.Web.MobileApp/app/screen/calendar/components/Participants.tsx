import { athleteService, eventService } from 'el/api';
import { ElButton, ElIdiograph, ElList } from 'el/components';
import { useAuth, useProfileRoute } from 'el/utils';
import React, { useEffect, useState } from 'react';

export default function Participants({ profile }) {
    const [participants, setParticipants] = useState([]);
    const { goToAthleteProfile } = useProfileRoute();
    const { user } = useAuth();

    useEffect(() => { getParticipants() }, [profile]);

    const getParticipants = async () => {
        const res: any = await eventService.getEventParticipants(profile.id);
        if (res && res.code === 200) {
            setParticipants(res.value);
        }
    };

    const handleFollowClick = async (athleteId) => {
        const res: any = await athleteService.followUser(user.id, athleteId);
        if (res && res.code === 200) {
            getParticipants();
        }
    };

    const handleUnfollowClick = async (athleteId) => {
        const res: any = await athleteService.unfollowUser(user.id, athleteId);
        if (res && res.code === 200) {
            getParticipants();
        }
    };

    return <ElList
        data={participants}
        renderItem={({ item }) => (
            <>
                <ElIdiograph
                    onPress={() => goToAthleteProfile(item.id)}
                    title={item.title}
                    subtitle={item.subtitle}
                    centerTitle={item.centerTitle}
                    imageUrl={item.avatarUrl}
                />
                {
                    !item.isFollowed && item.id != user.id &&
                    <ElButton size="sm" onPress={() => handleFollowClick(item.id)}>Follow</ElButton>
                }
                {
                    item.isFollowed && item.id != user.id &&
                    <ElButton size="sm" onPress={() => handleUnfollowClick(item.id)}>Unfollow</ElButton>
                }
            </>
        )}
    />
}
