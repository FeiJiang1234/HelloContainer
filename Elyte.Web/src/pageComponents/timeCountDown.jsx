import React, { useEffect } from 'react';
import { useCountDown } from 'utils';

const TimeCountDown = ({ leftMilliseconds }) => {
    const { timeLeft, setLeftMilliseconds } = useCountDown({ isTimerStop: false });
    useEffect(() => {
        setLeftMilliseconds(leftMilliseconds);
    }, [leftMilliseconds]);

    return <>{timeLeft}</>;
};

export default TimeCountDown;
