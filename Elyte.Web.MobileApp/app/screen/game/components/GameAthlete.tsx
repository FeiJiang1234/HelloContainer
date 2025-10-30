import { ElAvatar } from 'el/components';
import colors from 'el/config/colors';
import { Flex, Text } from 'native-base';
import React from 'react';

const GameAthlete = ({ uri, name }) => {
    return (
        <Flex direction="row" bgColor={colors.light} mb={1} p={2} borderRadius={8}>
            <ElAvatar uri={uri} size={48} style={{ marginRight: 8 }} />
            <Text>{name}</Text>
        </Flex>
    );
};

export default GameAthlete;
