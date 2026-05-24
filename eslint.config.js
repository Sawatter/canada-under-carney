import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  // Hex color drift prevention (Comet Round 2 finding closed v5.64).
  // Component code should reference colors via src/constants.js GRADES,
  // TREND_COLOR, STATUS_COLORS, or design tokens in src/index.css, not via
  // inline hex literals. The v5.43 contrast-fix incident hardcoded #e68a00
  // in two component files; this rule prevents that class of bug from
  // recurring. Warnings rather than errors so existing components keep
  // building while incremental cleanup happens.
  {
    files: ['src/components/**/*.jsx'],
    rules: {
      'no-restricted-syntax': ['warn', {
        selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
        message: "Inline hex color literal. Use a token from src/constants.js (GRADES, TREND_COLOR, STATUS_COLORS) or src/index.css design tokens. Closes the v5.43 color-drift incident class. If this color genuinely belongs in this component and not in a shared token, add // eslint-disable-next-line no-restricted-syntax with a one-line rationale.",
      }],
    },
  },
])
