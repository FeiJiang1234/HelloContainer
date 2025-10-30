import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 11.1111H8.88889V0H0V11.1111Z"/>
    <path d="M0 20H8.88889V13.3334H0V20Z"/>
    <path d="M11.1113 20H20.0002V8.88892H11.1113V20Z"/>
    <path d="M11.1113 0V6.66667H20.0002V0H11.1113Z"/>
</svg>
`;

export default function SwitchSvg({ fill = '#C0C5D0', ...rest }) {
    return <SvgXml xml={xml} fill={fill} {...rest} />;
}
