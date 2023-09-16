import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        white: "#FFFFFF",
        black: "#001E2B",
        greenBase: "#00ED64",
        greenLight1: "#71F6BA",
        greenLight2: "#C0FAE6",
        greenLight3: "#E3FCF7",
        greenDark1: "#00A35C",
        greenDark2: "#00684A",
        greenDark3: "#023430",

        grayBase: "#889397",
        grayLight1: "#C1C7C6",
        grayLight2: "#E8EDEB",
        grayLight3: "#F9FBFA",
        grayDark1: "#5C6C75",
        grayDark2: "#3D4F58",
        grayDark3: "#1C2D38",
        grayDark4: "#112733",

        redBase: "#DB3030",
        yellowBase: "#FFC010",
      },
    },
  },
  plugins: [],
};
export default config;
