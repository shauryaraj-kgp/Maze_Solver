import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './styles/**/*.{css}',
    ],

    theme: {
        extend: {
            colors: {
                slate: colors.slate,
                gray: colors.gray,
                blue: colors.blue,
                green: colors.green,
                red: colors.red,
                white: colors.white,
                black: colors.black,
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
