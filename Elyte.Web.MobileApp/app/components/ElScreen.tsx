import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import Constants from 'expo-constants';

type PropType = {
  children: any;
  style?: any;
};

const ElScreen: React.FC<PropType> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  view: {
    flex: 1,
  },
});

export default ElScreen;
