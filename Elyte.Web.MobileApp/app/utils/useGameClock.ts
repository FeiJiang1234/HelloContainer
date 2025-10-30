import { useEffect } from 'react';
import { useState } from 'react';

export default function useGameClock(defaultGameClock) {
    const [clock, setClock] = useState({ hour: '00', minute: '00', second: '00' });

    useEffect(() => {
        if (!defaultGameClock || defaultGameClock.split(':').length < 3) return;

        setDefultColck();
    }, [defaultGameClock]);

    const setDefultColck = () => {
        const timeSplit = defaultGameClock.split(':');
        setClock({ hour: timeSplit[0], minute: timeSplit[1], second: timeSplit[2] });
    };

    const setHour = hour => setClock(pre => ({ ...pre, hour: hour }));
    const setMinute = minute => setClock(pre => ({ ...pre, minute: minute }));
    const setSecond = second => setClock(pre => ({ ...pre, second: second }));

    return { clock, setHour, setMinute, setSecond };
}
