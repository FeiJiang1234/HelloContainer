import { SvgXml } from 'react-native-svg';

const xml = `
<svg viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.954 18L7.477 14.7615L1 18V1H13.954V18Z" stroke-width="1.9"/>
</svg>


`;

export default function CollectSvg({ stroke = '#C0C5D0', ...rest }) {
  return <SvgXml xml={xml} stroke={stroke} {...rest} />;
}
