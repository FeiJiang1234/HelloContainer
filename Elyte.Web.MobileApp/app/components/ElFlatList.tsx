import { ActionModel } from 'el/models/action/actionModel';
import { FlatList, Row, Text } from 'native-base';
import React from 'react';
import ElListItemSeparator from './ElListItemSeparator';
import ElSwipeable from './ElSwipeable';

type PropType = {
    data: any;
    renderItem: any;
    keyExtractor?: any;
    listEmptyText?: any;
    listEmptyComponent?: any;
    listFooterComponent?: any;
    onEndReached?: any;
    swipOptions?: ActionModel[];
    [rest: string]: any;
};

const ElFlatList: React.FC<PropType> = ({
    data,
    keyExtractor,
    listEmptyText,
    listEmptyComponent,
    listFooterComponent,
    onEndReached,
    renderItem,
    swipOptions,
    ...rest
}) => {
    const getOptions = item =>
        swipOptions?.filter(
            x => !x.isHide && (x.isHideByData === undefined || !x.isHideByData(item)),
        );

    return (
        <FlatList
            ListEmptyComponent={
                listEmptyText ? (
                    <Text mt={2} textAlign="center">
                        {listEmptyText}
                    </Text>
                ) : (
                    listEmptyComponent
                )
            }
            data={data}
            onEndReached={onEndReached}
            ListFooterComponent={listFooterComponent}
            keyExtractor={
                keyExtractor ? (item: any) => keyExtractor(item) : (item: any) => item.id.toString()
            }
            ItemSeparatorComponent={ElListItemSeparator}
            renderItem={({ item }) => (
                <ElSwipeable options={getOptions(item)} data={item}>
                    <Row my={2} alignItems="center" {...rest}>
                        {renderItem({ item })}
                    </Row>
                </ElSwipeable>
            )}
        />
    );
};

export default ElFlatList;
