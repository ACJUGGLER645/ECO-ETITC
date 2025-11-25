/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#10b981', // Emerald 500
                    dark: '#059669', // Emerald 600
                }
            }
        },
    },
    plugins: [],
}
