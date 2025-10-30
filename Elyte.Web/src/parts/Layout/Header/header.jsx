import React, { useState, useEffect } from 'react';
import { Toolbar, Box, Badge, AppBar, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { ElBox, ElSvgIcon, ElTitle } from 'components';
import { signalRService, userService, authService } from 'services';
import { useHistory } from 'react-router-dom';


const DrawerItem = styled(ListItemText)(({ theme }) => { return { color: '#1F345D', fontWeight: '500', fontSize: 18, marginLeft: theme.spacing(3) } });

const DrawerBottomItem = styled(Box)(({ theme }) => { return { bottom: 0, position: 'fixed', marginBottom: theme.spacing(8), width: '100%' } });

const useStyles = makeStyles(theme => ({
    bar: {
        background: theme.bgPrimary,
    },
    toolbar: theme.mixins.toolbar,
    actions: {
        alignItems: 'baseline',
        '& .el-svg-icon': {
            marginLeft: theme.spacing(2),
        },
    },
    toolbarWidth: {
        width: theme.breakpoints.values.sm,
        alignItems: 'center'
    },
    accountDrawerTitle: {
        textAlign: 'left',
        marginTop: theme.spacing(4),
        marginLeft: theme.spacing(5)
    }
}));

export default function Header () {
    const classes = useStyles();
    const history = useHistory();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);
    const [existUnreadItem, setExistUnreadItem] = useState({});

    const menuItems = [
        { text: 'My Profile', onClick: () => { setOpenDrawer(false); history.push('/myProfile'); } },
        { text: 'Sign In and Account Security', onClick: () => { setOpenDrawer(false); history.push('/changePassword'); } },
        { text: 'Payment History', onClick: () => { setOpenDrawer(false); history.push('/paymentHistory'); } }
    ];

    useEffect(() => {
        setIsHomePage(history.location.pathname === "/");
        if (!window.signalR) return;
        signalRService.registerCheckIsExistUnreadItemEvent((d) => {
            if (history.location.pathname !== "/chatBox") {
                setExistUnreadItem(d);
            }
        });

    });

    useEffect(() => {
        checkIsExistUnreadItem();
        signalRService.registerReceiveNotificationEvent(handleReceiveNotification);
        signalRService.registerClearNotificationEvent(handleClearNotification);
    }, []);

    const handleReceiveNotification = async () => {
        setExistUnreadItem(Object.assign({ ...existUnreadItem, ...{ existUnreadNotification: true } }));
    }

    const handleClearNotification = async () => {
        setExistUnreadItem(Object.assign({ ...existUnreadItem, ...{ existUnreadNotification: false } }));
    }

    const checkIsExistUnreadItem = async () => {
        const res = await userService.checkIsExistUnreadItem();
        if (res && res.code === 200) {
            setExistUnreadItem(res.value);
        }
    }

    const handleLogout = async () => {
        history.push('/login');
        await authService.logout();
    }

    return (
        <Box>
            <AppBar elevation={0} position="fixed" className={classes.bar}>
                <Toolbar sx={{ justifyContent: 'center' }}>
                    <Box display="flex" justifyContent="space-around" className={classes.toolbarWidth}>
                        {
                            isHomePage && <ElSvgIcon name="logo" onClick={() => history.push('/')} />
                        }
                        {
                            !isHomePage && <ElSvgIcon xSmall name="backArrow" onClick={() => { history.goBack() }} />
                        }
                        <span className="fillRemain"></span>
                        <Box className={classes.actions} display="flex">
                            <ElSvgIcon small name="search" onClick={() => history.push('/search')} />
                            <Badge color="secondary" variant="dot" invisible={!existUnreadItem.existUnreadNotification} onClick={() => history.push('/notifications')}>
                                <ElSvgIcon small name="notifications" />
                            </Badge>
                            <Badge color="secondary" variant="dot" invisible={!existUnreadItem.existUnreadMessage} onClick={() => history.push('/chats')}>
                                <ElSvgIcon small name="message" />
                            </Badge>
                            <ElSvgIcon small name="menu" onClick={() => setOpenDrawer(true)} />
                        </Box>
                    </Box>
                </Toolbar>
                <Drawer anchor={"right"} open={openDrawer} onClose={() => setOpenDrawer(false)}>
                    <Box sx={{ width: 300 }}>
                        <ElBox center className={classes.accountDrawerTitle}>
                            <ElTitle center={false}>Account Info</ElTitle>
                            <span className="fillRemain"></span>
                            <CloseIcon sx={{ marginRight: 3 }} onClick={() => setOpenDrawer(false)} />
                        </ElBox>
                        <Divider />
                        <List>
                            {
                                menuItems.map((item, index) => (
                                    <ListItem button key={index} sx={{ ":hover": { background: '#F0F2F7' } }}>
                                        <DrawerItem primary={item.text} onClick={item.onClick} />
                                    </ListItem>
                                ))
                            }
                        </List>
                        <DrawerBottomItem>
                            <Divider />
                            <ListItem button sx={{ ":hover": { background: '#F0F2F7' } }}>
                                <DrawerItem sx={{ marginLeft: 5, paddingTop: 3 }} onClick={handleLogout} primary={"Log Out"} />
                            </ListItem>
                        </DrawerBottomItem>
                    </Box>
                </Drawer>
            </AppBar>
            <Box className={classes.toolbar}></Box>
        </Box>
    );
}
