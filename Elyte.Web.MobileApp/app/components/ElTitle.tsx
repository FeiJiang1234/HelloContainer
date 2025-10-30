import React from 'react';
import H3 from './Typography/H3';

const ElTitle = ({ children }) => {
  return (
    <H3 center style={{ fontWeight: '500', marginTop: 16, marginBottom: 16 }}>
      {children}
    </H3>
  );
};

export default ElTitle;
