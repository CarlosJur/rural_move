/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Sage / menta — color principal (coche + fondo logo Rural Move)
        sage: {
          50:  '#F4F8F5',
          100: '#E6EFE8',
          200: '#CFE0D4',
          300: '#B4CEBC',
          400: '#9CB8A8',
          500: '#7FA08D',
          600: '#5F806E',
          700: '#476356',
          800: '#324740',
          900: '#1F2D29',
        },
        // Rojo institucional — escudo + "move"
        rioja: {
          50:  '#FCEDEF',
          100: '#F9D6DA',
          200: '#F0A7AF',
          300: '#E37582',
          400: '#D44558',
          500: '#C8102E',
          600: '#A60E26',
          700: '#810A1E',
          800: '#580712',
          900: '#33040A',
        },
        // Dorado heráldico — castillo y corona del escudo
        gold: {
          50:  '#FBF5E6',
          100: '#F6E8BD',
          200: '#EFD37F',
          300: '#E0B947',
          400: '#CFA12E',
          500: '#B58623',
          600: '#946A19',
          700: '#6F4F12',
          800: '#4A340B',
          900: '#251A05',
        },
        // Verde laurel — palmas del escudo
        laurel: {
          50:  '#EFF6F0',
          100: '#D7E8D9',
          200: '#A9CCAF',
          300: '#7BAD83',
          400: '#558E61',
          500: '#3F7D4E',
          600: '#33653F',
          700: '#264C30',
          800: '#193320',
          900: '#0D1A10',
        },
        // Azul mar — líneas onduladas del escudo
        ria: {
          400: '#7AB3E0',
          500: '#4A90D9',
          600: '#356DA8',
        },
        // Crema/marfil — papel institucional
        cream: {
          50:  '#FBF8F0',
          100: '#F5F0E2',
          200: '#EBE3CC',
        },
        ink: '#1A1A1A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        script:  ['"Dancing Script"', '"Brush Script MT"', 'cursive'],
        sans:    ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'card':     '0 2px 12px -2px rgba(31, 45, 41, 0.08), 0 1px 3px -1px rgba(31, 45, 41, 0.06)',
        'card-hover': '0 8px 24px -6px rgba(31, 45, 41, 0.15), 0 2px 6px -1px rgba(31, 45, 41, 0.08)',
        'heraldic': '0 4px 16px -4px rgba(200, 16, 46, 0.25)',
      },
      backgroundImage: {
        'sage-gradient': 'linear-gradient(135deg, #E6EFE8 0%, #CFE0D4 100%)',
        'cream-paper':   'linear-gradient(180deg, #FBF8F0 0%, #F5F0E2 100%)',
      },
    },
  },
  plugins: [],
}
