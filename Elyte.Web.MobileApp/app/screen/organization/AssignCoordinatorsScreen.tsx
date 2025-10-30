import React, { useEffect, useState } from 'react';
import { useElToast, useGoBack, useProfileRoute } from 'el/utils';
import { leagueService, tournamentService } from 'el/api';
import { ElContainer, ElFlatList, ElIdiograph, ElMenu, ElSearch } from 'el/components';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { ActionModel } from 'el/models/action/actionModel';
import { HStack } from 'native-base';

export default function AssignCoordinatorsScreen({ route }) {
    useGoBack();
    const { id, type } = route.params;
    const [userList, setUserList] = useState([]);
    const { goToAthleteProfile } = useProfileRoute();
    const [keyword, setKeyword] = useState('');
    const dispatch = useDispatch();
    const toast = useElToast();

    useEffect(() => {
        getUserList();
    }, [id]);

    const getAllUsers = async organizationType => {
        if (organizationType == 'Tournament') {
            return tournamentService.getAllUsersNotTournamentCoordinator(id, keyword);
        }
        if (organizationType == 'League') {
            return leagueService.getAllUsersNotLeagueCoordinator(id, keyword);
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

    const assignService = async item => {
        if (type === 'Tournament') {
            return tournamentService.assignTournamentCoordinator(id, item.id);
        }
        if (type === 'League') {
            return leagueService.assignLeagueCoordinator(id, item.id);
        }
    };

    const handleAssignClick = async item => {
        dispatch(PENDING());
        const res: any = await assignService(item);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            toast.success('Assign coordinator successfully.');
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
                    <HStack>
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
}
