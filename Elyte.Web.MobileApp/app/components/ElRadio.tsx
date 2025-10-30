import React from 'react';
import colors from 'el/config/colors';
import { Radio, Pressable } from 'native-base';

type PropType = {
    value: any;
    onPress?: any;
    children?: any;
    [rest: string]: any;
};

const ElRadio: React.FC<PropType> = ({ value, onPress, children, ...rest }) => {
    return (
        <Pressable
            onPress={onPress}
            bgColor={colors.light}
            borderRadius={8}
            mb={2}
            px={4}
            h={16}
            width="100%"
            style={{ display: 'flex', justifyContent: 'center' }}
            {...rest}>
            <Radio value={value}>{children}</Radio>
        </Pressable>
    );
};

export default ElRadio;
