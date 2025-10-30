import React from 'react';
import { ElIdiograph, ElMenu } from 'el/components';
import { Center, Divider, HStack } from 'native-base';
import { teamService } from 'el/api';
import { ActionModel } from 'el/models/action/actionModel';
import { useProfileRoute } from 'el/utils';

const RequestItem = ({ item, onHandleSuccess }) => {
    const { goToAthleteProfile } = useProfileRoute();

    const options: ActionModel[] = [
        { label: 'Accept', onPress: () => handleAcceptClick() },
        { label: 'Decline', onPress: () => handleDeclineClick() },
        { label: 'Block User', onPress: () => handleBlockAthleteClick() },
    ];

    const handleDeclineClick = async () => {
        const res: any = await teamService.rejectAthleteJoinRequest(item.teamId, item.id);
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    };

    const handleBlockAthleteClick = async () => {
        const res: any = await teamService.blockAthleteToJoinTeam(
            item.teamId,
            item.id,
            item.athleteId,
        );
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    };

    const handleAcceptClick = async () => {
        const res: any = await teamService.approveAthleteJoinRequest(item.teamId, item.id);
        if (res && res.code === 200 && onHandleSuccess) onHandleSuccess();
    };
    return (
        <>
            <HStack space={5} justifyContent="center">
                <ElIdiograph
                    onPress={() => goToAthleteProfile(item.athleteId)}
                    title={item.name}
                    imageUrl={item.pictureUrl}
                    subtitle={item.status}
                    my={2}
                />
                <Center>
                    <ElMenu items={options} />
                </Center>
            </HStack>
            <Divider />
        </>
    );
};

export default RequestItem;
