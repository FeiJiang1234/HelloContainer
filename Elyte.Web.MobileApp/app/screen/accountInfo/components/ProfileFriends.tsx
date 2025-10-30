import { athleteService } from 'el/api';
import { ElBody, ElConfirm, ElIdiograph, ElList, ElMenu, ElSearch } from 'el/components';
import { ActionModel } from 'el/models/action/actionModel';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { useElToast, useProfileRoute } from 'el/utils';
import { HStack } from 'native-base';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function ProfileFriends({ userId, viewedAthleteId }) {
    const [fans, setFans] = useState([]);
    const [fanOf, setFanOf] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [openConfirmDiolog, setOpenConfirmDiolog] = useState(false);
    const [targetAthleteId, setTargetAthleteId] = useState();
    const dispatch = useDispatch();
    const toast = useElToast();
    const { goToAthleteProfile } = useProfileRoute();

    useEffect(() => {
        getFollowing();
    }, [userId, keyword]);

    const getFansOptions = (item) => {
        const fansOptions: ActionModel[] = [
            {
                label: 'Block',
                onPress: () => handleBlock(item.id),
            },
        ];
        return fansOptions;
    }

    const getFanOfOptions = (item) => {
        const fanOfOptions: ActionModel[] = [
            ...getFansOptions(item),
            {
                label: 'Unfollow',
                onPress: () => handleUnfollow(item.id),
            },
        ];
        return fanOfOptions;
    }

    const getFollowing = async () => {
        dispatch(PENDING());
        const res: any = await athleteService.getFollowing(userId, keyword);
        if (res && res.code === 200 && res.value) {
            dispatch(SUCCESS());
            setFans(res.value.filter(x => x.followingType === 'Fans'));
            setFanOf(res.value.filter(x => x.followingType === 'FanOf'));
        } else {
            dispatch(ERROR());
        }
    };

    const handleBlock = id => {
        setOpenConfirmDiolog(true);
        setTargetAthleteId(id);
    };

    const handleUnfollow = async id => {
        dispatch(PENDING());
        const res: any = await athleteService.unfollowUser(userId, id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            toast.success('Unfollow athlete successfully');
            getFollowing();
        } else {
            dispatch(ERROR());
        }
    };

    const handleYesToBlockClick = async () => {
        const res: any = await athleteService.blockAthlete(userId, targetAthleteId);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            toast.success('Block athlete successfully');
            setOpenConfirmDiolog(false);
            getFollowing();
        } else {
            dispatch(ERROR());
        }
    };

    return (
        <>
            <ElSearch keyword={keyword} onKeywordChange={setKeyword} />
            <ElBody>My Fans</ElBody>
            <ElList
                data={fans}
                listEmptyText="No Fan"
                renderItem={({ item }) => (
                    <HStack space={5}>
                        <ElIdiograph
                            onPress={() => goToAthleteProfile(item.id)}
                            title={item.title}
                            subtitle={item.subtitle}
                            centerTitle={item.centerTitle}
                            imageUrl={item.avatarUrl}
                        />
                        {viewedAthleteId == userId && <ElMenu items={getFansOptions(item)}></ElMenu>}
                    </HStack>
                )}
            />

            <ElBody mt={2}>Fan Of</ElBody>
            <ElList
                data={fanOf}
                listEmptyText="No Following"
                renderItem={({ item }) => (
                    <HStack space={5}>
                        <ElIdiograph
                            onPress={() => goToAthleteProfile(item.id)}
                            title={item.title}
                            subtitle={item.subtitle}
                            centerTitle={item.centerTitle}
                            imageUrl={item.avatarUrl}
                        />
                        {viewedAthleteId == userId && <ElMenu items={getFanOfOptions(item)}></ElMenu>}
                    </HStack>
                )}
            />

            {openConfirmDiolog && (
                <ElConfirm
                    visible={openConfirmDiolog}
                    title="Block athlete"
                    message="Are you sure you want to block this athlete?"
                    onConfirm={handleYesToBlockClick}
                    onCancel={() => setOpenConfirmDiolog(false)}
                />
            )}
        </>
    );
}
