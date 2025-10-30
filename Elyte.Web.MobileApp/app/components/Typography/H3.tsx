import React from 'react';
import Typography from './Typography';
import { TypographyType } from './TypographyType';

const H3: React.FC<TypographyType> = props => {
  return <Typography {...props} fontSize={20} />;
};

export default H3;
