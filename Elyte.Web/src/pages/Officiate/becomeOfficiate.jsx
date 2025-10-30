import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { ElInput, ElTitle, ElButton, ElCheckbox, ElBody } from 'components';
import styled from '@emotion/styled';
import { useHistory, useLocation } from 'react-router-dom';
import { authService, athleteService } from 'services';
import { OrganizationType } from 'enums'

const InstructionsLabel = styled(Typography)(({ theme }) => {
    return {
        fontSize: 16,
        color: theme.palette.body.main,
        marginTop: theme.spacing(2),
    };
});

export default function BecomeOfficiate () {
    const history = useHistory();
    const location = useLocation();
    const OrganizationInfo = location.state.params;
    const currentUser = authService.getCurrentUser();
    const [isAgree, setIsAgree] = useState(true);
    const [athleteInfo, setAthleteInfo] = useState();

    useEffect(() => getAthleteInfo(), []);

    const getAthleteInfo = async () => {
        const res = await athleteService.getAtlteteForOfficiateRegistration(currentUser.id);
        if (res && res.code === 200) {
            setAthleteInfo(res.value);
        }
    }

    const getService = (organizationType) => {
        if (organizationType === OrganizationType.League) {
            return athleteService.requestToBecomeLeagueOfficiate(currentUser.id, OrganizationInfo.id);
        }

        if (organizationType === OrganizationType.Tournament) {
            return athleteService.requestToBecomeTournamentOfficiate(currentUser.id, OrganizationInfo.id);
        }

        if (organizationType === OrganizationType.Association) {
            return athleteService.requestToBecomeAssociationOfficiate(currentUser.id, OrganizationInfo.id);
        }
    }

    const handleRegisterOfficiateClick = async () => {
        const res = await getService(OrganizationInfo.type);
        if (res && res.code === 200) {
            window.elyte.success("Your application is successful, please wait admin to approve.");
            if (OrganizationInfo.type === OrganizationType.League) {
                return history.push('/leagueProfile', { params: OrganizationInfo.id })
            }
            if (OrganizationInfo.type === OrganizationType.Tournament) {
                return history.push('/tournamentProfile', { params: OrganizationInfo.id })
            }
            if (OrganizationInfo.type === OrganizationType.Association) {
                return history.push('/associationProfile', { params: OrganizationInfo.id })
            }
        }
    }

    return (
        <>
            <ElTitle center>Become an Officiate</ElTitle>
            <Typography className="category-text">Main information</Typography>
            {
                athleteInfo &&
                <>
                    <ElInput name="username" label="User Name" disabled defaultValue={athleteInfo?.name} />
                    <ElInput name="userphone" label="User Phone" disabled defaultValue={athleteInfo?.phoneNumber} />
                    <ElInput name="useremail" label="User Email" disabled defaultValue={athleteInfo?.email} />
                </>
            }
            <ElCheckbox onChange={() => setIsAgree(!isAgree)}
                label={<ElBody>Please confirm the above information is correct. If needed please make the changes to your info on your personal profile page.</ElBody>} />
            <Divider className='mt-16 mb-16' />
            {
                !athleteInfo?.isOfficiate &&
                <>
                    <InstructionsLabel>Instructions</InstructionsLabel>
                    <Box className="category-text">
                        Once you have submitted this request the organization will reach out to get in contact with you and confirm your registration with their league.
                        You will now have a new tab in your personal profile for your officiating details,
                        and you will now need to manage your {"\""}officiating calendar{"\""} so you can let others know when you are available to officiate.
                    </Box>
                </>
            }
            <Box pt={3} sx={{ alignItems: 'center', margin: 'auto', textAlign: 'center' }}>
                <ElButton disabled={isAgree} onClick={handleRegisterOfficiateClick}>Register</ElButton>
            </Box>
        </>
    );
}
