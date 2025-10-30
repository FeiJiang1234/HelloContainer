import React from 'react';
import { Box } from '@mui/material';
import { ElSearchBox, ElBox } from 'components';
import GameRow from 'pageComponents/gameRow';

const OrganizationGameHistories = ({ games, onSearch }) => {
    return (
        <Box pb={10}>
            <ElSearchBox mt={2} mb={2} onChange={onSearch} />
            {Array.isNullOrEmpty(games) && <ElBox mt={2} center>No Games</ElBox>}
            {games.map(item => <GameRow key={item.id} game={item} />)}
        </Box>
    );
};

export default OrganizationGameHistories;
