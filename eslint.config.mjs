import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import("eslint").FlatConfig[]} */
export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'src/generated/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },

  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      'prettier/prettier': 'error',

      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  prettierConfig,
];
