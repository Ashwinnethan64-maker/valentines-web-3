/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#D32F2F', // Deep Red
                    hover: '#b71c1c',
                    light: '#ffEBEE'
                },
                secondary: {
                    DEFAULT: '#FFC1CC', // Soft Pink
                    light: '#FFF0F5' // Lavender Blush
                }
            },
            fontFamily: {
                heading: ['"Playfair Display"', 'serif'],
                body: ['"Lato"', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
