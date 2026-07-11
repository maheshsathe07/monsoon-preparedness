/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        secondary: '#1A1A1A',
        accent: '#FF4444',
        warning: '#FFA500',
        success: '#22C55E',
        danger: '#EF4444',
        bg: {
          primary: '#0F0F0F',
          secondary: '#1A1A1A',
          tertiary: '#2A2A2A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
          muted: '#999999',
        },
        border: {
          light: '#333333',
          default: '#444444',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      spacing: {
        safe: 'max(1rem, env(safe-area-inset-bottom))',
      },
      minHeight: {
        touch: '48px',
      },
    },
  },
  plugins: [],
}
