import { athleteService } from 'el/api';
import { ElBody, ElContainer, ElFlatList, ElIdiograph, ElTitle } from 'el/components';
import { useDateTime, useGoBack, useProfileRoute } from 'el/utils';
import { Row } from 'native-base';
import React, { useState, useEffect } from 'react';

const AthleteJoinTeamRequestScreen = ({ route }) => {
    useGoBack();
    const [joinTeamRequests, setJoinTeamRequests] = useState([]);
    const { id } = route.params;
    const { utcToLocalDatetime } = useDateTime();
    const { goToTeamProfile } = useProfileRoute();

    useEffect(() => {
        getJoinTeamRequests();
    }, []);

    const getJoinTeamRequests = async () => {
        const res: any = await athleteService.getTeamJoinRequests(id);
        if (res && res.code === 200 && res.value) {
            setJoinTeamRequests(res.value);
        }
    };

    return (
        <ElContainer h="100%">
            <ElTitle>Join Team Requests</ElTitle>
            <ElFlatList
                data={joinTeamRequests}
                listEmptyText="No Requests"
                renderItem={({ item }) => (
                    <Row alignItems="center">
                        <ElIdiograph
                            onPress={() => goToTeamProfile(item.teamId)}
                            flex={1}
                            title={item.teamName}
                            centerTitle={item.centerTitle}
                            subtitle={utcToLocalDatetime(item.subtitle)}
                            imageUrl={item.avatarUrl}
                        />
                        <ElBody size="sm">{item.status}</ElBody>
                    </Row>
                )}
            />
        </ElContainer>
    );
};

export default AthleteJoinTeamRequestScreen;
