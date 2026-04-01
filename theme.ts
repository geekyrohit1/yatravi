import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3a7bd5', // Brand Blue
            light: '#00d2ff', // Cyan
            dark: '#2a5da8', // Dark Blue
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#1a3d70', // Deep Blue
            light: '#2a5da8',
            dark: '#1a3d70',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f9fafb', // Gray-50
            paper: '#ffffff',   // White
        },
        text: {
            primary: '#111827', // Gray-900
            secondary: '#4b5563', // Gray-600
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "sans-serif"',
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.025em',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.025em',
        },
        h3: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none', // Modern feel, no all-caps
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem', // Rounded-xl
                    padding: '0.75rem 1.5rem',
                },
                contained: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(58, 123, 213, 0.3)', // Brand blue glow
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '1rem', // Rounded-2xl
                    border: '1px solid rgba(0, 0, 0, 0.05)', // Light border
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', // Gentle shadow
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.2)',
                        },
                    },
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    color: '#3a7bd5',
                },
            },
        },
    },
});
