/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Azul — color principal de cromo/texto/acentos (azul de Galicia)
        sage: {
          50:  '#EFF5FC',
          100: '#D8E7F7',
          200: '#B3CDEE',
          300: '#85ADE0',
          400: '#5589CE',
          500: '#2E6CB8',
          600: '#21548F',
          700: '#1A4170',
          800: '#142F50',
          900: '#0E1F36',
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
        // Azul marino — tipo "Asociacións" y cinta heráldica
        gold: {
          50:  '#ECEEF6',
          100: '#D2D8EA',
          200: '#A6B1D5',
          300: '#7585BD',
          400: '#4E61A3',
          500: '#3A4D8C',
          600: '#2C3C70',
          700: '#212C54',
          800: '#161D38',
          900: '#0B0F1E',
        },
        // Azul vivo — tipo "Voluntariado"
        laurel: {
          50:  '#E8F4FD',
          100: '#C8E5FB',
          200: '#95CCF6',
          300: '#5DAFEE',
          400: '#2E92E0',
          500: '#1577C7',
          600: '#0F5EA0',
          700: '#0C497C',
          800: '#093458',
          900: '#061F36',
        },
        // Azul mar — líneas onduladas del escudo
        ria: {
          400: '#7AB3E0',
          500: '#4A90D9',
          600: '#356DA8',
        },
        // Blanco/neutro — superficies (antes crema amarillenta)
        cream: {
          50:  '#FFFFFF',
          100: '#F7F8F7',
          200: '#ECEEEC',
        },
        ink: '#1A1A1A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        script:  ['"Dancing Script"', '"Brush Script MT"', 'cursive'],
        sans:    ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'card':     '0 2px 12px -2px rgba(17, 17, 17, 0.08), 0 1px 3px -1px rgba(17, 17, 17, 0.06)',
        'card-hover': '0 8px 24px -6px rgba(17, 17, 17, 0.14), 0 2px 6px -1px rgba(17, 17, 17, 0.08)',
        'heraldic': '0 4px 16px -4px rgba(200, 16, 46, 0.25)',
      },
      backgroundImage: {
        'sage-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)',
        'cream-paper':   'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
      },
    },
  },
  plugins: [],
}
