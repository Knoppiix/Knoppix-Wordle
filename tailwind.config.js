/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        appear: {
          '0%': {opacity: '0%'},
          '100%': {opacity: '100%'}
        },
    },
      animation: {
        'appear-in': 'appear .3s ease-in-out',
        'bounce-once': 'bounceOnce .7s cubic-bezier(0, 0, 0.65, 1.18) 1',
      },
    },
    colors: {
      'jet': { DEFAULT: '#35302c', 100: '#0b0a09', 200: '#151312', 300: '#201d1a', 400: '#2a2623', 500: '#35302c', 600: '#625952', 700: '#8e8278', 800: '#b4aca5', 900: '#d9d5d2' },
      'cream': { DEFAULT: '#fffdc2', 100: '#5a5700', 200: '#b4ae00', 300: '#fff70e', 400: '#fffa68', 500: '#fffdc2', 600: '#fffdce', 700: '#fffeda', 800: '#fffee7', 900: '#fffff3' },
      'mauve': { DEFAULT: '#e8adff', 100: '#3d0056', 200: '#7b00ab', 300: '#b702ff', 400: '#d058ff', 500: '#e8adff', 600: '#edbeff', 700: '#f1ceff', 800: '#f6deff', 900: '#faefff' },
      'pastelcyan': { DEFAULT: '#adf8db', 100: '#074e33', 200: '#0e9c65', 300: '#14ea98', 400: '#61f1ba', 500: '#adf8db', 600: '#bff9e3', 700: '#cffbea', 800: '#dffcf1', 900: '#effef8' },
      'seasalt': { DEFAULT: '#f8f7f7', 100: '#352e2e', 200: '#6a5c5c', 300: '#9c8d8d', 400: '#cac2c2', 500: '#f8f7f7', 600: '#f9f8f8', 700: '#fbfafa', 800: '#fcfcfc', 900: '#fefdfd' }
    },    
    fontFamily: {
      Patua: ["Patua One"],
      Hepta: ["Hepta Slab"]
    }
  },
  plugins: [],
}

