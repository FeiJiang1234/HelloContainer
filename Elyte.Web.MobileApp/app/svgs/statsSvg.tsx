import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 0V22H23" stroke-width="1.91"/>
    <path d="M18.22 9.56982V19.1298" stroke-width="1.91"/>
    <path d="M12.48 1.91016V19.1302" stroke-width="1.91"/>
    <path d="M6.73999 5.74023V19.1302" stroke-width="1.91"/>
</svg>
`;

export default function StatsSvg({ stroke = '#C0C5D0', ...rest }) {
    return <SvgXml xml={xml} stroke={stroke} {...rest} />;
}
