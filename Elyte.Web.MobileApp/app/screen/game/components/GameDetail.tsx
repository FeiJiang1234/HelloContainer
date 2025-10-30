import { ElBody } from 'el/components';
import { Box, Column, Divider, Row } from 'native-base';
import React from 'react';

type PropType = {
    direction?: 'column' | 'row';
    title?: any;
    text?: any;
    noDivider?: any;
    details?: any;
};

const GameDetail: React.FC<PropType> = ({ direction = 'column', title, text, noDivider }) => {
    return (
        <Box>
            {direction === 'column' &&   
                <Column py={4} justifyContent="center">
                    <ElBody>{title}</ElBody>
                    {(!!text || text === 0 ) && <ElBody mt={1}>{text}</ElBody>}
                </Column>
            }
            {direction === 'row' &&   
                <Row py={4} justifyContent='space-between' alignItems='center'>
                    <ElBody>{title}</ElBody>
                    {(!!text || text === 0 ) && <ElBody mt={1}>{text}</ElBody>}
                </Row>
            }
          
            {!noDivider && <Divider />}
        </Box>
    );
};

export default GameDetail;
