/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F1F8F4',
          100: '#E1F1E8',
          200: '#C3E3D1',
          300: '#94CDB0',
          400: '#5BAE86',
          500: '#087443', // Primary Brand Green
          600: '#066339',
          700: '#054F2E',
          800: '#043F25',
          900: '#03341F',
        },
        surface: {
          white: '#FFFFFF',
          muted: '#F8FAFC',
          subtle: '#F1F5F9',
          border: '#E5E7EB',
        },
        content: {
          dark: '#101828',
          secondary: '#475467',
          muted: '#667085',
          placeholder: '#98A2B3',
        },
        state: {
          success: '#027A48',
          'success-bg': '#ECFDF3',
          warning: '#B54708',
          'warning-bg': '#FFFAEB',
          error: '#B42318',
          'error-bg': '#FEF3F2',
          info: '#026AA2',
          'info-bg': '#F0F9FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'card-hover': '0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16, 24, 40, 0.04)',
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        brand: '10px',
      }
    },
  },
  plugins: [],
}
