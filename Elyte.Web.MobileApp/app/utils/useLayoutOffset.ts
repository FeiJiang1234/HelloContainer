import { useState, useEffect } from 'react';
import { isPad } from 'el/config/constants';
import defaultStyles from 'el/config/styles';
import { useDeviceOrientation } from '@react-native-community/hooks'

const useLayoutOffset = () => {
    const orientation = useDeviceOrientation()
    const [layoutOffsetLeft, setLayoutOffsetLeft] = useState(0);
    const [layoutOffsetRight, setLayoutOffsetRight] = useState(0);

    useEffect(() => {
        const offset = isPad && orientation.landscape ? defaultStyles.layoutOffset : 0;
        setLayoutOffsetLeft(offset);
        setLayoutOffsetRight(offset);
    }, [orientation]);

    return {
        layoutOffsetLeft,
        layoutOffsetRight,
    };
};

export default useLayoutOffset;
