import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="21" height="27" viewBox="0 0 21 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.3512 12.3945V20.171" stroke="#1F345D" stroke-width="2"/>
<path d="M10.2721 14.6064V20.1711" stroke="#1F345D" stroke-width="2"/>
<path d="M6.19303 16.8301V20.1712" stroke="#1F345D" stroke-width="2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.4438 6.83031V25.7244H1.10059V1.27734H14.3508L19.4438 6.83031Z" stroke="#1F345D" stroke-width="2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.4432 6.83031V7.94789H13.3252V1.27734H14.3502L19.4432 6.83031Z" stroke="#1F345D" stroke-width="2"/>
</svg>
`;

export default function StatRecordingSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
