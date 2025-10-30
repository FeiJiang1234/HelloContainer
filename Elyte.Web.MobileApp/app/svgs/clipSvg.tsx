import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="19" cy="19" r="19" fill="url(#paint0_linear_0_1)"/>
<path d="M22.31 12.7203L14.59 20.5803C14.0959 21.0959 13.8262 21.7863 13.84 22.5003C13.8452 23.2216 14.1389 23.9109 14.6555 24.4144C15.1721 24.9178 15.8687 25.1936 16.59 25.1803C17.3065 25.1818 17.9939 24.8974 18.5 24.3903L26.82 16.0703C27.7101 15.1827 28.2102 13.9773 28.21 12.7203C28.2074 11.4588 27.701 10.2507 26.8034 9.36433C25.9058 8.478 24.6914 7.98693 23.43 8.00026C22.1785 8.00332 20.9786 8.49909 20.09 9.38026L12 17.5003C10.7236 18.7597 10.0036 20.4771 10 22.2703C10.0053 24.0605 10.7215 25.7753 11.9912 27.0374C13.2608 28.2995 14.9798 29.0056 16.77 29.0003C18.5632 28.9967 20.2805 28.2766 21.54 27.0003L28.16 20.3903" stroke="white" stroke-width="1.91"/>
<defs>
<linearGradient id="paint0_linear_0_1" x1="1.58818" y1="6.39717" x2="2.00054" y2="44.3952" gradientUnits="userSpaceOnUse">
<stop stop-color="#1F345D"/>
<stop offset="1" stop-color="#080E1B"/>
</linearGradient>
</defs>
</svg>
`;

export default function ClipSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
