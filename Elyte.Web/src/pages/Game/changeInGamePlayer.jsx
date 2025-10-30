import React, { useState, useEffect } from 'react';
import { teamService } from 'services';
import { Box, Typography } from '@mui/material';
import { ElBox, ElTitle, ElButton, ElMenuBtn, ElBodyContainer, ElBody } from 'components';
import { useLocation } from 'react-router-dom';
import { useProfileRoute } from 'utils';
import { Idiograph } from 'parts';
import { Selected, Unselected } from './components/lineUp';

const ChangeInGamePlayer = () => {
    const location = useLocation();
    const { gameId, gameCode, teamId } = location?.state;
    const [members, setMembers] = useState([]);

    useEffect(() => {
        getGameTeamRoster();
    }, [gameId]);

    const getGameTeamRoster = async () => {
        const res = await teamService.getTeamGameRoster(teamId, gameId);
        if (res && res.code === 200 && res.value) {
            setMembers(res.value);
        }
    };


    const handlePlayerChange = (athleteId, data) => {
        const newMembers = members.map(player => {
            if (player.athleteId === athleteId) {
                return { ...player, ...data };
            }
            return player;
        });
        setMembers(newMembers);
    };

    const handleConfirmLineup = async () => {
        const res = await teamService.changeGamePlayers(teamId, gameId, { players: members });
        if (res && res.code === 200) {
            window.elyte.success('update lineup successfully.');
            getGameTeamRoster();
        }
    };

    return (
        <ElBodyContainer>
            <ElTitle center>Team Line Up</ElTitle>
            <ElBody center>Game ID: {gameCode}</ElBody>
            {
                Array.isNullOrEmpty(members) && <ElBox center flex={1}>No Players</ElBox>
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
                            members.map((item, index) => <NormalPlayerItem key={item.athleteId + index} item={item} onPlayerChange={handlePlayerChange} />)
                        }
                    </Box>
                </>
            }
            <Box width={200} margin="auto">
                <ElButton mb={2} className="green" onClick={handleConfirmLineup}>
                    Confirm
                </ElButton>
            </Box>
        </ElBodyContainer>
    );
};

const NormalPlayerItem = ({ item, onPlayerChange }) => {
    const { athleteProfile } = useProfileRoute();
    const menuItems = [
        {
            text: 'S',
            onClick: () => onPlayerChange(item.athleteId, { isInGame: true }),
            hide: item.isInGame
        },
        {
            text: 'B',
            onClick: () => onPlayerChange(item.athleteId, { isInGame: false }),
            hide: !item.isInGame
        }
    ];

    return (
        <Box display='flex' mt={1}>
            <Box flex={1}>
                <Idiograph
                    to={item.isBlankAccount ? null : athleteProfile(item.athleteId)}
                    title={item.athleteName}
                    subtitle={item.subtitle}
                    centerTitle={item.blankAccountCode ? `ID: ${item.blankAccountCode}` : item.centerTitle}
                    imgurl={item?.avatarUrl} noDivider />
            </Box>
            <Box width={100} display='flex' justifyContent='center'>
                <ElMenuBtn items={menuItems}>
                    {item.isInGame && <Selected>S</Selected>}
                    {!item.isInGame && <Unselected>B</Unselected>}
                </ElMenuBtn>
            </Box>
            <Box width={40} display='flex' justifyContent='center'>
                {<Unselected>{item.position}</Unselected>}
            </Box>
        </Box>
    )
}

export default ChangeInGamePlayer;