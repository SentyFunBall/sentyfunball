/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,md,mdx,ts}'],
	theme: {
		extend: {
			colors: {
				white: '#f8f9fa'
			},
			fontFamily: {
				body: ['Manrope', ...defaultTheme.fontFamily.sans]
			},
			gridTemplateColumns: {
				list: 'repeat(auto-fill, minmax(400px, max-content))'
			},
			typography: {
				DEFAULT: {
					css: {
						'ul > li::marker': { color: '#9ca3af' },
						'ol > li::marker': { color: '#9ca3af' }
					}
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
}
