
import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="33" height="22" viewBox="0 0 33 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.1292 1.42967L20.1294 1.47159" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.1294 1.54678L16.1292 1.50487" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.2855 20.1863L17.0371 10.8177L16.1757 9.46489L11.1292 1.54692" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.2855 20.1443L22.0371 10.7757L20.5576 8.45805L16.1292 1.50493" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.2855 20.1111L26.0371 10.7425L24.6691 8.59392L20.1292 1.47173" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.1292 1.42973L31.0371 10.7005L25.2855 20.0691" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.07608 20.2633L4.59599 20.2422" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.92021 1.58201L1.92038 1.62393" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.07647 20.2634L6.55545 12.9656L7.82813 10.8949L6.87559 9.4028L6.87551 9.3928L1.9202 1.62407" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.57604 17.7788L12.3151 11.6872L12.8281 10.8529L6.9202 1.58208" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="7.07678" cy="20.2212" r="1" transform="rotate(89.5197 7.07678 20.2212)" fill="#1F345D"/>
</svg>
`;

export default function TeamLineUpSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
