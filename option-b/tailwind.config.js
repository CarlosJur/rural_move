/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Gris neutro (Apple) — cromo, texto y superficies sutiles
        sage: {
          50:  '#F5F5F7',
          100: '#ECECEF',
          200: '#D2D2D7',
          300: '#B0B0B8',
          400: '#8E8E93',
          500: '#6E6E73',
          600: '#515154',
          700: '#424245',
          800: '#1D1D1F',
          900: '#000000',
        },
        // Azul Apple — acento principal (botones, hoy, enlaces, "move")
        rioja: {
          50:  '#E8F1FD',
          100: '#CFE2FB',
          200: '#9DC4F6',
          300: '#5D9BEF',
          400: '#2E82EA',
          500: '#002108',
          600: '#0062C4',
          700: '#0051A2',
          800: '#003E7A',
          900: '#002A52',
        },
        // Naranja Apple — tipo "Asociacións"
        gold: {
          50:  '#FFF4E5',
          100: '#FFE3BF',
          200: '#FFCB85',
          300: '#FFB14D',
          400: '#FFA226',
          500: '#FF9500',
          600: '#D17B00',
          700: '#A36000',
          800: '#754500',
          900: '#472A00',
        },
        // Verde Apple — tipo "Voluntariado"
        laurel: {
          50:  '#EAF9EF',
          100: '#CFF1D9',
          200: '#A0E4B6',
          300: '#6BD68F',
          400: '#46CD72',
          500: '#34C759',
          600: '#28A148',
          700: '#1E7C37',
          800: '#155427',
          900: '#0C3017',
        },
        // Azul mar — líneas onduladas del escudo
        ria: {
          400: '#7AB3E0',
          500: '#4A90D9',
          600: '#356DA8',
        },
        // Superficies — blanco y gris Apple (--sk-enviro-neutral)
        cream: {
          50:  '#FFFFFF',
          100: '#E8E8ED',
          200: '#DCDCDF',
        },
        ink: '#1D1D1F',
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', 'system-ui', 'sans-serif'],
        script:  ['"Dancing Script"', '"Brush Script MT"', 'cursive'],
        sans:    ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'Inter', 'system-ui', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        'card':     '0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 1px 3px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 24px -6px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.06)',
        'heraldic': '0 4px 14px -4px rgba(0, 113, 227, 0.30)',
      },
      backgroundImage: {
        'sage-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)',
        'cream-paper':   'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
      },
    },
  },
  plugins: [],
}
