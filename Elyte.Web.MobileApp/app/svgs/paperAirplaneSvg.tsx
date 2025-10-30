import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="19" cy="19" r="19" fill="#17C476"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21 29L16.64 21.36L9 17L27 11L21 29Z" stroke="white" stroke-width="2"/>
<path d="M17 21L22 16" stroke="white" stroke-width="2"/>
</svg>

`;

export default function PaperAirplaneSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
