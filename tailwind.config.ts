import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "24px",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', '"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', '"Open Sans"', '"Helvetica Neue"', 'sans-serif'],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        secondary: "var(--color-secondary)",
        "secondary-foreground": "var(--color-secondary-foreground)",
        background: "var(--color-background)",
        "background-secondary": "var(--color-background-secondary)",
        "background-tertiary": "var(--color-background-tertiary)",
        foreground: "var(--color-foreground)",
        "foreground-secondary": "var(--color-foreground-secondary)",
        "foreground-muted": "var(--color-foreground-muted)",
        border: "var(--color-border)",
        "border-secondary": "var(--color-border-secondary)",
        "border-tertiary": "var(--color-border-tertiary)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        "accent-success": "var(--color-accent-success)",
        "accent-warning": "var(--color-accent-warning)",
        "accent-error": "var(--color-accent-error)",
        "accent-info": "var(--color-accent-info)",
        "accent-purple": "var(--color-accent-purple)",
        "accent-blend": "var(--color-accent-blend)",
        "overlay-backdrop": "var(--color-overlay-backdrop)",
        "overlay-card": "var(--color-overlay-card)",
        "overlay-hover": "var(--color-overlay-hover)",
      },
    },
  },
  plugins: [],
}

export default config