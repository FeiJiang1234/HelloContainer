import { SvgXml } from 'react-native-svg';

const xml = `
<svg viewBox="0 0 6 23" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="2.91" cy="2.91" r="1.91" stroke="#C0C5D0" stroke-width="1.91"/>
  <circle cx="2.91" cy="11.4998" r="1.91" stroke="#C0C5D0" stroke-width="1.91"/>
  <circle cx="2.91" cy="20.0902" r="1.91" stroke="#C0C5D0" stroke-width="1.91"/>
</svg>

`;

export default function OptionsSvg({ ...rest }) {
  return <SvgXml xml={xml} {...rest} />;
}
