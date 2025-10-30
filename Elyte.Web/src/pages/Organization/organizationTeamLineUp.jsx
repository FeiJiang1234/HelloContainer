import React, { useState, useEffect } from 'react';
import { ElBodyContainer, ElButton, ElMenuBtn, ElTitle } from 'components';
import { useLocation } from 'react-router-dom';
import { teamService } from 'services';
import { BasketballPosition, SoccerPosition, SportType } from 'enums';
import { Box, Typography } from '@mui/material';
import { Idiograph } from 'parts';
import BlankAccountCreate from 'pages/Organization/blankAccountCreate';
import { Selected, Unselected } from 'pages/Game/components/lineUp';
import { useProfileRoute } from 'utils';

const OrganizationTeamLineUp = () => {
    const location = useLocation();
    const { organizationId, organizationType, teamId, isAdminView, sportType } = location?.state;
    const [members, setMembers] = useState([]);
    const [isCreatePlayer, setIsCreatePlayer] = useState(false);

    useEffect(() => {
        getTeamMembers();
    }, []);

    const getTeamMembers = async () => {
        const res = await teamService.getTeamPlayersByOrganizationId(
            teamId,
            organizationId,
            organizationType,
        );
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };

    const handlePlayerChange = (id, data) => {
        const newMembers = members.map(player => {
            if (player.id === id) {
                return { ...player, ...data };
            }
            return player;
        });
        setMembers(newMembers);
    };

    const handleConfirmLineup = async () => {
        members.forEach(x => (x.athleteId = x.id));

        const res = await getConfirmLineupService();
        if (res && res.code === 200) {
            window.elyte.success('update lineup successfully.');
            getTeamMembers();
        }
    };

    const getConfirmLineupService = () => {
        if (organizationType == 'League')
            return teamService.updateLeagueLineup(teamId, organizationId, { lineups: members });
        if (organizationType == 'Tournament')
            return teamService.updateTournamentLineup(teamId, organizationId, { lineups: members });
    }

    return (
        <>
            <ElBodyContainer>
                <ElTitle center>Team Line Up</ElTitle>
                <Box display="flex">
                    <Typography flex={1}>Player</Typography>
                    <Typography width={100} textAlign="center">
                        Sign In
                    </Typography>
                    <Typography width={40} textAlign="center">
                        Pos
                    </Typography>
                </Box>
                <Box flex={1} overflow="auto">
                    {members.map(item => (
                        <PlayerItem key={item.id} sportType={sportType} isAdminView={isAdminView} item={item} onPlayerChange={handlePlayerChange} />
                    ))}
                </Box>
                {
                    isAdminView &&
                    <Box width={200} margin="auto">
                        <ElButton mt={2} mb={1} onClick={() => setIsCreatePlayer(true)}>
                            Blank Player
                        </ElButton>
                        <ElButton mb={2} className="green" onClick={handleConfirmLineup}>
                            Confirm
                        </ElButton>
                    </Box>
                }
            </ElBodyContainer>
            <BlankAccountCreate
                isCreatePlayer={isCreatePlayer}
                onCancel={() => setIsCreatePlayer(false)}
                teamId={teamId}
                organizationId={organizationId}
                organizationType={organizationType}
                onSuccess={() => {
                    setIsCreatePlayer(false);
                    getTeamMembers();
                }}
            />
        </>
    );
};

const PlayerItem = ({ sportType, isAdminView, item, onPlayerChange }) => {
    const { athleteProfile } = useProfileRoute();
    const signInItems = [
        {
            text: 'S',
            onClick: () => onPlayerChange(item.id, { isJoinOrganization: true, isStarter: true }),
            hide: item.isJoinOrganization && item.isStarter,
        },
        {
            text: 'B',
            onClick: () => onPlayerChange(item.id, { isJoinOrganization: true, isStarter: false }),
            hide: item.isJoinOrganization && !item.isStarter,
        },
        {
            text: 'N/A',
            onClick: () => onPlayerChange(item.id, { isJoinOrganization: false, isStarter: false }),
            hide: !item.isJoinOrganization,
        },
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
        <Box display="flex" mt={1}>
            <Box flex={1}>
                <Idiograph
                    to={item.isBlankAccount ? null : athleteProfile(item.id)}
                    title={item.title}
                    centerTitle={item.blankAccountCode ? `ID: ${item.blankAccountCode}` : item.centerTitle}
                    imgurl={item.avatarUrl}
                />
            </Box>
            <Box width={100} display="flex" justifyContent="center">
                <ElMenuBtn items={isAdminView ? signInItems : []}>
                    {item.isJoinOrganization && item.isStarter && <Selected>S</Selected>}
                    {item.isJoinOrganization && !item.isStarter && <Unselected>B</Unselected>}
                    {!item.isJoinOrganization && <Unselected>N/A</Unselected>}
                </ElMenuBtn>
            </Box>
            <Box width={40} display="flex" justifyContent="center">
                {item.isJoinOrganization && (
                    <ElMenuBtn items={isAdminView ? positionItems() : []}>
                        <Unselected>{item.position}</Unselected>
                    </ElMenuBtn>
                )}
            </Box>
        </Box>
    );
};

export default OrganizationTeamLineUp;
