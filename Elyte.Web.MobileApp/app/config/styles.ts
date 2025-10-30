import { Platform } from 'react-native';
import colors from '../config/colors';
import { isPad } from 'el/config/constants';

export default {
  text: {
    color: colors.dark,
    fontSize: 16,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
  },
  mr16: {
    marginRight: 16,
  },
  ml16: {
    marginLeft: 16,
  },
  headerHight: isPad ? 55 : 45,
  footerHight: isPad ? 60 : 50,
  layoutOffset: 200
};
