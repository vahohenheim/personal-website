import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTypescript,
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
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
]);

export default eslintConfig;
