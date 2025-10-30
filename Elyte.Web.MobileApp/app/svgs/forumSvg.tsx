import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5739 6.66687V13.1479C15.5739 14.4878 14.4876 15.5741 13.1477 15.5741H11.5274V18.0002L6.66667 15.5741H3.42615C2.78269 15.5741 2.16559 15.3184 1.7106 14.8635C1.25561 14.4085 1 13.7914 1 13.1479V6.66687C1 5.32695 2.08622 4.24072 3.42615 4.24072H13.1477C14.4876 4.24072 15.5739 5.32695 15.5739 6.66687Z" stroke="white" stroke-width="1.91"/>
  <path d="M15.5738 12.3333H16.4221C17.7422 12.3149 18.8052 11.2443 18.8143 9.92415V3.42615C18.8143 2.08622 17.7281 1 16.3882 1H6.66663C5.3267 1 4.24048 2.08622 4.24048 3.42615V4.27445" stroke="white" stroke-width="1.91"/>
  <path d="M4.24048 9.90706H5.86074" stroke="white" stroke-width="1.91"/>
  <path d="M7.48096 9.90706H9.10122" stroke="white" stroke-width="1.91"/>
  <path d="M10.7131 9.90706H12.3334" stroke="white" stroke-width="1.91"/>
</svg>

`;

export default function ForumSvg({ ...rest }) {
    return <SvgXml xml={xml} {...rest} />;
}
