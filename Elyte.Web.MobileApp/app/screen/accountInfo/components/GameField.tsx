import { ElIcon } from 'el/components';
import colors from 'el/config/colors';
import { SportType } from 'el/enums';
import BasketballCourtSvg from 'el/svgs/basketballCourtSvg';
import SoccerFieldSvg from 'el/svgs/soccerFieldSvg';
import { Box, Flex, Pressable } from 'native-base';
import { useState } from 'react';

const MissShot = ({ ...rest }) => {
    return <ElIcon name="close" color={colors.danger} {...rest}></ElIcon>;
};

const Shot = ({ color, ...rest }) => {
    return <Box h={4} w={4} borderWidth={2} borderRadius={50} borderColor={color} {...rest}></Box>;
};

type PropType = {
    isMissShot?: any;
    onSelectPosition?: any;
    shots?: any;
    sportType?: any;
};

const GameField: React.FC<PropType> = ({ isMissShot, onSelectPosition, shots, sportType }) => {
    const [fieldWidth, setFieldWidth] = useState<number>(0);
    const [position, setPosition] = useState<any>({});

    const transformPosition = position => {
        return position.replace('calc(', '').replace(' - 10px)', '');
    };

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setFieldWidth(width);
    };

    const fieldColor = () => {
        if (sportType === SportType.Basketball) return '#FFBA93';
        return colors.secondary;
    };

    const shotColor = () => {
        if (sportType === SportType.Basketball) return colors.secondary;
        return '#FFFF00';
    };

    const setShotPosition = async e => {
        var xToParent = e.nativeEvent.locationX;
        var yToParent = e.nativeEvent.locationY;
        const xPercent = `${Math.round((xToParent / fieldWidth) * 10000) / 100.0}%`;
        const yPercent = `${Math.round((yToParent / (fieldWidth * 1.12)) * 10000) / 100.0}%`;
        const xPercentSaved = `calc(${xPercent} - 10px)`;
        const yPercentSaved = `calc(${yPercent} - 10px)`;

        setPosition({ x: xPercent, y: yPercent });
        await onSelectPosition({ x: xPercentSaved, y: yPercentSaved });
    };

    return (
        <>
            <Box p={2} bgColor={fieldColor()}>
                <Pressable onPress={e => setShotPosition(e)}>
                    <Box
                        onLayout={onLayout}
                        position="relative"
                        width="100%"
                        height={fieldWidth * 1.12}
                        bgColor={fieldColor()}
                    >
                        {sportType === SportType.Basketball && <BasketballCourtSvg />}
                        {sportType === SportType.Soccer && <SoccerFieldSvg />}
                        {position.x &&
                            position.y &&
                            (isMissShot ? (
                                <MissShot position="absolute" left={position.x} top={position.y} />
                            ) : (
                                <Shot
                                    position="absolute"
                                    left={position.x}
                                    top={position.y}
                                    color={shotColor()}
                                />
                            ))
                        }

                        {shots?.map(x =>
                            x.isMissShot ? (
                                <MissShot
                                    position="absolute"
                                    key={x.id}
                                    left={transformPosition(x.positionX)}
                                    top={transformPosition(x.positionY)}
                                />
                            ) : (
                                <Shot
                                    position="absolute"
                                    key={x.id}
                                    left={transformPosition(x.positionX)}
                                    top={transformPosition(x.positionY)}
                                    color={shotColor()}
                                />
                            ),
                        )}
                    </Box>
                </Pressable>
            </Box>
            <Flex direction="row" justify="flex-end" mt={1}>
                <Flex direction="row" align="center">
                    <Shot color={shotColor()} mr={1} /> Made Shot
                </Flex>
                <Flex direction="row" align="center" ml={2}>
                    <MissShot /> Missed Shot
                </Flex>
            </Flex>
        </>
    );
};

export default GameField;
