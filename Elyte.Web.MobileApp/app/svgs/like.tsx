import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import colors from '../config/colors';

const xml = `
<svg viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.3324 1.00001C12.6525 1.00677 11.0882 1.85617 10.1676 3.26136C8.94886 1.43013 6.67694 0.609834 4.56943 1.24008C2.46192 1.87032 1.01334 3.80323 1 6.00292C1 13.5029 10.1676 16 10.1676 16C10.1676 16 19.3353 13.5029 19.3353 6.00292C19.3376 4.67535 18.8112 3.40149 17.8725 2.46276C16.9338 1.52403 15.6599 0.997685 14.3324 1.00001Z" stroke-width="1.91"/>
<path d="M14.3323 4.33547C14.7753 4.33313 15.2009 4.50808 15.5141 4.82133C15.8274 5.13458 16.0023 5.56011 16 6.00311C15.975 7.46874 15.3614 8.86269 14.2974 9.87098" stroke-width="1.91"/>
</svg>

`;

export default function LikeSvg({ stroke = '#C0C5D0', ...rest }) {
  return <SvgXml xml={xml} stroke={stroke} {...rest} />;
}
