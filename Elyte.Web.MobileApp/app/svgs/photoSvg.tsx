import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 1H22V22H1V1Z" stroke-width="1.91"/>
<path d="M1 19.14L7.68 12.46L13.41 18.18L17.23 14.36L22 19.14" stroke-width="1.91"/>
<circle cx="13.41" cy="7.68002" r="1.91" stroke-width="1.91"/>
</svg>
`;

export default function PhotoSvg({ stroke = '#C0C5D0', ...rest }) {
    return <SvgXml xml={xml} stroke={stroke} {...rest} />;
}
