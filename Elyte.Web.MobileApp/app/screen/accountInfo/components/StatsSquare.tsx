import { LinearGradient } from 'expo-linear-gradient';
import { Box, Flex, Text, useDisclose, Pressable } from 'native-base';
import React, { useState, useEffect } from 'react';
import { ElActionsheet } from 'el/components';
import colors from 'el/config/colors';
import { useAuth } from 'el/utils';
import { isPad } from 'el/config/constants';

const Square = ({ type, value, size }) => {
    return (
        <Box
            style={{
                width: size,
                height: size,
            }}>
            <LinearGradient
                {...colors.linear}
                style={{
                    width: size - 4,
                    height: size - 4,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text fontSize={isPad ? 20 : 14} color={colors.white}>
                    {type}
                </Text>
                <Text fontSize={isPad ? 20 : 14} color={colors.white} bold>
                    {value}
                </Text>
            </LinearGradient>
        </Box>
    );
};

type PropType = {
    onSelectedItem?: any;
    onPress?: any;
    userId: string;
    stats: any;
};

const StatsSquare: React.FC<PropType> = ({ onSelectedItem, onPress, userId, stats }) => {
    const [width, setWidth] = useState(0);
    const { user } = useAuth();
    const smallSize = width / 4;
    const bigSize = width / 2;
    const [unshownStats, setUnshownStats] = useState<any>([]);
    const [mainStats, setMainStats] = useState<any>();
    const [defaultShowStats, setDefaultShowStats] = useState<any>([]);
    const isViewer = user.id !== userId;
    const { isOpen, onOpen, onClose } = useDisclose();

    useEffect(() => {
        setMainStats(stats.find(x => x.isMain));
        setDefaultShowStats(stats.filter(x => !x.isMain && x.isDisplay));
        setUnshownStats(
            stats
                .filter(x => !x.isMain && !x.isDisplay)
                .map(x => {
                    return {
                        label: `${x.fullStatsName} (${x.stats})`,
                        value: x.id,
                        fullStatsName: x.fullStatsName,
                    };
                }),
        );
    }, [stats]);

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
    };

    return (
        <>
            <Flex direction="row" justify="space-between" onLayout={onLayout}>
                <Flex direction="row" justify="space-between" wrap="wrap" style={{ width: width / 2 }}>
                    {defaultShowStats.map((x, index) =>
                        isViewer ? (
                            <Square
                                key={x.id}
                                size={smallSize}
                                type={x.friendlyStatsName}
                                value={x.stats}
                            />
                        ) : (
                            <Pressable key={x.id} onPress={() => {
                                onOpen && onOpen();
                                onPress && onPress(x.id, index + 1, false);
                            }}>
                                <Square size={smallSize} type={x.friendlyStatsName} value={x.stats} />
                            </Pressable>
                        ),
                    )}
                </Flex>

                {
                    isViewer ? (<Square size={bigSize} type={mainStats?.friendlyStatsName} value={mainStats?.stats} />) : (
                        <Pressable onPress={() => {
                            onOpen && onOpen();
                            onPress && onPress(mainStats.id, 1, true);
                        }}>
                            <Square size={bigSize} type={mainStats?.friendlyStatsName} value={mainStats?.stats} />
                        </Pressable>
                    )
                }
            </Flex>
            <ElActionsheet isOpen={isOpen} onClose={onClose} items={unshownStats} onSelectedItem={item => onSelectedItem && onSelectedItem(item)} ></ElActionsheet>
        </>
    );
};

export default StatsSquare;
