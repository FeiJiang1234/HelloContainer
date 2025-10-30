import { Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import colors from '../config/colors';

type PropType = {
  error: any;
  visible: any;
  [rest: string]: any;
};

const ElErrorMessage: React.FC<PropType> = ({ error, visible, ...rest }) => {
  if (!visible || !error) return null;

  return <Text style={styles.error} {...rest}>{error}</Text>;
};

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
  },
});

export default ElErrorMessage;
