import React from 'react';
import { ElSearch } from 'el/components';
import { Box, Divider, Text } from 'native-base';
import GameRow from './GameRow';

const OrganizationGameHistories = ({ keyword, games, onSearch, inputAccessoryViewID }) => {
    return (
        <Box pb={10}>
            <ElSearch
                keyword={keyword}
                onKeywordChange={onSearch}
                inputAccessoryViewID={inputAccessoryViewID}
            />
            {games.length === 0 && (
                <Text mt={2} textAlign="center">
                    No Games
                </Text>
            )}
            {games.map(item => (
                <React.Fragment key={item.id}>
                    <GameRow game={item} />
                    <Divider />
                </React.Fragment>
            ))}
        </Box>
    );
};

export default OrganizationGameHistories;
