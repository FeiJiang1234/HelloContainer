import { SvgXml } from 'react-native-svg';

const xml = `
<svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="13.9571" cy="3.04286" r="2.04286" stroke-width="1.91"/>
  <circle cx="3.04286" cy="8.49989" r="2.04286" stroke-width="1.91"/>
  <circle cx="13.9571" cy="13.9569" r="2.04286" stroke-width="1.91"/>
  <path d="M12.1286 3.95703L4.87143 7.5856" stroke-width="1.91"/>
  <path d="M12.1286 13.0426L4.87143 9.41406" stroke-width="1.91"/>
</svg>
`;

export default function ShareSvg({ stroke = '#C0C5D0', ...rest }) {
    return <SvgXml xml={xml} stroke={stroke} {...rest} />;
}
