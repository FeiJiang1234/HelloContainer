import Svg, { Path, Circle } from 'react-native-svg';

export default function Notification({ isShowDot, ...rest }) {
    return (
        <Svg viewBox="0 0 29 29" fill="none" {...rest}>
            <Path
                clipRule="evenodd"
                d="M23.09 17.36v-4.77A8.6 8.6 0 0 0 14.5 4a8.6 8.6 0 0 0-8.59 8.59v4.77L4 19.27v1.91h21v-1.91l-1.91-1.91Z"
                stroke="#fff"
                strokeWidth={1.91}
            />
            <Path
                d="M17.19 21.18c.123.319.18.659.17 1a2.86 2.86 0 1 1-5.72 0c-.01-.341.047-.681.17-1"
                stroke="#fff"
                strokeWidth={1.91}
            />
            {isShowDot && <Circle cx={24} cy={5} r={5} fill="#E95B5B" />}
        </Svg>
    );
}
