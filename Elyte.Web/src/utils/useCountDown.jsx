import { useState, useEffect } from 'react';

export default function useCountDown({ isTimerStop }) {
    const [timeLeft, setTimeLeft] = useState();
    const [endTime, setEndTime] = useState();
    const [leftMilliseconds, setLeftMilliseconds] = useState();

    const setLeftTime = () => {
        if (new Date().getTime() > endTime) {
            setTimeLeft(`00:00:00`);
        } else {
            setTimeLeft(format(endTime - new Date().getTime()));
        }
    };

    useEffect(() => {
        if (leftMilliseconds === undefined) return;
        setTimeLeft(format(leftMilliseconds));

        const startIntervalOffset = 100;
        setEndTime(new Date().getTime() + leftMilliseconds + startIntervalOffset);
    }, [leftMilliseconds]);


    useEffect(() => {
        const startIntervalOffset = 100;
        setEndTime(new Date().getTime() + leftMilliseconds + startIntervalOffset);
    }, [isTimerStop]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isTimerStop || new Date().getTime() > endTime) {
                clearInterval(interval);
                return;
            }

            setLeftTime();
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    const format = timeSpan => {
        if (!timeSpan) return '00:00:00';

        const hours = Math.floor((timeSpan % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeSpan % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeSpan % (1000 * 60)) / 1000);
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    };

    const padZero = value => String(value).padStart(2, '0');

    return { timeLeft, setLeftMilliseconds };
}
