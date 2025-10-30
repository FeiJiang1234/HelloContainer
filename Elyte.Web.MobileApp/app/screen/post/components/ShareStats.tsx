import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import { SportType, SportTypes } from 'el/enums';
import { athleteService, postService } from 'el/api';
import { useAuth } from 'el/utils';
import _ from 'lodash';
import { Box, Flex, Text } from 'native-base';
import { ElButton, ElCheckbox, ElErrorMessage, ElSelectEx, ElTextarea } from 'el/components';
import { LinearGradient } from 'expo-linear-gradient';
import colors from 'el/config/colors';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { ResponseResult } from 'el/models/responseResult';
import { PostModel } from 'el/models/post/PostModel';
import { RootState } from 'el/store/store';
import { GET_LATEST_POSTS } from 'el/store/slices/postSlice';
import * as Yup from 'yup';

const initValue = {
    sportType: '',
    statsType: '',
    details: ''
};

const validationSchema = Yup.object().shape({
    statsType: Yup.string().required().label('Stats Type'),
    details: Yup.string().required().max(250).label('Details'),
});


export default function ShareStats() {
    const posts = useSelector((state: RootState) => state.posts);
    const navigation: any = useNavigation();
    const [sportStats, setSportStats] = useState<any[]>([]);
    const [stats, setStats] = useState<any>();
    const [isOfficial, setIsOfficial] = useState<boolean>();
    const { user } = useAuth();
    const [selectedSport, setSelectedSport] = useState('');
    const dispatch = useDispatch();

    const { handleSubmit, setFieldValue, values, handleChange, errors, touched } = useFormik({
        initialValues: initValue,
        validationSchema: validationSchema,
        onSubmit: values => handleShareClick(values),
    });

    useEffect(() => {
        if (!selectedSport) return;

        getStats();
    }, [isOfficial, selectedSport]);


    const getStats = async () => {
        const res: any = await getStatsService();
        if (res && res.code === 200) {
            const allStats = res.value.map(x => ({ 
                id: x.id, 
                value: x.fullStatsName, 
                label: x.fullStatsName, 
                shortName: x.friendlyStatsName, 
                ...x 
            }));
            setSportStats(allStats);
            const currentStats = allStats.find(x => x.label === stats?.label);
            setStats(currentStats);
        }
    };

    const getStatsService = () => {
        if (selectedSport === SportType.Basketball) {
            return athleteService.getBasketballStats(user.id, isOfficial);
        }
        if (selectedSport === SportType.Soccer) {
            return athleteService.getSoccerStats(user.id, isOfficial);
        }

        return athleteService.getLowSportStats(user.id, isOfficial, selectedSport);
    };

    const handleShareClick = async data => {
        dispatch(PENDING());
        const res: any = await postService.createPostStats({
            ...data,
            statsType: stats?.shortName,
            statsValue: stats?.stats,
            isOfficial: isOfficial,
        });

        if (res && res.code === 200) {
            await getLatestPosts();
            navigation.goBack();
            dispatch(SUCCESS());
        } else {
            dispatch(ERROR());
        }
    };

    const getLatestPosts = async () => {
        const res: ResponseResult<PostModel[]> = await postService.getLatestPosts(posts[0]?.createdDate);
        dispatch(GET_LATEST_POSTS(res.value));
    };

    const handleSportTypeChanged = e => {
        const sportType = e.value;
        setFieldValue('sportType', sportType);
        setSelectedSport(sportType);
    };


    const handleStatsChanged = async e => {
        const statsType = e.label;
        setFieldValue('statsType', statsType);
        setStats(e);
    };

    return (
        <>
            <Flex direction="row" align="center">
                <Box flex={1}>
                    <ElSelectEx name="sportType" placeholder="Choose a Sport" items={SportTypes} onSelectedItem={handleSportTypeChanged} />
                    <ElSelectEx name="statsType" placeholder="Choose a Stat" items={sportStats} onSelectedItem={handleStatsChanged} />
                    <ElErrorMessage error={errors['statsType']} visible={true} />
                    <Box my={1}>
                        <ElCheckbox value={isOfficial} onValueChange={setIsOfficial}>Is Official</ElCheckbox>
                    </Box>
                </Box>
                {
                    stats?.shortName &&
                    <LinearGradient {...colors.linear} style={[styles.stats, isOfficial ? styles.officialStats : {}]}>
                        <Text color={colors.white} bold>
                            {stats?.shortName}
                        </Text>
                        <Text color={colors.white}>{stats?.stats}</Text>
                    </LinearGradient>
                }
            </Flex>
            <ElTextarea name="details" placeholder="Say something" maxLength={250} onChangeText={handleChange('details')} />
            <ElErrorMessage error={errors['details']} visible={touched['details']} />
            <ElButton onPress={handleSubmit}>Create a post</ElButton>
        </>
    );
}

const styles = StyleSheet.create({
    stats: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        borderRadius: 10,
        width: 120,
        height: 120,
        color: 'white',
    },
    officialStats: {
        borderWidth: 6,
        borderColor: colors.secondary,
    },
});
