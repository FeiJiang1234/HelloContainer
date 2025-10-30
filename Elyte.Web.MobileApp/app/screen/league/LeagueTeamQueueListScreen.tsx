import { leagueService } from 'el/api';
import { ElContainer, ElIdiograph, ElFlatList, ElTitle } from 'el/components';
import { useGoBack, useProfileRoute } from 'el/utils';
import React, { useEffect, useState } from 'react';

export default function LeagueTeamQueueListScreen({ route }) {
    useGoBack();
    const { id } = route.params;
    const [teams, setTeams] = useState<any[]>([]);
    const { goToTeamProfile } = useProfileRoute();

    useEffect(() => {
        getLeagueTeamQueueList();
    }, []);

    const getLeagueTeamQueueList = async () => {
        const res: any = await leagueService.getLeagueTeamQueue(id);
        if (res && res.code === 200 && res.value) {
            setTeams(res.value);
        }
    };

    return (
        <ElContainer h="100%">
            <ElTitle>Queue List</ElTitle>
            <ElFlatList
                data={teams}
                listEmptyText="No Teams"
                renderItem={({ item }) =>
                    <ElIdiograph
                        onPress={() => goToTeamProfile(item.id)}
                        title={item.title}
                        subtitle={item.subtitle}
                        centerTitle={item.centerTitle}
                        imageUrl={item.avatarUrl}
                    />
                }
            />
        </ElContainer>
    );
}
