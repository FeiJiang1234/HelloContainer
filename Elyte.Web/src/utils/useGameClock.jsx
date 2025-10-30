export default function useGameClock (defaultGameClock) {
    if (String.isNullOrEmpty(defaultGameClock)) {
        return { hour: '00', minute: '00', second: '00' };
    }

    const timeSplit = defaultGameClock.split(':');
    return { hour: timeSplit[0], minute: timeSplit[1], second: timeSplit[2] };
}
