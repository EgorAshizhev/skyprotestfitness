import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  // 1. Игнорируемые папки
  globalIgnores(['dist']),

  // 2. Базовые конфигурации плагинов (разворачиваются в корень массива)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Специфичные настройки для ваших TS/TSX файлов
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    languageOptions: {
      globals: globals.browser,
    },
  },

  // 4. Отключение конфликтующих правил форматирования Prettier
  // ОБЯЗАТЕЛЬНО должен идти самым последним в массиве!
  eslintConfigPrettier,
])
