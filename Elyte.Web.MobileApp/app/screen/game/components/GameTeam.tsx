import { ElAvatar, ElIcon, ElLinkBtn } from 'el/components';
import colors from 'el/config/colors';
import { Box, Pressable, Row, Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

type PropType = {
    url: any;
    name: any;
    rank?: any;
    score?: any;
    onArrowClick?: any;
    onAvatarClick?: any;
    onRowClick?: any;
    isWinner?: boolean;
};

const GameTeam: React.FC<PropType> = ({
    url,
    name,
    rank,
    score,
    onArrowClick,
    onAvatarClick,
    onRowClick,
    isWinner
}) => {
    return (
        <Pressable onPress={onRowClick}>
            <Box my={1} px={2} style={styles(isWinner).teamBox}>
                <Row>
                    <ElAvatar uri={url} size={36} />
                    <Box pl={1}>
                        <Text color={isWinner ? colors.white : colors.primary}>{name}</Text>
                        {rank && <ElLinkBtn fontSize={12}>{rank}</ElLinkBtn>}
                    </Box>
                </Row>
                <Row alignItems='center'>
                    {score !== undefined && <Text color={isWinner ? colors.white : colors.secondary}>{score}</Text>}
                    {onArrowClick && (
                        <Pressable onPress={onArrowClick} hitSlop={8}>
                            <ElIcon name="chevron-right" color={isWinner ? colors.white : colors.primary} size={30} />
                        </Pressable>
                    )}
                </Row>
            </Box>
        </Pressable>
    );
};

const styles = isWinner =>
    StyleSheet.create({
        teamBox: {
            backgroundColor: isWinner ? colors.secondary : '#F0F2F7',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            height: 56,
            justifyContent: 'space-between',
        },
    });

export default GameTeam;
