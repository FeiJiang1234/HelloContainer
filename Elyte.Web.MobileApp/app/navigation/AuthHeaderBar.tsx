import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import GoBack from '../svgs/goBack';
import {
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import { ParamListBase, Route } from '@react-navigation/native';
import { isPad } from 'el/config/constants';
import { useLayoutOffset } from 'el/utils';

type PropType = {
  back?: { title: string } | undefined;
  options: StackNavigationOptions;
  route: Route<string, object | undefined>;
  navigation: StackNavigationProp<ParamListBase, string, undefined>;
};

const AuthHeaderBar: React.FC<PropType> =  ({ navigation, route, options, back }) => {
  const { layoutOffsetLeft, layoutOffsetRight } = useLayoutOffset();

  return (
    <LinearGradient {...colors.linear} style={[styles.header, { 
        paddingLeft: layoutOffsetLeft,
        paddingRight: layoutOffsetRight, 
    }]}>
      {back && (
        <>
          <Pressable onPress={navigation.goBack}>
            <GoBack width={isPad ? 24 : 18} height={isPad ? 22 : 16} style={styles.goBack} /> 
          </Pressable>
          <Text style={{color: colors.white }}>
            { typeof options.headerTitle === "string" ? options.headerTitle : '' }
          </Text>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 35,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  goBack: {
    marginLeft: 16,
    marginRight: 8
  }
});

export default AuthHeaderBar;
