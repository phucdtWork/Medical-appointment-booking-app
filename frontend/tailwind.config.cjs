// tailwind.config.cjs
module.exports = {
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f8fafc',
                    500: '#0ea5a4',
                    700: '#0b6866',
                },
            },
        }
    },
    plugins: [],
}
