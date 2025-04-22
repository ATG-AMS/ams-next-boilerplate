import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        white: '#FFFFFF',
        black: '#001E2B',
        greenBase: '#00ED64',
        greenLight1: '#71F6BA',
        greenLight2: '#C0FAE6',
        greenLight3: '#E3FCF7',
        greenDark1: '#00A35C',
        greenDark2: '#00684A',
        greenDark3: '#023430',

        grayBase: '#889397',
        grayLight1: '#C1C7C6',
        grayLight2: '#E8EDEB',
        grayLight3: '#F9FBFA',
        grayDark1: '#5C6C75',
        grayDark2: '#3D4F58',
        grayDark3: '#1C2D38',
        grayDark4: '#112733',

        redBase: '#DB3030',
        yellowBase: '#FFC010',

        // atg-mdm 에서 가져온 색상 코드
        atg: {
          50: '#F2F3FC',
          100: '#DDDEF8',
          200: '#B3B5EF',
          300: '#898CE6',
          400: '#5F63DD',
          500: '#4A4ED8',
          600: '#353AD4',
          700: '#262AB1',
          800: '#1D2088',
          900: '#181B71',
          950: '#14165C',
        },
        atgGray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          table: 'hsl(var(--border-table))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        focus: 'hsl(var(--focus))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
        },
        sucess: {
          DEFAULT: 'hsl(var(--sucess))',
        },
        gnb: {
          depth: '#E5E7EB',
          border: '#D1D5DB',
          bg: '#334155',
        },
      },
    },
  },
  plugins: [],
};
export default config;
