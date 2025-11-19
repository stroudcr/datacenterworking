import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          primary: "rgba(14, 165, 233, 0.1)",
          secondary: "rgba(6, 182, 212, 0.1)",
          border: "rgba(203, 213, 225, 0.2)",
        },
        ice: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        silver: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-hover": "0 12px 40px 0 rgba(31, 38, 135, 0.5)",
      },
      typography: {
        ice: {
          css: {
            '--tw-prose-body': '#cbd5e1',
            '--tw-prose-headings': '#f8fafc',
            '--tw-prose-lead': '#e2e8f0',
            '--tw-prose-links': '#38bdf8',
            '--tw-prose-bold': '#f1f5f9',
            '--tw-prose-counters': '#94a3b8',
            '--tw-prose-bullets': '#94a3b8',
            '--tw-prose-hr': 'rgba(203, 213, 225, 0.2)',
            '--tw-prose-quotes': '#e2e8f0',
            '--tw-prose-quote-borders': '#38bdf8',
            '--tw-prose-captions': '#94a3b8',
            '--tw-prose-code': '#f1f5f9',
            '--tw-prose-pre-code': '#e2e8f0',
            '--tw-prose-pre-bg': 'rgba(14, 165, 233, 0.1)',
            '--tw-prose-th-borders': 'rgba(203, 213, 225, 0.2)',
            '--tw-prose-td-borders': 'rgba(203, 213, 225, 0.1)',
            p: {
              marginTop: '1em',
              marginBottom: '1em',
            },
            'ul, ol': {
              marginTop: '1em',
              marginBottom: '1em',
              paddingLeft: '1.5em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'li > p': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            a: {
              color: '#38bdf8',
              textDecoration: 'underline',
              '&:hover': {
                color: '#7dd3fc',
              },
            },
            strong: {
              color: '#f1f5f9',
              fontWeight: '600',
            },
            em: {
              color: '#e2e8f0',
            },
            blockquote: {
              borderLeftColor: '#38bdf8',
              color: '#e2e8f0',
            },
            h1: {
              color: '#f8fafc',
            },
            h2: {
              color: '#f8fafc',
            },
            h3: {
              color: '#f8fafc',
            },
            h4: {
              color: '#f8fafc',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
