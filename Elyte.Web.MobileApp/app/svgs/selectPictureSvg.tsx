
import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg fill="none" width="24" height="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 1H22V22H1V1Z"></path>
<path d="M1 19.14L7.68 12.46L13.41 18.18L17.23 14.36L22 19.14"></path>
<circle cx="13.41" cy="7.68002" r="1.91"></circle>
</svg>
`;

export default function SelectPicture({ ...rest }) {
    return <SvgXml stroke='#B0B8CB' xml={xml} {...rest} />;
}
