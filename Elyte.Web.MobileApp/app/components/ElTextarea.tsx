import React from 'react';
import ElInput from './ElInput';

type PropType = {
    numberOfLines?: number;
    [rest: string]: any;
};

const ElTextarea: React.FC<PropType> = ({ numberOfLines = 5, ...rest }) => {
    return (
        <ElInput
            {...rest}
            multiline
            numberOfLines={numberOfLines}
            style={{ height: numberOfLines * 20, textAlignVertical: 'top' }}
        />
    );
};

export default ElTextarea;
