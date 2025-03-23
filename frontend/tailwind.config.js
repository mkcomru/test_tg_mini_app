/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'telegram-blue': '#2AABEE',
                'telegram-purple': '#6370ff',
            }
        }
    },
    plugins: [],
}