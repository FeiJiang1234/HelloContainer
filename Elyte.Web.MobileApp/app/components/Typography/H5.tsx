import React from 'react';
import Typography from './Typography';
import { TypographyType } from './TypographyType';

const H5: React.FC<TypographyType> = props => {
  return <Typography {...props} fontSize={15} />;
};

export default H5;
