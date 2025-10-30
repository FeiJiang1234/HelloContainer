import { useIsFocused } from '@react-navigation/native';
import { leagueService, teamService, tournamentService } from 'el/api';
import associationService from 'el/api/associationService';
import { ElContainer, ElIdiograph, ElFlatList, ElSearch, ElMenu } from 'el/components';
import { ActionModel } from 'el/models/action/actionModel';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast, useGoBack, useProfileRoute } from 'el/utils';
import { HStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const GetAllUsersToSelectAdminScreen = ({ route }) => {
    useGoBack();
    const { id, type } = route.params;
    const [userList, setUserList] = useState<any[]>([]);
    const [keyword, setKeyword] = useState('');
    const toast = useElToast();
    const dispatch = useDispatch();
    const { goToAthleteProfile } = useProfileRoute();

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            getUserList();
        }
    }, [isFocused]);

    const getAllUsers = async organizationType => {
        if (organizationType == 'Team') {
            return teamService.getAllTeamMembersNotTeamAdmin(id, keyword);
        }

        if (organizationType == 'Tournament') {
            return tournamentService.getAllUsersNotTournamentAdmin(id, keyword);
        }

        if (organizationType == 'League') {
            return leagueService.getAllUsersNotLeagueAdmin(id, keyword);
        }

        if (organizationType == 'Association') {
            return associationService.getAllUsersNotAssociationAdmin(id, keyword);
        }
    };

    useEffect(() => {
        getUserList();
    }, [keyword]);

    const getUserList = async () => {
        if (!type) {
            return;
        }
        const res: any = await getAllUsers(type);
        if (res && res.code === 200) {
            setUserList(res.value);
        }
    };

    const AssignService = async item => {
        if (type == 'Team') {
            return teamService.assignTeamAdmin(id, item.id);
        }
        if (type == 'Tournament') {
            return tournamentService.assignTournamentAdmin(id, item.id);
        }
        if (type == 'League') {
            return leagueService.assignLeagueAdmin(id, item.id);
        }
        if (type == 'Association') {
            return associationService.assignAssociationAdmin(id, item.id);
        }
    };

    const handleAssignClick = async item => {
        dispatch(PENDING());
        const res: any = await AssignService(item);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            toast.success('Assign admin successfully.');
            getUserList();
        } else {
            dispatch(ERROR());
        }
    };

    const getOptions = (item) => {
        const options: ActionModel[] = [{ label: 'Assign', onPress: () => handleAssignClick(item) }];
        return options;
    }

    return (
        <ElContainer h="100%">
            <ElSearch
                keyword={keyword}
                onKeywordChange={setKeyword}
                inputAccessoryViewID="hideAccessory"
            />
            <ElFlatList
                data={userList}
                listEmptyText="No Users"
                renderItem={({ item }) => (
                    <HStack space={5}>
                        <ElIdiograph
                            onPress={() => goToAthleteProfile(item.id)}
                            title={item.title}
                            subtitle={item.subtitle}
                            centerTitle={item.centerTitle}
                            imageUrl={item.avatarUrl}
                        />
                        <ElMenu items={getOptions(item)}></ElMenu>
                    </HStack>
                )}
            />
        </ElContainer>
    );
};

export default GetAllUsersToSelectAdminScreen;
