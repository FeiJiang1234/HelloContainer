import { useCountDown } from "el/utils";
import { useEffect } from "react";


const TimeCountDown = ({ leftMilliseconds }) => {
    const { timeLeft, setLeftMilliseconds } = useCountDown({ isTimerStop: false });
    useEffect(() => {
        setLeftMilliseconds(leftMilliseconds);
    }, [leftMilliseconds]);

    return <>{timeLeft}</>;
};

export default TimeCountDown;