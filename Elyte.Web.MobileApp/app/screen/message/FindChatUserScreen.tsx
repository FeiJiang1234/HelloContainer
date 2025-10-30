import React, { useEffect, useState } from 'react';
import { useAuth, useGoBack, useProfileRoute, utils } from 'el/utils';
import { ElChatMessageButton, ElContainer, ElIdiograph, ElFlatList, ElSearch, ElTitle } from 'el/components';
import { ChatType } from 'el/enums';
import { athleteService } from 'el/api';

export default function FindChatUserScreen() {
    useGoBack();
    const { user } = useAuth();
    const [keyword, setKeyword] = useState("");
    const [userList, setUserList] = useState<Array<any>>();
    const { goToAthleteProfile } = useProfileRoute();

    useEffect(() => {
        if (!keyword) {
            return setUserList([]);
        }
        getAllUsers();
    }, [keyword]);

    const getAllUsers = async () => {
        const res: any = await athleteService.getAthletes(keyword);
        if (res && res.code === 200 && !utils.isArrayNullOrEmpty(res.value)) {
            setUserList(res.value.filter(x => x.id !== user.id));
        }
    }

    return <ElContainer h='100%'>
        <ElTitle>Chat Users</ElTitle>
        <ElSearch onKeywordChange={setKeyword} />
        <ElFlatList
            data={userList}
            renderItem={({ item }) => (
                <>
                    <ElIdiograph
                        onPress={() => goToAthleteProfile(item.id)}
                        title={item.title}
                        imageUrl={item.avatarUrl}
                        centerTitle={item.centerTitle}
                        subtitle={item.subtitle}
                        imageSize={48}
                    />
                    <ElChatMessageButton toUserId={item.id} chatType={ChatType.Personal}></ElChatMessageButton>
                </>
            )}
        />
    </ElContainer>;
}
