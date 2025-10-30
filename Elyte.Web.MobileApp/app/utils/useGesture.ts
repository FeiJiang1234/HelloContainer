import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

const useGesture = () => {
    const position = useSharedValue({ x: 0, y: 0 });
    const start = useSharedValue({ x: 0, y: 0 });
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const initAnimation = () => {
        position.value = {
            x: 0,
            y: 0,
        };
        start.value = {
            x: 0,
            y: 0,
        };
        scale.value = 1;
        savedScale.value = 1;
    };

    const panGesture = Gesture.Pan()
        .onUpdate(e => {
            position.value = {
                x: e.translationX + start.value.x,
                y: e.translationY + start.value.y,
            };
        })
        .onEnd(() => {
            start.value = {
                x: position.value.x,
                y: position.value.y,
            };
        });

    const pinchGesture = Gesture.Pinch()
        .onUpdate(e => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    return { initAnimation, position, scale, panGesture, pinchGesture };
};

export default useGesture;
