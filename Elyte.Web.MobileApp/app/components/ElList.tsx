import { ActionModel } from 'el/models/action/actionModel';
import { Divider, Row, Text } from 'native-base';
import React from 'react';
import ElSwipeable from './ElSwipeable';

type PropType = {
    data: any;
    renderItem: any;
    keyExtractor?: any;
    listEmptyText?: any;
    listEmptyComponent?: any;
    swipOptions?: ActionModel[];
    [rest: string]: any;
};

const ElList: React.FC<PropType> = ({
    data,
    keyExtractor,
    listEmptyText,
    listEmptyComponent,
    renderItem,
    swipOptions,
    ...rest
}) => {
    const getOptions = item =>
        swipOptions?.filter(
            x => !x.isHide && (x.isHideByData === undefined || !x.isHideByData(item)),
        );

    return (
        <>
            {(!data || data.length === 0) &&
                (listEmptyText ? (
                    <Text mt={2} textAlign="center">
                        {listEmptyText}
                    </Text>
                ) : (
                    listEmptyComponent
                ))}

            {data &&
                data.map(item => (
                    <React.Fragment key={keyExtractor ? keyExtractor(item) : item.id}>
                        <ElSwipeable options={getOptions(item)} data={item}>
                            <Row my={2} alignItems="center" {...rest}>
                                {renderItem({ item })}
                            </Row>
                        </ElSwipeable>
                        <Divider />
                    </React.Fragment>
                ))}
        </>
    );
};

export default ElList;
