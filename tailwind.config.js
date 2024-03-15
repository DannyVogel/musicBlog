/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        satisfy: ["Satisfy", "cursive"],
      },
      backgroundImage: (theme) => ({
        pattern: "url('/download.png')",
      }),
    },
  },
  extend: {
    gridTemplateRows: {
      layout: "60px 1fr",
      soundBoard: "250px 50px 1fr",
      soundBoardLg: "400px 50px 1fr",
    },
    gridTemplateColumns: {
      actionBar: "1fr 100px 1fr",
      actionBarMD: "1fr 200px 1fr",
    },
  },
  colors: {},
  plugins: [],
};
