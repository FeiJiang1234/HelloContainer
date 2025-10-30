import { useLayoutOffset } from 'el/utils';
import { View } from 'native-base';
import React from 'react';

const ElContainer = ({ children, style = {}, ...rest }) => {
  const { layoutOffsetLeft, layoutOffsetRight } = useLayoutOffset();

  return (
    <View style={[{ marginLeft: layoutOffsetLeft + 16, marginRight: layoutOffsetRight + 16 }, style]} {...rest}>{children}</View>
  );
};

export default ElContainer;
