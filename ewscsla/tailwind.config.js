/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './templates/**/*.html',
        './web/templates/**/*.html',
        './node_modules/flowbite/**/*.js'
    ],
    theme: {
        fontFamily: {
            sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"']
        },
        extend: {},
    },
    plugins: ["tailwindcss ,autoprefixer", require('flowbite/plugin')],
}

