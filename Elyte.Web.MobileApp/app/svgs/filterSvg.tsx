import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4.5H23" stroke-width="2" stroke-linecap="square"/>
<path d="M1 4.5H4" stroke-width="2" stroke-linecap="square"/>
<rect x="4" y="1.5" width="4" height="6" stroke-width="2" stroke-linecap="square"/>
<path d="M22 12.5H23" stroke-width="2" stroke-linecap="square"/>
<path d="M1 12.5H14" stroke-width="2" stroke-linecap="square"/>
<rect x="14" y="9.5" width="4" height="6" stroke-width="2" stroke-linecap="square"/>
<path d="M12 20.5H23" stroke-width="2" stroke-linecap="square"/>
<path d="M1 20.5H4" stroke-width="2" stroke-linecap="square"/>
<rect x="4" y="17.5" width="4" height="6" stroke-width="2" stroke-linecap="square"/>
</svg>
`;

export default function FilterSvg({ stroke = '#B0B8CB', ...rest }) {
    return <SvgXml xml={xml} stroke={stroke} {...rest} />;
}
