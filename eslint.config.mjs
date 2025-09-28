import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  // Global ignores
  {
    ignores: [
      // Build and generated directories
      '.next/**',
      'node_modules/**',
      'out/**',
      'dist/**',
      'build/**',
      '.turbo/**',

      // Generated files
      '*.d.ts',
      '**/*.generated.*',

      // Scripts (we'll handle these separately)
      'scripts/**/*.js'
    ]
  },

  // Main configuration
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Console rules - only allow warn and error
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // Pattern rules
      'no-empty-pattern': 'error',

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],

      // Next.js specific rules
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-unwanted-polyfillio': 'error',
      '@next/next/no-page-custom-font': 'off',

      // React rules
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off'
    }
  },
  // Scripts configuration - more lenient rules
  {
    files: ['scripts/**/*.{js,ts}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
];

export default eslintConfig;
