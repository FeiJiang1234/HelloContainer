import React, { useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardHeader, CardContent, CardMedia, CardActions, Collapse, Divider, MenuItem, Typography, Box } from '@mui/material';
import { ElSvgIcon, ElMenu, ElReadMore, ElLinkBtn, ElDialog, ElButton, ElBox, ElAvatar, ElBody } from 'components';
import { useDateTime, useProfileRoute } from 'utils';
import { Idiograph } from 'parts';
import { postService, authService } from 'services';
import LeaveComment from './leaveComment';
import PostComment from './postComment';
import { useHistory } from 'react-router';
import { SportType } from 'enums';

const useStyles = makeStyles(theme => {
    return {
        root: {
            '&.MuiPaper-elevation1': {
                boxShadow: 'none',
            },
        },
        options: {
            marginLeft: theme.spacing(1),
        },
        actions: {
            paddingLeft: theme.spacing(2),
            paddingTop: theme.spacing(2),
            paddingRight: theme.spacing(1),
            '& .el-svg-icon': {
                marginRight: theme.spacing(2),
            },
        },
        label: {
            fontSize: '11px', color: '#C0C5D0'
        },
        stats: ({ isOfficial }) => {
            return {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: theme.bgPrimary,
                marginRight: 8,
                borderRadius: 10,
                width: 80,
                height: 80,
                color: 'white',
                border: isOfficial ? `4px solid ${theme.palette.secondary.minor}` : '0px'
            }
        }
    };
});

function PostCard ({ post, onDeleted }) {
    const user = authService.getCurrentUser();
    const menuRef = useRef();
    const history = useHistory();
    const { athleteProfile } = useProfileRoute();
    const { fromNow } = useDateTime();
    const [isShowCommentBox, setIsShowCommentBox] = useState(false);
    const [commentList, setCommentList] = useState(post.comments || []);
    const [currentPost, setCurrentPost] = useState(post);
    const classes = useStyles({ isOfficial: currentPost.isOfficial });
    const [shareDialogState, setShareDialogState] = useState(false);
    const [likeList, setLikeList] = useState([]);

    const getPost = async () => {
        const res = await postService.gePost(currentPost.postId);
        if (res && res.code === 200) {
            setCurrentPost((x) => Object.assign({}, x, res.value));
            setCommentList(res.value.comments || []);
        }
    }

    const getPostComments = async () => {
        const res = await postService.getPostComments(currentPost.postId);
        if (res && res.code === 200) {
            setCommentList(res.value);
        }
    }

    const handleLikeClick = async () => {
        const service = currentPost.isLike ? postService.unlikePost(user.id, currentPost.postId) : postService.likePost(user.id, currentPost.postId);
        const res = await service;
        if (res && res.code === 200) {
            getPost();
        }
    };

    const handleFavoriteClick = async () => {
        const service = currentPost.isFavorite ? postService.unFavoritePost(user.id, currentPost.postId) : postService.favoritePost(user.id, currentPost.postId);
        const res = await service;
        if (res && res.code === 200) {
            getPost();
        }
    };

    const handleDeletePostClick = async () => {
        const res = await postService.removePost(currentPost.postId);
        if (res && res.code === 200 && onDeleted) {
            onDeleted();
        }
    };

    const handleReacAllCommentsClick = async () => {
        if (commentList.length <= 3 && currentPost.commentCounts <= 3) return;
        if (commentList.length <= 3 && currentPost.commentCounts > 3) {
            return getPostComments();
        }
        if (commentList.length > 3) {
            setCommentList(post.comments);
        }
    };

    const handleCommentSuccess = () => {
        getPost();
    }

    const handleShareClick = async () => {
        if (!currentPost.isShared) {
            return setShareDialogState(true);
        }

        const res = await postService.unsharePost(currentPost.postId);
        if (res && res.code === 200) {
            getPost();
        }
    }

    const handleYesShareClick = async () => {
        const res = await postService.sharePost(currentPost.postId);
        if (res && res.code === 200) {
            setShareDialogState(false);
            getPost();
        }
    }

    const handleDeleteCommentClick = () => {
        getPost();
    }

    const handleShowLikedPostUsersClick = async () => {
        const res = await postService.getPostLikes(currentPost.postId);
        if (res && res.code === 200) {
            setLikeList(res.value);
        }
    }

    const handleImageClick = () => {
        if (currentPost.postType === "Event") {
            history.push('/eventProfile', { params: currentPost.postId });
        }
    }

    const buildSportIcon = () => {
        if (currentPost.sportType === SportType.Basketball) {
            return <ElSvgIcon xSmall name="basketball" />;
        }
        if (currentPost.sportType === SportType.Soccer) {
            return <ElSvgIcon xSmall name="soccer" />;
        }
        if (currentPost.sportType === SportType.Baseball) {
            return <ElSvgIcon xSmall name="baseball" />;
        }

        return "";
    }

    return (
        <Card className={classes.root}>
            <CardHeader avatar={<Idiograph to={() => athleteProfile(currentPost.creatorId)} title={currentPost.creatorName} subtitle={fromNow(currentPost.createdDate)} imgurl={currentPost.creatorPictureUrl} />}
                action={
                    currentPost.isCreator &&
                    <>
                        <ElSvgIcon light small name="options" className={classes.options} onClick={e => menuRef.current.open(e.currentTarget)} />
                        <ElMenu ref={menuRef}>
                            <MenuItem onClick={handleDeletePostClick}>Delete</MenuItem>
                        </ElMenu>
                    </>
                }
            />
            <CardContent sx={{ paddingBottom: 1, paddingTop: 0 }}>
                <Box style={{ display: 'flex', flexDirection: 'row' }}>
                    {
                        currentPost.postType === "Stats" &&
                        <Box>
                            <Box className={classes.stats}>
                                <Typography>{currentPost.statsType}</Typography>
                                <Typography sx={{ fontWeight: 'bold' }}>{currentPost.statsValue}</Typography>
                            </Box>
                            <ElBody center style={{ fontSize: '10px', width: 80 }}>{currentPost.sportType}</ElBody>
                        </Box>  
                    }
                    <Box style={{ flex: 1 }}>
                        <ElReadMore text={currentPost.details} />
                    </Box>
                </Box>

            </CardContent>
            {currentPost.imageUrl && <CardMedia image={currentPost.imageUrl} component="img" onClick={handleImageClick} />}
            <CardActions className={classes.actions}>
                <ElSvgIcon like={currentPost.isLike} light={!currentPost.isLike} xSmall name="like" onClick={handleLikeClick} />
                <ElSvgIcon light xSmall name="comment" onClick={() => setIsShowCommentBox(true)} />
                <ElSvgIcon favorite={currentPost.isFavorite} light={!currentPost.isFavorite} xSmall name="collect" onClick={handleFavoriteClick} />
                <Typography className={classes.label}>{currentPost.likeCounts} likes</Typography>
                <Typography className={classes.label}>{currentPost.commentCounts} comments</Typography>
                <span className="fillRemain"></span>
                {currentPost.isCreator && <ElSvgIcon favorite={currentPost.isShared} light={!currentPost.isShared} xSmall name="share" onClick={handleShareClick} />}
            </CardActions>
            <ElBox ml={1} mb={1} sx={{ flexWrap: 'wrap' }}>
                {
                    !Array.isNullOrEmpty(currentPost.likes) &&
                    currentPost.likes.map(x => <ElAvatar className='hand' key={x.id} small src={x.userAvatar} onClick={handleShowLikedPostUsersClick} />)
                }
            </ElBox>
            {isShowCommentBox && <LeaveComment postId={currentPost.postId} onHideCommentBox={setIsShowCommentBox} onCommentSuccess={handleCommentSuccess} />}
            {
                currentPost.commentCounts > 0 &&
                <ElLinkBtn className='ml-16 mb-8 mt-8' small onClick={handleReacAllCommentsClick}>Read all comments ({currentPost.commentCounts})</ElLinkBtn>
            }
            {
                !Array.isNullOrEmpty(commentList) &&
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent sx={{ paddingBottom: 0, paddingTop: 1 }} >
                        {commentList.map(item => <PostComment key={item.commentId} postId={currentPost.postId} comment={item} onCommentSuccess={handleCommentSuccess} onDeleted={handleDeleteCommentClick} />)}
                    </CardContent>
                </Collapse>
            }
            <Divider className='mb-8' />
            {
                shareDialogState &&
                <ElDialog open={shareDialogState} onClose={() => setShareDialogState(false)} subgreen
                    title="Share Post"
                    subTitle="Are you sure to share this post? when you choose to share, everybody can see this post on his home page."
                    actions={
                        <>
                            <ElButton onClick={handleYesShareClick}>Yes</ElButton>
                            <ElButton onClick={() => setShareDialogState(false)}>No</ElButton>
                        </>
                    }>
                </ElDialog>
            }
            {
                !Array.isNullOrEmpty(likeList) &&
                <ElDialog open={!Array.isNullOrEmpty(likeList)} onClose={() => setLikeList([])}>
                    <Box sx={{ minHeight: (theme) => theme.spacing(20), maxHeight: (theme) => theme.spacing(50), overflow: 'auto', marginTop: (theme) => theme.spacing(2) }}>
                        {
                            likeList.map(x => <Box key={x.id} mb={1}>
                                <Idiograph to={null} subtitle={fromNow(x.createdDate)} title={x.likeUserName} imgurl={x.userAvatar} />
                            </Box>)
                        }
                    </Box>
                </ElDialog>
            }
        </Card>
    );
}

export default PostCard;
