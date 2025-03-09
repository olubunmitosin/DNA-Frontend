import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          "0": "rgb(var(--gray-0) / <alpha-value>)",
          "50": "rgb(var(--gray-50) / <alpha-value>)",
          "100": "rgb(var(--gray-100) / <alpha-value>)",
          "200": "rgb(var(--gray-200) / <alpha-value>)",
          "300": "rgb(var(--gray-300) / <alpha-value>)",
          "400": "rgb(var(--gray-400) / <alpha-value>)",
          "500": "rgb(var(--gray-500) / <alpha-value>)",
          "600": "rgb(var(--gray-600) / <alpha-value>)",
          "700": "rgb(var(--gray-700) / <alpha-value>)",
          "800": "rgb(var(--gray-800) / <alpha-value>)",
          "900": "rgb(var(--gray-900) / <alpha-value>)",
          "1000": "rgb(var(--gray-1000) / <alpha-value>)",
        },

        light: {
          "100": "#323232",
          "200": "#EEF5FF",
          "300": "#FFFCF4",
          "400": "hsl(var(--light-400))",
          "500": "hsl(var(--light-500))",
          "600": "hsl(var(--light-600))",
          "700": "hsl(var(--light-700))",
          "800": "hsl(var(--light-800))",
          "900": "hsl(var(--light-900))",
        },
        dark: {
          "100": "#000000",
          "200": "#0F1117",
          "300": "#151821",
          "400": "#212734",
          "500": "#101012",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        xxs: "360px",
        xs: "370px",
        msx: "390px",
        ms: "400px",
        sm: "640px",
        md: "768px",
        mmd: "840px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1600px",
        "2xl": "1536px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
