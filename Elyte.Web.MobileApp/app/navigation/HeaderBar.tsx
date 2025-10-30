import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Search, Notification, Message, Menu } from 'el/svgs';
import defaultStyles from 'el/config/styles';
import { LinearGradient } from 'expo-linear-gradient';
import colors from 'el/config/colors';
import routes from 'el/navigation/routes';
import { Pressable, HStack } from 'native-base';
import { useLayoutOffset, useSignalR } from 'el/utils';
import { SignalrEvent } from 'el/enums';
import { isPad } from 'el/config/constants';

type PropType = {
    navigation: any;
    options?: any;
};

const HeaderBar: React.FC<PropType> = ({ navigation, options }) => {
    const { register, unregister } = useSignalR();
    const [existUnreadItem, setExistUnreadItem] = useState<any>({});
    const { layoutOffsetLeft, layoutOffsetRight } = useLayoutOffset();
    const menus = [
        {
            onPress: () => navigation.navigate(routes.Search),
            icon: <Search width={isPad ? 28 : 22} height={isPad ? 28 : 22} />,
        },
        {
            onPress: () => navigation.navigate(routes.Notification),
            icon: < Notification width={isPad ? 34 : 26} height={isPad ? 34 : 26} isShowDot={existUnreadItem.existUnreadNotification} />,
        },
        {
            onPress: () => navigation.navigate(routes.ChatUserList),
            icon: <Message width={isPad ? 36 : 27} height={isPad ? 36 : 27} isShowDot={existUnreadItem.existUnreadMessage} />,
        },
        {
            onPress: () => navigation.openDrawer(),
            icon: <Menu width={isPad ? 28 : 20} height={isPad ? 28 : 20} />
        },
    ];

    useEffect(() => {
        register(SignalrEvent.CheckIsExistUnreadItem, data => {
            setExistUnreadItem(data);
        });

        return () => unregister(SignalrEvent.CheckIsExistUnreadItem);
    }, []);

    const HeaderLeft = options.headerLeft;
    return (
        <LinearGradient {...colors.linear} style={[headerStyles(HeaderLeft).header, { paddingLeft: layoutOffsetLeft, paddingRight: layoutOffsetRight }]}>
            {HeaderLeft && <HeaderLeft />}
            <HStack>
                {
                    menus && menus.map((x, index) =>
                        <Pressable key={index} size={isPad ? 12 : 10} alignItems="center" justifyContent="center" onPress={x.onPress}>
                            {x.icon}
                        </Pressable>
                    )
                }
            </HStack>
        </LinearGradient>
    );
};

const headerStyles = headerLeft =>
    StyleSheet.create({
        header: {
            flexDirection: 'row',
            height: defaultStyles.headerHight,
            justifyContent: headerLeft ? 'space-between' : 'flex-end',
            alignItems: 'center'
        },
    });

export default HeaderBar;
