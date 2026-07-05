/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Dark theme surface layers
        'dm-bg':      '#111111',
        'dm-sidebar': '#1a1a1a',
        'dm-card':    '#1e1e1e',
        'dm-input':   '#2a2a2a',
        'dm-hover':   '#252525',
        // Borders
        'dm-border':  '#2e2e2e',
        'dm-border2': '#333333',
        // Text
        'dm-text':       '#e5e5e5',
        'dm-text2':      '#888888',
        'dm-placeholder':'#555555',
        // Accent (dark blue)
        'dm-accent':      '#2563eb',
        'dm-accent-hover':'#1d4ed8',
      },
    },
  },
  plugins: [],
}
