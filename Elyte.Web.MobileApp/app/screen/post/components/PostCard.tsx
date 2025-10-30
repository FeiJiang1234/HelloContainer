import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image as RNImage } from 'react-native';
import { useAuth, useDateTime, useElToast, useProfileRoute } from 'el/utils';
import colors from 'el/config/colors';
import { CollectSvg, CommentSvg, LikeSvg, OptionsSvg, ShareSvg } from 'el/svgs';
import { ElActionsheet, ElAvatar, ElBody, ElConfirm, ElIdiograph, ElModal, ElScrollContainer } from 'el/components';
import { Box, Flex, Text, Pressable, Row, Divider, Image, useDisclose, VStack } from 'native-base';
import LeaveComment from './LeaveComment';
import { athleteService, postService } from 'el/api';
import { ResponseResult } from 'el/models/responseResult';
import { CommentModel } from 'el/models/post/commentModel';
import { PostModel } from 'el/models/post/PostModel';
import PostComment from './PostComment';
import { ActionModel } from 'el/models/action/actionModel';
import { useDispatch } from 'react-redux';
import { DELETE_POST } from 'el/store/slices/postSlice';
import { LinearGradient } from 'expo-linear-gradient';
import BasketballSvg from 'el/svgs/basketballSvg';
import { SportType } from 'el/enums';
import SoccerSvg from 'el/svgs/soccerSvg';
import ElReportDialog from 'el/components/ElReportDialog';

export default function PostCard(item: PostModel) {
    const { fromNow } = useDateTime();
    const options: ActionModel[] = [
        { label: 'Delete', onPress: () => handleDeletePostClick(), isHide: !item.isCreator },
        { label: 'Report', onPress: () => setIsShowReport(true), isHide: item.isCreator }
    ];
    const IMAGE_HEIGHT = 200;
    const IMAGE_MAX_WIDTH = 300;
    const [isShowCommentBox, setIsShowCommentBox] = useState(false);
    const [isCommentsCollapse, setIsCommentsCollapse] = useState(true);
    const [currentPost, setCurrentPost] = useState(item);
    const [commentList, setCommentList] = useState(item.comments || []);
    const [likeList, setLikeList] = useState([]);
    const { goToAthleteProfile, goToEventProfile } = useProfileRoute();
    const { user } = useAuth();
    const [shareDialogState, setShareDialogState] = useState(false);
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [isShowReport, setIsShowReport] = useState<boolean>(false);
    const [imageSize, setImageSize] = useState<any>({});
    const toast = useElToast();

    useEffect(() => {
        if (!currentPost.imageUrl) return;

        RNImage.getSize(currentPost.imageUrl, (originWidth, originHeight) => {
            const width = (IMAGE_HEIGHT / originHeight) * originWidth;
            if (width > IMAGE_MAX_WIDTH) {
                const height = (IMAGE_MAX_WIDTH / originWidth) * originHeight;
                setImageSize({ width: IMAGE_MAX_WIDTH, height: height });
            } else {
                setImageSize({ width: width, height: IMAGE_HEIGHT });
            }
        })
    }, [])

    const getPost = async () => {
        const res: any = await postService.gePost(currentPost.postId);
        if (res && res.code === 200) {
            setCurrentPost(x => Object.assign({}, x, res.value));
            setCommentList(res.value.comments || []);
        }
    };

    const handleCommentClick = async comment => {
        let data = { postId: item.postId, comment: comment };
        const res: any = await postService.addPostComment(data);
        if (res && res.code === 200) {
            getPost();
            await getPostComments();
            setIsShowCommentBox(false);
            setIsCommentsCollapse(false);
        }
    };

    const getPostComments = async () => {
        const res: ResponseResult<CommentModel[]> = await postService.getPostComments(item.postId);
        if (res && res.code === 200) {
            setCommentList(res.value);
        }
    };

    const handleLikeClick = async () => {
        const service = currentPost.isLike
            ? postService.unlikePost(user.id, currentPost.postId)
            : postService.likePost(user.id, currentPost.postId);
        const res: any = await service;
        if (res && res.code === 200) {
            getPost();
        }
    };

    const handleFavoriteClick = async () => {
        const service = currentPost.isFavorite
            ? postService.unFavoritePost(user.id, currentPost.postId)
            : postService.favoritePost(user.id, currentPost.postId);
        const res: any = await service;
        if (res && res.code === 200) {
            getPost();
        }
    };

    const handleShowLikedPostUsersClick = async () => {
        const res: any = await postService.getPostLikes(currentPost.postId);
        if (res && res.code === 200) {
            setLikeList(res.value);
        }
    };

    const handleReacAllCommentsClick = async () => {
        if (isCommentsCollapse) {
            setIsCommentsCollapse(false);
            await getPostComments();
        } else {
            setIsCommentsCollapse(true);
        }
    };

    const handleShareClick = async () => {
        if (!currentPost.isShared) {
            return setShareDialogState(true);
        }

        const res: any = await postService.unsharePost(currentPost.postId);
        if (res && res.code === 200) {
            getPost();
        }
    };

    const handleYesShareClick = async () => {
        const res: any = await postService.sharePost(currentPost.postId);
        if (res && res.code === 200) {
            setShareDialogState(false);
            getPost();
        }
    };

    const handleCommentSuccess = () => {
        getPost();
    };

    const handleDeleteCommentClick = () => {
        getPost();
    };

    const handleDeletePostClick = async () => {
        const res: any = await postService.removePost(currentPost.postId);
        if (res && res.code === 200) {
            dispatch(DELETE_POST(currentPost.postId));
        }
    };

    const handleImageClick = () => {
        if (currentPost.postType === "Event") {
            goToEventProfile(currentPost.postId);
        }
    }

    const handleReport = async values => {
        const res: any = await athleteService.complain(item.creatorId, values);
        if (res && res.code === 200) {
            setIsShowReport(false);
            toast.success('We have received your report, and we will deal with it within 24 hours. Thanks.');
        }
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <ElIdiograph
                        onPress={() => goToAthleteProfile(currentPost.creatorId)}
                        title={currentPost.creatorName}
                        imageUrl={currentPost.creatorPictureUrl}
                        subtitle={fromNow(currentPost.createdDate)}
                    />
                    {
                        <Pressable onPress={onOpen}>
                            <Box padding={2}>
                                <OptionsSvg style={{ width: 6, height: 23 }} />
                            </Box>
                        </Pressable>
                    }
                </View>
                <VStack px={4} space={2}>
                    <Row >
                        {
                            currentPost.postType === "Stats" &&
                            <Box>
                                <LinearGradient {...colors.linear}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 10,
                                        marginBottom: 4,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: item.isOfficial ? 4 : 0,
                                        borderColor: colors.secondary,
                                        marginRight: 4
                                    }}>
                                    <Text color={colors.white} bold>{item.statsType}</Text>
                                    <Text color={colors.white}>{item.statsValue}</Text>
                                </LinearGradient>
                                <ElBody size="sm" style={{ textAlign: 'center',  width: 80 }}>{item.sportType}</ElBody>
                            </Box>
                        }
                        <Box style={{ flex: 1 }}>{currentPost.details}</Box>
                    </Row>
                    {
                        currentPost.imageUrl &&
                        <Pressable onPress={handleImageClick}>
                            <Image
                                alt="image"
                                resizeMode="contain"
                                height={imageSize.height}
                                width={imageSize.width}
                                source={{ uri: currentPost.imageUrl }}
                            />
                        </Pressable>
                    }
                </VStack>
                <Flex direction="row" px={4} mt={4}>
                    <Flex direction="row" flex={1}>
                        <Pressable onPress={handleLikeClick}>
                            <LikeSvg style={{ width: 21, height: 17 }} stroke={currentPost.isLike ? colors.danger : undefined} />
                        </Pressable>

                        <Pressable onPress={() => setIsShowCommentBox(!isShowCommentBox)}>
                            <CommentSvg style={{ width: 20, height: 20, marginLeft: 16 }} />
                        </Pressable>

                        <Pressable onPress={handleFavoriteClick}>
                            <CollectSvg style={{ width: 15, height: 20, marginLeft: 16 }} stroke={currentPost.isFavorite ? colors.secondary : undefined} />
                        </Pressable>

                        <Text style={{ fontSize: 12, color: colors.medium, marginLeft: 8 }}>
                            {currentPost.likeCounts} likes {currentPost.commentCounts} comments
                        </Text>
                    </Flex>
                    {
                        currentPost.isCreator &&
                        <Pressable onPress={handleShareClick}>
                            <ShareSvg stroke={currentPost.isShared ? colors.secondary : undefined} style={{ width: 21, height: 17 }} />
                        </Pressable>
                    }
                </Flex>
                <Pressable onPress={handleShowLikedPostUsersClick}>
                    <Row px={4} mt={2}>
                        {currentPost?.likes?.map((x: any) => <ElAvatar key={x.id} uri={x.userAvatar} size={24} />)}
                    </Row>
                </Pressable>
                {isShowCommentBox && <LeaveComment onSubmit={handleCommentClick} onHide={() => setIsShowCommentBox(false)} />}
                {
                    currentPost.commentCounts > 0 &&
                    <Pressable onPress={handleReacAllCommentsClick}>
                        <Text color={colors.secondary} ml={4} fontSize={12} my={2}>
                            Read all comments ({currentPost.commentCounts})
                        </Text>
                    </Pressable>
                }
                {isCommentsCollapse
                    ? commentList
                        ?.slice(0, 3)
                        .map(c => (
                            <PostComment
                                key={c.commentId}
                                onCommentSuccess={handleCommentSuccess}
                                onDeleted={handleDeleteCommentClick}
                                item={c}
                            />
                        ))
                    : commentList?.map(c => (
                        <PostComment
                            key={c.commentId}
                            onCommentSuccess={handleCommentSuccess}
                            onDeleted={handleDeleteCommentClick}
                            item={c}
                        />
                    ))}

                {
                    likeList.length !== 0 &&
                    <ElModal visible={likeList.length !== 0} onClose={() => setLikeList([])}>
                        <ElScrollContainer>
                            {
                                likeList.map((x: any) =>
                                    <Box key={x.id}>
                                        <ElIdiograph title={x.likeUserName} subtitle={fromNow(x.createdDate)} imageUrl={x.userAvatar} />
                                        <Divider my={2} />
                                    </Box>
                                )
                            }
                        </ElScrollContainer>
                    </ElModal>
                }
                {
                    shareDialogState &&
                    <ElConfirm
                        visible={shareDialogState}
                        title="Share Post"
                        message="Are you sure to share this post? when you choose to share, everybody can see this post on his home page."
                        onConfirm={handleYesShareClick}
                        onCancel={() => setShareDialogState(false)}
                    />
                }
            </View>
            <ElActionsheet isOpen={isOpen} onClose={onClose} items={options} />
            {isShowReport && <ElReportDialog isVisible={isShowReport} onCancel={() => setIsShowReport(false)} onSave={handleReport} />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomColor: colors.light,
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 8,
        marginBottom: 8,
    },
    idiograph: {
        flexDirection: 'row',
    },
});
