/** @type {import"tailwindcs").Config} */
module.exports = {
  content: ["./public/index.html",
            "./public/chat/index.{html,js}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#1A1924",
        purple: "#633BBC",
        water: "#07847E"
      },
      textColor: {
        "light-gray": "#E1E1E6"
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"]
      },
    },
  },
  plugins: [],
}