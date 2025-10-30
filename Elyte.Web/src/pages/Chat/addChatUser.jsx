import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { ElSearchBox, ElTitle } from 'components';
import { ChatMessageButton } from 'pageComponents';
import { authService, athleteService } from 'services';
import IdiographRow from 'parts/Commons/idiographRow';
import { useProfileRoute } from 'utils';
import { ChatType } from 'enums';


const AddChatUser = () => {
    const { athleteProfile } = useProfileRoute();
    const currentUser = authService.getCurrentUser();
    const [keyword, setKeyword] = useState("");
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        if (String.isNullOrEmpty(keyword)) {
            return setUserList([]);
        }
        getAllUsers();
    }, [keyword]);

    const getAllUsers = async () => {
        const res = await athleteService.getAthletes(keyword);
        if (res && res.code === 200 && !Array.isNullOrEmpty(res.value)) {
            setUserList(res.value.filter(x => x.id !== currentUser.id));
        }
    }

    return (
        <>
            <ElTitle center>Chat Users</ElTitle>
            <ElSearchBox mb={2} onChange={setKeyword} />
            <Box className='scroll-container' sx={{ maxHeight: (theme) => `calc(100vh - ${theme.spacing(34)})` }}>
                {
                    !Array.isNullOrEmpty(userList) && userList.map((item) =>
                        <IdiographRow key={item.id} title={item.title} subtitle={item.subtitle} centerTitle={item.centerTitle} imgurl={item.avatarUrl} to={athleteProfile(item.id)} >
                            <ChatMessageButton toUserId={item.id} chatType={ChatType.Personal} />
                        </IdiographRow>
                    )
                }
            </Box>
        </>
    );
};

export default AddChatUser;
