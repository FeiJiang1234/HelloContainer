import { SvgXml } from 'react-native-svg';

const xml = `
    <svg viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.40945 7.3184V7.3184C2.15376 7.3184 1.13672 6.30136 1.13672 5.04568V5.04568C1.13672 3.78999 2.15376 2.77295 3.40945 2.77295V2.77295C4.66513 2.77295 5.68217 3.78999 5.68217 5.04568V5.04568C5.68217 6.30136 4.66513 7.3184 3.40945 7.3184Z" fill="#080E1B" stroke="#080E1B" stroke-width="1"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.68182 23.2271H2.27273V18.6816H0V12.9998C0 11.7441 1.01705 10.7271 2.27273 10.7271H3.40909" fill="#1F345D" stroke="#1F345D" stroke-width="1"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.5911 7.3184V7.3184C22.8468 7.3184 23.8638 6.30136 23.8638 5.04568V5.04568C23.8638 3.78999 22.8468 2.77295 21.5911 2.77295V2.77295C20.3354 2.77295 19.3184 3.78999 19.3184 5.04568V5.04568C19.3184 6.30136 20.3354 7.3184 21.5911 7.3184Z" fill="#080E1B" stroke="#080E1B" stroke-width="1"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3184 23.2271H22.7275V18.6816H25.0002V12.9998C25.0002 11.7441 23.9831 10.7271 22.7275 10.7271H21.5911" fill="#1F345D" stroke="#1F345D" stroke-width="1"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5009 7.31818V7.31818C10.6179 7.31818 9.0918 5.79205 9.0918 3.90909V3.90909C9.0918 2.02614 10.6179 0.5 12.5009 0.5V0.5C14.3838 0.5 15.91 2.02614 15.91 3.90909V3.90909C15.91 5.79205 14.3838 7.31818 12.5009 7.31818Z" fill="#080E1B" stroke="#080E1B" stroke-width="1"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9093 25.4998H9.09109V18.6816H6.81836V12.9998C6.81836 11.7441 7.8354 10.7271 9.09109 10.7271H15.9093C17.165 10.7271 18.182 11.7441 18.182 12.9998V19.818H15.9093V25.4998Z" fill="#1F345D" stroke="#1F345D" stroke-width="1"/>
    </svg>
`;

export default function OfficiatesSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
