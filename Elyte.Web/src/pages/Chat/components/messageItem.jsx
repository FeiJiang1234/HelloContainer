import React from 'react';
import { Box, Divider, Typography, Grid, CircularProgress, Avatar } from '@mui/material';
import { ElSvgIcon } from 'components';
import { useDateTime } from 'utils';

const MessageItem = ({ message }) => {
    const { fromNow } = useDateTime();
    return <Box sx={{ minHeight: '50px', flexGrow: 1, marginBottom: 2 }}>
        <Grid container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', }}>
            <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                {!message.isSender && <Avatar src={message.senderProfileImage} />}
                {message.isSender && message.sendFailed && <CircularProgress color="inherit" size={20} />}
            </Grid>
            <Grid item xs={8} sx={{ background: message.isSender ? 'linear-gradient(179.38deg, #1F345D 16.7%, #080E1B 115.63%)' : "#F5F5F5", borderRadius: '15px', paddingLeft: 2 }}>
                <Grid container sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Grid item xs={12}>
                        <Box sx={{ height: '50px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Typography sx={{ fontWeight: 500, fontSize: 15, color: message.isSender ? '#FFFFFF' : '#000000' }}>{message.senderName}</Typography>
                            <Typography sx={{ fontSize: 11, color: '#808A9E', marginRight: '16px' }}>{fromNow(message.createdDate)}</Typography>
                        </Box>
                    </Grid>
                    <Divider sx={{ marginBottom: 1, opacity: '20%', borderColor: message.isSender ? '#808A9E' : '#BFBFBF', width: '95%' }}></Divider>
                    <Grid item xs={12}>
                        <Typography sx={{ wordBreak: 'break-all', fontSize: 14, color: message.isSender ? '#FFFFFF' : '#808A9E', marginRight: '16px', marginBottom: 2 }}>{message.content}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                {message.isSender && <Avatar src={message.senderProfileImage} />}
                {!message.isSender && <ElSvgIcon dark xSmall name="forwardArrow" />}
            </Grid>
        </Grid>
    </Box>;
}

export default MessageItem;

