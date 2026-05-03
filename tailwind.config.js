module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        accent: '#7c3aed'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
