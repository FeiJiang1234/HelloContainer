import { Pressable, Image } from 'native-base';
import React from 'react';

type PropType = {
    uri?: string;
    size: number;
    style?: any;
    onPress?: Function;
    [rest: string]: any;
};


const ElAvatar: React.FC<PropType> = ({ uri, size, style, onPress, ...rest }) => {
    const avatar = uri ? { uri: uri } : require('../../assets/images/avatar.png');

    return (
        <Pressable style={{ height: size }} onPress={() => onPress && onPress()}>
            <Image
                source={avatar}
                style={[{ width: size, height: size, borderRadius: size / 2 }, { ...style }]}
                {...rest}
                alt="image"
            />
        </Pressable>
    );
};

export default ElAvatar;
