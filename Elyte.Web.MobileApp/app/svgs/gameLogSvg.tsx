
import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="27" height="31" viewBox="0 0 27 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.06445 6.7272V3.9716C3.08366 2.73092 4.09295 1.73416 5.33377 1.73047H22.9879C24.2396 1.73434 25.2534 2.74808 25.2573 3.99979V27.4612C25.2534 28.7129 24.2396 29.7266 22.9879 29.7305H5.33377C4.08207 29.7266 3.06832 28.7129 3.06445 27.4612V24.7056" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.89453 6.72738H5.27737" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.89453 9.72152H5.27737" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.89453 12.7176H5.27737" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.89453 15.7137H5.27737" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.89453 18.7157H5.27737" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.89453 21.7098H5.27737" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.06443 24.7059H1.89453" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="5.1364" cy="24.8747" r="0.704757" fill="#1F345D"/>
<path d="M10.7754 7.70003H18.5982" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.63867 11.4852H20.6407" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="16.1582" y="22.7598" width="5.89177" height="3.87616" rx="1.81" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;

export default function GameLogSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
