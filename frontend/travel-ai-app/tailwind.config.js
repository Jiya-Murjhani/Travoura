module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#FF6F61',
        secondary: '#6B5B95',
      },
      backgroundImage: {
        'sunset-gradient': 'linear-gradient(to right, #FF7E5F, #FEB47B)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}