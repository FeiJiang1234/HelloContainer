import { useState, useEffect, useRef } from 'react';

export default function useCountDownSeconds() {
    const [seconds, setSeconds] = useState(0);
    const countdownRef = useRef();

    useEffect(() => {
        if (seconds >= 60) {
            clearInterval(countdownRef.current);
            return setSeconds(0);
        }
    }, [seconds]);

    const secondsIncrease = () => {
        setSeconds(count => count + 1);
        countdownRef.current = setInterval(() => setSeconds(count => count + 1), 1000);
    };

    return { seconds, secondsIncrease };
}
