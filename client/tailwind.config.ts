import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

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
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            spacing: {
                'button-shadow': '8px',
                'button-shadow-hover': '4px',
            },
        },
        fontFamily: {
            sans: ['Atkinson\\ Hyperlegible', 'sans-serif'],
        },
    },
    darkMode: 'class',
    plugins: [
        nextui({
            themes: {
                light: {
                    // layout: {},
                    colors: {
                        foreground: '#082f49',
                        background: '#e0f2fe',
                        primary: {
                            foreground: '#FFFFFF',
                            DEFAULT: '#38bdf8',
                        },
                        focus: '#e0f2fe',
                    },
                },
                // dark: {
                //     layout: {},
                //     colors: {},
                // },
            },
        }),
        require('@headlessui/tailwindcss'),
    ],
};
export default config;
