import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Pressable, Row, Text } from 'native-base';
import ElAvatar from './ElAvatar';
import ElBody from './ElBody';
import colors from 'el/config/colors';

type PropType = {
    style?: any
    profileType?: string
    onPress?: any;
    id?: any
    title: any;
    imageUrl: string;
    subtitle?: any;
    centerTitle?: any;
    imageSize?: number;
    reverse?: boolean;
    [rest: string]: any;
};

const ElIdiograph: React.FC<PropType> = ({
    style,
    profileType,
    onPress,
    id,
    title,
    imageUrl,
    subtitle,
    centerTitle,
    reverse,
    imageSize = 36,
    ...rest
}) => {
    return (
        <Pressable flex={1} onPress={onPress} style={style}>
            <Row alignItems="center" {...rest}>
                {!reverse && <ElAvatar uri={imageUrl} size={imageSize} onPress={onPress} />}
                <Box style={styles(reverse).avatarInfo} flex={1} alignItems={reverse ? 'flex-end' : 'flex-start'}>
                    {typeof title === 'object' && title}
                    {typeof title === 'string' && <Text>{title}</Text>}
                    {centerTitle !== undefined && centerTitle !== '' && (
                        <ElBody size="sm" color={colors.secondary}>
                            {centerTitle}
                        </ElBody>
                    )}
                    {typeof subtitle === 'object' && subtitle}
                    {typeof subtitle === 'string' && <ElBody size="sm">{subtitle}</ElBody>}
                </Box>
                {reverse && <ElAvatar uri={imageUrl} size={imageSize} onPress={onPress} />}
            </Row>
        </Pressable>
    );
};

const styles = reverse =>
    StyleSheet.create({
        avatarInfo: {
            marginRight: reverse ? 4 : 0,
            marginLeft: reverse ? 0 : 4,
        },
    });

export default ElIdiograph;
