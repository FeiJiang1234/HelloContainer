import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import colors from '../config/colors';
import ElIcon from './ElIcon';

export default function ElPickerItem({ item, value, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Text>{item.label}</Text>
      { !!item.value && item.value == value && <ElIcon name='check' color={colors.secondary} style={{ position: 'absolute', right: 8 }} size={25} /> }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  }
});
