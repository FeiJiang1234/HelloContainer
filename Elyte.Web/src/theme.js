import { createTheme } from '@mui/material/styles';

const spacing = 8;
const primary = '#1F345C';
const bgPrimary = 'linear-gradient(180deg, #1F345D 16.55%, #080E1B 185%)';
const bodyMain = "#808A9E";

const theme = createTheme({
    spacing: spacing,

    typography: {
        fontFamily: 'Poppins',
    },

    bgPrimary: bgPrimary,

    bgClicked: 'linear-gradient(180deg, #2599FB 6.84%, #006BC5 100%)',

    palette: {
        primary: {
            main: primary,
            contrastText: '#fff',
        },
        secondary: {
            main: '#E95B5B',
            minor: '#17C476',
        },
        error: {
            main: '#FF7373',
            bg: '#FFF5F5',
        },
        body: {
            main: bodyMain,
            light: '#B0B8CB',
        },
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#fff',
                    fontSize: '0.875rem',
                },
                '.profile-title': {
                    fontWeight: '500 !important',
                    fontSize: '20px !important',
                    color: 'black',
                },
                '.profile-address': {
                    fontSize: '12px',
                    color: bodyMain,
                    justifyContent: 'left !important',
                    marginBottom: spacing,
                },
                '.category-text': {
                    fontSize: 15,
                    color: bodyMain,
                    marginTop: `${spacing * 2}px !important`,
                },
                '.terms-text': {
                    paddingTop: '0 !important',
                    color: bodyMain,
                    fontSize: 14,
                },
                '.operation-btn': {
                    flex: 'none',
                    color: '#FFFFFF',
                    fontWeight: 500,
                    fontSize: '13px',
                    borderRadius: 5,
                    marginRight: 10,
                    height: '30px !important',
                },
                '.divider': {
                    marginTop: `${spacing * 2}px !important`,
                    marginBottom: `${spacing * 2}px !important`,
                },
                '.checkbox-label': {
                    fontSize: 15,
                    color: bodyMain,
                },
                '.primary-bold': {
                    color: primary,
                    fontWeight: 'bold',
                },
                '.scroll-container': {
                    overflow: 'auto',
                    flex: 1,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 15,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.green:not(.Mui-disabled)': {
                        background: '#17C476'
                    },
                    '&.gray:not(.Mui-disabled)': {
                        background: '#F0F2F7'
                    },
                    '&.blue:not(.Mui-disabled)': {
                        background: '#2599FB'
                    },
                }
            }
        },
        MuiCheckbox: {
            defaultProps: {
                disableRipple: true
            },
        },
    },
    overrides: {
        MuiSvgIcon: {
            root: {
                cursor: 'pointer',
            },
        },
    },
});

export default theme;
