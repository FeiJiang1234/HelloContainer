import { useState, useEffect } from 'react';
import { associationService } from 'el/api';
import { ElAvatar, ElBody, ElButton, ElLinkBtn, ElScrollContainer, ElTitle, H3 } from 'el/components';
import routes from 'el/navigation/routes';
import { useGoBack } from 'el/utils';
import { Box, Flex, Row, Text } from 'native-base';
import { ResponseResult } from 'el/models/responseResult';
import { AssociationProfileModel } from 'el/models/association/associationProfileModel';

export default function AssociationCreateSuccessScreen({ navigation, route }) {
    useGoBack({ backTo: routes.OrganizationList });
    const { id } = route.params;
    const [profile, setProfile] = useState<any>({});

    useEffect(() => {
        getAssociationProfile();
    }, []);

    const getAssociationProfile = async () => {
        const res: ResponseResult<AssociationProfileModel> = await associationService.getAssociationProfile(id);
        if (res && res.code === 200) {
            setProfile(res.value);
        }
    };

    return (
        <ElScrollContainer>
            <ElTitle>CONGRATULATIONS!</ElTitle>
            <Flex mb={2} align="center">
                <ElBody mb={2} textAlign="center">
                    You have successfully created a new association!
                </ElBody>
                <ElAvatar size={81} uri={profile?.imageUrl} />
                <H3 style={{ marginTop: 16 }}>{profile.name}</H3>
                <Box>
                    <Row alignItems="center">
                        <ElLinkBtn>Details:&nbsp;</ElLinkBtn>
                        <Text>{profile?.details}</Text>
                    </Row>
                </Box>
            </Flex>
            <ElButton
                onPress={() => navigation.navigate(routes.AssociationProfile, { id: id })}
                style={{ marginBottom: 8 }}>
                Go to profile
            </ElButton>
        </ElScrollContainer>
    );
}
