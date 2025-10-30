import React from 'react';
import PropTypes from 'prop-types';

const ElSvgImage = ({ name }) => {
  return <img className="el-svg-icon hand" src={`/svgs/${name}.svg`} />;
};

ElSvgImage.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ElSvgImage;
