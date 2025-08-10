/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // 如果你用了 src 目录
        "*.{js,ts,jsx,tsx,mdx}"
    ],
  theme: {
    extend: {
      // ... 你的主题扩展
    },
  },
  plugins: [],
}
