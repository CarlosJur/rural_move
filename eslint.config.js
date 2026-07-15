import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  // Carpetas que ESLint ni debe mirar.
  { ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/supabase/.temp/**'] },
  // Reglas base de JavaScript.
  js.configs.recommended,
  // Reglas de TypeScript (se aplican solo a .ts/.tsx).
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-key': 'warn',
      'react/react-in-jsx-scope': 'off',
      // Avisa de variables sin usar, pero permite las que empiezan por _
      // (convención para decir "sé que no la uso, es a propósito").
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  prettier
)
