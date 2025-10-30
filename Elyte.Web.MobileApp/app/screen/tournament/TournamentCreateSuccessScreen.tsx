import { useState, useEffect } from 'react';
import { tournamentService } from 'el/api';
import {
    ElAvatar,
    ElBody,
    ElButton,
    ElLinkBtn,
    ElScrollContainer,
    ElTitle,
    H3,
} from 'el/components';
import routes from 'el/navigation/routes';
import { useDateTime, useGoBack } from 'el/utils';
import { Box, Flex, Row, Text } from 'native-base';
import { ResponseResult } from 'el/models/responseResult';
import { TournamentModel } from 'el/models/tournament/tournamentModel';

export default function TournamentCreateSuccessScreen({ navigation, route }) {
    useGoBack({ backTo: routes.OrganizationList });
    const { id } = route.params;
    const [profile, setProfile] = useState<any>({});
    const { format } = useDateTime();

    useEffect(() => {
        getTeamProfile();
    }, []);

    const getTeamProfile = async () => {
        const res: ResponseResult<TournamentModel> = await tournamentService.getTournament(id);
        if (res && res.code === 200) {
            setProfile(res.value);
        }
    };

    return (
        <ElScrollContainer>
            <ElTitle>CONGRATULATIONS!</ElTitle>
            <Flex mb={2} align="center">
                <ElBody mb={2} textAlign="center">
                    You have successfully created a new tournament!
                </ElBody>
                <ElAvatar size={81} uri={profile?.imageUrl} />
                <H3 style={{ marginTop: 16 }}>{profile.name}</H3>
                <Box>
                    <Row alignItems="center">
                        <ElLinkBtn>Sport:&nbsp;</ElLinkBtn>
                        <Text>{profile?.sportType}</Text>
                    </Row>
                    <Row alignItems="center">
                        <ElLinkBtn>Start:&nbsp;</ElLinkBtn>
                        <Text>{format(profile?.startDate)}</Text>
                    </Row>
                    <Row alignItems="center">
                        <ElLinkBtn>End:&nbsp;</ElLinkBtn>
                        <Text>{format(profile?.endDate)}</Text>
                    </Row>
                    <Row alignItems="center">
                        <ElLinkBtn>Game Type:&nbsp;</ElLinkBtn>
                        <Text>{profile?.gameType}</Text>
                    </Row>
                    <Row alignItems="center">
                        <ElLinkBtn>Total Teams:&nbsp;</ElLinkBtn>
                        <Text>{profile?.totalTeamsAllowed}</Text>
                    </Row>
                    <Row alignItems="center">
                        <ElLinkBtn>Roster Total:&nbsp;</ElLinkBtn>
                        <Text>{profile?.rosterAmount}</Text>
                    </Row>
                    <Row alignItems="center">
                        <ElLinkBtn>Details:&nbsp;</ElLinkBtn>
                        <Text>{profile?.details}</Text>
                    </Row>
                </Box>
            </Flex>
            <ElButton
                onPress={() => navigation.navigate(routes.TournamentProfile, { id: id })}
                style={{ marginBottom: 8 }}>
                Go to profile
            </ElButton>
        </ElScrollContainer>
    );
}
