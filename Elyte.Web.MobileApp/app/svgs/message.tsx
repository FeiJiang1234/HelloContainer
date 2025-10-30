import Svg, { Path, Circle } from 'react-native-svg';

export default function Message({ isShowDot, ...rest }) {
    return (
        <Svg viewBox="0 0 29 29" fill="none" {...rest}>
            <Path
                clipRule="evenodd"
                d="M24 14.5C24 9.25329 19.7467 5 14.5 5C9.25329 5 5 9.25329 5 14.5C5 19.7467 9.25329 24 14.5 24H24L21.34 21.08C23.0497 19.3168 24.004 16.956 24 14.5Z"
                stroke="#fff"
                strokeWidth={1.9}
            />
            <Path
                d="M17.3496 14.5H19.2496"
                stroke="#fff"
                strokeWidth={1.91}
            />
            <Path
                d="M13.5498 14.5H15.4498"
                stroke="#fff"
                strokeWidth={1.91}
            />
            <Path
                d="M9.75 14.5H11.65"
                stroke="#fff"
                strokeWidth={1.91}
            />
            {isShowDot && <Circle cx={24} cy={5} r={5} fill="#E95B5B" />}
        </Svg>
    );
}

