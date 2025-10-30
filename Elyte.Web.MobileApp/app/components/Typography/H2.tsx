import React from 'react';
import Typography from './Typography';
import { TypographyType } from './TypographyType';

const H2: React.FC<TypographyType> = props => {
  return <Typography {...props} fontSize={25} />;
};

export default H2;
