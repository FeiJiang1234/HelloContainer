import React, { useState } from 'react';
import { Box, InputBase, ClickAwayListener } from '@mui/material';
import { styled } from '@mui/system';
import { ElForm, ElSvgIcon, ElAvatar, ElButton } from 'components';
import { useForm } from "react-hook-form";
import { postService, authService } from 'services';

const CommentBox = styled(Box)(({ theme }) => {
    return {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        background: '#F0F2F7',
        height: '50px',
        borderRadius: '50px',
        boxSizing: 'border-box',
        padding: theme.spacing(1),
        '& .MuiInputBase-root': {
            flex: '1',
            '& input': {
                textIndent: '15px',
            },
        },
    };
});


export default function LeaveComment ({ postId, commentId, onHideCommentBox, onCommentSuccess }) {
    const user = authService.getCurrentUser();
    const form = useForm();
    const { register } = form;
    const [buttonState, setButtonState] = useState(false);

    const handleCommentClick = async (formData) => {
        setButtonState(true);
        let data = { postId: postId, commentId: commentId, comment: formData.comment }
        const service = commentId ? postService.addCommentReply(data) : postService.addPostComment(data);
        const res = await service;
        if (res && res.code === 200) {
            onHideCommentBox(false);
            if (onCommentSuccess) onCommentSuccess();
        }
        setButtonState(false);
    }

    return (
        <ClickAwayListener onClickAway={() => onHideCommentBox(false)}>
            <CommentBox mt={1} mb={1} >
                <ElForm flexDirection="row" form={form} onSubmit={handleCommentClick}>
                    <ElAvatar src={user.pictureUrl} />
                    <InputBase autoFocus name="comment" placeholder="Leave a comment"  {...register("comment")} inputProps={{ maxLength: 150 }} />
                    <ElButton circle type="submit" className="green" loading={buttonState}>
                        <ElSvgIcon light xSmall name="infomation" />
                    </ElButton>
                </ElForm>
            </CommentBox>
        </ClickAwayListener>
    );
}
