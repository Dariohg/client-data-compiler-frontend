import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    colors: {
        brand: {
            50: '#e3f2fd',
            100: '#bbdefb',
            200: '#90caf9',
            300: '#64b5f6',
            400: '#42a5f5',
            500: '#2196f3',
            600: '#1e88e5',
            700: '#1976d2',
            800: '#1565c0',
            900: '#0d47a1',
        },
        gray: {
            50: '#f7fafc',
            100: '#edf2f7',
            200: '#e2e8f0',
            300: '#cbd5e0',
            400: '#a0aec0',
            500: '#718096',
            600: '#4a5568',
            700: '#2d3748',
            800: '#1a202c',
            900: '#171923',
        },
        success: {
            50: '#f0fff4',
            100: '#c6f6d5',
            200: '#9ae6b4',
            300: '#68d391',
            400: '#48bb78',
            500: '#38a169',
            600: '#2f855a',
            700: '#276749',
            800: '#22543d',
            900: '#1c4532',
        },
        error: {
            50: '#fed7d7',
            100: '#feb2b2',
            200: '#fc8181',
            300: '#f56565',
            400: '#e53e3e',
            500: '#c53030',
            600: '#9b2c2c',
            700: '#822727',
            800: '#63171b',
            900: '#1a202c',
        },
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
        }
    },
    fonts: {
        heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
        body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
                color: props.colorMode === 'dark' ? 'gray.100' : 'gray.900',
            },
        }),
    },
    components: {
        Button: {
            defaultProps: {
                colorScheme: 'brand',
            },
            variants: {
                solid: (props) => ({
                    bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500',
                    color: 'white',
                    _hover: {
                        bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.600',
                    },
                }),
                ghost: (props) => ({
                    color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
                    _hover: {
                        bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
                    },
                }),
            },
        },
        Card: {
            baseStyle: (props) => ({
                container: {
                    bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
                    borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
                    borderWidth: '1px',
                    borderRadius: 'lg',
                    shadow: props.colorMode === 'dark' ? 'xl' : 'md',
                },
            }),
        },
        Table: {
            variants: {
                simple: (props) => ({
                    th: {
                        borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
                        color: props.colorMode === 'dark' ? 'gray.300' : 'gray.600',
                    },
                    td: {
                        borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
                    },
                }),
            },
        },
        Modal: {
            baseStyle: (props) => ({
                dialog: {
                    bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
                },
                header: {
                    borderBottomColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
                },
                footer: {
                    borderTopColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
                },
            }),
        },
        Input: {
            variants: {
                outline: (props) => ({
                    field: {
                        borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
                        bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
                        _hover: {
                            borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
                        },
                        _focus: {
                            borderColor: 'brand.500',
                            boxShadow: `0 0 0 1px ${props.colorMode === 'dark' ? '#2196f3' : '#2196f3'}`,
                        },
                    },
                }),
            },
        },
        Select: {
            variants: {
                outline: (props) => ({
                    field: {
                        borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
                        bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
                        _hover: {
                            borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
                        },
                    },
                }),
            },
        },
    },
})

export default theme