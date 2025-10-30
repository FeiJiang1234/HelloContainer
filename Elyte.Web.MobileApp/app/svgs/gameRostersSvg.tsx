import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="27" height="37" viewBox="0 0 32 37" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.42883 9.77148L1 18.0586" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.12911 18.6646C5.08484 18.6646 4.23828 17.8181 4.23828 16.7738V9.84375" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.76172 7.12911H10.5711" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.76294 1.77344C7.26398 1.77344 6.04883 2.98859 6.04883 4.48755C6.04883 5.98651 7.26398 7.20166 8.76294 7.20166" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.33439 32.181L4.42969 16.8281" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.869 16.7734L12.0005 31.6287" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.76172 26.1279V32.0718C8.76172 32.2867 8.93589 32.4609 9.15074 32.4609H11.7382C11.953 32.4609 12.1272 32.2867 12.1272 32.0718" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24.1426 7.12891H25.0473C26.5462 7.12891 27.7614 8.34406 27.7614 9.84302V16.7278C27.7614 17.7721 26.9148 18.6187 25.8706 18.6187" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.6262 1.77344C22.1273 1.77344 20.9121 2.98859 20.9121 4.48755C20.9121 5.98651 22.1273 7.20166 23.6262 7.20166" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.4531 8.77539L30.9996 18.0577" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.6972 16.7734L26.8286 31.6287" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.2383 25.2236V32.0722C23.2383 32.2871 23.4125 32.4613 23.6273 32.4613H26.2148C26.4296 32.4613 26.6038 32.2871 26.6038 32.0722" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.6671 13.0371L8.23828 21.3332" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.0001 10.748H16.9048C18.4038 10.748 19.6189 11.9632 19.6189 13.4622V20.6546C19.5992 21.6847 18.7584 22.5094 17.7281 22.5092H13.3674C12.3231 22.5092 11.4766 21.6627 11.4766 20.6184V13.4622" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.9993 5.04883C14.5003 5.04883 13.2852 6.26398 13.2852 7.76294C13.2852 9.26191 14.5003 10.4771 15.9993 10.4771" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.8633 12.042L23.4097 21.3333" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.5707 35.4463L11.666 20.1025" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.1073 20.0391L19.2388 34.9034" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 26.1279V34.786C16 35.0008 16.1742 35.175 16.389 35.175H18.9765C19.1913 35.175 19.3655 35.0008 19.3655 34.786" stroke="#1F345D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export default function GameRostersSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
