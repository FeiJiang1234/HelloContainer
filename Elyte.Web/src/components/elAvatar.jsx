import React from 'react';
import { Avatar } from '@mui/material';
import { styled } from '@mui/system';

const NewAvatar = styled(Avatar, {
    shouldForwardProp: (prop) => !['small', 'large', 'xlarge'].includes(prop),
  })(({ theme, small, large, xlarge }) => ({
        ...(small && { width: theme.spacing(3.5), height: theme.spacing(3.5)}),
        ...(large && { width: theme.spacing(10), height: theme.spacing(10)}),
        ...(xlarge && { width: theme.spacing(19), height: theme.spacing(19)})
}));

function ElAvatar ({ src, small, large, xlarge, ...rest }) {
    return (
        <NewAvatar src={src} {...rest} small={small} large={large} xlarge={xlarge} />
    );
}

export default ElAvatar;
