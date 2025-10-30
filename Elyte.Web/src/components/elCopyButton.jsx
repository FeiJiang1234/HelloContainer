import React from 'react';
import copy from 'copy-to-clipboard';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { Button } from '@mui/material';

const ELCopyButton = ({ content }) => {
    const handleCopyIdClick = (content) => {
        copy(content);
        window.elyte.success("copy successfully.");
    }

    return (
        <Button onClick={() => handleCopyIdClick(content)} sx={{ textTransform: 'none', color: "#B0B8CB", margin: 0 }} startIcon={<ContentCopy sx={{ color: '#17C476' }} />}>
            Copy
        </Button>
    );
}

export default ELCopyButton;