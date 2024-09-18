import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'
import ts from 'typescript-eslint'
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,

  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const patchedConfig = fixupConfigRules([
  ...compat.extends('next/core-web-vitals'),
])

const config = [
  ...patchedConfig,
  ...ts.configs.recommended,
  prettierConfigRecommended,
  // Add more flat configs here
  { ignores: ['.next/*'] },
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: false,
          endOfLine: 'auto',
        },
      ],
      'jsx-a11y/alt-text': [
        'warn',
        {
          elements: ['img'],
          img: ['Image'],
        },
      ],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'react/no-unknown-property': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]

export default config
