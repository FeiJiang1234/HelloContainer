import { teamService } from 'el/api';
import { ElContainer, ElIdiograph, ElFlatList, ElSearch, ElMenu } from 'el/components';
import { ActionModel } from 'el/models/action/actionModel';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast, useGoBack, useProfileRoute } from 'el/utils';
import { Box, Center, HStack } from 'native-base';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const InvitePlayersScreen = ({ navigation, route }) => {
    useGoBack();
    const { teamId } = route.params;
    const { goToAthleteProfile } = useProfileRoute();
    const [players, setPlayers] = useState<any[]>([]);
    const [keyword, setKeyword] = useState('');
    const dispatch = useDispatch();
    const tosat = useElToast();

    useEffect(() => {
        getPlayers();
    }, []);

    const getPlayers = async (userName = '') => {
        dispatch(PENDING());
        const res: any = await teamService.getAthleteToBeInvited(teamId, userName);
        if (res && res.code === 200 && res.value) {
            setPlayers(res.value);
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const handleInviteClick = async player => {
        dispatch(PENDING());
        const res: any = await teamService.invitePlayerJoinTeam(teamId, player.id);
        if (res && res.code == 200) {
            await getPlayers(keyword);
            tosat.success('Invitation sent successfully');
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const handleKeywordChange = inputKeyword => {
        setKeyword(inputKeyword);
        getPlayers(inputKeyword);
    };

    const getOptions = (player) => {
        const options: ActionModel[] = [{ label: 'Invite', onPress: () => handleInviteClick(player) }];
        return options;
    }

    return (
        <ElContainer h="100%">
            <ElSearch keyword={keyword} onKeywordChange={handleKeywordChange} />
            <Box flex={1}>
                <ElFlatList
                    data={players}
                    listEmptyText="No Open Players"
                    renderItem={({ item }) => (
                        <HStack>
                            <ElIdiograph
                                onPress={() => goToAthleteProfile(item.id)}
                                title={item.title}
                                subtitle={item.subtitle}
                                centerTitle={item.centerTitle}
                                imageUrl={item.avatarUrl}
                            />
                            <Center>
                                <ElMenu items={getOptions(item)}></ElMenu>
                            </Center>
                        </HStack>
                    )}
                />
            </Box>
        </ElContainer>
    );
};

export default InvitePlayersScreen;
