/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#28a745',
        'primary-dark': '#218838',
        danger: '#ff6347',
        'text-gray': '#676767',
        'text-dark': '#333',
        'border-gray': '#ccc',
      },
      height: {
        'search': '320px',
        'search-lg': '400px',
        'search-xl': '480px', // cao gấp 5 lần
        'search-xxl': '600px', // thử cao hơn nữa
      },
      width: {
        'search': '512px',
        'search-lg': '640px',
      },
      padding: {
        'search-x': '48px',
        'search-y': '96px',
        'search-y-lg': '120px',
      },
      fontSize: {
        'search': '24px',
        'search-lg': '28px',
      },
    },
  },
  plugins: [],
}
