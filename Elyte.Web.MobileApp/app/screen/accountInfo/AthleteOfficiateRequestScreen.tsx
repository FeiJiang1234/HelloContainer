import { athleteService } from 'el/api';
import { ElBody, ElContainer, ElFlatList, ElIdiograph, ElTitle } from 'el/components';
import { useGoBack, useProfileRoute } from 'el/utils';
import { Row } from 'native-base';
import React, { useState, useEffect } from 'react';

const AthleteOfficiateRequestScreen = ({ route }) => {
    useGoBack();
    const [requests, setRequests] = useState([]);
    const { id } = route.params;
    const { goToProfile } = useProfileRoute();

    useEffect(() => {
        getJoinReqests();
    }, []);

    const getJoinReqests = async () => {
        const res: any = await athleteService.getAthleteOfficiateRequests(id);
        if (res && res.code === 200 && res.value) {
            setRequests(res.value);
        }
    };

    return (
        <ElContainer h="100%">
            <ElTitle>Officiate Requests</ElTitle>
            <ElFlatList
                data={requests}
                listEmptyText="No Requests"
                keyExtractor={(item: any) => item.requestId.toString()}
                renderItem={({ item }) => (
                    <Row alignItems="center">
                        <ElIdiograph
                            onPress={() => goToProfile(item.organizationType, item.organizationId)}
                            flex={1}
                            title={item.organizationName}
                            subtitle={
                                <ElBody size="sm">{`${item.organizationType}, ${item.address}`}</ElBody>
                            }
                            imageUrl={item.pictureUrl}
                        />
                        <ElBody size="sm">{item.status}</ElBody>
                    </Row>
                )}
            />
        </ElContainer>
    );
};

export default AthleteOfficiateRequestScreen;
