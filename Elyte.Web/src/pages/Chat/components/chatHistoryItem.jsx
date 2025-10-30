import React from 'react';
import { Box, Grid, Avatar, Typography, Divider, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChatType } from 'enums';
import { useDateTime } from 'utils';

const ChatContentBox = styled(Typography)(({ theme }) => ({
    overflow: 'hidden',
    maxWidth: `calc(${theme.breakpoints.values.sm}px - ${theme.spacing(40)})`,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 14,
    marginRight: '16px',
    marginBottom: 2
}));

const ChatHistoryItem = ({ unreadMessageCount, name, chatType, imageUrl, date, content, onClick }) => {
    const { fromNow } = useDateTime();
    const buildBadgeVisible = () => {
        if (chatType !== ChatType.Team) {
            return true;
        }

        return !unreadMessageCount;
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 64 }} onClick={onClick}>
                <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Badge badgeContent={unreadMessageCount > 99 ? "99+" : unreadMessageCount} color="info" invisible={buildBadgeVisible()} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                        <Avatar src={imageUrl} />
                    </Badge>
                </Grid>
                <Grid container pl={1}>
                    <Grid item xs={12}>
                        <Box pt={1} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontWeight: 500, fontSize: 15, color: '#000000', whiteSpace: 'nowrap' }}>{name}</Typography>
                            <Typography sx={{ fontSize: 11, color: '#808A9E', marginRight: '16px' }}>{fromNow(date)}</Typography>
                        </Box>
                    </Grid>
                    <Grid mt={0.5} item xs={12}>
                        <ChatContentBox sx={{ color: unreadMessageCount ? '#000000' : '#808A9E', fontWeight: unreadMessageCount ? 600 : 400, }}>{content}</ChatContentBox>
                    </Grid>
                </Grid>
            </Box>
            <Divider />
        </>
    )
}

export default ChatHistoryItem;