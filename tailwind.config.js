module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8C52FF',
        secondary: '#CB6CE6',
        title: '#000',
        description: '#7B7588',
        success: '#6CE67C',
        danger: '#f00',
        hoverColor: '#CB6CE622',
        primary_light: '#EEE5FF',
        primary_50: '#DDCCFF',
      }
    },
  },

  plugins: [],
  darkMode: 'class',
}