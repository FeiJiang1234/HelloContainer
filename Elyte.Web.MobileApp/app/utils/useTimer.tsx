import { useState, useEffect } from 'react';

export default function useTimer ({ isTimerStop }) {
    const [timePast, setTimePast] = useState<any>();
    const [startTime, setStartTime] = useState<any>();
    const [pastMilliseconds, setPastMilliseconds] = useState<any>();

    useEffect(() => {
        setTimePast(format(pastMilliseconds));
        if (!pastMilliseconds) return;

        setStartTime(new Date().getTime() - pastMilliseconds);
    }, [pastMilliseconds]);

    useEffect(() => {
        setStartTime(new Date().getTime() - pastMilliseconds);
    }, [isTimerStop]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isTimerStop) {
                clearInterval(interval);
                return;
            }
            setTimePast(format(new Date().getTime() - startTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const format = timeSpan => {
        if (!timeSpan) return '00:00:00';

        const hours = Math.floor((timeSpan % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeSpan % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeSpan % (1000 * 60)) / 1000);

        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    };

    const padZero = value => String(value).padStart(2, '0');

    return { timePast, setPastMilliseconds };
}
