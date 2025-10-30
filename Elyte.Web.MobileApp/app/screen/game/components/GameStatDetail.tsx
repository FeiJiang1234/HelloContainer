import React from 'react';
import { ElAccordion, ElBody, ElIdiograph } from 'el/components';
import colors from 'el/config/colors';
import { Row } from 'native-base';

type PropType = {
    title: any;
    text: any;
    details?: any;
};

const GameStatDetail: React.FC<PropType> = ({ title, text, details }) => {
    return (
        <ElAccordion title={`${title}: ${text}`}>
            {details?.map(x => (
                <Row
                    key={x.id}
                    mt={2}
                    bgColor={colors.light}
                    p={2}
                    alignItems="center"
                    justifyContent="space-between"
                    borderRadius={8}>
                    <ElIdiograph title={x.athleteName} imageUrl={x.athletePictureUrl} />
                    <ElBody>{x.count}</ElBody>
                </Row>
            ))}
        </ElAccordion>
    );
};

export default GameStatDetail;
