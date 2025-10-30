import { Box } from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Box)(() => { return { 
    display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8, '& > *': { flex: 1 } } 
})

export default Container;