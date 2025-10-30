import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg viewBox="0 0 293 327" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M111.5 0V106H180.5V0" stroke="white" stroke-width="2"/>
    <path d="M99 0V106H191.5V0" stroke="white" stroke-width="2"/>
    <circle cx="146" cy="106" r="33" stroke="white" stroke-width="2"/>
    <circle cx="146" cy="12" r="11" stroke="white" stroke-width="2"/>
    <rect x="1" y="1" width="291" height="325" stroke="white" stroke-width="2"/>
    <path d="M19 0.5V98.5C19 98.5 52.5 201.5 146.5 201.5C240.5 201.5 274 98.5 274 98.5V0.5" stroke="white" stroke-width="2"/>
    <path d="M191.5 42H274" stroke="white" stroke-width="2"/>
    <path d="M19 42L99 42" stroke="white" stroke-width="2"/>
    <path d="M191.5 84.5L292.5 132" stroke="white" stroke-width="2"/>
    <path d="M99 84.5L0.5 131" stroke="white" stroke-width="2"/>
    <path d="M180.5 106L292 326" stroke="white" stroke-width="2"/>
    <path d="M112 106L1 326" stroke="white" stroke-width="2"/>
</svg>
    
`;

export default function BasketballCourtSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
