
import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="23" height="32" viewBox="0 0 23 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.38 11.51H5.3C6.8464 11.51 8.1 12.7636 8.1 14.31V14.66H18.17C19.8269 14.66 21.17 13.3169 21.17 11.66V6.8C21.17 5.14315 19.8269 3.8 18.17 3.8H11.33C9.7836 3.8 8.53 2.5464 8.53 1H1V30.13H16.8" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="20.5" cy="29.9004" r="1" fill="#1F345D"/>
</svg>
`;

export default function EndGameSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
