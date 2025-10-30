import { useLayoutOffset } from 'el/utils';
import { ScrollView } from 'native-base';
import React from 'react';

const ElScrollContainer = ({ children, style = {}, ...rest }) => {
    const { layoutOffsetLeft, layoutOffsetRight } = useLayoutOffset();

    return (
        <ScrollView style={[{ paddingLeft: layoutOffsetLeft + 16, paddingRight: layoutOffsetRight + 16 }, style]} {...rest}>
            {children}
        </ScrollView>
    );
};

export default ElScrollContainer;
