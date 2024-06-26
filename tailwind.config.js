/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      text: {
        50: "#e5e6e6",
        100: "#7c8383",
        200: "#b1e7e7",
        300: "#191a1a",
        400: "#fef4e7",
        500: "#c37509",
        600: "#311d02",
        700: "#247575",
        800: "#180f01",
        900: "#110e08",
        950: "#080c11",
      },
      background: {
        50: "#f2f3f3",
        100: "#e5e6e6",
        200: "#cacece",
        300: "#b0b5b5",
        400: "#969c9c",
        500: "#7c8383",
        600: "#636969",
        700: "#4a4f4f",
        800: "#313535",
        900: "#191a1a",
        950: "#0c0d0d",
      },
      primary: {
        50: "#fef4e7",
        100: "#fde9ce",
        200: "#fad49e",
        300: "#f8be6d",
        400: "#f6a83c",
        500: "#f4930b",
        600: "#c37509",
        700: "#925807",
        800: "#613b05",
        900: "#311d02",
        950: "#180f01",
      },
      secondary: {
        50: "#f7f4ee",
        100: "#efe9dc",
        200: "#ded2ba",
        300: "#cebc97",
        400: "#bea574",
        500: "#ad8f52",
        600: "#8b7241",
        700: "#685631",
        800: "#453921",
        900: "#231d10",
        950: "#110e08",
      },
      accent: {
        50: "#eef1f7",
        100: "#dce4ef",
        200: "#b9c9df",
        300: "#96aecf",
        400: "#7393bf",
        500: "#5078af",
        600: "#40608c",
        700: "#304869",
        800: "#203046",
        900: "#101823",
        950: "#080c11",
      },
    },

    extend: {},
  },
  plugins: [daisyui],
};
