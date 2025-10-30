import React from 'react';
import Typography from './Typography';
import { TypographyType } from './TypographyType';

const H4: React.FC<TypographyType> = props => {
  return <Typography {...props} fontSize={18} />;
};

export default H4;
