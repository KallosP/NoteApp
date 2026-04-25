/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"note-bg": {
					light: "#f4f4f5",
					hover: "#f8fafc"
				},
				"note-border": {
					DEFAULT: "#e5e7eb",
					hover: "#cbd5e1"
				}
			},
			boxShadow: {
				"note-card": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
				"note-card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
			},
			animation: {
				"fade-in": "fadeIn 0.3s ease-out",
				"slide-up": "slideUp 0.3s ease-out"
			},
			keyframes: {
				fadeIn: {
					"0%": {opacity: "0"},
					"100%": {opacity: "1"}
				},
				slideUp: {
					"0%": {transform: "translateY(20px)", opacity: "0"},
					"100%": {transform: "translateY(0)", opacity: "1"}
				}
			}
		}
	},
	plugins: []
};
