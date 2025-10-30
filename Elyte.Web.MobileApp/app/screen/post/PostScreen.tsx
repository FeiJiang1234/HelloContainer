import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { postService } from 'el/api';
import { PageResult } from 'el/models/pageResult';
import { PostModel } from 'el/models/post/PostModel';
import { ResponseResult } from 'el/models/responseResult';
import PostCard from './components/PostCard';
import colors from 'el/config/colors';
import routes from 'el/navigation/routes';
import { LinearGradient } from 'expo-linear-gradient';
import { ElIcon, H5 } from 'el/components';
import { requestStatus } from 'el/models/requestStatus';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'el/store/store';
import { GET_POSTS, GET_LATEST_POSTS, CLEAR_POST, ADD_POSTS } from 'el/store/slices/postSlice';
import { useLayoutOffset } from 'el/utils';
import { Box } from 'native-base';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

export default function PostScreen({ navigation, route }) {
    const { refresh } = route?.params || false;
    const posts: any[] = useSelector((state: RootState) => state.posts);
    const dispatch = useDispatch();
    const [status, setStatus] = useState(requestStatus.IDLE);
    const [noMore, setNoMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [pageNumber, setPageNumber] = useState(2);
    const pageSize = 10;
    const { layoutOffsetLeft, layoutOffsetRight } = useLayoutOffset();

    useEffect(() => {
        getPosts();
    }, []);

    useEffect(() => {
        if (!refresh) return;

        navigation.setParams({
            refresh: false,
        });
        getLatestPosts();
    }, [refresh]);

    const getPosts = async () => {
        setStatus(requestStatus.PENDING);
        const res: ResponseResult<PageResult<PostModel>> = await postService.getPosts(1, pageSize);
        dispatch(CLEAR_POST());
        if (res && res.code === 200) {
            if (res.value.items.length < pageSize) setNoMore(true);
            dispatch(GET_POSTS(res.value.items));
            setPageNumber(2);
            setStatus(requestStatus.SUCCESS);
        } else {
            setStatus(requestStatus.ERROR);
        }
    };

    const getLatestPosts = async () => {
        setRefreshing(true);
        const res: ResponseResult<PostModel[]> = await postService.getLatestPosts(posts[0]?.createdDate);
        dispatch(GET_LATEST_POSTS(res.value));
        setRefreshing(false);
    };

    const reachEndRefresh = async () => {
        setStatus(requestStatus.PENDING);
        const res: ResponseResult<PageResult<PostModel>> = await postService.getPosts(
            pageNumber,
            pageSize,
        );
        if (res && res.code === 200) {
            setStatus(requestStatus.SUCCESS);
            setPageNumber(i => i + 1);
            dispatch(ADD_POSTS(res.value.items));
            if (res.value.items.length < 10) {
                setNoMore(true);
            }
        } else {
            setStatus(requestStatus.ERROR);
        }

    }

    return (
        <>
            <Box style={{
                paddingLeft: layoutOffsetLeft,
                paddingRight: layoutOffsetRight,
            }}>
                <KeyboardAwareFlatList
                    data={posts}
                    keyExtractor={p => p.postId}
                    refreshing={refreshing}
                    onRefresh={getPosts}
                    renderItem={({ item }) => <PostCard {...item} />}
                    onEndReached={reachEndRefresh}
                    ListFooterComponent={noMore ? null : <ActivityIndicator style={{ marginTop: 8, marginBottom: 8 }} />}
                    ListEmptyComponent={status === requestStatus.PENDING ? null : <H5 center style={{ marginTop: 16 }}>No Posts</H5>}
                />
            </Box>
            <LinearGradient {...colors.linear} style={[styles.fab, {
                right: layoutOffsetRight + 16,
            }]}>
                <Pressable onPress={() => navigation.navigate(routes.PostCreate)}>
                    <Box size={10} alignItems="center" justifyContent="center">
                        <ElIcon name="pencil" color={colors.white} size={26} />
                    </Box>
                </Pressable>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        width: 55,
        height: 55,
        position: 'absolute',
        bottom: 16,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
