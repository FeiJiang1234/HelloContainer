import React from 'react';
import { ElIdiograph, ElList } from 'el/components';
import { Text } from 'native-base';
import { SportType } from 'el/enums';
import BasketballSvg from 'el/svgs/basketballSvg';
import SoccerSvg from 'el/svgs/soccerSvg';
import BaseballSvg from 'el/svgs/baseballSvg';
import { useAuth, useElToast, useProfileRoute } from 'el/utils';
import { teamService } from 'el/api';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useDispatch } from 'react-redux';
import { ActionModel } from 'el/models/action/actionModel';

type PropType = {
    teams: any;
    onHandleSuccess?: Function;
};

const TeamList: React.FC<PropType> = ({ teams, onHandleSuccess }) => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const toast = useElToast();
    const { goToTeamProfile } = useProfileRoute();

    const buildSportIcon = item => {
        if (item.sportType === SportType.Basketball) {
            return <BasketballSvg />;
        }
        if (item.sportType === SportType.Soccer) {
            return <SoccerSvg />;
        }
        if (item.sportType === SportType.Baseball) {
            return <BaseballSvg />;
        }

        return '';
    };

    const handleJoinTeamClick = async team => {
        dispatch(PENDING());
        const res: any = await teamService.athleteRequestToJoinTeam(user.id, team.id);
        if (res && res.code === 200) {
            onHandleSuccess && (await onHandleSuccess());
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
            toast.error(res.Message);
        }
    };

    const options: ActionModel[] = [
        {
            label: 'Join',
            onPress: item => handleJoinTeamClick(item),
            isHideByData: item => item.isJoin || item.isJoin === null,
        },
    ];

    return (
        <ElList
            data={teams}
            swipOptions={options}
            renderItem={({ item }) => (
                <>
                    <ElIdiograph
                        onPress={() => goToTeamProfile(item.id)}
                        title={
                            <Text>
                                {item.title}
                                &nbsp;
                                {buildSportIcon(item)}
                            </Text>
                        }
                        imageUrl={item.avatarUrl}
                        centerTitle={item.centerTitle}
                        subtitle={item.subtitle}
                        imageSize={48}
                    />
                    {item.isJoin === null && <Text>Requesting</Text>}
                </>
            )}
        />
    );
};

export default TeamList;
