
import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="7.62891" y="6.30469" width="15.7818" height="21.0471" rx="5.725" stroke="#1F345D" stroke-width="1.91"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M23.4258 11.5703H26.0584C28.2355 11.5703 30.0004 13.3352 30.0004 15.5123V18.1449C30.0004 20.322 28.2355 22.0869 26.0584 22.0869H23.4258V11.5703H23.4258Z" stroke="#1F345D" stroke-width="1.91"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.62931 22.0869H4.9967C2.81959 22.0869 1.05469 20.322 1.05469 18.1449V15.5123C1.05469 13.3352 2.81959 11.5703 4.9967 11.5703H7.62931V22.0869V22.0869Z" stroke="#1F345D" stroke-width="1.91"/>
<path d="M4.99609 11.5695C4.99609 5.75369 9.71072 1.03906 15.5265 1.03906C21.3423 1.03906 26.0569 5.75369 26.0569 11.5695" stroke="#1F345D" stroke-width="1.91"/>
<path d="M26.0572 22.0859V23.4643C26.0496 27.0976 23.102 30.0389 19.4688 30.0389" stroke="#1F345D" stroke-width="1.91"/>
</svg>
`;

export default function CallCoordinatorSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
