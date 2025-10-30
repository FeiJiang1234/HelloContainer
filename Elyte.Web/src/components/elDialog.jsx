import React from 'react';
import { Box, DialogTitle, DialogActions, Dialog, DialogContent, IconButton } from '@mui/material';
import { ElBody } from 'components';
import CloseIcon from '@mui/icons-material/Close';

function ElDialog ({ open, onClose, className, title, subTitle, children, actions, subgreen, subred, maxWidth, showCloseIcon = true, contentStyle={ } }) {
    return (
        <Dialog maxWidth={maxWidth ?? "sm"} className={className} open={open} onClose={onClose} fullWidth={true} >
            <DialogTitle sx={{ fontSize: 18, textAlign: 'center' }}>
                {title}
                {subTitle && <ElBody
                    sx={[
                        { textAlign: 'center', fontSize: 15 },
                        subgreen && ((theme) => ({
                            color: theme.palette.secondary.minor
                        })),
                        subred && (
                            { color: '#FF5B5B' }
                        )
                    ]}>{subTitle}</ElBody>
                }
                {showCloseIcon && onClose &&
                    <IconButton aria-label="close" sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                }
            </DialogTitle>
            <DialogContent sx={{ pb: 0, overflow: 'hidden', ...contentStyle }}>
                <Box sx={{ borderBottom: '1px solid #F0F2F7', overflow: 'hidden', pb: 1 }}>
                    {children}
                </Box>
            </DialogContent>
            {
                actions && <DialogActions
                    sx={{
                        pt: 2,
                        display: 'flex',
                        pl: 3,
                        pr: 3,
                        '& > *': {
                            flex: 1,
                        }
                    }}>
                    {actions}
                </DialogActions>
            }
        </Dialog>
    );
}

export default ElDialog;
