import React, { useEffect, useState } from 'react';
import { useAuth, useElToast, useGoBack } from 'el/utils';
import { athleteService } from 'el/api';
import { OrganizationType } from 'el/enums';
import { ElBody, ElButton, ElCheckbox, ElInput, ElScrollContainer, ElTitle } from 'el/components';
import { Box, Divider } from 'native-base';
import routes from 'el/navigation/routes';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';

export default function BecomeOfficiateScreen({ navigation, route }) {
    useGoBack();
    const toast = useElToast();
    const { id, type } = route.params;
    const { user } = useAuth();
    const [isAgree, setIsAgree] = useState(true);
    const [athleteInfo, setAthleteInfo] = useState<any>();
    const dispatch = useDispatch();

    useEffect(() => {
        getAthleteInfo();
    }, []);

    const getAthleteInfo = async () => {
        const res: any = await athleteService.getAtlteteForOfficiateRegistration(user.id);
        if (res && res.code === 200) {
            setAthleteInfo(res.value);
        }
    };

    const getService = organizationType => {
        if (organizationType === OrganizationType.League) {
            return athleteService.requestToBecomeLeagueOfficiate(user.id, id);
        }
        if (organizationType === OrganizationType.Tournament) {
            return athleteService.requestToBecomeTournamentOfficiate(user.id, id);
        }
        if (organizationType === OrganizationType.Association) {
            return athleteService.requestToBecomeAssociationOfficiate(user.id, id);
        }
    };

    const handleRegisterOfficiateClick = async () => {
        dispatch(PENDING());
        const res: any = await getService(type);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            toast.success('Your application is successful, please wait admin to approve.');
            if (type === OrganizationType.League) {
                navigation.navigate(routes.LeagueProfile, { id: id });
            }
            if (type === OrganizationType.Tournament) {
                navigation.navigate(routes.TournamentProfile, { id: id });
            }
            if (type === OrganizationType.Association) {
                navigation.navigate(routes.AssociationProfile, { id: id });
            }
        } else {
            dispatch(ERROR());
            toast.error(res.Message);
        }
    };

    return (
        <ElScrollContainer>
            <ElTitle>Become an Officiate</ElTitle>
            <ElBody>Main information</ElBody>
            {
                athleteInfo &&
                <>
                    <ElInput
                        name="username"
                        placeholder="User Name"
                        editable={false}
                        defaultValue={athleteInfo?.name}
                    />
                    <ElInput
                        name="userphone"
                        placeholder="User Phone"
                        editable={false}
                        defaultValue={athleteInfo?.phoneNumber}
                    />
                    <ElInput
                        name="useremail"
                        placeholder="User Email"
                        editable={false}
                        defaultValue={athleteInfo?.email}
                    />
                </>
            }
            <ElCheckbox value={isAgree} onValueChange={() => setIsAgree(!isAgree)}>
                <ElBody>
                    Please confirm the above information is correct. If needed please make the
                    changes to your info on your personal profile page.
                </ElBody>
            </ElCheckbox>
            <Divider my={2} />
            {
                !athleteInfo?.isOfficiate &&
                <>
                    <ElBody>Instructions</ElBody>
                    <ElBody>
                        Once you have submitted this request the organization will reach out to get
                        in contact with you and confirm your registration with their league. You
                        will now have a new tab in your personal profile for your officiating
                        details, and you will now need to manage your {'"'}officiating calendar{'"'}{' '}
                        so you can let others know when you are available to officiate.
                    </ElBody>
                </>
            }
            <Box pt={3}>
                <ElButton
                    disabled={!isAgree}
                    onPress={handleRegisterOfficiateClick}
                    style={{ marginBottom: 8 }}>
                    Register
                </ElButton>
            </Box>
        </ElScrollContainer>
    );
}
