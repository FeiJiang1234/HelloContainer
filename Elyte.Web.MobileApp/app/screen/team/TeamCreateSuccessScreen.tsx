import React, { useState, useEffect } from 'react';
import { ElAvatar, ElBody, ElButton, ElScrollContainer, ElTitle, H3 } from 'el/components';
import { Flex } from 'native-base';
import { useGoBack } from 'el/utils';
import { teamService } from 'el/api';
import { TeamModel } from 'el/models/team/teamModel';
import { ResponseResult } from 'el/models/responseResult';
import routes from 'el/navigation/routes';
import ElAddress from 'el/components/ElAddress';

export default function TeamCreateSuccessScreen({ navigation, route }) {
    useGoBack({ backTo: routes.TeamList });
    const { id } = route.params;
    const [profile, setProfile] = useState<TeamModel>();

    useEffect(() => {
        getTeamProfile();
    }, []);

    const getTeamProfile = async () => {
        const res: ResponseResult<TeamModel> = await teamService.getTeamProfile(id);
        if (res && res.code === 200) {
            setProfile(res.value);
        }
    };

    return (
        <ElScrollContainer>
            <ElTitle>CONGRATULATIONS!</ElTitle>
            <Flex align="center">
                <ElBody mb={2} textAlign="center">
                    You have successfully created a new team!
                </ElBody>
                <ElAvatar size={81} uri={profile?.imageUrl} />
                <H3 style={{ marginTop: 16 }}>{profile?.name}</H3>
                <ElBody mb={2}>{profile?.sportType}</ElBody>
                <ElBody mb={4}>{profile?.bio}</ElBody>
                <ElAddress mb="2" {...profile} />
            </Flex>
            <ElButton onPress={() => navigation.navigate(routes.TeamProfile, { id: id })}>
                Go to Team&apos;s profile
            </ElButton>
        </ElScrollContainer>
    );
}
