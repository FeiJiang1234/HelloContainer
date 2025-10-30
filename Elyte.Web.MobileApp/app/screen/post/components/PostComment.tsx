import React, { useState } from 'react';
import { CommentModel } from 'el/models/post/commentModel';
import { Box, Flex, Text, useDisclose } from 'native-base';
import { ElActionsheet, ElAvatar, ElBody, ElIcon } from 'el/components';
import colors from 'el/config/colors';
import LeaveComment from './LeaveComment';
import { postService } from 'el/api';
import { Pressable } from 'react-native';
import { ActionModel } from 'el/models/action/actionModel';
import { useProfileRoute } from 'el/utils';

type PropType = {
    item: CommentModel;
    onCommentSuccess: Function;
    onDeleted: Function;
};

const PostComment: React.FC<PropType> = ({ item, onCommentSuccess, onDeleted }) => {
    const [isShowCommentBox, setIsShowCommentBox] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();
    const { goToAthleteProfile } = useProfileRoute();
    const options: ActionModel[] = [
        {
            label: 'Delete',
            onPress: () => handleDeleteComment(),
        },
    ];

    const handleCommentClick = async comment => {
        let data = { postId: item.postId, commentId: item.commentId, comment: comment };

        const res: any = await postService.addCommentReply(data);
        if (res && res.code === 200) {
            if (onCommentSuccess) onCommentSuccess();
        }
    };

    const handleDeleteComment = async () => {
        const res: any = await postService.deletePostComment(item.postId, item.commentId);
        if (res && res.code === 200) {
            onDeleted && onDeleted();
        }
    };

    return (
        <Box>
            <Flex direction="row" align="center" mx={4} mb={1}>
                <ElAvatar size={28} uri={item.replyerId ? item.replyerAvatar : item.commenterAvatar}  onPress={() => goToAthleteProfile(item.replyerId ?? item.commenterId)}/>
                <Text fontSize={12} mx={1}>
                    {item.replyerId && <>
                        <Text onPress={() => goToAthleteProfile(item.replyerId)}>{item.replyerName}</Text>
                        <Text> @ </Text>
                    </> }
                    <Text onPress={() => goToAthleteProfile(item.commenterId)}>{item.commenterName}</Text>: <ElBody size="sm">{item.comment}</ElBody>
                </Text>
            </Flex>

            <Flex direction="row" justify="flex-end" mr={4} mb={1}>
                <Pressable onPress={() => setIsShowCommentBox(true)}>
                    <ElIcon name="reply" color={colors.disabled} testID="reply" />
                </Pressable>
                {
                    item.canDelete &&
                    <Pressable onPress={onOpen}>
                        <ElIcon name="trash-can-outline" color={colors.disabled} ml={2} />
                    </Pressable>
                }
            </Flex>
            {isShowCommentBox && <LeaveComment onSubmit={handleCommentClick} onHide={() => setIsShowCommentBox(false)} />}
            <ElActionsheet isOpen={isOpen} onClose={onClose} items={options} />
        </Box>
    );
};

export default PostComment;
