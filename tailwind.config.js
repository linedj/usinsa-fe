/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'Noto Sans KR', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        ink: '#111111',
        paper: '#FFFFFF',
        mist: '#F5F5F3',
        line: '#E5E4E1',
        graphite: '#767672',
        signal: '#D9432E',
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
}
