import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { ElLink, ElBox, ElAvatar } from 'components';
import LeaveComment from './leaveComment';
import { useProfileRoute } from 'utils';
import { Reply, Delete } from '@mui/icons-material';
import { postService } from 'services';

const UserName = styled(ElLink)(() => {
    return {
        fontWeight: 500,
        fontSize: 14,
        color: '#000000',
        lineBreak: 'anywhere',
        display: 'contents'
    };
});
const Avatar = styled(ElAvatar)(({ theme }) => {
    return {
        marginRight: theme.spacing(1),
    };
});

const CommentContent = styled(Typography)(({ theme }) => {
    return {
        fontWeight: 400,
        fontSize: 14,
        color: '#808A9E',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        lineBreak: 'anywhere',
        display: 'contents'
    };
});

const ReplyIcon = styled(Reply)(({ theme }) => {
    return {
        color: '#C0C5D0',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    };
});

const DeleteIcon = styled(Delete)(({ theme }) => {
    return {
        color: '#C0C5D0',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    };
});


export default function PostComment ({ postId, comment, onCommentSuccess, onDeleted }) {
    const [isShowCommentBox, setIsShowCommentBox] = useState(false);
    const [isShowActionBox, setIsShowActionBox] = useState(true);

    const handleHideCommentBox = () => {
        setIsShowCommentBox(false);
        setIsShowActionBox(true);
    }

    const handleReplyClick = () => {
        setIsShowCommentBox(true);
        setIsShowActionBox(false);
    }

    const handleDeleteComment = async () => {
        const res = await postService.deletePostComment(postId, comment.commentId);
        if (res && res.code === 200) {
            onDeleted && onDeleted();
        }
    }

    return (
        <Box>
            {!comment.replyerId && <CommentItem comment={comment} />}
            {comment.replyerId && <CommentReplyItem comment={comment} />}
            {
                isShowActionBox &&
                <ElBox sx={{ justifyContent: 'end' }}>
                    <ReplyIcon onClick={handleReplyClick} />
                    {comment.canDelete && <DeleteIcon onClick={handleDeleteComment} />}
                </ElBox>
            }
            {isShowCommentBox && <LeaveComment postId={postId} commentId={comment.commentId} onCommentSuccess={onCommentSuccess} onHideCommentBox={handleHideCommentBox} />}
        </Box>
    );
}

const CommentItem = ({ comment }) => {
    const { athleteProfile } = useProfileRoute();
    return (
        <ElBox sx={{ flexFlow: 'row' }}>
        <Avatar src={comment.commenterAvatar} small></Avatar>
            <UserName to={() => athleteProfile(comment.commenterId)}>{comment.commenterName}<> : </></UserName>
            <CommentContent>{comment.comment}</CommentContent>
        </ElBox>
    )
}

const CommentReplyItem = ({ comment }) => {
    const { athleteProfile } = useProfileRoute();
    return (
        <ElBox sx={{ flexFlow: 'row' }}>
            <Avatar src={comment.replyerAvatar} small ></Avatar>
            <UserName to={() => athleteProfile(comment.replyerId)}>{comment.replyerName}</UserName>
            <> </>@<> </>
            <UserName to={() => athleteProfile(comment.commenterId)}>{comment.commenterName}<> : </></UserName>
            <CommentContent>{comment.comment}</CommentContent>
        </ElBox >
    )
}
