import colors from 'el/config/colors';
import { Text } from 'native-base';
import React from 'react';

type PropType = {
    children: any;
    size?: 'md' | 'sm' | 'lg';
    color?: string;
    [rest: string]: any;
};

const ElBody: React.FC<PropType> = ({ children, size = 'md', ...rest }) => {
    let fontSize = 14;
    if (size === 'sm') fontSize = 12;
    if (size === 'lg') fontSize = 16;

    return (
        <Text fontSize={fontSize} color={colors.medium} {...rest}>
            {children}
        </Text>
    );
};

export default ElBody;
