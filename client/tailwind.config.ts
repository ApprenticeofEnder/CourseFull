import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
    	extend: {
    		backgroundImage: {
    			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
    		},
    		spacing: {
    			'button-shadow': '8px',
    			'button-shadow-hover': '4px'
    		},
    		colors: {
    			text: {
    				'50': '#030417',
    				'100': '#06082d',
    				'200': '#0b0f5b',
    				'300': '#111788',
    				'400': '#161eb6',
    				'500': '#1c26e3',
    				'600': '#4951e9',
    				'700': '#777dee',
    				'800': '#a4a8f4',
    				'900': '#d2d4f9',
    				'950': '#e8e9fc'
    			},
    			background: {
    				'50': '#010f18',
    				'100': '#021e31',
    				'200': '#043c62',
    				'300': '#065b93',
    				'400': '#0879c4',
    				'500': '#0a97f5',
    				'600': '#3bacf7',
    				'700': '#6cc1f9',
    				'800': '#9dd5fb',
    				'900': '#ceeafd',
    				'950': '#e7f5fe'
    			},
    			primary: {
    				'50': '#011118',
    				'100': '#032230',
    				'200': '#064460',
    				'300': '#086591',
    				'400': '#0b87c1',
    				'500': '#0ea9f1',
    				'600': '#3ebaf4',
    				'700': '#6ecbf7',
    				'800': '#9fddf9',
    				'900': '#cfeefc',
    				'950': '#e7f6fe',
    				DEFAULT: '#0ea9f1'
    			},
    			secondary: {
    				'50': '#051504',
    				'100': '#092a09',
    				'200': '#125511',
    				'300': '#1c7f1a',
    				'400': '#25a923',
    				'500': '#2ed42b',
    				'600': '#58dc56',
    				'700': '#82e580',
    				'800': '#abeeaa',
    				'900': '#d5f6d5',
    				'950': '#eafbea'
    			},
    			accent: {
    				'50': '#020f18',
    				'100': '#031e30',
    				'200': '#073c5f',
    				'300': '#0a5a8f',
    				'400': '#0d78bf',
    				'500': '#1196ee',
    				'600': '#40abf2',
    				'700': '#70c0f5',
    				'800': '#a0d5f8',
    				'900': '#cfeafc',
    				'950': '#e7f4fd'
    			},
    			success: {
    				'50': '#e0ffe6',
    				'100': '#b5f9c4',
    				'200': '#88f3a0',
    				'300': '#5bef7c',
    				'400': '#2fea58',
    				'500': '#15d03f',
    				'600': '#0aa230',
    				'700': '#037421',
    				'800': '#004611',
    				'900': '#001900',
    				DEFAULT: '#15d03f'
    			},
    			warning: {
    				'50': '#fffbdb',
    				'100': '#fef4ae',
    				'200': '#fcec7f',
    				'300': '#fbe44f',
    				'400': '#fadd1f',
    				'500': '#e0c305',
    				'600': '#ae9800',
    				'700': '#7d6d00',
    				'800': '#4b4100',
    				'900': '#1b1600'
    			},
    			danger: {
    				'50': '#ffe5e2',
    				'100': '#ffbab1',
    				'200': '#fe8d80',
    				'300': '#fd614f',
    				'400': '#fb351d',
    				'500': '#e21c04',
    				'600': '#b01402',
    				'700': '#7f0d01',
    				'800': '#4e0600',
    				'900': '#1f0000'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	},
    	fontFamily: {
    		sans: ['Atkinson\\\\ Hyperlegible', 'sans-serif']
    	}
    },
    darkMode: ['class', 'class'],
    plugins: [
        nextui({
            themes: {
                light: {
                    // layout: {},
                    colors: {
                        foreground: '#0a0d4f',
                        background: {
                            50: '#010f19',
                            100: '#021e31',
                            200: '#033d63',
                            300: '#055b94',
                            400: '#0679c6',
                            500: '#0897f7',
                            600: '#39acf9',
                            700: '#6bc1fa',
                            800: '#9cd6fc',
                            900: '#ceeafd',
                            DEFAULT: '#ceeafd',
                        },
                        primary: {
                            50: '#011118',
                            100: '#032230',
                            200: '#064460',
                            300: '#086591',
                            400: '#0b87c1',
                            500: '#0ea9f1',
                            600: '#3ebaf4',
                            700: '#6ecbf7',
                            800: '#9fddf9',
                            900: '#cfeefc',
                            DEFAULT: '#0ea9f1',
                        },
                        success: {
                            foreground: '#ffffff',
                        },
                        default: {
                            foreground: '#0a0d4f',
                            DEFAULT: '#ceeafd',
                        },
                        focus: '#0ea9f1',
                    },
                },
                // dark: {
                //     layout: {},
                //     colors: {},
                // },
            },
        }),
        require('@headlessui/tailwindcss'),
        require("tailwindcss-animate")
    ],
};
export default config;
