import React from 'react';
import { Row, Text, Center } from 'native-base';
import { gameService } from 'el/api';
import { ElButton, ElInput } from 'el/components';
import { useElToast, utils, useGameClock } from 'el/utils';
import { GameStatus } from 'el/enums';

const GameClock = ({ gameId, gameState, currentTime, period, isOfficiate }) => {
    const { clock, setHour, setMinute, setSecond }: any = useGameClock(currentTime);
    const { success, error } = useElToast();
    const [editState, setEditState] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { hour, minute, second } = clock;

    const handleSaveClick = async () => {
        const h = parseInt(hour);
        if (isNaN(h)) {
            return error('The hour is invalid.');
        }

        const m = parseInt(minute);
        if (isNaN(m) || m < 0 || m > 59) {
            return error('The minute\'s value must be between 0 and 59.');
        }

        const s = parseInt(second);
        if (isNaN(s) || s < 0 || s > 59) {
            return error('The second\'s value must be between 0 and 59.');
        }

        const clockTime = `${hour}:${minute}:${second}`;
        setLoading(true);
        const res: any = await gameService.changeGameClock(gameId, clockTime);
        setLoading(false);
        if (res && res.code === 200) {
            setEditState(false);
            success('Change game time successfully!');
        }
    }

    return (
        <Row mb={2} justifyContent="center">
            <Center>
                <Text fontSize={32} mr={1}>{utils.numberToOrdinal(period)}</Text>
            </Center>
            {
                !editState &&
                <Center>
                    <Text fontSize={32}>{currentTime}</Text>
                </Center>
            }
            {
                editState && gameState === GameStatus.Paused &&
                <>
                    <Center width={16}>
                        <ElInput width={18} keyboardType="number-pad" maxLength={2} defaultValue={hour} onChangeText={setHour} />
                    </Center>
                    <Center><Text fontSize={32}>:</Text></Center>
                    <Center width={16}>
                        <ElInput width={18} keyboardType="number-pad" maxLength={2} defaultValue={minute} onChangeText={setMinute} />
                    </Center>
                    <Center><Text fontSize={32}>:</Text></Center>
                    <Center width={16}>
                        <ElInput width={18} keyboardType="number-pad" maxLength={2} defaultValue={second} onChangeText={setSecond} />
                    </Center>
                    <Center>
                        <ElButton style={{ width: 60, height: 45, marginLeft: 5 }} loading={loading} onPress={handleSaveClick}>Save</ElButton>
                    </Center>
                </>
            }
            {
                !editState && isOfficiate && gameState === GameStatus.Paused &&
                <Center>
                    <ElButton style={{ width: 60, height: 45, marginLeft: 5 }} onPress={() => setEditState(true)}>Edit</ElButton>
                </Center>
            }
        </Row>
    );
}

export default GameClock;