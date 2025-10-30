import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ElTitle, ElDialog, ElInput, ElBox, ElButton, ElMenuBtn, ElBodyContainer, ElBody } from 'components';
import { teamService } from 'services';
import { useProfileRoute } from 'utils';
import { Idiograph } from 'parts';
import { BasketballPosition, SoccerPosition, SportType, OrganizationType } from 'enums';
import { Selected, Unselected } from './components/lineUp';

export default function TeamLineUp () {
    const location = useLocation();
    const history = useHistory();
    const { teamId, gameId, gameCode, sportType, organizationId, organizationType } = location?.state;
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isCreatePlayer, setIsCreatePlayer] = useState(false);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => getTeamMembersInOrganization(), []);

    const getTeamMembersInOrganization = async () => {
        if (!teamId) return;
        let res = null
        if (organizationType === OrganizationType.League) {
            res = await teamService.getLeagueTeamRoster(teamId, organizationId, gameId);
        }

        if (organizationType === OrganizationType.Tournament) {
            res = await teamService.getTournamentTeamRoster(teamId, organizationId, gameId);
        }

        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handleCreatePlayer = async (data) => {
        setLoading(true);
        const res = await handleCreatePlayerService(data);
        if (res && res.code === 200) {
            reset();
            setIsCreatePlayer(false);
            getTeamMembersInOrganization();
        }
        setLoading(false);
    }

    const handleCreatePlayerService = (data) => {
        if (organizationType === OrganizationType.League)
            return teamService.createBlankAthleteToLeagueTeam(teamId, organizationId, { ...data });
        if (organizationType === OrganizationType.Tournament)
            return teamService.createBlankAthleteToTournamentTeam(teamId, organizationId, { ...data });
    }

    const handlePlayerChange = (id, data) => {
        const newMembers = members.map(player => { return player.id === id ? { ...player, ...data } : player; });
        setMembers(newMembers);
    };

    const handleConfirmLineup = async () => {
        members.forEach(x => (x.athleteId = x.id));
        const res = await teamService.updateGameLineup(teamId, gameId, { lineups: members });
        if (res && res.code === 200) {
            window.elyte.success('Update lineup successfully.');
            getTeamMembersInOrganization();
            history.push('/gameProfile', { params: { id: gameId } });
        }
    };

    return (
        <ElBodyContainer>
            <ElTitle center>Team Line Up</ElTitle>
            <ElBody center>Game ID: {gameCode}</ElBody>
            {
                Array.isNullOrEmpty(members) && <ElBox mt={2} center flex={1}>No Players</ElBox>
            }
            {
                !Array.isNullOrEmpty(members) &&
                <>
                    <Box display='flex'>
                        <Typography flex={1}>Player</Typography>
                        <Typography width={100} textAlign='center'>Sign In</Typography>
                        <Typography width={40} textAlign='center'>Pos</Typography>
                    </Box>
                    <Box flex={1} overflow="auto">
                        {
                            members.map((item, index) => <NormalPlayerItem key={item.id + index} item={item} sportType={sportType} onPlayerChange={handlePlayerChange} />)
                        }
                    </Box>
                </>
            }
            <Box width={200} margin="auto">
                <ElButton mt={2} mb={1} onClick={() => setIsCreatePlayer(true)}>Blank Player</ElButton>
                <ElButton mb={2} className="green" onClick={handleConfirmLineup}>Confirm</ElButton>
            </Box>
            <ElDialog open={isCreatePlayer} onClose={() => setIsCreatePlayer(false)} title="Create Player" subTitle="Create a blank account for one of your team mates that doesnt have an ELYTE account"
                actions={
                    <ElButton loading={loading} onClick={handleSubmit(handleCreatePlayer)}>Create Player</ElButton>
                }>
                <form autoComplete="off" onSubmit={handleSubmit(handleCreatePlayer)}>
                    <ElInput label="Name" errors={errors} inputProps={{ maxLength: 50 }}
                        {...register("name", { required: 'This field is required.' })}
                    />
                </form>
            </ElDialog>
        </ElBodyContainer>
    );
}

const NormalPlayerItem = ({ item, sportType, onPlayerChange }) => {
    const { athleteProfile } = useProfileRoute();

    const menuItems = [
        {
            text: 'S',
            onClick: () => onPlayerChange(item.id, { joinGameType: "Starter" }),
            hide: item.joinGameType == "Starter"
        },
        {
            text: 'B',
            onClick: () => onPlayerChange(item.id, { joinGameType: "Substituter" }),
            hide: item.joinGameType == "Substituter"
        }
    ];

    const positionItems = () => {
        const positions = getPositions();
        const positionMenu = positions.map(x => ({
            text: x,
            onClick: () => onPlayerChange(item.id, { position: x }),
            hide: item.position === x,
        }));
        return positionMenu;
    };

    const getPositions = () => {
        if (sportType === SportType.Basketball) return Object.values(BasketballPosition);
        if (sportType === SportType.Soccer) return Object.values(SoccerPosition);

        return [];
    }

    return (
        <Box display='flex' mt={1}>
            <Box flex={1}>
                <Idiograph
                    to={item.isBlankAccount ? null : athleteProfile(item.id)}
                    title={item?.title}
                    centerTitle={item.blankAccountCode ? `ID: ${item.blankAccountCode}` : item.centerTitle}
                    subtitle={item.isBlankAccount ? null : item.subtitle}
                    imgurl={item?.avatarUrl} noDivider />
            </Box>
            <Box width={100} display='flex' justifyContent='center'>
                <ElMenuBtn items={menuItems}>
                    {
                        item.joinGameType == null &&
                        <Unselected>N/A</Unselected>
                    }
                    {
                        item.joinGameType == 'Starter' &&
                        <Selected>S</Selected>
                    }
                    {
                        item.joinGameType == 'Substituter' &&
                        <Unselected>B</Unselected>
                    }
                </ElMenuBtn>
            </Box>
            <Box width={40} display='flex' justifyContent='center'>
                {
                    item.joinGameType !== null &&
                    <ElMenuBtn items={positionItems()}>
                        <Unselected>{item.position}</Unselected>
                    </ElMenuBtn>
                }
            </Box>
        </Box>
    )
}