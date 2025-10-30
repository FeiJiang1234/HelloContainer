import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11.5" cy="10.54" r="4.77"  stroke-width="1.91"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.27 3.86L14.36 1H8.64003L6.73003 3.86H2.91003C1.85516 3.86 1.00003 4.71514 1.00003 5.77V16.27C0.997349 16.7774 1.19772 17.2648 1.5565 17.6235C1.91527 17.9823 2.40265 18.1827 2.91003 18.18H20.09C20.5974 18.1827 21.0848 17.9823 21.4436 17.6235C21.8023 17.2648 22.0027 16.7774 22 16.27V5.77C22 4.71514 21.1449 3.86 20.09 3.86H16.27Z"  stroke-width="1.91"/>
<path d="M3.85999 1.9502V3.8602"  stroke-width="1.91"/>
<path d="M18.1801 6.72998H20.0901"  stroke-width="1.91"/>
</svg>
`;

export default function CameraSvg({ stroke = '#C0C5D0', ...rest }) {
    return <SvgXml xml={xml} stroke={stroke} {...rest} />;
}
