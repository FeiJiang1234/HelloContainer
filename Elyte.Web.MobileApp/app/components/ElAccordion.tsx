import { Box, Divider, Pressable, Row } from 'native-base';
import React, { useState } from 'react';
import ElBody from './ElBody';
import ElIcon from './ElIcon';

type PropType = {
    title: any;
    children: any;
};

const ElAccordion: React.FC<PropType> = ({ title, children }) => {
    const [isShowDetails, setIsShowDetails] = useState(true);

    return (
        <Box mt={4}>
            <Row justifyContent="space-between">
                <ElBody>{title}</ElBody>
                {children !== undefined && children.length !== 0 && (
                    <Pressable size={6} alignItems="center" justifyContent="center" onPress={() => setIsShowDetails(!isShowDetails)}>
                        <ElIcon name={isShowDetails ? 'chevron-down' : 'chevron-up'} />
                    </Pressable>
                )}
            </Row>
            {isShowDetails && children}
            <Divider mt={4} />
        </Box>
    );
};

export default ElAccordion;
