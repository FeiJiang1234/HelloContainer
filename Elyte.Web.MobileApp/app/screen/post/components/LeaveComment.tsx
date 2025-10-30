import React, { useState } from 'react';
import { Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from 'el/utils';
import colors from 'el/config/colors';
import { ElAvatar } from 'el/components';
import { Flex, Input } from 'native-base';
import ForumSvg from 'el/svgs/forumSvg';

export default function LeaveComment({ onSubmit, onHide }) {
    const { user } = useAuth();
    const [comment, setComment] = useState<string>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!comment) return;

        setLoading(true);
        await onSubmit(comment);
        onHide && onHide();
        setLoading(false);
    };

    const handleBlur = () => {
        if (!comment) onHide && onHide();
    };

    return (
        <Flex direction="row" mx={4} my={1} p={1} borderRadius={25} bgColor={colors.light}>
            <ElAvatar uri={user.pictureUrl} size={40} />
            <Input
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                flex={1}
                mx={2}
                borderWidth={0}
                bgColor={colors.light}
                onBlur={handleBlur}
                onChangeText={setComment}
                enablesReturnKeyAutomatically
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
                placeholder='Leave a comment'
            />
            <Flex
                justify="center"
                align="center"
                h={10}
                w={10}
                bgColor={colors.secondary}
                opacity={loading ? 0.5 : 1}
                borderRadius={20}>
                <Pressable onPress={handleSubmit} disabled={loading}>
                    <ForumSvg />
                    {loading && (
                        <ActivityIndicator
                            color={colors.primary}
                            style={{ position: 'absolute' }}
                        />
                    )}
                </Pressable>
            </Flex>
        </Flex>
    );
}
